import React, { useState } from 'react';
import {
  Award,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { ALL_BADGES, BadgeDefinition } from '../data/badges';
import { Student } from '../types';
import { BadgeIcon } from './BadgeIcon';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!isOpen) return null;

  const unlockedBadgeIds = new Set(student.badges || []);
  const unlockedCount = unlockedBadgeIds.size;
  const totalCount = ALL_BADGES.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = ALL_BADGES.filter((b) => {
    const isUnlocked = unlockedBadgeIds.has(b.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div
      id="badges-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="badges-modal-dialog"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>Conquistas & Badges Oficiais</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">
                  {unlockedCount} de {totalCount}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Alcançadas por mérito acadêmico, assiduidade e foco nos estudos.
              </p>
            </div>
          </div>

          <button
            id="close-badges-modal-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Banner */}
        <div className="p-6 bg-slate-900/90 border-b border-slate-800 shrink-0 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>
              Aluno: <strong className="text-white">{student.name}</strong> • Turno:{' '}
              <strong className="text-amber-400">{student.shift}</strong>
            </span>
            <span className="font-bold text-amber-400">{progressPercent}% Concluído</span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todas ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                filter === 'unlocked'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Desbloqueadas ({unlockedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('locked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                filter === 'locked'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bloqueadas ({totalCount - unlockedCount})</span>
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBadges.map((badge) => {
              const isUnlocked = unlockedBadgeIds.has(badge.id);
              const unlockedDate = student.badgeUnlocks?.[badge.id];

              let rarityBadge = (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Comum
                </span>
              );
              if (badge.rarity === 'rare') {
                rarityBadge = (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Rara
                  </span>
                );
              } else if (badge.rarity === 'epic') {
                rarityBadge = (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Épica
                  </span>
                );
              } else if (badge.rarity === 'legendary') {
                rarityBadge = (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Lendária
                  </span>
                );
              }

              return (
                <div
                  key={badge.id}
                  id={`badge-card-${badge.id}`}
                  className={`p-4 rounded-2xl border transition-all flex items-start space-x-4 ${
                    isUnlocked
                      ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    <BadgeIcon badge={badge} isUnlocked={isUnlocked} size="lg" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {badge.name}
                      </h4>
                      {rarityBadge}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {badge.description}
                    </p>

                    <div className="pt-2 text-[11px] flex items-center space-x-2">
                      {isUnlocked ? (
                        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            Conquistada em{' '}
                            {unlockedDate
                              ? new Date(unlockedDate).toLocaleDateString('pt-BR')
                              : 'durante o curso'}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bloqueada • Cumpra os requisitos para desbloquear</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>As conquistas desbloqueadas são registradas no seu histórico e certificado!</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
