import React from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
  Brain,
  CalendarCheck,
  GraduationCap,
  Footprints,
  Lock,
  Medal,
} from 'lucide-react';
import { BadgeDefinition } from '../data/badges';

interface BadgeIconProps {
  badge: BadgeDefinition;
  isUnlocked: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  badge,
  isUnlocked,
  size = 'md',
}) => {
  const getIcon = () => {
    const props = {
      className:
        size === 'sm'
          ? 'w-4 h-4'
          : size === 'md'
          ? 'w-6 h-6'
          : size === 'lg'
          ? 'w-9 h-9'
          : 'w-12 h-12',
    };

    switch (badge.icon) {
      case 'Footprints':
        return <Footprints {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Brain':
        return <Brain {...props} />;
      case 'CalendarCheck':
        return <CalendarCheck {...props} />;
      case 'GraduationCap':
        return <GraduationCap {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  const sizeContainerClasses =
    size === 'sm'
      ? 'w-8 h-8 rounded-lg'
      : size === 'md'
      ? 'w-12 h-12 rounded-xl'
      : size === 'lg'
      ? 'w-16 h-16 rounded-2xl'
      : 'w-24 h-24 rounded-3xl';

  if (!isUnlocked) {
    return (
      <div
        className={`${sizeContainerClasses} bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500 relative select-none`}
        title={`Bloqueado: ${badge.name} - ${badge.description}`}
      >
        <div className="opacity-40">{getIcon()}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 rounded-inherit">
          <Lock className={size === 'sm' ? 'w-3 h-3 text-slate-400' : 'w-4 h-4 text-slate-400'} />
        </div>
      </div>
    );
  }

  // Unlocked color themes based on badge.accentColor
  let colorStyles = 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20';
  if (badge.accentColor === 'emerald') {
    colorStyles = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20';
  } else if (badge.accentColor === 'blue') {
    colorStyles = 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/20';
  } else if (badge.accentColor === 'purple') {
    colorStyles = 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/20';
  } else if (badge.accentColor === 'cyan') {
    colorStyles = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/20';
  } else if (badge.accentColor === 'orange') {
    colorStyles = 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-orange-500/20';
  } else if (badge.accentColor === 'yellow') {
    colorStyles = 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-300 shadow-amber-500/30';
  }

  return (
    <div
      className={`${sizeContainerClasses} border flex items-center justify-center shadow-lg transition-transform hover:scale-105 select-none relative ${colorStyles}`}
      title={`${badge.name} - ${badge.description}`}
    >
      {getIcon()}
    </div>
  );
};
