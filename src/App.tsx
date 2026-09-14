import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { StudentIdentificationModal } from './components/StudentIdentificationModal';
import { StudentCourseView } from './components/StudentCourseView';
import { InstructorDashboard } from './components/InstructorDashboard';
import { CertificateModal } from './components/CertificateModal';
import { BadgesModal } from './components/BadgesModal';
import { BadgeUnlockCelebration } from './components/BadgeUnlockCelebration';
import { AdminLoginModal } from './components/AdminLoginModal';
import { DEFAULT_LESSONS } from './data/defaultLessons';
import { ALL_BADGES, getBadgeById, BadgeDefinition } from './data/badges';
import { Student, DayLesson, AuditEvent, InstructorStats } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'student' | 'instructor'>('student');
  const [student, setStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<DayLesson[]>(DEFAULT_LESSONS);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [eventsList, setEventsList] = useState<AuditEvent[]>([]);
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [isIdentifyModalOpen, setIsIdentifyModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [celebrationBadges, setCelebrationBadges] = useState<BadgeDefinition[]>([]);
  const [onlineCount, setOnlineCount] = useState(1);

  // Admin authentication state loaded from local cache
  const [adminAuth, setAdminAuth] = useState<{ user: string; email?: string } | null>(() => {
    try {
      const stored = localStorage.getItem('inf_basica_admin_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const studentRef = useRef<Student | null>(student);
  studentRef.current = student;

  // 1. Load initial lessons and check cached student
  useEffect(() => {
    // Fetch course lessons from API
    fetch('/api/course')
      .then((res) => res.json())
      .then((data) => {
        if (data.lessons && data.lessons.length > 0) {
          setLessons(data.lessons);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch course lessons from API:', err);
      });

    // Check localStorage for student
    const cachedStudent = localStorage.getItem('inf_basica_student');
    if (cachedStudent) {
      try {
        const parsed = JSON.parse(cachedStudent);
        setStudent(parsed);
        // Re-identify on server to ensure online presence
        fetch('/api/students/identify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: parsed.name,
            birthDate: parsed.birthDate || '2008-01-01',
            shift: parsed.shift || 'Matutino',
            existingId: parsed.id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.student) {
              setStudent(data.student);
              localStorage.setItem('inf_basica_student', JSON.stringify(data.student));
            }
          })
          .catch(() => {});
      } catch {
        setIsIdentifyModalOpen(true);
      }
    } else {
      setIsIdentifyModalOpen(true);
    }
  }, []);

  // 2. Fetch instructor data (roster, stats, events)
  const fetchInstructorData = useCallback(() => {
    fetch('/api/instructor/roster')
      .then((res) => res.json())
      .then((data) => {
        if (data.students) setStudentsList(data.students);
        if (data.stats) {
          setStats(data.stats);
          setOnlineCount(data.stats.onlineStudents);
        }
      })
      .catch((err) => console.error('Error fetching roster:', err));

    fetch('/api/instructor/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events) setEventsList(data.events);
      })
      .catch((err) => console.error('Error fetching events:', err));
  }, []);

  useEffect(() => {
    fetchInstructorData();
    const interval = setInterval(fetchInstructorData, 4000);
    return () => clearInterval(interval);
  }, [fetchInstructorData]);

  // 3. Server-Sent Events (SSE) for Real-Time instructor streaming
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/instructor/events/stream');

      eventSource.addEventListener('new_event', (e) => {
        try {
          const ev = JSON.parse(e.data);
          setEventsList((prev) => [ev, ...prev.slice(0, 99)]);
        } catch {}
      });

      eventSource.addEventListener('roster_update', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.students) setStudentsList(data.students);
          if (data.stats) {
            setStats(data.stats);
            setOnlineCount(data.stats.onlineStudents);
          }
        } catch {}
      });

      eventSource.addEventListener('course_updated', (e) => {
        try {
          const updatedLesson = JSON.parse(e.data);
          setLessons((prev) =>
            prev.map((l) => (l.day === updatedLesson.day ? updatedLesson : l))
          );
        } catch {}
      });
    } catch (err) {
      console.warn('SSE connection failed, relying on polling:', err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // 4. Student Heartbeat Loop (every 4 seconds)
  useEffect(() => {
    if (!student) return;

    const ping = () => {
      if (!studentRef.current) return;
      fetch('/api/students/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentRef.current.id,
          currentDay: studentRef.current.currentDay,
          currentStage: studentRef.current.currentStage,
          videoTime: studentRef.current.videoCurrentTime,
          videoDuration: studentRef.current.videoDuration,
        }),
      }).catch(() => {});
    };

    ping();
    const hbInterval = setInterval(ping, 4000);
    return () => clearInterval(hbInterval);
  }, [student?.id]);

  // Student Identification Handler
  const handleIdentify = async (data: {
    name: string;
    birthDate: string;
    shift: 'Matutino' | 'Vespertino';
  }) => {
    try {
      const res = await fetch('/api/students/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.student) {
        setStudent(json.student);
        localStorage.setItem('inf_basica_student', JSON.stringify(json.student));
        if (json.newlyUnlockedBadges && json.newlyUnlockedBadges.length > 0) {
          const unlockedObjs = (json.newlyUnlockedBadges as string[])
            .map((id) => getBadgeById(id))
            .filter((b): b is BadgeDefinition => Boolean(b));
          if (unlockedObjs.length > 0) {
            setCelebrationBadges(unlockedObjs);
          }
        }
        fetchInstructorData();
      }
    } catch (err) {
      console.error('Error during student identification:', err);
    }
  };

  // Video Complete Handler (Unlocks Quiz)
  const handleVideoComplete = async (day: number) => {
    if (!student) return;
    try {
      const res = await fetch('/api/students/video-finished', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, day }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = {
          ...student,
          currentStage: 'quiz' as const,
        };
        setStudent(updated);
        localStorage.setItem('inf_basica_student', JSON.stringify(updated));
        fetchInstructorData();
      }
    } catch (err) {
      console.error('Error recording video finish:', err);
    }
  };

  // Violation Handler: User attempted forward seek, pause, left video tab, attention timeout, etc.
  const handleViolation = async (
    type: 'LEFT_VIDEO' | 'SEEK_ATTEMPT' | 'PAUSE_ATTEMPT' | 'ATTENTION_TIMEOUT',
    detail: string
  ) => {
    if (!student) return;
    try {
      const res = await fetch('/api/students/infraction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          type,
          day: student.currentDay,
          detail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Reset local student stage and video time to 0
        const updated = {
          ...student,
          currentStage: 'video' as const,
          videoCurrentTime: 0,
        };
        setStudent(updated);
        localStorage.setItem('inf_basica_student', JSON.stringify(updated));
        fetchInstructorData();
      }
    } catch (err) {
      console.error('Error recording violation:', err);
    }
  };

  // Time update handler
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (!student) return;
    setStudent((prev) =>
      prev
        ? {
            ...prev,
            videoCurrentTime: currentTime,
            videoDuration: duration,
          }
        : null
    );
  };

  // Quiz Submission Handler
  const handleSubmitQuiz = async (answers: Record<string, number>) => {
    if (!student) {
      throw new Error('Aluno não identificado');
    }

    const res = await fetch('/api/students/quiz-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        day: student.currentDay,
        answers,
      }),
    });

    const data = await res.json();

    if (data.student) {
      setStudent(data.student);
      localStorage.setItem('inf_basica_student', JSON.stringify(data.student));
    }

    if (data.newlyUnlockedBadges && data.newlyUnlockedBadges.length > 0) {
      const unlockedObjs = (data.newlyUnlockedBadges as string[])
        .map((id) => getBadgeById(id))
        .filter((b): b is BadgeDefinition => Boolean(b));
      if (unlockedObjs.length > 0) {
        setCelebrationBadges(unlockedObjs);
      }
    }

    fetchInstructorData();

    return data;
  };

  // Restart Day Handler
  const handleRestartDay = (day: number) => {
    if (!student) return;
    const updated = {
      ...student,
      currentDay: day,
      currentStage: 'video' as const,
      videoCurrentTime: 0,
    };
    setStudent(updated);
    localStorage.setItem('inf_basica_student', JSON.stringify(updated));
    fetch('/api/students/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        currentDay: day,
        currentStage: 'video',
        videoTime: 0,
      }),
    }).catch(() => {});
  };

  // Advance to Next Day Handler
  const handleAdvanceDay = (currentDayNum: number) => {
    if (!student) return;
    const nextDay = Math.min(10, currentDayNum + 1);
    const updated = {
      ...student,
      currentDay: nextDay,
      currentStage: 'video' as const,
      videoCurrentTime: 0,
    };
    setStudent(updated);
    localStorage.setItem('inf_basica_student', JSON.stringify(updated));
    fetch('/api/students/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        currentDay: nextDay,
        currentStage: 'video',
        videoTime: 0,
      }),
    }).catch(() => {});
  };

  // Instructor Update Lesson Handler
  const handleUpdateLesson = async (day: number, data: Partial<DayLesson>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/course/day/${day}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.lesson) {
        setLessons((prev) => prev.map((l) => (l.day === day ? json.lesson : l)));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating lesson:', err);
      return false;
    }
  };

  // Instructor Reset Student Handler
  const handleResetStudent = async (studentId: string, targetDay: number = 1): Promise<boolean> => {
    try {
      const res = await fetch('/api/instructor/reset-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, targetDay }),
      });
      const json = await res.json();
      if (json.success) {
        if (student && student.id === studentId) {
          setStudent(json.student);
          localStorage.setItem('inf_basica_student', JSON.stringify(json.student));
        }
        fetchInstructorData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error resetting student:', err);
      return false;
    }
  };

  // Instructor Manually Advance/Approve Student Handler
  const handleAdvanceStudent = async (studentId: string, score: number = 10.0): Promise<boolean> => {
    try {
      const res = await fetch('/api/instructor/advance-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, score }),
      });
      const json = await res.json();
      if (json.success) {
        if (student && student.id === studentId) {
          setStudent(json.student);
          localStorage.setItem('inf_basica_student', JSON.stringify(json.student));
          if (json.newlyUnlockedBadges && json.newlyUnlockedBadges.length > 0) {
            const unlockedObjs = (json.newlyUnlockedBadges as string[])
              .map((id) => getBadgeById(id))
              .filter((b): b is BadgeDefinition => Boolean(b));
            if (unlockedObjs.length > 0) {
              setCelebrationBadges(unlockedObjs);
            }
          }
        }
        fetchInstructorData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error advancing student:', err);
      return false;
    }
  };

  // Instructor Delete Student Handler
  const handleDeleteStudent = async (studentId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/instructor/student/${studentId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        if (student && student.id === studentId) {
          setStudent(null);
          localStorage.removeItem('inf_basica_student');
        }
        fetchInstructorData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting student:', err);
      return false;
    }
  };

  const handleClearAllStudents = async () => {
    try {
      const res = await fetch('/api/instructor/clear-all-students', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStudentsList([]);
        setEventsList([]);
        if (student) {
          setStudent(null);
          localStorage.removeItem('inf_basica_student');
        }
        fetchInstructorData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error clearing all students:', err);
      return false;
    }
  };

  const handleViewChange = (view: 'student' | 'instructor') => {
    if (view === 'instructor') {
      if (!adminAuth) {
        setIsAdminLoginModalOpen(true);
        return;
      }
    }
    setCurrentView(view);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('inf_basica_admin_auth');
    setAdminAuth(null);
    setCurrentView('student');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        student={student}
        onOpenIdentify={() => setIsIdentifyModalOpen(true)}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        onlineCount={onlineCount}
        isAdminAuthenticated={!!adminAuth}
        adminName={adminAuth?.user}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Viewport */}
      <main className="flex-1 pb-16">
        {currentView === 'student' ? (
          student ? (
            <StudentCourseView
              student={student}
              lessons={lessons}
              onVideoComplete={handleVideoComplete}
              onViolation={handleViolation}
              onTimeUpdate={handleTimeUpdate}
              onSubmitQuiz={handleSubmitQuiz}
              onRestartDay={handleRestartDay}
              onAdvanceDay={handleAdvanceDay}
              onViewCertificate={() => setIsCertModalOpen(true)}
              onOpenBadges={() => setIsBadgesModalOpen(true)}
            />
          ) : (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                <span className="text-2xl font-black">🎓</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Identificação Necessária
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Para iniciar as videoaulas do curso de 10 dias e registrar seu aproveitamento com o instrutor em tempo real, informe seu nome completo, data de nascimento e turno (Matutino ou Vespertino).
              </p>
              <button
                id="identify-initial-cta-btn"
                type="button"
                onClick={() => setIsIdentifyModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                Fazer Identificação Agora
              </button>
            </div>
          )
        ) : (
          <InstructorDashboard
            stats={stats}
            students={studentsList}
            events={eventsList}
            lessons={lessons}
            onUpdateLesson={handleUpdateLesson}
            onResetStudent={handleResetStudent}
            onAdvanceStudent={handleAdvanceStudent}
            onDeleteStudent={handleDeleteStudent}
            onRefresh={fetchInstructorData}
            adminUser={adminAuth?.user}
            onClearAllStudents={handleClearAllStudents}
          />
        )}
      </main>

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={(authData) => {
          setAdminAuth(authData);
          setCurrentView('instructor');
        }}
      />

      {/* Student Identification Modal */}
      <StudentIdentificationModal
        isOpen={isIdentifyModalOpen}
        onClose={() => setIsIdentifyModalOpen(false)}
        onIdentify={handleIdentify}
        currentStudent={student}
      />

      {/* Official Certificate Modal */}
      {student && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          student={student}
        />
      )}

      {/* Student Badges Collection Modal */}
      {student && (
        <BadgesModal
          isOpen={isBadgesModalOpen}
          onClose={() => setIsBadgesModalOpen(false)}
          student={student}
        />
      )}

      {/* Badges Unlock Celebration Overlay */}
      <BadgeUnlockCelebration
        badges={celebrationBadges}
        onClose={() => setCelebrationBadges([])}
        onOpenAllBadges={() => {
          setCelebrationBadges([]);
          setIsBadgesModalOpen(true);
        }}
      />
    </div>
  );
}
