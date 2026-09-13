import { Student } from '../types';
import { ALL_BADGES, getBadgeById, BadgeDefinition } from '../data/badges';

export interface EvaluationResult {
  updated: boolean;
  newBadgeIds: string[];
  newBadges: BadgeDefinition[];
}

export function evaluateStudentBadges(student: Student): EvaluationResult {
  if (!student.badges) {
    student.badges = [];
  }
  if (!student.badgeUnlocks) {
    student.badgeUnlocks = {};
  }

  const currentBadges = new Set(student.badges);
  const newlyUnlockedIds: string[] = [];

  const scores = student.dayScores || {};
  const attempts = student.dayAttempts || {};
  const infractions = student.infractions || [];

  const completedDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(
    (d) => scores[d] !== undefined && scores[d] >= 8.0
  );
  const completedCount = completedDays.length;

  // 1. 'first_step': Concluiu Dia 1 com aprovação (nota >= 8.0)
  if (!currentBadges.has('first_step') && scores[1] !== undefined && scores[1] >= 8.0) {
    newlyUnlockedIds.push('first_step');
  }

  // 2. 'perfect_score': Acertou 100% (nota 10.0) em qualquer quiz
  if (!currentBadges.has('perfect_score')) {
    const hasTen = Object.values(scores).some((sc) => sc >= 10.0);
    if (hasTen) {
      newlyUnlockedIds.push('perfect_score');
    }
  }

  // 3. 'iron_discipline': Concluiu pelo menos 1 dia com zero infrações registradas
  if (!currentBadges.has('iron_discipline') && completedCount >= 1 && infractions.length === 0) {
    newlyUnlockedIds.push('iron_discipline');
  }

  // 4. 'halfway_mark': Concluiu pelo menos 5 dias do curso
  if (!currentBadges.has('halfway_mark') && completedCount >= 5) {
    newlyUnlockedIds.push('halfway_mark');
  }

  // 5. 'quiz_master': Aprovado na 1ª tentativa em 3 ou mais dias
  if (!currentBadges.has('quiz_master')) {
    const passedFirstAttempt = completedDays.filter((d) => (attempts[d] || 1) === 1).length;
    if (passedFirstAttempt >= 3) {
      newlyUnlockedIds.push('quiz_master');
    }
  }

  // 6. 'consistent_attendance': Completou todas as 10 videoaulas/dias
  if (
    !currentBadges.has('consistent_attendance') &&
    (completedCount >= 10 || student.currentStage === 'course_finished')
  ) {
    newlyUnlockedIds.push('consistent_attendance');
  }

  // 7. 'course_graduate': Formado com média geral >= 9.0
  if (!currentBadges.has('course_graduate') && (completedCount >= 10 || student.currentStage === 'course_finished')) {
    const totalScore = completedDays.reduce((acc, d) => acc + (scores[d] || 0), 0);
    const avg = completedDays.length > 0 ? totalScore / completedDays.length : 0;
    if (avg >= 9.0) {
      newlyUnlockedIds.push('course_graduate');
    }
  }

  if (newlyUnlockedIds.length > 0) {
    const now = new Date().toISOString();
    newlyUnlockedIds.forEach((id) => {
      student.badges!.push(id);
      student.badgeUnlocks![id] = now;
    });

    const newBadges = newlyUnlockedIds
      .map((id) => getBadgeById(id))
      .filter((b): b is BadgeDefinition => Boolean(b));

    return {
      updated: true,
      newBadgeIds: newlyUnlockedIds,
      newBadges,
    };
  }

  return {
    updated: false,
    newBadgeIds: [],
    newBadges: [],
  };
}
