import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Film,
  BookOpen,
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Award,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Radio,
  Sun,
  Sunset,
  Zap,
  Calendar,
  Eye,
  Upload,
  Settings,
  Lock,
  Unlock,
  Play,
  X,
} from 'lucide-react';
import { Student, DayLesson, AuditEvent, InstructorStats, Question } from '../types';
import { ALL_BADGES, getBadgeById } from '../data/badges';
import { BadgeIcon } from './BadgeIcon';

interface InstructorDashboardProps {
  stats: InstructorStats | null;
  students: Student[];
  events: AuditEvent[];
  lessons: DayLesson[];
  onUpdateLesson: (day: number, data: Partial<DayLesson>) => Promise<boolean>;
  onResetStudent: (studentId: string, targetDay?: number) => Promise<boolean>;
  onAdvanceStudent?: (studentId: string, score?: number) => Promise<boolean>;
  onDeleteStudent?: (studentId: string) => Promise<boolean>;
  onRefresh: () => void;
  adminUser?: string;
  onClearAllStudents?: () => Promise<boolean>;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  stats,
  students,
  events,
  lessons,
  onUpdateLesson,
  onResetStudent,
  onAdvanceStudent,
  onDeleteStudent,
  onRefresh,
  adminUser,
  onClearAllStudents,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'lessons' | 'events'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState<'all' | 'Matutino' | 'Vespertino'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Content Editor State
  const [editingDay, setEditingDay] = useState<number>(1);
  const [lessonForm, setLessonForm] = useState<Partial<DayLesson>>({});
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [previewVideoIdx, setPreviewVideoIdx] = useState<number>(0);
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');

  const handleVideoUrlChange = (slotIndex: number, newUrl: string) => {
    const urls = [...(lessonForm.videoUrls || [])];
    while (urls.length <= slotIndex) {
      urls.push('');
    }
    urls[slotIndex] = newUrl;
    const isYt = newUrl.includes('youtube.com') || newUrl.includes('youtu.be');
    setLessonForm({
      ...lessonForm,
      videoUrls: urls,
      videoUrl: urls[0] || '',
      videoType: isYt ? 'youtube' : 'mp4'
    });
  };

  const handleRemoveVideoSlot = (slotIndex: number) => {
    const urls = [...(lessonForm.videoUrls || [])];
    urls[slotIndex] = '';
    while (urls.length > 0 && !urls[urls.length - 1]) {
      urls.pop();
    }
    setLessonForm({
      ...lessonForm,
      videoUrls: urls,
      videoUrl: urls[0] || '',
    });
  };

  const handleUploadSlot = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingVideo(true);
    setUploadingSlot(slotIndex);
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('slotIndex', slotIndex.toString());
      const res = await fetch('/api/instructor/upload-video', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const urls = [...(lessonForm.videoUrls || [])];
        while (urls.length <= slotIndex) {
          urls.push('');
        }
        urls[slotIndex] = data.url;
        setLessonForm((prev) => ({
          ...prev,
          videoUrls: urls,
          videoUrl: urls[0] || data.url,
          videoType: 'mp4',
        }));
        setSaveSuccessMsg(`Vídeo ${slotIndex + 1} anexado com sucesso!`);
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao fazer upload do vídeo');
      }
    } catch {
      alert('Erro ao enviar o arquivo de vídeo');
    } finally {
      setIsUploadingVideo(false);
      setUploadingSlot(null);
      e.target.value = '';
    }
  };

  const handleUploadBatch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingVideo(true);
    setUploadingSlot(-1);
    try {
      const formData = new FormData();
      for (let i = 0; i < Math.min(5, files.length); i++) {
        formData.append('videos', files[i]);
      }
      const res = await fetch('/api/instructor/upload-videos-batch', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        const urls = [...(lessonForm.videoUrls || [])];
        data.urls.forEach((u: string, idx: number) => {
          urls[idx] = u;
        });
        setLessonForm((prev) => ({
          ...prev,
          videoUrls: urls,
          videoUrl: urls[0] || data.urls[0],
          videoType: 'mp4',
        }));
        setSaveSuccessMsg(`${data.urls.length} vídeo(s) anexados com sucesso para a playlist!`);
        setTimeout(() => setSaveSuccessMsg(''), 3500);
      } else {
        alert(data.error || 'Erro ao fazer upload em lote');
      }
    } catch {
      alert('Erro ao enviar os arquivos de vídeo');
    } finally {
      setIsUploadingVideo(false);
      setUploadingSlot(null);
      e.target.value = '';
    }
  };

  const handleToggleDayRelease = async () => {
    const targetDay = editingDay;
    const nextReleasedState = !(lessonForm.isReleased ?? (targetDay === 1));
    setLessonForm((prev) => ({ ...prev, isReleased: nextReleasedState }));

    try {
      const res = await fetch(`/api/course/day/${targetDay}/toggle-release`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg(
          nextReleasedState
            ? `Dia ${targetDay} LIBERADO com sucesso para a turma!`
            : `Dia ${targetDay} BLOQUEADO para os alunos.`
        );
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        onRefresh();
      }
    } catch (err) {
      console.error('Error toggling release:', err);
    }
  };

  // Sync lesson form when selected day changes
  useEffect(() => {
    const current = lessons.find((l) => l.day === editingDay) || lessons[0];
    if (current) {
      const vUrls = current.videoUrls && current.videoUrls.length > 0
        ? [...current.videoUrls]
        : (current.videoUrl ? [current.videoUrl] : []);
      setLessonForm({
        title: current.title,
        subtitle: current.subtitle,
        videoUrl: current.videoUrl,
        videoUrls: vUrls,
        durationSeconds: current.durationSeconds,
        videoType: current.videoType,
        isReleased: current.isReleased ?? (current.day === 1),
        summary: [...(current.summary || [])],
        questions: current.questions ? JSON.parse(JSON.stringify(current.questions)) : [],
      });
      setPreviewVideoIdx(0);
      setQuestionCategoryFilter('all');
    }
  }, [editingDay, lessons]);

  // Derived counts for Shift
  const matutinoCount = students.filter((s) => s.shift === 'Matutino').length;
  const vespertinoCount = students.filter((s) => s.shift === 'Vespertino').length;
  const onlineStudentsCount = students.filter((s) => s.isOnline).length;
  const completedStudentsCount = students.filter(
    (s) => s.currentStage === 'course_finished' || (s.dayScores?.[10] !== undefined && s.dayScores[10] >= 8)
  ).length;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.birthDate && s.birthDate.includes(searchTerm));
    const matchShift = selectedShift === 'all' || s.shift === selectedShift;
    return matchSearch && matchShift;
  });

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLesson(true);
    setSaveSuccessMsg('');
    try {
      const activeUrls = (lessonForm.videoUrls || []).map((u) => u.trim()).filter((u) => u.length > 0);
      const payload: Partial<DayLesson> = {
        ...lessonForm,
        videoUrls: activeUrls,
        videoUrl: activeUrls[0] || lessonForm.videoUrl || '',
        isReleased: lessonForm.isReleased ?? (editingDay === 1),
      };
      const ok = await onUpdateLesson(editingDay, payload);
      if (ok) {
        setSaveSuccessMsg(`Conteúdo e ${lessonForm.questions?.length || 0} exercícios do Dia ${editingDay} salvos com sucesso!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleQuestionChange = (qIdx: number, field: string, value: any) => {
    const qs = [...(lessonForm.questions || [])];
    if (qs[qIdx]) {
      qs[qIdx] = { ...qs[qIdx], [field]: value };
      setLessonForm({ ...lessonForm, questions: qs });
    }
  };

  const handleOptionChange = (qIdx: number, optIdx: number, text: string) => {
    const qs = [...(lessonForm.questions || [])];
    if (qs[qIdx]) {
      const opts = [...qs[qIdx].options];
      opts[optIdx] = text;
      qs[qIdx].options = opts;
      setLessonForm({ ...lessonForm, questions: qs });
    }
  };

  const handleAddQuestion = () => {
    const qs = [...(lessonForm.questions || [])];
    const newQ: Question = {
      id: `d${editingDay}_q_${Date.now()}`,
      question: 'Nova pergunta sobre informática básica...',
      options: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
      correctIndex: 0,
      explanation: 'Explicação pedagógica da resposta...',
    };
    qs.push(newQ);
    setLessonForm({ ...lessonForm, questions: qs });
  };

  const handleDeleteQuestion = (qIdx: number) => {
    const qs = [...(lessonForm.questions || [])];
    qs.splice(qIdx, 1);
    setLessonForm({ ...lessonForm, questions: qs });
  };

  const handleAddSummaryItem = () => {
    const currentSummary = [...(lessonForm.summary || [])];
    currentSummary.push('Novo ponto chave abordado na aula...');
    setLessonForm({ ...lessonForm, summary: currentSummary });
  };

  const handleSummaryChange = (idx: number, val: string) => {
    const currentSummary = [...(lessonForm.summary || [])];
    currentSummary[idx] = val;
    setLessonForm({ ...lessonForm, summary: currentSummary });
  };

  const handleDeleteSummaryItem = (idx: number) => {
    const currentSummary = [...(lessonForm.summary || [])];
    currentSummary.splice(idx, 1);
    setLessonForm({ ...lessonForm, summary: currentSummary });
  };

  const formatBirthDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div id="admin-dashboard-wrapper" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>Painel do Administrador</span>
            </h1>
            <span className="flex items-center space-x-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{adminUser || 'Pedro Simão'}</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Radio className="w-3.5 h-3.5" />
              <span>Tempo Real</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Controle total sobre o aproveitamento dos alunos (Matutino / Vespertino), postagem de videoaulas e questões dos 10 dias.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onClearAllStudents && students.length > 0 && (
            <button
              id="admin-clear-all-students-btn"
              type="button"
              onClick={async () => {
                if (
                  window.confirm(
                    'Deseja limpar todos os alunos cadastrados e eventos? Use isso se desejar iniciar uma turma 100% nova sem dados anteriores.'
                  )
                ) {
                  await onClearAllStudents();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-red-600/15 hover:bg-red-600/30 text-red-300 text-xs font-semibold rounded-xl border border-red-500/30 transition-colors cursor-pointer"
              title="Zerar todos os alunos cadastrados"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Limpar Alunos</span>
            </button>
          )}

          <button
            id="admin-refresh-data-btn"
            type="button"
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title="Atualizar dados do servidor"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total de Alunos</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{students.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Cadastrados no curso</div>
        </div>

        {/* Online Now */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Online Agora</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{onlineStudentsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Ativos no momento</div>
        </div>

        {/* Turno Matutino */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Turno Matutino</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">{matutinoCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Período da manhã</div>
        </div>

        {/* Turno Vespertino */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Turno Vespertino</span>
            <Sunset className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-300 mt-1">{vespertinoCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Período da tarde</div>
        </div>

        {/* Concluídos / Formados */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Concluídos (10/10)</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-yellow-400 mt-1">{completedStudentsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Aprovados com nota ≥ 8.0</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-4 border-b border-slate-800">
        <button
          id="admin-tab-roster"
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-1 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'roster'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Controle de Alunos ({students.length})</span>
        </button>

        <button
          id="admin-tab-lessons"
          type="button"
          onClick={() => setActiveTab('lessons')}
          className={`pb-3 px-1 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'lessons'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Gerenciar Vídeos & Exercícios (10 Dias)</span>
        </button>

        <button
          id="admin-tab-events"
          type="button"
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-1 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'events'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Auditoria & Violações ao Vivo ({events.length})</span>
        </button>
      </div>

      {/* ======================= TAB 1: ROSTER (CONTROLE DE ALUNOS) ======================= */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Filters Bar: Search & Turno Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="admin-search-students-input"
                type="text"
                placeholder="Buscar por nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Turno Filter Chips */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 whitespace-nowrap mr-1">Filtrar Turno:</span>
              <button
                type="button"
                id="filter-all-shifts-btn"
                onClick={() => setSelectedShift('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedShift === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Todos ({students.length})
              </button>

              <button
                type="button"
                id="filter-matutino-btn"
                onClick={() => setSelectedShift('Matutino')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                  selectedShift === 'Matutino'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Matutino ({matutinoCount})</span>
              </button>

              <button
                type="button"
                id="filter-vespertino-btn"
                onClick={() => setSelectedShift('Vespertino')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                  selectedShift === 'Vespertino'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5 text-blue-400" />
                <span>Vespertino ({vespertinoCount})</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Aluno</th>
                    <th className="px-4 py-4">Data Nasc.</th>
                    <th className="px-4 py-4">Turno</th>
                    <th className="px-4 py-4">Dia Atual</th>
                    <th className="px-5 py-4">Fase do Conteúdo</th>
                    <th className="px-5 py-4">Aproveitamento (Notas)</th>
                    <th className="px-4 py-4">Conquistas</th>
                    <th className="px-4 py-4">Violações</th>
                    <th className="px-5 py-4 text-right">Controles do Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                        {students.length === 0 ? (
                          <div className="max-w-md mx-auto space-y-2.5">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2">
                              <Users className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-bold text-white">
                              Base de Alunos Limpa e Pronta
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Não há alunos cadastrados ou dados fictícios. Assim que novos alunos acessarem o sistema e realizarem a identificação, seus dados aparecerão aqui em tempo real!
                            </p>
                          </div>
                        ) : (
                          <span>Nenhum aluno encontrado para os filtros selecionados.</span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const completedDays = Object.keys(s.dayScores || {}).length;
                      const scoresArr: number[] = Object.values(s.dayScores || {});
                      const avg =
                        scoresArr.length > 0
                          ? (scoresArr.reduce((a: number, b: number) => a + b, 0) / scoresArr.length).toFixed(1)
                          : '—';

                      return (
                        <tr
                          key={s.id}
                          id={`student-row-${s.id}`}
                          className="hover:bg-slate-800/50 transition-colors"
                        >
                          {/* Student Name and Status */}
                          <td className="px-5 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                  {s.name.charAt(0).toUpperCase()}
                                </div>
                                <span
                                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                                    s.isOnline ? 'bg-emerald-500' : 'bg-slate-600'
                                  }`}
                                  title={s.isOnline ? 'Online agora' : 'Offline'}
                                />
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center space-x-2">
                                  <span>{s.name}</span>
                                  {s.currentStage === 'course_finished' && (
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                                      Concluiu 🎓
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {s.isOnline ? (
                                    <span className="text-emerald-400">● Online agora</span>
                                  ) : (
                                    <span>Visto em {new Date(s.lastActive).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Data de Nascimento */}
                          <td className="px-4 py-4 whitespace-nowrap text-slate-300">
                            <div className="flex items-center space-x-1.5 font-mono text-xs">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>{formatBirthDate(s.birthDate)}</span>
                            </div>
                          </td>

                          {/* Turno */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                s.shift === 'Matutino'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                              }`}
                            >
                              {s.shift === 'Matutino' ? (
                                <Sun className="w-3.5 h-3.5 text-amber-400" />
                              ) : (
                                <Sunset className="w-3.5 h-3.5 text-blue-400" />
                              )}
                              <span>{s.shift}</span>
                            </span>
                          </td>

                          {/* Dia Atual */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-blue-400">Dia {s.currentDay} / 10</span>
                            </div>
                            <div className="w-20 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${(s.currentDay / 10) * 100}%` }}
                              />
                            </div>
                          </td>

                          {/* Fase do Conteúdo */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            {s.currentStage === 'video' && (
                              <span className="inline-flex items-center space-x-1 text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                                <Clock className="w-3 h-3" />
                                <span>Vídeo ({s.videoCurrentTime}s / {s.videoDuration}s)</span>
                              </span>
                            )}
                            {s.currentStage === 'quiz' && (
                              <span className="inline-flex items-center space-x-1 text-xs text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                                <BookOpen className="w-3 h-3" />
                                <span>No Quiz Avaliativo</span>
                              </span>
                            )}
                            {s.currentStage === 'course_finished' && (
                              <span className="inline-flex items-center space-x-1 text-xs text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                <Award className="w-3 h-3" />
                                <span>Formado</span>
                              </span>
                            )}
                          </td>

                          {/* Notas */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>Média:</span>
                              <span
                                className={
                                  avg !== '—' && Number(avg) >= 8
                                    ? 'text-emerald-400'
                                    : 'text-amber-400'
                                }
                              >
                                {avg}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => {
                                const sc = s.dayScores?.[d];
                                return (
                                  <span
                                    key={d}
                                    className={`w-3.5 h-3.5 rounded text-[9px] flex items-center justify-center font-bold ${
                                      sc !== undefined
                                        ? sc >= 8
                                          ? 'bg-emerald-500 text-slate-950'
                                          : 'bg-red-500 text-white'
                                        : 'bg-slate-800 text-slate-500'
                                    }`}
                                    title={`Dia ${d}: ${sc !== undefined ? sc + '/10' : 'Não feito'}`}
                                  >
                                    {sc !== undefined ? (sc >= 8 ? '✓' : '✗') : d}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          {/* Conquistas / Badges */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(s)}
                              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
                              title="Clique para inspecionar as conquistas deste aluno"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              <span>{(s.badges || []).length} / {ALL_BADGES.length}</span>
                            </button>
                          </td>

                          {/* Violações */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            {s.infractions && s.infractions.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => setSelectedStudent(s)}
                                className="inline-flex items-center space-x-1 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-full border border-red-500/20 cursor-pointer"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>{s.infractions.length} reinícios</span>
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-400 flex items-center space-x-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>0</span>
                              </span>
                            )}
                          </td>

                          {/* Controles do Admin */}
                          <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                            {/* Aprovar Dia */}
                            {onAdvanceStudent && (
                              <button
                                type="button"
                                id={`advance-student-${s.id}-btn`}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Aprovar manualmente o Dia ${s.currentDay} para ${s.name}?`
                                    )
                                  ) {
                                    onAdvanceStudent(s.id, 10.0);
                                  }
                                }}
                                className="px-2.5 py-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-600/20 hover:bg-emerald-600/40 rounded-lg border border-emerald-500/30 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                                title="Aprovar dia manualmente com nota 10"
                              >
                                <Zap className="w-3 h-3 text-emerald-400" />
                                <span className="hidden lg:inline">Aprovar</span>
                              </button>
                            )}

                            {/* Zerar */}
                            <button
                              id={`reset-student-${s.id}-btn`}
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Deseja zerar o progresso do aluno ${s.name} e recomeçá-lo do Dia 1?`
                                  )
                                ) {
                                  onResetStudent(s.id, 1);
                                }
                              }}
                              className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                              title="Reiniciar aluno para o Dia 1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span className="hidden lg:inline">Zerar</span>
                            </button>

                            {/* Excluir Aluno */}
                            {onDeleteStudent && (
                              <button
                                type="button"
                                id={`delete-student-${s.id}-btn`}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Tem certeza de que deseja excluir o cadastro do aluno ${s.name}?`
                                    )
                                  ) {
                                    onDeleteStudent(s.id);
                                  }
                                }}
                                className="px-2.5 py-1.5 text-xs text-red-300 hover:text-white bg-red-600/20 hover:bg-red-600/40 rounded-lg border border-red-500/30 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                                title="Excluir cadastro do aluno"
                              >
                                <Trash2 className="w-3 h-3 text-red-400" />
                              </button>
                            )}

                            {/* Detalhes */}
                            <button
                              type="button"
                              id={`view-details-${s.id}-btn`}
                              onClick={() => setSelectedStudent(s)}
                              className="px-2.5 py-1.5 text-xs text-blue-300 hover:text-white bg-blue-600/20 hover:bg-blue-600/40 rounded-lg border border-blue-500/30 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span className="hidden lg:inline">Ver</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: LESSONS & EXERCISES EDITOR ======================= */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Instructor Video Posting Notice - Matches Screenshot 1 */}
          <div className="bg-[#0b1329] border border-[#18243e] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Postagem de Vídeos pelo Administrador
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Selecione o Dia abaixo, cole o link do seu vídeo do YouTube ou MP4 e clique em <strong>Salvar Alterações</strong>. O vídeo entrará no ar imediatamente para os alunos da turma.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 shrink-0 bg-[#0d172e] px-3 py-1.5 rounded-xl border border-[#1e2d4d]">
              <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Vídeo Postado</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400/80"></span>
                <span>Aguardando Vídeo</span>
              </span>
            </div>
          </div>

          {/* Day Selector Pills with Video & Release Status */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {lessons.map((l) => {
              const isRel = l.isReleased !== false;
              const vCount = (l.videoUrls && l.videoUrls.length > 0) ? l.videoUrls.length : (l.videoUrl && l.videoUrl.trim() ? 1 : 0);
              const isSelected = editingDay === l.day;

              return (
                <button
                  key={l.day}
                  id={`select-edit-day-${l.day}-btn`}
                  type="button"
                  onClick={() => setEditingDay(l.day)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2.5 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25 ring-2 ring-amber-500'
                      : 'bg-[#0b1329] border border-[#18243e] text-slate-400 hover:text-white hover:border-[#27385c]'
                  }`}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-extrabold text-xs">Dia {l.day}</span>
                    <span className={`text-[10px] font-medium flex items-center space-x-1 ${
                      isRel ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {isRel ? <Unlock className="w-2.5 h-2.5 inline" /> : <Lock className="w-2.5 h-2.5 inline" />}
                      <span>{isRel ? 'Liberado' : 'Bloqueado'}</span>
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    vCount > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-[#0d172e] text-slate-500 border-[#1e2d4d]'
                  }`}>
                    {vCount > 0 ? `${vCount} vídeo${vCount > 1 ? 's' : ''}` : '0 vídeos'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSaveLesson} className="space-y-6">
            {/* Top Bar with Save Button and Day Release Toggle - Matches Screenshot 1 */}
            <div className="bg-[#0b1329] border border-[#18243e] p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-500 block">
                  CONFIGURAÇÃO DE CONTEÚDO
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                  Editando o Dia {editingDay} de 10
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Publique a videoaula e configure as perguntas do quiz avaliativo.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {saveSuccessMsg && (
                  <span className="text-xs font-semibold text-emerald-400 animate-fade-in flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saveSuccessMsg}</span>
                  </span>
                )}

                <button
                  id="save-lesson-changes-btn"
                  type="submit"
                  disabled={isSavingLesson}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-[#ea580c] hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-orange-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingLesson ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>

                <button
                  type="button"
                  id="admin-toggle-release-btn"
                  onClick={handleToggleDayRelease}
                  className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    (lessonForm.isReleased ?? (editingDay === 1))
                      ? 'bg-[#059669] hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                  title="Controlar liberação deste dia para os alunos"
                >
                  {(lessonForm.isReleased ?? (editingDay === 1)) ? 'Liberar Dia' : 'Liberar Dia'}
                </button>
              </div>
            </div>

            {/* Video Configuration Card - Matches Screenshot 1 Exactly */}
            <div className="bg-[#0b1329] border border-[#18243e] p-6 rounded-2xl space-y-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>VIDEOAULA DO DIA {editingDay}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    TÍTULO DA AULA
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title || ''}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0d172e] border border-[#1e2d4d] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    SUBTÍTULO / OBJETIVO
                  </label>
                  <input
                    type="text"
                    value={lessonForm.subtitle || ''}
                    onChange={(e) => setLessonForm({ ...lessonForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0d172e] border border-[#1e2d4d] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  URL DO VÍDEO (YOUTUBE OU ARQUIVO MP4 DIRETO)
                </label>
                <input
                  type="text"
                  value={lessonForm.videoUrl || (lessonForm.videoUrls && lessonForm.videoUrls[0]) || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const urls = [...(lessonForm.videoUrls || [])];
                    while (urls.length < 1) urls.push('');
                    urls[0] = val;
                    const isYt = val.includes('youtube.com') || val.includes('youtu.be');
                    setLessonForm({ ...lessonForm, videoUrl: val, videoUrls: urls, videoType: isYt ? 'youtube' : 'mp4' });
                  }}
                  placeholder="/videos/aula1.mp4 ou https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 bg-[#0d172e] border border-[#1e2d4d] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    PLAYLIST DO DIA — ATÉ 5 VÍDEOS
                  </label>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {(lessonForm.videoUrls || []).filter((u) => u && u.trim().length > 0).length} de 5 vídeos ativos
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  As posições vazias ficam prontas para você colar uma URL ou publicar o arquivo quando o tiver.
                </p>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map((slotIdx) => {
                    const currentUrl = (lessonForm.videoUrls && lessonForm.videoUrls[slotIdx]) || '';
                    return (
                      <div key={slotIdx} className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-slate-400 bg-[#101b33] border border-[#1e2d4d] w-7 h-8 rounded-lg flex items-center justify-center shrink-0">
                          {slotIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={currentUrl}
                          onChange={(e) => handleVideoUrlChange(slotIdx, e.target.value)}
                          placeholder={`/videos/... ou link do vídeo ${slotIdx + 1}`}
                          className="flex-1 px-3.5 py-2 bg-[#0d172e] border border-[#1e2d4d] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                        <label
                          title={`Anexar arquivo MP4 direto para o Vídeo ${slotIdx + 1}`}
                          className="px-3 py-2 bg-[#18243e] hover:bg-[#223358] border border-[#273a62] rounded-lg text-slate-300 hover:text-white text-xs cursor-pointer flex items-center space-x-1 shrink-0 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden sm:inline text-[11px] font-medium">Anexar</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            onChange={(e) => handleUploadSlot(e, slotIdx)}
                            className="hidden"
                          />
                        </label>
                        {currentUrl ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveVideoSlot(slotIdx)}
                            title="Remover vídeo deste slot"
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-[#1e2d4d] transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  OU ANEXAR VÍDEO (MP4)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleUploadBatch}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#18243e] file:text-slate-200 hover:file:bg-[#203052] file:cursor-pointer"
                  />
                  {isUploadingVideo && (
                    <span className="text-xs text-amber-400 animate-pulse font-medium flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>
                        {uploadingSlot !== null && uploadingSlot >= 0
                          ? `Enviando vídeo para o Slot ${uploadingSlot + 1}...`
                          : 'Enviando vídeos para o servidor...'}
                      </span>
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Você pode selecionar múltiplos arquivos MP4 para preencher automaticamente os 5 slots da playlist.
                </p>
              </div>

              {/* Video Preview Box */}
              {(() => {
                const activeUrls = (lessonForm.videoUrls || []).filter((u) => u && u.trim().length > 0);
                const currentPreviewUrl = activeUrls[previewVideoIdx] || activeUrls[0] || lessonForm.videoUrl || '';

                if (currentPreviewUrl && currentPreviewUrl.trim()) {
                  const isYt = currentPreviewUrl.includes('youtube.com') || currentPreviewUrl.includes('youtu.be');

                  return (
                    <div className="pt-2 space-y-3 border-t border-[#18243e]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-semibold flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Vídeo ativo para o Dia {editingDay} (Pré-visualização):</span>
                        </span>
                        <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                          Ativo na turma
                        </span>
                      </div>

                      {activeUrls.length > 1 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400 font-medium">Selecionar prévia:</span>
                          {activeUrls.map((_, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => setPreviewVideoIdx(pIdx)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                (previewVideoIdx === pIdx || (previewVideoIdx >= activeUrls.length && pIdx === 0))
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-[#0d172e] border border-[#1e2d4d] text-slate-400 hover:text-white'
                              }`}
                            >
                              Vídeo {pIdx + 1}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="aspect-video w-full max-w-lg bg-black rounded-xl overflow-hidden border border-[#1e2d4d] flex items-center justify-center shadow-lg">
                        {isYt ? (
                          <iframe
                            src={
                              currentPreviewUrl.includes('embed')
                                ? currentPreviewUrl
                                : currentPreviewUrl.replace('watch?v=', 'embed/').split('&')[0]
                            }
                            title="Pré-visualização da Aula"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <video src={currentPreviewUrl} controls className="w-full h-full" />
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })()}
            </div>

            {/* Summary Points Card */}
            <div className="bg-[#0b1329] border border-[#18243e] p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>Resumo Pedagógico da Aula</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddSummaryItem}
                  className="px-3 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Ponto</span>
                </button>
              </div>

              <div className="space-y-2">
                {(lessonForm.summary || []).map((item, sIdx) => (
                  <div key={sIdx} className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#0d172e] border border-[#1e2d4d] text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {sIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleSummaryChange(sIdx, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0d172e] border border-[#1e2d4d] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSummaryItem(sIdx)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Questions Editor - Matches Screenshot 2 Exactly */}
            <div className="bg-[#0b1329] border border-[#18243e] p-6 rounded-2xl space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Exercícios & Quiz Avaliativo ({lessonForm.questions?.length || 0} Questões)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Nota de corte obrigatória: 8.0 / 10. Alunos com menos de 8 voltam pro início do dia.
                  </p>
                </div>
                <button
                  type="button"
                  id="admin-add-question-btn"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Questão</span>
                </button>
              </div>

              {/* Group / Video Tabs for 50 Questions */}
              {(lessonForm.questions?.length || 0) > 10 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
                  <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Filtrar Bloco:</span>
                  <button
                    type="button"
                    onClick={() => setQuestionCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      questionCategoryFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#0d172e] border border-[#1e2d4d] text-slate-400 hover:text-white'
                    }`}
                  >
                    Todas ({lessonForm.questions?.length || 0})
                  </button>
                  {[1, 2, 3, 4, 5].map((vNum) => {
                    const start = (vNum - 1) * 10 + 1;
                    const end = Math.min(vNum * 10, lessonForm.questions?.length || 0);
                    if (start > (lessonForm.questions?.length || 0)) return null;

                    return (
                      <button
                        key={vNum}
                        type="button"
                        onClick={() => setQuestionCategoryFilter(String(vNum) as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          questionCategoryFilter === String(vNum)
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-[#0d172e] border border-[#1e2d4d] text-slate-400 hover:text-white'
                        }`}
                      >
                        Vídeo {vNum} (Q{start}-{end})
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="space-y-6">
                {(lessonForm.questions || [])
                  .map((q, originalIdx) => ({ q, originalIdx }))
                  .filter(({ originalIdx }) => {
                    if (questionCategoryFilter === 'all') return true;
                    const vNum = parseInt(questionCategoryFilter, 10);
                    const startIdx = (vNum - 1) * 10;
                    const endIdx = vNum * 10;
                    return originalIdx >= startIdx && originalIdx < endIdx;
                  })
                  .map(({ q, originalIdx }) => (
                    <div
                      key={q.id || originalIdx}
                      id={`admin-question-card-${originalIdx}`}
                      className="p-5 sm:p-6 bg-[#0b1329] border border-[#18243e] rounded-xl space-y-4 shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#1e3a8a] text-white text-xs font-bold px-2 py-0.5 rounded">
                            {originalIdx + 1}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            QUESTÃO {originalIdx + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(originalIdx)}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1.5 cursor-pointer font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>Remover</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          ENUNCIADO DA PERGUNTA
                        </label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleQuestionChange(originalIdx, 'question', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0d172e] border border-[#1e2d4d] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>

                      {/* Options A, B, C, D */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          ALTERNATIVAS (SELECIONE A CORRETA)
                        </label>
                        {q.options.map((opt, optIdx) => {
                          const isSelected = q.correctIndex === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center space-x-2.5 px-3 py-2 bg-[#0d172e] rounded-lg transition-all border ${
                                isSelected
                                  ? 'border-[#10b981] ring-1 ring-[#10b981]/50'
                                  : 'border-[#1e2d4d] hover:border-[#27385c]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`correct_idx_${q.id || originalIdx}`}
                                checked={isSelected}
                                onChange={() => handleQuestionChange(originalIdx, 'correctIndex', optIdx)}
                                className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500 cursor-pointer shrink-0"
                                title="Marcar como resposta correta"
                              />
                              <span className="text-xs font-bold text-slate-200 shrink-0">
                                {String.fromCharCode(65 + optIdx)})
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(originalIdx, optIdx, e.target.value)}
                                className="flex-1 bg-transparent border-0 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          EXPLICAÇÃO / JUSTIFICATIVA PEDAGÓGICA
                        </label>
                        <input
                          type="text"
                          value={q.explanation}
                          onChange={(e) => handleQuestionChange(originalIdx, 'explanation', e.target.value)}
                          placeholder="A aula apresenta orientações sobre..."
                          className="w-full px-3.5 py-2.5 bg-[#0d172e] border border-[#1e2d4d] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ======================= TAB 3: LIVE AUDIT EVENTS ======================= */}
      {activeTab === 'events' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Feed de Eventos e Auditoria em Tempo Real</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoramento instantâneo de logins, saídas de tela, tentativas de adiantar e resultados de quizzes.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Últimos {events.length} registros</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {events.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhum evento registrado até o momento.
              </div>
            ) : (
              events.map((ev) => {
                let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
                if (ev.severity === 'danger') {
                  badgeClass = 'bg-red-500/10 text-red-300 border-red-500/30';
                } else if (ev.severity === 'warning') {
                  badgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                } else if (ev.severity === 'success') {
                  badgeClass = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
                } else if (ev.severity === 'info') {
                  badgeClass = 'bg-blue-500/10 text-blue-300 border-blue-500/30';
                }

                return (
                  <div
                    key={ev.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs transition-all ${badgeClass}`}
                  >
                    <div className="flex items-start sm:items-center space-x-3">
                      <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-[11px] whitespace-nowrap">
                        {ev.type}
                      </span>
                      <span className="leading-snug">{ev.message}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 whitespace-nowrap font-mono">
                      {new Date(ev.timestamp).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Student Details Inspect Modal */}
      {selectedStudent && (
        <div
          id="student-details-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            id="student-details-modal-card"
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-5 my-6 text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedStudent.name}</h3>
                <span className="text-xs text-slate-400">
                  Cadastrado em {new Date(selectedStudent.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Data de Nascimento:</span>
                <strong className="text-white font-mono">{formatBirthDate(selectedStudent.birthDate)}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Turno:</span>
                <strong className="text-white">{selectedStudent.shift}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Dia Atual de Estudo:</span>
                <strong className="text-blue-400 font-bold">Dia {selectedStudent.currentDay} / 10</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Presença:</span>
                <strong className={selectedStudent.isOnline ? 'text-emerald-400' : 'text-slate-400'}>
                  {selectedStudent.isOnline ? '● Online agora' : 'Offline'}
                </strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Histórico de Notas (Mínimo exigido: 8.0)
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => {
                  const score = selectedStudent.dayScores?.[day];
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-lg text-center border ${
                        score !== undefined
                          ? score >= 8
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-red-500/10 border-red-500/30 text-red-300'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold">Dia {day}</div>
                      <div className="text-xs font-black">
                        {score !== undefined ? score.toFixed(1) : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges / Conquistas do Aluno */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>
                    Conquistas & Badges ({(selectedStudent.badges || []).length} de {ALL_BADGES.length})
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {ALL_BADGES.map((b) => {
                  const isUnlocked = (selectedStudent.badges || []).includes(b.id);
                  const unlockedDate = selectedStudent.badgeUnlocks?.[b.id];
                  return (
                    <div
                      key={b.id}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2.5 text-xs ${
                        isUnlocked
                          ? 'bg-slate-950 border-amber-500/30 text-slate-200'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <BadgeIcon badge={b} isUnlocked={isUnlocked} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-[11px] text-white">
                          {b.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {isUnlocked
                            ? `Desbloqueada ${
                                unlockedDate
                                  ? new Date(unlockedDate).toLocaleDateString('pt-BR')
                                  : ''
                              }`
                            : 'Bloqueada'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedStudent.infractions && selectedStudent.infractions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                  Registro de Violações & Reinícios ({selectedStudent.infractions.length})
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedStudent.infractions.map((inf) => (
                    <div
                      key={inf.id}
                      className="p-2.5 bg-red-950/40 border border-red-900/50 rounded-xl text-[11px] text-red-300"
                    >
                      <div className="font-semibold">{inf.detail}</div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(inf.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
