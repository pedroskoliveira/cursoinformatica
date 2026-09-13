import React from 'react';
import { Award, Sparkles, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { BadgeDefinition } from '../data/badges';
import { BadgeIcon } from './BadgeIcon';

interface BadgeUnlockCelebrationProps {
  badges: BadgeDefinition[];
  onClose: () => void;
  onOpenAllBadges?: () => void;
}

export const BadgeUnlockCelebration: React.FC<BadgeUnlockCelebrationProps> = ({
  badges,
  onClose,
  onOpenAllBadges,
}) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div
      id="badge-celebration-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        id="badge-celebration-dialog"
        className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden space-y-6"
      >
        {/* Glow and Decorative Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          id="close-celebration-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Title */}
        <div className="space-y-2 relative">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nova Conquista Desbloqueada!</span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">
            Parabéns pelo Mérito!
          </h3>
          <p className="text-xs text-slate-300">
            Você atingiu um marco pedagógico importante na sua capacitação.
          </p>
        </div>

        {/* Badges List */}
        <div className="space-y-4 relative">
          {badges.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-slate-950/80 border border-amber-500/30 rounded-2xl flex items-center space-x-4 text-left shadow-lg"
            >
              <div className="shrink-0">
                <BadgeIcon badge={b} isUnlocked={true} size="lg" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Badge Desbloqueado
                </span>
                <h4 className="text-base font-black text-white leading-snug">
                  {b.name}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative">
          {onOpenAllBadges && (
            <button
              type="button"
              id="view-all-badges-from-celebration-btn"
              onClick={() => {
                onClose();
                onOpenAllBadges();
              }}
              className="w-full sm:w-1/2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center space-x-1"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Ver Conquistas</span>
            </button>
          )}

          <button
            type="button"
            id="continue-after-badge-btn"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1"
          >
            <span>Continuar Curso</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
