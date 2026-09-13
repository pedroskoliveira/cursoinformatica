import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Award,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { DayLesson, Student } from '../types';
import { StrictVideoPlayer } from './StrictVideoPlayer';
import { DayQuiz } from './DayQuiz';
import { ALL_BADGES, getBadgeById } from '../data/badges';
import { BadgeIcon } from './BadgeIcon';

interface StudentCourseViewProps {
  student: Student;
  lessons: DayLesson[];
  onVideoComplete: (day: number) => Promise<void>;
  onViolation: (type: 'LEFT_VIDEO' | 'SEEK_ATTEMPT' | 'PAUSE_ATTEMPT', detail: string) => Promise<void>;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onSubmitQuiz: (answers: Record<string, number>) => Promise<any>;
  onRestartDay: (day: number) => void;
  onAdvanceDay: (day: number) => void;
  onViewCertificate: () => void;
  onOpenBadges?: () => void;
}

export const StudentCourseView: React.FC<StudentCourseViewProps> = ({
  student,
  lessons,
  onVideoComplete,
  onViolation,
  onTimeUpdate,
  onSubmitQuiz,
  onRestartDay,
  onAdvanceDay,
  onViewCertificate,
  onOpenBadges,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(student.currentDay || 1);

  // Sync selected day with student's current day
  useEffect(() => {
    setSelectedDay(student.currentDay || 1);
  }, [student.currentDay]);

  const currentLesson = lessons.find((l) => l.day === selectedDay) || lessons[0];
  const isCompleted = student.dayScores?.[selectedDay] !== undefined && student.dayScores[selectedDay] >= 8.0;
  const isLessonReleased = currentLesson.isReleased !== false || isCompleted;
  const isVideoDone = isCompleted || student.currentStage === 'quiz' || student.currentStage === 'course_finished';
  const isLastDay = selectedDay === 10;
  const hasFinishedAll = student.currentStage === 'course_finished' || (student.dayScores?.[10] !== undefined && student.dayScores[10] >= 8.0);

  return (
    <div id="student-course-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Welcome / Rules Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <span>Ambiente de Aprendizagem Obrigatório</span>
            <span>•</span>
            <span>Nota de Corte 8.0</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Olá, {student.name}! Bem-vindo(a) ao seu Curso de Informática
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Para avançar, assista às videoaulas completas sem pausar ou alternar de tela. Cada dia culmina em um quiz onde a aprovação exige nota mínima 8.0.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {onOpenBadges && (
            <button
              id="open-badges-banner-btn"
              type="button"
              onClick={onOpenBadges}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Conquistas ({(student.badges || []).length}/{ALL_BADGES.length})</span>
            </button>
          )}

          {hasFinishedAll && (
            <button
              id="open-certificate-banner-btn"
              type="button"
              onClick={onViewCertificate}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              <span>Ver Meu Certificado Oficial</span>
            </button>
          )}
        </div>
      </div>

      {/* 10 Days Stepper / Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Jornada de 10 Dias
          </span>
          <span>
            Progresso Geral:{' '}
            <strong className="text-white">
              {Object.keys(student.dayScores || {}).filter((d) => (student.dayScores[Number(d)] || 0) >= 8).length} / 10 Dias Concluídos
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {lessons.map((lesson) => {
            const isDayPassed = (student.dayScores?.[lesson.day] || 0) >= 8.0;
            const isReleasedByAdmin = lesson.isReleased !== false;
            const isUnlocked = isDayPassed || (isReleasedByAdmin && lesson.day <= student.currentDay);
            const isCurrent = lesson.day === selectedDay;

            let cardStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed';
            if (isDayPassed) {
              cardStyle = 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200 hover:border-emerald-600 cursor-pointer';
            } else if (isUnlocked) {
              cardStyle = 'bg-slate-900 border-slate-700 text-slate-200 hover:border-blue-500 cursor-pointer';
            } else if (!isReleasedByAdmin) {
              cardStyle = 'bg-slate-950/80 border-amber-900/30 text-amber-500/60 cursor-not-allowed';
            }
            if (isCurrent) {
              cardStyle += ' ring-2 ring-blue-500 shadow-lg shadow-blue-500/20';
            }

            return (
              <button
                key={lesson.day}
                id={`day-nav-card-${lesson.day}`}
                type="button"
                disabled={!isUnlocked}
                onClick={() => setSelectedDay(lesson.day)}
                title={!isReleasedByAdmin ? 'Aguardando liberação do professor' : ''}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all min-h-[76px] ${cardStyle}`}
              >
                <div className="flex items-center justify-between w-full text-[11px] font-bold">
                  <span>Dia {lesson.day}</span>
                  {isDayPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isUnlocked ? (
                    <Play className="w-3 h-3 text-blue-400" />
                  ) : !isReleasedByAdmin ? (
                    <Lock className="w-3 h-3 text-amber-500/70" />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-600" />
                  )}
                </div>

                <div className="text-[10px] truncate max-w-full font-medium mt-1 text-slate-400">
                  {lesson.title.replace(`Dia ${lesson.day}:`, '').trim()}
                </div>

                {isDayPassed ? (
                  <span className="text-[10px] font-black text-emerald-400 mt-0.5">
                    Nota: {student.dayScores[lesson.day]?.toFixed(1)}
                  </span>
                ) : !isReleasedByAdmin ? (
                  <span className="text-[9px] font-semibold text-amber-500/80 mt-0.5">
                    Bloqueado
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area for the Selected Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Strict Video Player + Day Quiz */}
        <div className="lg:col-span-2 space-y-8">
          {/* Day Title and Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Dia {currentLesson.day} de 10
              </span>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Vídeo Obrigatório (Assistir Integralmente)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentLesson.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {currentLesson.subtitle}
            </p>
          </div>

          {!isLessonReleased ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Dia {currentLesson.day} Aguardando Liberação do Professor
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  O conteúdo deste dia ainda não foi liberado pelo professor. Fique atento às instruções em sala de aula para o momento da liberação.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Strict Video Player */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <Play className="w-3.5 h-3.5 text-blue-400" />
                    <span>Etapa 1: Videoaula Obrigatória</span>
                  </span>
                  <span className="text-amber-400 font-medium text-[11px]">
                    ⚠️ Não saia da aba e não tente adiantar
                  </span>
                </div>

                <StrictVideoPlayer
                  lesson={currentLesson}
                  onVideoComplete={() => onVideoComplete(currentLesson.day)}
                  onViolation={onViolation}
                  onTimeUpdate={onTimeUpdate}
                  isUnlockedForQuiz={isVideoDone}
                />
              </div>

              {/* Day Quiz Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Etapa 2: Exercícios Avaliativos (Nota de corte: 8.0)</span>
                  </span>
                  {isVideoDone && (
                    <span className="text-emerald-400 font-semibold text-[11px]">
                      Liberado para resposta
                    </span>
                  )}
                </div>

                <DayQuiz
                  lesson={currentLesson}
                  isUnlocked={isVideoDone}
                  onSubmitQuiz={onSubmitQuiz}
                  onRestartDay={() => onRestartDay(currentLesson.day)}
                  onNextDay={() => onAdvanceDay(currentLesson.day)}
                  isLastDay={isLastDay}
                  onViewCertificate={onViewCertificate}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Column (1 Col): Pedagogy & Summary Guide */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Resumo dos Tópicos do Dia {currentLesson.day}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Estes conceitos fundamentais são essenciais tanto para os exercícios quanto para sua formação em informática:
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              {currentLesson.summary.map((pt, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Anti-Cheat Warning Guide */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-xs text-amber-200 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-300 uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Lembrete de Integridade</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              O sistema monitora continuamente se o vídeo está em foco. Se você mudar de aba, o vídeo reinicia para 00:00.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Ao concluir a aula e fazer o quiz, você precisa acertar pelo menos 80% das questões (nota 8.0). Caso contrário, a aula do dia é reiniciada para você assimilar o conteúdo.
            </p>
          </div>

          {/* Student Stats Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-3">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Seu Desempenho</span>
              <span className="text-amber-400 font-semibold">Turno: {student.shift}</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Data de Nascimento:</span>
                <strong className="text-slate-200">
                  {student.birthDate
                    ? student.birthDate.split('-').length === 3
                      ? `${student.birthDate.split('-')[2]}/${student.birthDate.split('-')[1]}/${student.birthDate.split('-')[0]}`
                      : student.birthDate
                    : '—'}
                </strong>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Dia Atual de Estudo:</span>
                <strong className="text-white">Dia {student.currentDay} / 10</strong>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Tentativas no Quiz deste Dia:</span>
                <strong className="text-white">{student.dayAttempts?.[currentLesson.day] || 0}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Nota Obtida:</span>
                <strong
                  className={
                    student.dayScores?.[currentLesson.day] !== undefined
                      ? student.dayScores[currentLesson.day] >= 8
                        ? 'text-emerald-400'
                        : 'text-red-400'
                      : 'text-slate-500'
                  }
                >
                  {student.dayScores?.[currentLesson.day] !== undefined
                    ? `${student.dayScores[currentLesson.day].toFixed(1)} / 10.0`
                    : 'Pendente de avaliação'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reinícios por Violação:</span>
                <strong className="text-red-400">{student.infractions?.length || 0}</strong>
              </div>
            </div>
          </div>

          {/* Badges / Conquistas Widget */}
          <div
            id="student-badges-widget"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Conquistas & Badges</span>
              </div>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                {(student.badges || []).length} / {ALL_BADGES.length}
              </span>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Desbloqueie medalhas alcançando notas 10, mantendo disciplina e concluindo a jornada completa.
            </p>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {ALL_BADGES.slice(0, 4).map((badge) => {
                const isUnlocked = (student.badges || []).includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center text-center space-y-1"
                  >
                    <BadgeIcon badge={badge} isUnlocked={isUnlocked} size="sm" />
                    <span className="text-[9px] text-slate-400 truncate w-full block">
                      {badge.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {onOpenBadges && (
              <button
                id="view-all-badges-sidebar-btn"
                type="button"
                onClick={onOpenBadges}
                className="w-full mt-2 py-2 px-3 bg-slate-800 hover:bg-slate-700/80 text-amber-300 rounded-xl text-xs font-semibold border border-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ver Todas as Conquistas ({ALL_BADGES.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
