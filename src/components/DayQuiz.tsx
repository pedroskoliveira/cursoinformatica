import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Award,
  Sparkles,
  Lock,
} from 'lucide-react';
import { DayLesson, Question } from '../types';

interface DayQuizProps {
  lesson: DayLesson;
  isUnlocked: boolean;
  onSubmitQuiz: (answers: Record<string, number>) => Promise<{
    passed: boolean;
    score: number;
    correctCount: number;
    totalQuestions: number;
    questionResults?: any[];
    message: string;
    newlyUnlockedBadges?: string[];
  }>;
  onRestartDay: () => void;
  onNextDay: () => void;
  isLastDay: boolean;
  onViewCertificate: () => void;
}

export const DayQuiz: React.FC<DayQuizProps> = ({
  lesson,
  isUnlocked,
  onSubmitQuiz,
  onRestartDay,
  onNextDay,
  isLastDay,
  onViewCertificate,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    correctCount: number;
    totalQuestions: number;
    questionResults?: any[];
    message: string;
  } | null>(null);

  const questions = lesson.questions || [];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result) return; // Locked once submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === questions.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await onSubmitQuiz(selectedAnswers);
      setResult(res);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForRetry = () => {
    setResult(null);
    setSelectedAnswers({});
    onRestartDay();
  };

  if (!isUnlocked) {
    return (
      <div
        id="quiz-locked-card"
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-lg"
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">
          Exercícios do Dia {lesson.day} Bloqueados
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
          Você precisa assistir a videoaula completa acima (100% da duração) sem sair da tela e sem adiantar para liberar as questões avaliativas.
        </p>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400/90 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          <span>Assista ao vídeo para desbloquear</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`quiz-container-day-${lesson.day}`}
      className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Quiz Header */}
      <div className="bg-slate-950 p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Quiz Avaliativo: {lesson.title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Responda às questões com atenção. Nota mínima de aprovação:{' '}
            <strong className="text-emerald-400">8.0 / 10</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400">
            Respondidas: <strong className="text-white">{answeredCount}</strong> / {questions.length}
          </span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Result Modal / Callout if submitted */}
      {result && (
        <div
          id="quiz-result-feedback-banner"
          className={`p-6 border-b ${
            result.passed
              ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-100'
              : 'bg-red-950/80 border-red-800/80 text-red-100'
          }`}
        >
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-1">
              {result.passed ? (
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 animate-pulse">
                  <AlertOctagon className="w-10 h-10" />
                </div>
              )}
            </div>

            <h4 className="text-2xl font-black tracking-tight">
              {result.passed ? '🎉 Aprovado com Sucesso!' : '❌ Nota Insuficiente (Menor que 8.0)'}
            </h4>

            <div className="flex items-center justify-center space-x-4 text-sm font-semibold">
              <span
                className={`px-3 py-1 rounded-full text-base font-bold ${
                  result.passed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                Sua Nota: {result.score.toFixed(1)} / 10.0
              </span>
              <span className="text-xs text-slate-300">
                Acertos: {result.correctCount} de {result.totalQuestions}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto leading-relaxed">
              {result.passed
                ? `Excelente aproveitamento! Você superou o critério de aprovação (nota 8.0) e já pode prosseguir.`
                : `Atenção: A nota mínima é 8.0. Conforme a regra obrigatória estabelecida, você deve reassistir a aula do Dia ${lesson.day} desde o início (00:00) para tentar novamente.`}
            </p>

            {result.newlyUnlockedBadges && result.newlyUnlockedBadges.length > 0 && (
              <div
                id="quiz-unlocked-badges-chip"
                className="bg-amber-500/20 border border-amber-500/40 rounded-xl px-4 py-2 text-amber-300 text-xs font-bold inline-flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>
                  {result.newlyUnlockedBadges.length === 1
                    ? '🎉 Nova Conquista Desbloqueada no seu Perfil!'
                    : `🎉 ${result.newlyUnlockedBadges.length} Novas Conquistas Desbloqueadas!`}
                </span>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {result.passed ? (
                isLastDay ? (
                  <button
                    id="finish-course-certificate-btn"
                    type="button"
                    onClick={onViewCertificate}
                    className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    <span>Emitir Meu Certificado de Conclusão</span>
                  </button>
                ) : (
                  <button
                    id="advance-next-day-btn"
                    type="button"
                    onClick={onNextDay}
                    className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                  >
                    <span>Ir para o Dia {lesson.day + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )
              ) : (
                <button
                  id="quiz-failed-restart-day-btn"
                  type="button"
                  onClick={handleResetForRetry}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reiniciar Aula do Dia {lesson.day} (00:00)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {questions.map((q: Question, qIdx: number) => {
          const selectedOption = selectedAnswers[q.id];
          const evaluated = result?.questionResults?.find((qr: any) => qr.questionId === q.id);

          return (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 transition-all"
            >
              <div className="flex items-start space-x-3 mb-4">
                <span className="w-7 h-7 rounded-lg bg-slate-800 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {qIdx + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-200 leading-snug">
                    {q.question}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Vale 2.0 pontos
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-0 sm:pl-10">
                {q.options.map((opt: string, optIdx: number) => {
                  const isSelected = selectedOption === optIdx;
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  let optionStyle =
                    'border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300';

                  if (isSelected && !result) {
                    optionStyle = 'border-blue-500 bg-blue-500/10 text-white shadow-sm';
                  }

                  if (result) {
                    if (optIdx === q.correctIndex) {
                      optionStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-200 font-semibold';
                    } else if (isSelected && optIdx !== q.correctIndex) {
                      optionStyle = 'border-red-500 bg-red-500/15 text-red-200 line-through';
                    } else {
                      optionStyle = 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center space-x-3 text-xs sm:text-sm transition-all cursor-pointer ${optionStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after quiz submission */}
              {result && q.explanation && (
                <div className="mt-4 pl-0 sm:pl-10 text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                  <strong className="text-blue-400 block mb-1">Explicação Pedagógica:</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        {!result && (
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {allAnswered ? (
                <span className="text-emerald-400 font-medium">
                  Todas as {questions.length} questões foram respondidas! Pronto para enviar.
                </span>
              ) : (
                <span>
                  Responda todas as questões para liberar o envio ({answeredCount}/{questions.length})
                </span>
              )}
            </div>

            <button
              id="submit-quiz-answers-btn"
              type="submit"
              disabled={!allAnswered || isSubmitting}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg cursor-pointer ${
                allAnswered && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {isSubmitting ? (
                <span>Avaliando Respostas...</span>
              ) : (
                <>
                  <span>Enviar Quiz para Correção</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
