import React, { useState } from 'react';
import { ShieldAlert, User, Calendar, Sun, Sunset, ArrowRight } from 'lucide-react';
import { Student } from '../types';

interface StudentIdentificationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onIdentify: (data: { name: string; birthDate: string; shift: 'Matutino' | 'Vespertino' }) => void;
  currentStudent: Student | null;
}

export const StudentIdentificationModal: React.FC<StudentIdentificationModalProps> = ({
  isOpen,
  onClose,
  onIdentify,
  currentStudent,
}) => {
  const [name, setName] = useState(currentStudent?.name || '');
  const [birthDate, setBirthDate] = useState(currentStudent?.birthDate || '');
  const [shift, setShift] = useState<'Matutino' | 'Vespertino'>(
    currentStudent?.shift || 'Matutino'
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!birthDate.trim()) {
      setError('Por favor, informe sua data de nascimento.');
      return;
    }
    setError('');
    onIdentify({
      name: name.trim(),
      birthDate: birthDate.trim(),
      shift,
    });
    if (onClose) onClose();
  };

  return (
    <div
      id="identification-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="identification-modal-card"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl text-slate-100 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/60 to-slate-900 p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Identificação do Aluno
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Informe seus dados para acessar o curso de 10 dias de informática
              </p>
            </div>
          </div>
        </div>

        {/* Strict Rules Callout */}
        <div className="mx-6 mt-5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200">
          <div className="flex items-start space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed">
              <span className="font-bold text-amber-300 block uppercase tracking-wider text-[11px]">
                Regras Obrigatórias do Curso
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li>
                  <strong className="text-amber-200">Vídeo obrigatório:</strong> Se você sair da tela ou mudar de aba,{' '}
                  <span className="text-red-300 font-semibold">a aula reinicia para o começo (00:00)</span>.
                </li>
                <li>
                  <strong className="text-amber-200">Sem avançar:</strong> É bloqueado adiantar ou pular qualquer trecho do vídeo.
                </li>
                <li>
                  <strong className="text-amber-200">Nota mínima 8.0:</strong> Se tirar nota menor que 8 no quiz,{' '}
                  <span className="text-red-300 font-semibold">o dia reinicia para o início</span>.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div
              id="identify-error-message"
              className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-xl"
            >
              {error}
            </div>
          )}

          {/* Nome Completo */}
          <div>
            <label
              htmlFor="student-name-input"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Nome Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="student-name-input"
                type="text"
                required
                placeholder="Ex: Pedro Henrique Oliveira"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div>
            <label
              htmlFor="student-birthdate-input"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Data de Nascimento *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="student-birthdate-input"
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Turno: Matutino ou Vespertino */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Turno de Estudo *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="shift-matutino-btn"
                onClick={() => setShift('Matutino')}
                className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2.5 transition-all cursor-pointer text-sm font-semibold ${
                  shift === 'Matutino'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <Sun className={`w-4 h-4 ${shift === 'Matutino' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>Matutino (Manhã)</span>
              </button>

              <button
                type="button"
                id="shift-vespertino-btn"
                onClick={() => setShift('Vespertino')}
                className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2.5 transition-all cursor-pointer text-sm font-semibold ${
                  shift === 'Vespertino'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <Sunset className={`w-4 h-4 ${shift === 'Vespertino' ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>Vespertino (Tarde)</span>
              </button>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            {currentStudent && onClose && (
              <button
                id="identify-cancel-btn"
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              id="identify-submit-btn"
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              <span>Entrar e Iniciar Aulas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
