export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DayLesson {
  day: number;
  title: string;
  subtitle: string;
  durationSeconds: number;
  videoUrl: string;
  videoUrls?: string[]; // Playlist de até 5 vídeos
  videoType: 'youtube' | 'mp4' | 'simulated';
  isReleased?: boolean; // Liberação dia a dia pelo Administrador
  summary: string[];
  questions: Question[];
}

export interface StudentInfraction {
  id: string;
  type: 'LEFT_VIDEO' | 'SEEK_ATTEMPT' | 'PAUSE_ATTEMPT' | 'TAB_SWITCH' | 'BLUR_WINDOW' | 'ATTENTION_TIMEOUT';
  day: number;
  timestamp: string;
  detail: string;
}

export interface Student {
  id: string;
  name: string;
  birthDate: string; // Data de Nascimento
  shift: 'Matutino' | 'Vespertino'; // Turno
  currentDay: number; // 1 to 10
  currentStage: 'video' | 'quiz' | 'day_complete' | 'course_finished';
  videoCurrentTime: number;
  videoDuration: number;
  dayScores: Record<number, number>; // day -> score (0-10)
  dayAttempts: Record<number, number>; // day -> attempts count
  infractions: StudentInfraction[];
  badges?: string[]; // array of unlocked badge IDs
  badgeUnlocks?: Record<string, string>; // badgeId -> unlockedAt timestamp
  isOnline: boolean;
  lastActive: string;
  createdAt: string;
  email?: string;
  registration?: string;
}

export interface AuditEvent {
  id: string;
  studentId: string;
  studentName: string;
  day: number;
  type:
    | 'STUDENT_LOGIN'
    | 'VIDEO_STARTED'
    | 'LEFT_VIDEO'
    | 'SEEK_ATTEMPT'
    | 'PAUSE_ATTEMPT'
    | 'ATTENTION_TIMEOUT'
    | 'QUIZ_SUBMITTED'
    | 'QUIZ_PASSED'
    | 'QUIZ_FAILED_RESET'
    | 'QUIZ_ATTEMPTS_EXHAUSTED'
    | 'DAY_UNLOCKED'
    | 'COURSE_COMPLETED'
    | 'INSTRUCTOR_RESET'
    | 'BADGE_UNLOCKED'
    | 'VIDEO_UPLOADED';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export interface InstructorStats {
  totalStudents: number;
  onlineStudents: number;
  averageScore: number;
  totalInfractions: number;
  completionRate: number;
  dayDistribution: Record<number, number>;
}
