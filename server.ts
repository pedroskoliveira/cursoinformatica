import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_LESSONS } from './src/data/defaultLessons.ts';
import { ALL_BADGES, getBadgeById } from './src/data/badges.ts';
import { evaluateStudentBadges } from './src/utils/badgeEvaluator.ts';
import { Student, DayLesson, AuditEvent, StudentInfraction } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory + File Storage
const DATA_DIR = path.join(process.cwd(), 'data');
const VIDEOS_DIR = path.join(DATA_DIR, 'videos');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  lessons: DayLesson[];
  students: Record<string, Student>;
  events: AuditEvent[];
}

// Initial DB state
let db: DatabaseSchema = {
  lessons: DEFAULT_LESSONS,
  students: {},
  events: []
};

// Valid Admin credentials defined directly in code
const ADMIN_ACCOUNTS = [
  { user: 'admin', pass: 'admin123', name: 'Pedro Simão (Administrador)' },
  { user: 'pedro', pass: 'pedro123', name: 'Pedro Simão (Administrador)' },
  { user: 'pedrinhosro21@gmail.com', pass: 'pedro123', name: 'Pedro Simão (Administrador)' },
  { user: 'pedrinhosro21@gmail.com', pass: 'admin123', name: 'Pedro Simão (Administrador)' },
  { user: 'admin', pass: 'admin', name: 'Administrador Pedro' }
];

// Load existing DB or initialize clean state (WITHOUT mock data)
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Sanitize: Purge any fictitious demo students and mock events
    const sanitizedStudents: Record<string, Student> = {};
    if (parsed.students && typeof parsed.students === 'object') {
      Object.entries(parsed.students as Record<string, Student>).forEach(([id, st]) => {
        if (!id.startsWith('demo-') && !st.name?.includes('Lucas Ferreira') && !st.name?.includes('Beatriz Costa') && !st.name?.includes('Rodrigo Albuquerque')) {
          sanitizedStudents[id] = st;
        }
      });
    }

    const sanitizedEvents: AuditEvent[] = (parsed.events || []).filter(
      (ev: AuditEvent) => !ev.id?.startsWith('ev-init-') && !ev.studentId?.startsWith('demo-')
    );

    db = {
      lessons: parsed.lessons && parsed.lessons.length === 10 ? parsed.lessons : DEFAULT_LESSONS,
      students: sanitizedStudents,
      events: sanitizedEvents
    };

    // Clear any initial dummy video URLs so admin can post custom videos for each lesson
    const dummyVideoPatterns = [
      'AkFi90lZ3AU',
      '3Q3e93z_KCs',
      'hjh_48QvH08',
      '7_LPdttKXPc',
      '1P5mH7R7k8w',
      'yrr_Wl2N3-M',
      'S2hk_u5hL2g',
      'jZz7u3yM6qA',
      '8-PfvZ8p3cE',
      'D3_qK-hD30U',
      'BigBuckBunny'
    ];
    db.lessons.forEach((l) => {
      if (l.videoUrl && dummyVideoPatterns.some((pat) => l.videoUrl.includes(pat))) {
        l.videoUrl = '';
      }
      if (l.isReleased === undefined) {
        l.isReleased = l.day === 1;
      }
      if (!l.videoUrls) {
        l.videoUrls = l.videoUrl ? [l.videoUrl] : [];
      }
    });

    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } else {
    // Start with a completely clean database (zero fictitious data)
    db = {
      lessons: DEFAULT_LESSONS,
      students: {},
      events: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }

  // Ensure badges are evaluated for existing real students in DB
  Object.values(db.students).forEach((st) => {
    evaluateStudentBadges(st);
  });
} catch (err) {
  console.error('Error initializing db:', err);
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

// Serve uploaded videos statically
app.use('/videos', express.static(VIDEOS_DIR));

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, VIDEOS_DIR);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage, limits: { fileSize: 300 * 1024 * 1024 } }); // limit 300MB

// Upload endpoint for admin to attach video files directly
app.post('/api/instructor/upload-video', upload.single('video'), (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  const urlPath = `/videos/${req.file.filename}`;
  addEvent({
    studentId: 'admin',
    studentName: 'Administrador Pedro',
    day: 0,
    type: 'VIDEO_UPLOADED',
    message: `Vídeo ${req.file.originalname} enviado pelo Administrador.`,
    severity: 'info'
  });
  res.json({ success: true, url: urlPath, videoType: 'mp4' });
});

// SSE Clients for real-time instructor feed
const sseClients = new Set<express.Response>();

function broadcastSSE(type: string, data: any) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function addEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>) {
  const newEvent: AuditEvent = {
    ...event,
    id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString()
  };
  db.events.unshift(newEvent);
  if (db.events.length > 200) {
    db.events.pop();
  }
  saveDb();
  broadcastSSE('new_event', newEvent);
  broadcastSSE('roster_update', getRosterData());
  return newEvent;
}

function getRosterData() {
  const now = Date.now();
  const studentsList = Object.values(db.students).map((s) => {
    // Online if heartbeat received in the last 20 seconds
    const lastActiveMs = new Date(s.lastActive || 0).getTime();
    const isOnline = now - lastActiveMs < 25000;
    return {
      ...s,
      isOnline
    };
  });

  const total = studentsList.length;
  const online = studentsList.filter((s) => s.isOnline).length;
  
  let scoreSum = 0;
  let scoreCount = 0;
  let infractionsSum = 0;
  let completedCount = 0;
  const dayDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };

  studentsList.forEach((s) => {
    dayDist[s.currentDay] = (dayDist[s.currentDay] || 0) + 1;
    infractionsSum += (s.infractions || []).length;
    if (s.currentStage === 'course_finished' || s.currentDay > 10 || (s.currentDay === 10 && s.dayScores[10] >= 8)) {
      completedCount++;
    }
    Object.values(s.dayScores || {}).forEach((sc) => {
      scoreSum += sc;
      scoreCount++;
    });
  });

  return {
    students: studentsList,
    stats: {
      totalStudents: total,
      onlineStudents: online,
      averageScore: scoreCount > 0 ? Number((scoreSum / scoreCount).toFixed(1)) : 0,
      totalInfractions: infractionsSum,
      completionRate: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      dayDistribution: dayDist
    }
  };
}

// ======================== API ROUTES ========================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1.1 Admin Authentication Endpoint (Hardcoded credentials for Pedro Simão / Admin)
app.post('/api/instructor/login', (req, res) => {
  const { username, password } = req.body;
  const normalizedUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const matched = ADMIN_ACCOUNTS.find(
    (acc) =>
      (acc.user.toLowerCase() === normalizedUser || acc.user === normalizedUser) &&
      acc.pass === cleanPass
  );

  if (!matched) {
    return res.status(401).json({
      success: false,
      message: 'Usuário ou senha de Administrador inválidos.'
    });
  }

  const token = 'admin_session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

  return res.json({
    success: true,
    token,
    user: matched.name,
    email: 'pedrinhosro21@gmail.com',
    message: 'Autenticação de Administrador realizada com sucesso.'
  });
});

// 1.2 Clear all students / reset test roster (Instructor tool)
app.post('/api/instructor/clear-all-students', (req, res) => {
  db.students = {};
  db.events = [];
  saveDb();
  broadcastSSE('roster_update', getRosterData());
  broadcastSSE('events_cleared', { timestamp: new Date().toISOString() });
  return res.json({ success: true, message: 'Todos os alunos e eventos foram zerados com sucesso.' });
});

// 2. Get Course Lessons
app.get('/api/course', (req, res) => {
  res.json({
    lessons: db.lessons,
    passingScore: 8.0,
    totalDays: 10
  });
});

// Helper to normalize any video URL (YouTube, Google Drive, MP4)
function normalizeUrl(url: string): { url: string; type: 'youtube' | 'mp4' } {
  let u = url ? url.trim() : '';
  let type: 'youtube' | 'mp4' = 'mp4';
  if (!u) return { url: '', type: 'mp4' };

  const ytMatch = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return { url: `https://www.youtube.com/embed/${ytMatch[1]}`, type: 'youtube' };
  }
  if (u.includes('youtube.com/embed/')) {
    return { url: u, type: 'youtube' };
  }
  if (u.includes('drive.google.com') || u.includes('docs.google.com')) {
    const driveMatch = u.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]{10,})/);
    if (driveMatch && driveMatch[1]) {
      return { url: `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`, type: 'mp4' };
    }
  }
  return { url: u, type: 'mp4' };
}

// 3. Update Lesson & Post Videos (Instructor feature)
app.put('/api/course/day/:day', (req, res) => {
  const dayNum = parseInt(req.params.day, 10);
  const { title, subtitle, videoUrl, videoUrls, videoType, isReleased, durationSeconds, summary, questions } = req.body;

  const idx = db.lessons.findIndex((l) => l.day === dayNum);
  if (idx === -1) {
    return res.status(404).json({ error: 'Dia não encontrado' });
  }

  // Handle playlist of up to 5 videos
  let processedVideoUrls: string[] = [];
  if (Array.isArray(videoUrls)) {
    processedVideoUrls = videoUrls.map((u: string) => normalizeUrl(u).url).filter((u: string) => u.length > 0);
  }

  // Primary video URL
  let normalizedVideoUrl = videoUrl !== undefined ? normalizeUrl(videoUrl).url : db.lessons[idx].videoUrl;
  let resolvedVideoType: 'youtube' | 'mp4' = videoType ?? db.lessons[idx].videoType;

  if (processedVideoUrls.length > 0) {
    normalizedVideoUrl = processedVideoUrls[0];
    resolvedVideoType = normalizeUrl(normalizedVideoUrl).type;
  } else if (normalizedVideoUrl) {
    resolvedVideoType = normalizeUrl(normalizedVideoUrl).type;
    processedVideoUrls = [normalizedVideoUrl];
  }

  const newIsReleased = typeof isReleased === 'boolean' ? isReleased : db.lessons[idx].isReleased ?? (dayNum === 1);

  db.lessons[idx] = {
    ...db.lessons[idx],
    title: title ?? db.lessons[idx].title,
    subtitle: subtitle ?? db.lessons[idx].subtitle,
    videoUrl: normalizedVideoUrl,
    videoUrls: processedVideoUrls,
    videoType: resolvedVideoType,
    isReleased: newIsReleased,
    durationSeconds: durationSeconds ? parseInt(durationSeconds, 10) : db.lessons[idx].durationSeconds,
    summary: Array.isArray(summary) ? summary : db.lessons[idx].summary,
    questions: Array.isArray(questions) ? questions : db.lessons[idx].questions
  };

  saveDb();
  broadcastSSE('course_updated', db.lessons[idx]);

  addEvent({
    studentId: 'admin',
    studentName: 'Administrador Pedro',
    day: dayNum,
    type: 'DAY_UNLOCKED',
    message: `Conteúdo do Dia ${dayNum} foi atualizado pelo Administrador (${processedVideoUrls.length} vídeo(s) na playlist).`,
    severity: 'info'
  });

  res.json({ success: true, lesson: db.lessons[idx] });
});

// 3.1 Toggle Day Release Status (Instructor feature - "Liberar Dia a Dia")
app.post('/api/course/day/:day/toggle-release', (req, res) => {
  const dayNum = parseInt(req.params.day, 10);
  const idx = db.lessons.findIndex((l) => l.day === dayNum);
  if (idx === -1) {
    return res.status(404).json({ error: 'Dia não encontrado' });
  }

  const newReleased = !db.lessons[idx].isReleased;
  db.lessons[idx].isReleased = newReleased;
  saveDb();
  broadcastSSE('course_updated', db.lessons[idx]);

  addEvent({
    studentId: 'admin',
    studentName: 'Administrador Pedro',
    day: dayNum,
    type: 'DAY_UNLOCKED',
    message: newReleased
      ? `O Administrador LIBEROU o Dia ${dayNum} para os alunos da turma!`
      : `O Administrador BLOQUEOU o Dia ${dayNum} para os alunos da turma.`,
    severity: newReleased ? 'success' : 'warning'
  });

  res.json({ success: true, lesson: db.lessons[idx] });
});

// 4. Student Identification (Only: Nome Completo, Data de Nascimento, Turno Matutino ou Vespertino)
app.post('/api/students/identify', (req, res) => {
  const { name, birthDate, shift, existingId } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nome completo é obrigatório' });
  }
  if (!birthDate || !birthDate.trim()) {
    return res.status(400).json({ error: 'Data de nascimento é obrigatória' });
  }

  const validShift: 'Matutino' | 'Vespertino' =
    shift === 'Vespertino' ? 'Vespertino' : 'Matutino';

  let studentId = existingId;
  let student: Student | undefined;

  if (studentId && db.students[studentId]) {
    student = db.students[studentId];
    student.name = name.trim();
    student.birthDate = birthDate.trim();
    student.shift = validShift;
    student.lastActive = new Date().toISOString();
    student.isOnline = true;
  } else {
    // Find by matching name and birthDate
    const existing = Object.values(db.students).find(
      (s) =>
        s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        s.birthDate.trim() === birthDate.trim()
    );

    if (existing) {
      student = existing;
      student.name = name.trim();
      student.birthDate = birthDate.trim();
      student.shift = validShift;
      student.lastActive = new Date().toISOString();
      student.isOnline = true;
    } else {
      studentId = 'std_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      student = {
        id: studentId,
        name: name.trim(),
        birthDate: birthDate.trim(),
        shift: validShift,
        currentDay: 1,
        currentStage: 'video',
        videoCurrentTime: 0,
        videoDuration: db.lessons[0]?.durationSeconds || 120,
        dayScores: {},
        dayAttempts: {},
        infractions: [],
        isOnline: true,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      db.students[studentId] = student;
    }
  }

  // Evaluate any badges earned so far
  evaluateStudentBadges(student);
  saveDb();

  addEvent({
    studentId: student.id,
    studentName: student.name,
    day: student.currentDay,
    type: 'STUDENT_LOGIN',
    message: `Aluno ${student.name} (Nasc: ${student.birthDate} - Turno: ${student.shift}) entrou no sistema no Dia ${student.currentDay}.`,
    severity: 'info'
  });

  res.json({ success: true, student });
});

// 5. Student Heartbeat (Sent every 3-5s while in session)
app.post('/api/students/heartbeat', (req, res) => {
  const { studentId, currentDay, currentStage, videoTime, videoDuration } = req.body;

  if (!studentId || !db.students[studentId]) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }

  const s = db.students[studentId];
  s.lastActive = new Date().toISOString();
  s.isOnline = true;
  if (currentDay !== undefined) s.currentDay = currentDay;
  if (currentStage !== undefined) s.currentStage = currentStage;
  if (videoTime !== undefined) s.videoCurrentTime = Math.round(videoTime);
  if (videoDuration !== undefined) s.videoDuration = Math.round(videoDuration);

  // Periodic save (or when stage changes)
  saveDb();

  res.json({ success: true, serverTime: Date.now() });
});

// 6. Infraction / Reset Event: When user attempts forward seek, pause, leaves video tab, etc.
app.post('/api/students/infraction', (req, res) => {
  const { studentId, type, day, detail } = req.body;

  if (!studentId || !db.students[studentId]) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }

  const student = db.students[studentId];
  const infraction: StudentInfraction = {
    id: 'inf_' + Date.now(),
    type: type || 'LEFT_VIDEO',
    day: day || student.currentDay,
    timestamp: new Date().toISOString(),
    detail: detail || 'Saiu do vídeo ou tentou burlar regras'
  };

  student.infractions.push(infraction);
  
  // RESET THE VIDEO TO ZERO!
  student.videoCurrentTime = 0;
  student.currentStage = 'video';
  student.lastActive = new Date().toISOString();

  saveDb();

  let humanMessage = '';
  if (type === 'LEFT_VIDEO' || type === 'TAB_SWITCH' || type === 'BLUR_WINDOW') {
    humanMessage = `Aluno ${student.name} SAIU DA TELA DO VÍDEO no Dia ${day || student.currentDay}! O vídeo foi reiniciado para 00:00.`;
  } else if (type === 'SEEK_ATTEMPT') {
    humanMessage = `Aluno ${student.name} TENTOU ADIANTAR O VÍDEO no Dia ${day || student.currentDay}! Bloqueado e reiniciado para 00:00.`;
  } else if (type === 'PAUSE_ATTEMPT') {
    humanMessage = `Aluno ${student.name} TENTOU PAUSAR O VÍDEO no Dia ${day || student.currentDay}! Não permitido, vídeo reiniciado.`;
  } else {
    humanMessage = `Violação detectada para ${student.name}: ${detail}. Vídeo reiniciado.`;
  }

  addEvent({
    studentId: student.id,
    studentName: student.name,
    day: day || student.currentDay,
    type: type as any || 'LEFT_VIDEO',
    message: humanMessage,
    severity: 'danger'
  });

  res.json({
    success: true,
    resetToStart: true,
    message: 'Vídeo reiniciado devido à saída da tela ou tentativa de avanço/pausa.'
  });
});

// 7. Video Finished -> Unlocks Quiz for that day
app.post('/api/students/video-finished', (req, res) => {
  const { studentId, day } = req.body;
  if (!studentId || !db.students[studentId]) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }

  const s = db.students[studentId];
  s.currentStage = 'quiz';
  s.lastActive = new Date().toISOString();
  saveDb();

  addEvent({
    studentId: s.id,
    studentName: s.name,
    day: day || s.currentDay,
    type: 'VIDEO_STARTED',
    message: `Aluno ${s.name} assistiu 100% do vídeo do Dia ${day || s.currentDay}. Liberado para o Quiz!`,
    severity: 'info'
  });

  res.json({ success: true, currentStage: 'quiz' });
});

// 8. Quiz Submission: Must score >= 8.0 to pass! If < 8.0, RESTART DAY FROM BEGINNING!
app.post('/api/students/quiz-submit', (req, res) => {
  const { studentId, day, answers } = req.body;

  if (!studentId || !db.students[studentId]) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }

  const student = db.students[studentId];
  const lesson = db.lessons.find((l) => l.day === day) || db.lessons[day - 1];

  if (!lesson || !lesson.questions || lesson.questions.length === 0) {
    return res.status(400).json({ error: 'Lição ou perguntas não encontradas' });
  }

  // Calculate score out of 10
  let correctCount = 0;
  const totalQuestions = lesson.questions.length;
  const questionResults = lesson.questions.map((q) => {
    const selected = answers ? answers[q.id] : undefined;
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      selected,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const score = Number(((correctCount / totalQuestions) * 10).toFixed(1));
  const attempts = (student.dayAttempts[day] || 0) + 1;
  student.dayAttempts[day] = attempts;
  student.dayScores[day] = score;

  const PASSING_SCORE = 8.0;
  const passed = score >= PASSING_SCORE;

  if (passed) {
    // Approved for this day!
    if (day >= 10) {
      student.currentStage = 'course_finished';
      student.currentDay = 10;
      addEvent({
        studentId: student.id,
        studentName: student.name,
        day: 10,
        type: 'COURSE_COMPLETED',
        message: `🎓 Aluno ${student.name} CONCLUIU OS 10 DIAS DO CURSO! Nota final do Dia 10: ${score}/10!`,
        severity: 'success'
      });
    } else {
      student.currentDay = day + 1;
      student.currentStage = 'video';
      student.videoCurrentTime = 0;
      student.videoDuration = db.lessons[day]?.durationSeconds || 120;
      addEvent({
        studentId: student.id,
        studentName: student.name,
        day,
        type: 'QUIZ_PASSED',
        message: `✅ Aluno ${student.name} APROVADO no Dia ${day} com nota ${score}/10! Liberado o Dia ${day + 1}.`,
        severity: 'success'
      });
    }
  } else {
    // FAILED (< 8.0) -> Strict enforcement: RESET ENTIRE DAY TO VIDEO 00:00!
    student.currentStage = 'video';
    student.videoCurrentTime = 0;
    
    addEvent({
      studentId: student.id,
      studentName: student.name,
      day,
      type: 'QUIZ_FAILED_RESET',
      message: `❌ Aluno ${student.name} REPROVADO no Quiz do Dia ${day} com nota ${score}/10 (Mínimo: 8.0). Conforme regra, voltou para o início do vídeo!`,
      severity: 'danger'
    });
  }

  // Evaluate badges on student after quiz outcome
  const badgeEval = evaluateStudentBadges(student);
  if (badgeEval.updated) {
    badgeEval.newBadges.forEach((b) => {
      addEvent({
        studentId: student.id,
        studentName: student.name,
        day: student.currentDay,
        type: 'BADGE_UNLOCKED',
        message: `🏆 Aluno ${student.name} DESBLOQUEOU A CONQUISTA: "${b.name}"! (${b.description})`,
        severity: 'success'
      });
    });
  }

  saveDb();

  res.json({
    success: true,
    passed,
    score,
    passingScore: PASSING_SCORE,
    correctCount,
    totalQuestions,
    questionResults,
    student,
    newlyUnlockedBadges: badgeEval.newBadges,
    message: passed
      ? `Parabéns! Você tirou nota ${score}/10 e foi aprovado no Dia ${day}!`
      : `Nota insuficiente: ${score}/10. O mínimo exigido é ${PASSING_SCORE}. Conforme as regras, você precisa reassistir a aula desde o início (00:00) e tentar novamente.`
  });
});

// 9. Real-time Roster & Stats for Instructor
app.get('/api/instructor/roster', (req, res) => {
  res.json(getRosterData());
});

// 10. Audit Events for Instructor
app.get('/api/instructor/events', (req, res) => {
  res.json({ events: db.events.slice(0, 100) });
});

// 11. Real-time SSE Stream for Instructor Dashboard
app.get('/api/instructor/events/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.add(res);

  // Send initial data immediately
  res.write(`event: initial\ndata: ${JSON.stringify(getRosterData())}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// 12. Instructor Reset Student Progress
app.post('/api/instructor/reset-student', (req, res) => {
  const { studentId, targetDay = 1 } = req.body;
  if (!studentId || !db.students[studentId]) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }

  const s = db.students[studentId];
  s.currentDay = targetDay;
  s.currentStage = 'video';
  s.videoCurrentTime = 0;
  if (targetDay === 1) {
    s.dayScores = {};
    s.dayAttempts = {};
  }
  saveDb();

  addEvent({
    studentId: s.id,
    studentName: s.name,
    day: targetDay,
    type: 'INSTRUCTOR_RESET',
    message: `Instrutor reiniciou o progresso do aluno ${s.name} para o Dia ${targetDay}.`,
    severity: 'warning'
  });

  res.json({ success: true, student: s });
});

// 13. Instructor Manually Advance Student
app.post('/api/instructor/advance-student', (req, res) => {
  const { studentId, score = 10.0 } = req.body;
  if (!studentId || !db.students[studentId]) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }

  const s = db.students[studentId];
  s.dayScores[s.currentDay] = Math.max(8.0, Number(score) || 10.0);
  if (s.currentDay >= 10) {
    s.currentStage = 'course_finished';
  } else {
    s.currentDay = s.currentDay + 1;
    s.currentStage = 'video';
    s.videoCurrentTime = 0;
  }
  saveDb();

  addEvent({
    studentId: s.id,
    studentName: s.name,
    day: s.currentDay,
    type: 'DAY_UNLOCKED',
    message: `Admin aprovou manualmente o progresso do aluno ${s.name}.`,
    severity: 'success'
  });

  const badgeEval = evaluateStudentBadges(s);
  if (badgeEval.updated) {
    badgeEval.newBadges.forEach((b) => {
      addEvent({
        studentId: s.id,
        studentName: s.name,
        day: s.currentDay,
        type: 'BADGE_UNLOCKED',
        message: `🏆 Aluno ${s.name} DESBLOQUEOU A CONQUISTA: "${b.name}"! (${b.description})`,
        severity: 'success'
      });
    });
  }

  saveDb();

  res.json({ success: true, student: s, newlyUnlockedBadges: badgeEval.newBadges });
});

// 14. Instructor Delete Student
app.delete('/api/instructor/student/:id', (req, res) => {
  const { id } = req.params;
  if (!db.students[id]) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }

  const removedName = db.students[id].name;
  delete db.students[id];
  saveDb();

  addEvent({
    studentId: id,
    studentName: removedName,
    day: 0,
    type: 'INSTRUCTOR_RESET',
    message: `Admin removeu o cadastro do aluno ${removedName}.`,
    severity: 'danger'
  });

  res.json({ success: true });
});

// 15. Instructor Clear All Students
app.post('/api/instructor/clear-all', (req, res) => {
  db.students = {};
  db.events = [];
  saveDb();
  res.json({ success: true });
});

// 16. Available Badges Catalog
app.get('/api/badges', (req, res) => {
  res.json({ badges: ALL_BADGES });
});

// ======================== VITE & STATIC SERVING ========================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
