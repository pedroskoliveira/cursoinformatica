import React from 'react';
import { ShieldCheck, UserCheck, GraduationCap, MonitorPlay, Sun, Sunset, SlidersHorizontal, Award, Lock, LogOut } from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  currentView: 'student' | 'instructor';
  onViewChange: (view: 'student' | 'instructor') => void;
  student: Student | null;
  onOpenIdentify: () => void;
  onOpenBadges?: () => void;
  onlineCount: number;
  isAdminAuthenticated?: boolean;
  adminName?: string;
  onAdminLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  student,
  onOpenIdentify,
  onOpenBadges,
  onlineCount,
  isAdminAuthenticated,
  adminName,
  onAdminLogout,
}) => {
  return (
    <header
      id="app-header"
      className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Course Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                Informática Básica
              </span>
              <span className="text-xs bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                10 Dias
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sistema Rigoroso • Nota Mínima 8.0
            </p>
          </div>
        </div>

        {/* Center Mode Switcher: Área do Aluno vs Painel do Admin */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            id="nav-student-view-btn"
            type="button"
            onClick={() => onViewChange('student')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentView === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Área do Aluno</span>
          </button>
          <button
            id="nav-instructor-view-btn"
            type="button"
            onClick={() => onViewChange('instructor')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentView === 'instructor'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Painel do Admin</span>
            {!isAdminAuthenticated ? (
              <span className="p-0.5 bg-amber-500/20 rounded text-amber-300 border border-amber-500/30" title="Acesso Restrito ao Administrador">
                <Lock className="w-3 h-3" />
              </span>
            ) : (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>
        </div>

        {/* Right Info: Admin Status, Student Profile Pill & Online Count */}
        <div className="flex items-center space-x-2.5">
          {isAdminAuthenticated && (
            <div className="flex items-center space-x-2">
              <span className="hidden lg:flex items-center space-x-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold truncate max-w-[150px]">{adminName || 'Admin Pedro'}</span>
              </span>
              {onAdminLogout && (
                <button
                  id="admin-logout-btn"
                  type="button"
                  onClick={onAdminLogout}
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-300 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                  title="Encerrar sessão do Administrador"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair Admin</span>
                </button>
              )}
            </div>
          )}
          {student && onOpenBadges && (
            <button
              id="header-badges-btn"
              type="button"
              onClick={onOpenBadges}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Ver suas conquistas e medalhas"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Conquistas</span>
              <span className="px-1.5 py-0.5 bg-amber-500/30 rounded-full text-[10px] text-amber-200 font-black">
                {(student.badges || []).length}
              </span>
            </button>
          )}

          {student ? (
            <div className="flex items-center space-x-2">
              <button
                id="header-student-profile-btn"
                type="button"
                onClick={onOpenIdentify}
                className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors text-left cursor-pointer"
                title="Clique para editar identificação"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[140px]">
                    {student.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight flex items-center space-x-1.5 mt-0.5">
                    <span className="inline-flex items-center text-amber-300">
                      {student.shift === 'Matutino' ? (
                        <Sun className="w-3 h-3 mr-0.5" />
                      ) : (
                        <Sunset className="w-3 h-3 mr-0.5" />
                      )}
                      {student.shift}
                    </span>
                    <span>•</span>
                    <span>Dia {student.currentDay}/10</span>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <button
              id="header-identify-prompt-btn"
              type="button"
              onClick={onOpenIdentify}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Identificar Aluno</span>
            </button>
          )}

          {/* Online count indicator */}
          <div
            id="header-online-indicator"
            className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60"
            title="Alunos ativos no sistema"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{onlineCount} online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
