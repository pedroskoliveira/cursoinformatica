export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'quiz' | 'attendance' | 'discipline' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  accentColor: string; // Tailwind color name like 'amber', 'emerald', 'blue', 'purple'
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'first_step',
    name: 'Primeiro Passo',
    description: 'Concluiu com sucesso o Dia 1 e a sua primeira avaliação.',
    icon: 'Footprints',
    category: 'attendance',
    rarity: 'common',
    accentColor: 'blue',
  },
  {
    id: 'perfect_score',
    name: 'Nota Máxima (10.0)',
    description: 'Alcançou a nota máxima (10.0) com 100% de acerto em um quiz diário.',
    icon: 'Sparkles',
    category: 'quiz',
    rarity: 'rare',
    accentColor: 'amber',
  },
  {
    id: 'iron_discipline',
    name: 'Disciplina de Ferro',
    description: 'Assistiu a uma aula completa sem nenhuma saída de tela ou tentativa de avanço.',
    icon: 'ShieldCheck',
    category: 'discipline',
    rarity: 'rare',
    accentColor: 'emerald',
  },
  {
    id: 'halfway_mark',
    name: 'Metade da Jornada',
    description: 'Superou a metade do curso (5 dias completos com aprovação).',
    icon: 'Zap',
    category: 'attendance',
    rarity: 'rare',
    accentColor: 'cyan',
  },
  {
    id: 'quiz_master',
    name: 'Mestre dos Quizzes',
    description: 'Aprovado de primeira tentativa em pelo menos 3 avaliações diferentes.',
    icon: 'Brain',
    category: 'quiz',
    rarity: 'epic',
    accentColor: 'purple',
  },
  {
    id: 'consistent_attendance',
    name: 'Frequência Exemplar',
    description: 'Assistiu e concluiu todas as 10 videoaulas obrigatórias dos 10 dias.',
    icon: 'CalendarCheck',
    category: 'attendance',
    rarity: 'epic',
    accentColor: 'orange',
  },
  {
    id: 'course_graduate',
    name: 'Graduado com Honras',
    description: 'Concluiu os 10 dias de capacitação com média final igual ou superior a 9.0!',
    icon: 'GraduationCap',
    category: 'mastery',
    rarity: 'legendary',
    accentColor: 'yellow',
  },
];

export function getBadgeById(badgeId: string): BadgeDefinition | undefined {
  return ALL_BADGES.find((b) => b.id === badgeId);
}
