import React from 'react';
import { Award, CheckCircle2, Printer, X, Download, ShieldCheck, Sparkles } from 'lucide-react';
import { Student } from '../types';
import { getBadgeById } from '../data/badges';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen) return null;

  const scores: number[] = Object.values(student.dayScores || {});
  const avgScore =
    scores.length > 0
      ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)
      : '10.0';

  const issueDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedBirthDate = student.birthDate
    ? student.birthDate.split('-').length === 3
      ? `${student.birthDate.split('-')[2]}/${student.birthDate.split('-')[1]}/${student.birthDate.split('-')[0]}`
      : student.birthDate
    : '—';

  const certHash = `CERT-IB10-${student.id.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString(36).toUpperCase()}`;

  const unlockedBadges = (student.badges || [])
    .map((id) => getBadgeById(id))
    .filter(Boolean);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="certificate-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="certificate-modal-dialog"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-6"
      >
        {/* Modal Top Actions */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Certificado Oficial de Conclusão</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              id="print-certificate-btn"
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              id="close-certificate-btn"
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div
          id="printable-certificate-area"
          className="p-8 sm:p-12 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-center relative border-8 border-slate-800/80 m-4 rounded-2xl"
        >
          {/* Subtle Decorative Borders */}
          <div className="absolute inset-2 border-2 border-dashed border-amber-500/30 rounded-xl pointer-events-none" />

          {/* Badge Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 mb-6">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-2">
            Certificado de Conclusão
          </h2>

          <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-400 font-bold mb-6">
            Programa Intensivo de 10 Dias • Informática Básica
          </p>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
            Certificamos que o(a) aluno(a)
          </p>

          <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 mb-2">
            {student.name}
          </div>

          <p className="text-xs text-slate-400 mb-6 font-mono">
            Nascimento: <strong className="text-slate-200">{formattedBirthDate}</strong> • Turno: <strong className="text-slate-200">{student.shift}</strong>
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
            concluiu com êxito todas as 10 etapas obrigatórias do{' '}
            <strong className="text-white">Curso de Informática Básica</strong>, cumprindo 100% da carga horária de videoaulas sem avanço indevido e obtendo média final igual ou superior ao critério de corte de 8.0 pontos.
          </p>

          {/* Grade and Verification Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto bg-slate-900/90 p-4 rounded-xl border border-slate-800 mb-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Média de Aproveitamento</span>
              <strong className="text-lg font-black text-emerald-400">{avgScore} / 10</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Carga Horária</span>
              <strong className="text-lg font-black text-white">10 Aulas (10 Dias)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Data de Emissão</span>
              <strong className="text-xs font-bold text-slate-200">{issueDate}</strong>
            </div>
          </div>

          {/* Badges / Honors on Certificate */}
          {unlockedBadges.length > 0 && (
            <div className="max-w-xl mx-auto mb-8 p-3.5 bg-slate-900/60 rounded-xl border border-amber-500/30 text-left">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Honrarias e Conquistas Registradas ({unlockedBadges.length}):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {unlockedBadges.map((b) => (
                  <span
                    key={b!.id}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium"
                    title={b!.description}
                  >
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>{b!.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Signatures and Validation */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-left gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="block font-semibold text-slate-300">Autenticidade Verificada</span>
                <span className="font-mono text-[10px] text-slate-400">{certHash}</span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="font-bold text-white">Coordenação Pedagógica</div>
              <div className="text-[11px] text-slate-400">Sistema Integrado de Informática Básica</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
