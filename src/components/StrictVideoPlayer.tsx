import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldAlert,
  Play,
  Lock,
  Eye,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { DayLesson } from '../types';
import { parseAndFormatVideoUrl } from '../utils/videoUtils';

interface StrictVideoPlayerProps {
  lesson: DayLesson;
  onVideoComplete: () => void;
  onViolation: (type: 'LEFT_VIDEO' | 'SEEK_ATTEMPT' | 'PAUSE_ATTEMPT', detail: string) => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  isUnlockedForQuiz: boolean;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export const StrictVideoPlayer: React.FC<StrictVideoPlayerProps> = ({
  lesson,
  onVideoComplete,
  onViolation,
  onTimeUpdate,
  isUnlockedForQuiz,
}) => {
  // Support playlist of up to 5 videos per day
  const playlist =
    lesson.videoUrls && lesson.videoUrls.filter((u) => u && u.trim().length > 0).length > 0
      ? lesson.videoUrls.filter((u) => u && u.trim().length > 0)
      : lesson.videoUrl && lesson.videoUrl.trim()
      ? [lesson.videoUrl]
      : [];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const activeVideoUrl = playlist[currentVideoIndex] || playlist[0] || lesson.videoUrl;
  const videoInfo = parseAndFormatVideoUrl(activeVideoUrl);
  const isVideoAvailable = videoInfo.type !== 'empty';

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(() => lesson.durationSeconds || 120);
  const [hasCompleted, setHasCompleted] = useState(isUnlockedForQuiz);
  const [violationModal, setViolationModal] = useState<{
    show: boolean;
    title: string;
    message: string;
  } | null>(null);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [playerMode, setPlayerMode] = useState<'video' | 'interactive'>(() =>
    isVideoAvailable ? 'video' : 'interactive'
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const maxAllowedTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const hasCompletedRef = useRef<boolean>(hasCompleted);
  const durationRef = useRef<number>(duration);
  const startedAtRef = useRef<number>(0);
  const lastKnownTimeRef = useRef<number>(0);

  isPlayingRef.current = isPlaying;
  hasCompletedRef.current = hasCompleted;
  durationRef.current = duration;

  // Sync state when lesson or video index changes
  useEffect(() => {
    setCurrentVideoIndex(0);
    setCurrentTime(0);
    maxAllowedTimeRef.current = 0;
    lastKnownTimeRef.current = 0;
    startedAtRef.current = 0;
    setIsPlaying(false);
    setHasCompleted(isUnlockedForQuiz);
    setActiveSlideIndex(0);
    setDuration(lesson.durationSeconds || 120);

    if (isVideoAvailable) {
      setPlayerMode('video');
    } else {
      setPlayerMode('interactive');
    }

    if (timerRef.current) clearInterval(timerRef.current);
  }, [lesson.day, isUnlockedForQuiz, lesson.videoUrl, lesson.videoUrls, isVideoAvailable]);

  // Handle violation: resets everything to 00:00 and alerts the student
  const triggerViolation = useCallback(
    (type: 'LEFT_VIDEO' | 'SEEK_ATTEMPT' | 'PAUSE_ATTEMPT', detail: string) => {
      // Grace period: ignore during initial 4 seconds of playback start
      if (Date.now() - startedAtRef.current < 4000) {
        return;
      }
      // If already completed or not playing, do not penalize
      if (hasCompletedRef.current || !isPlayingRef.current) {
        return;
      }

      setIsPlaying(false);
      setCurrentTime(0);
      lastKnownTimeRef.current = 0;
      maxAllowedTimeRef.current = 0;
      setActiveSlideIndex(0);

      // Reset HTML5 video if active
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }

      // Reset YouTube player if active
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        try {
          ytPlayerRef.current.seekTo(0, true);
          ytPlayerRef.current.pauseVideo();
        } catch {
          // Ignore
        }
      }

      setViolationModal({
        show: true,
        title: '⚠️ Violação Detectada!',
        message: `${detail} Pelas regras deste curso, o vídeo foi reiniciado para o início (00:00).`,
      });

      onViolation(type, detail);
    },
    [onViolation]
  );

  // RIGOROUS DETECTION: Visibility Change (tab switch/minimize) and Seek keys
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isPlayingRef.current && !hasCompletedRef.current) {
        if (Date.now() - startedAtRef.current > 4000) {
          triggerViolation(
            'LEFT_VIDEO',
            'Você alternou de aba ou minimizou o navegador durante a exibição do vídeo.'
          );
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlayingRef.current && !hasCompletedRef.current && Date.now() - startedAtRef.current > 4000) {
        // Block seeking shortcuts (Space, Arrow Keys, J, K, L)
        if (
          e.code === 'Space' ||
          e.code === 'ArrowRight' ||
          e.code === 'ArrowLeft' ||
          e.code === 'ArrowUp' ||
          e.code === 'ArrowDown' ||
          e.key === 'j' ||
          e.key === 'k' ||
          e.key === 'l'
        ) {
          e.preventDefault();
          triggerViolation(
            'SEEK_ATTEMPT',
            'Tentativa de voltar, avançar ou pausar a reprodução usando atalhos de teclado.'
          );
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerViolation]);

  // Finish Lesson or Advance Playlist Handler
  const handleFinishLesson = useCallback(() => {
    if (currentVideoIndex < playlist.length - 1) {
      // Advance to next video in playlist
      const nextIdx = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIdx);
      setCurrentTime(0);
      maxAllowedTimeRef.current = 0;
      lastKnownTimeRef.current = 0;
      startedAtRef.current = Date.now();
      setIsPlaying(true);
    } else {
      // Completed all videos for this day!
      setIsPlaying(false);
      setHasCompleted(true);
      const finalDuration = durationRef.current;
      setCurrentTime(finalDuration);
      onTimeUpdate(finalDuration, finalDuration);
      onVideoComplete();
    }
  }, [currentVideoIndex, playlist.length, onTimeUpdate, onVideoComplete]);

  // YouTube API initialization & duration auto-detection
  useEffect(() => {
    if (videoInfo.type !== 'youtube' || !videoInfo.videoId) return;

    let destroyed = false;

    const initYt = () => {
      if (destroyed || !window.YT || !window.YT.Player) return;
      const iframeId = `youtube-iframe-day-${lesson.day}-${currentVideoIndex}`;
      const elem = document.getElementById(iframeId);
      if (!elem) return;

      try {
        ytPlayerRef.current = new window.YT.Player(iframeId, {
          events: {
            onReady: (event: any) => {
              const d = event.target.getDuration();
              if (d && !isNaN(d) && d > 5) {
                const rounded = Math.ceil(d);
                setDuration(rounded);
                durationRef.current = rounded;
              }
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                handleFinishLesson();
              } else if (
                event.data === window.YT.PlayerState.PAUSED &&
                isPlayingRef.current &&
                !hasCompletedRef.current
              ) {
                if (Date.now() - startedAtRef.current > 4000) {
                  triggerViolation(
                    'PAUSE_ATTEMPT',
                    'Pausa detectada na videoaula.'
                  );
                }
              }
            },
          },
        });
      } catch {
        // Fallback silently if iframe api already mounted
      }
    };

    if (!window.YT) {
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existing) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevReady) prevReady();
        initYt();
      };
    } else {
      initYt();
    }

    return () => {
      destroyed = true;
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [videoInfo.type, videoInfo.videoId, lesson.day, currentVideoIndex, handleFinishLesson, triggerViolation]);

  // Main ticker loop for interactive slides or time synchronization
  useEffect(() => {
    if (isPlaying && !hasCompleted) {
      timerRef.current = setInterval(() => {
        // If native video is playing, time is synced via onTimeUpdate on the video element
        if (playerMode === 'video' && videoInfo.type === 'mp4') {
          return;
        }

        // If YouTube player is active, check its exact currentTime
        if (playerMode === 'video' && videoInfo.type === 'youtube' && ytPlayerRef.current) {
          try {
            const ytCurr = Math.floor(ytPlayerRef.current.getCurrentTime() || 0);
            const ytDuration = Math.ceil(ytPlayerRef.current.getDuration() || durationRef.current);
            if (ytDuration > 5 && ytDuration !== durationRef.current) {
              setDuration(ytDuration);
              durationRef.current = ytDuration;
            }

            // Anti-tamper: if student somehow skipped ahead or back
            if (Date.now() - startedAtRef.current > 4000) {
              const prev = lastKnownTimeRef.current;
              if (prev > 1 && (ytCurr < prev - 2 || ytCurr > prev + 4)) {
                triggerViolation(
                  'SEEK_ATTEMPT',
                  'Tentativa de voltar ou avançar a aula detectada.'
                );
                return;
              }
            }

            lastKnownTimeRef.current = ytCurr;
            setCurrentTime(ytCurr);
            maxAllowedTimeRef.current = Math.max(maxAllowedTimeRef.current, ytCurr);
            onTimeUpdate(ytCurr, ytDuration);

            if (ytCurr >= ytDuration - 1 && ytDuration > 0) {
              handleFinishLesson();
            }
            return;
          } catch {
            // Fall back to increment ticker
          }
        }

        // Fallback increment (Interactive slides or standard ticker)
        setCurrentTime((prev) => {
          const next = prev + 1;
          const currentDuration = durationRef.current;
          maxAllowedTimeRef.current = Math.max(maxAllowedTimeRef.current, next);

          const slidesCount = Math.max(1, lesson.summary.length);
          const slideDuration = currentDuration / slidesCount;
          const currentSlide = Math.min(
            slidesCount - 1,
            Math.floor(next / slideDuration)
          );
          setActiveSlideIndex(currentSlide);

          onTimeUpdate(next, currentDuration);

          if (next >= currentDuration) {
            clearInterval(timerRef.current);
            handleFinishLesson();
            return currentDuration;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    isPlaying,
    hasCompleted,
    playerMode,
    videoInfo.type,
    currentTime,
    lesson.summary.length,
    onTimeUpdate,
    handleFinishLesson,
    triggerViolation,
  ]);

  // Start Playing
  const handleStartPlay = () => {
    if (hasCompleted) return;
    startedAtRef.current = Date.now();
    lastKnownTimeRef.current = 0;
    maxAllowedTimeRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
      try {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
      } catch {
        // ignore
      }
    }
  };

  // Prevent user pausing directly
  const handleUserAttemptPause = () => {
    if (!hasCompleted && isPlaying) {
      triggerViolation(
        'PAUSE_ATTEMPT',
        'Pausa não permitida. O vídeo deve ser assistido continuamente do início ao fim sem interrupções.'
      );
    }
  };

  // HTML5 Video Events
  const handleNativeLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const d = e.currentTarget.duration;
    if (d && !isNaN(d) && isFinite(d) && d > 2) {
      const rounded = Math.ceil(d);
      setDuration(rounded);
      durationRef.current = rounded;
    }
  };

  const handleNativeTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isPlaying) return;
    const curr = e.currentTarget.currentTime;
    const currentDuration = durationRef.current;

    // Detect if user jumped back or forward (SEEK ATTEMPT)
    if (Date.now() - startedAtRef.current > 4000) {
      const prev = lastKnownTimeRef.current;
      if (prev > 1 && (curr < prev - 1.5 || curr > prev + 4)) {
        e.currentTarget.currentTime = 0;
        triggerViolation(
          'SEEK_ATTEMPT',
          'Tentativa de voltar ou avançar o vídeo detectada.'
        );
        return;
      }
    }

    lastKnownTimeRef.current = curr;
    const sec = Math.floor(curr);
    setCurrentTime(sec);
    maxAllowedTimeRef.current = Math.max(maxAllowedTimeRef.current, sec);
    onTimeUpdate(sec, currentDuration);

    if (currentDuration > 0 && curr >= currentDuration - 0.5) {
      handleFinishLesson();
    }
  };

  const handleNativeSeeking = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isPlayingRef.current || hasCompletedRef.current) return;
    if (Date.now() - startedAtRef.current < 4000) return;
    // Strictly reset to 0:00 whenever seeking happens
    e.currentTarget.currentTime = 0;
    triggerViolation(
      'SEEK_ATTEMPT',
      'Tentativa de voltar ou avançar a aula detectada.'
    );
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;

  const formatTime = (secs: number) => {
    const safe = isNaN(secs) || secs < 0 ? 0 : Math.floor(secs);
    const m = Math.floor(safe / 60);
    const s = Math.floor(safe % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id={`strict-video-container-day-${lesson.day}`}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100 relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Violation Overlay Modal */}
      {violationModal && violationModal.show && (
        <div
          id="video-violation-alert-overlay"
          className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 animate-bounce">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-red-400 tracking-tight mb-2">
            {violationModal.title}
          </h3>
          <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
            {violationModal.message}
          </p>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 max-w-sm mb-6 text-left space-y-1">
            <div className="font-semibold text-slate-200">Regras de Monitoramento:</div>
            <div>• Não volte o vídeo nem tente avançar.</div>
            <div>• Não saia desta aba enquanto o vídeo estiver em execução.</div>
            <div>• Não minimize o navegador nem clique fora da tela.</div>
            <div>• O conteúdo deve ser assistido 100% até o fim.</div>
          </div>
          <button
            id="violation-acknowledge-btn"
            type="button"
            onClick={() => {
              setViolationModal(null);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-red-500/25 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Entendi, Recomeçar Vídeo (00:00)</span>
          </button>
        </div>
      )}

      {/* Top Banner: Rules & Anti-cheat Active */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">Modo de Avaliação Rigorosa Ativo</span>
          <span className="hidden sm:inline text-slate-400">• Sem pausas • Reinicia para o início caso volte</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Player Mode Switcher */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            {isVideoAvailable && (
              <button
                id="player-mode-video-btn"
                type="button"
                onClick={() => setPlayerMode('video')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  playerMode === 'video'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Videoaula
              </button>
            )}
            <button
              id="player-mode-interactive-btn"
              type="button"
              onClick={() => setPlayerMode('interactive')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                playerMode === 'interactive'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aula Guiada
            </button>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Playlist Indicator (If day contains multiple videos) */}
      {playlist.length > 1 && (
        <div className="bg-slate-950/90 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              Playlist do Dia:
            </span>
            <span className="text-slate-300 font-semibold text-xs">
              Vídeo {currentVideoIndex + 1} de {playlist.length}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            {playlist.map((_, pIdx) => {
              const isPast = pIdx < currentVideoIndex;
              const isCurr = pIdx === currentVideoIndex;
              return (
                <span
                  key={pIdx}
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold border transition-all ${
                    isPast
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : isCurr
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {isPast ? `V${pIdx + 1} ✓` : isCurr ? `V${pIdx + 1} ▶` : `V${pIdx + 1} 🔒`}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Screen Area */}
      <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center overflow-hidden select-none">
        {playerMode === 'interactive' ? (
          /* Interactive Slides Player */
          <div className="w-full h-full p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 relative">
            {/* Top Slide Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Slide {activeSlideIndex + 1} de {lesson.summary.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {lesson.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {isPlaying && (
                  <span className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Transmitindo Aula</span>
                  </span>
                )}
              </div>
            </div>

            {/* Slide Body Content */}
            <div className="my-auto py-4 max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-2">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>

              <h4 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {lesson.summary[activeSlideIndex] || lesson.subtitle}
              </h4>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Preste atenção aos conceitos apresentados. O Quiz avaliativo deste dia exigirá nota mínima de 8.0 para aprovação.
              </p>

              {/* Progress dots for slides */}
              <div className="flex items-center justify-center space-x-2 pt-2">
                {lesson.summary.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeSlideIndex
                        ? 'w-8 bg-blue-500'
                        : idx < activeSlideIndex
                        ? 'w-4 bg-emerald-500/70'
                        : 'w-2 bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Audio/Visual Wave Effect when playing */}
            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span>Instruções em andamento</span>
              </div>
              <div className="flex items-center space-x-1 h-3">
                {[40, 70, 30, 90, 60, 80, 45, 95, 50, 75].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 bg-blue-500 rounded-full transition-all duration-200 ${
                      isPlaying ? 'opacity-90' : 'opacity-20'
                    }`}
                    style={{ height: isPlaying ? `${h}%` : '20%' }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Video Player (MP4 or YouTube) */
          videoInfo.type === 'mp4' ? (
            /* Direct MP4 / Uploaded Video Mode */
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                key={`native-video-day-${lesson.day}-${currentVideoIndex}`}
                id={`native-video-day-${lesson.day}-${currentVideoIndex}`}
                src={videoInfo.embedUrl}
                playsInline
                preload="metadata"
                controls={false}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate nofullscreen"
                onLoadedMetadata={handleNativeLoadedMetadata}
                onTimeUpdate={handleNativeTimeUpdate}
                onSeeking={handleNativeSeeking}
                onEnded={handleFinishLesson}
                className="w-full h-full object-contain pointer-events-none"
              />
              {/* Interaction Blocker to prevent user pausing or seeking */}
              <div
                id="native-video-interaction-blocker"
                className="absolute inset-0 z-20 cursor-default"
                onClick={handleUserAttemptPause}
              />
            </div>
          ) : videoInfo.type === 'youtube' ? (
            /* YouTube Embed Mode */
            <div className="w-full h-full relative">
              <iframe
                key={`youtube-iframe-day-${lesson.day}-${currentVideoIndex}`}
                id={`youtube-iframe-day-${lesson.day}-${currentVideoIndex}`}
                src={`${videoInfo.embedUrl}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&controls=0&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                title={lesson.title}
                className="w-full h-full border-0 pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
              {/* Interaction Blocker */}
              <div
                id="youtube-interaction-blocker"
                className="absolute inset-0 z-20 cursor-default"
                onClick={handleUserAttemptPause}
              />
            </div>
          ) : (
            /* Empty state */
            <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center bg-slate-950 text-slate-300 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Aguardando Postagem da Videoaula
              </h4>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                O Professor irá cadastrar o vídeo desta aula no Painel do Administrador. Você pode utilizar a Aula Guiada para estudar o conteúdo completo.
              </p>
              <button
                type="button"
                onClick={() => setPlayerMode('interactive')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
              >
                Ver Aula Guiada
              </button>
            </div>
          )
        )}

        {/* Initial "Iniciar Aula" Overlay */}
        {!isPlaying && !hasCompleted && (
          <div
            id="video-start-prompt-overlay"
            className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <button
              id="start-lesson-video-btn"
              type="button"
              onClick={handleStartPlay}
              className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/40 transition-transform active:scale-95 cursor-pointer mb-4"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20 group-hover:opacity-40"></span>
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>

            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              Iniciar Aula Obrigatória
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
              Mantenha o foco nesta tela. Não tente avançar, pausar ou voltar o vídeo: qualquer tentativa de retorno ou saída reinicia o vídeo do 00:00.
            </p>
            <span className="text-[11px] font-semibold text-amber-300/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Duração da aula: {formatTime(duration)}
            </span>
          </div>
        )}

        {/* Completion Banner inside video */}
        {hasCompleted && (
          <div
            id="video-completed-banner"
            className="absolute inset-0 z-30 bg-emerald-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              Aula do Dia {lesson.day} Concluída!
            </h3>
            <p className="text-xs text-emerald-200/80 max-w-md mb-4">
              Você assistiu a todo o conteúdo desta videoaula. O Quiz avaliativo abaixo está liberado!
            </p>
            <span className="text-xs font-semibold bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-lg shadow-sm">
              Exercícios e Prova Desbloqueados
            </span>
          </div>
        )}
      </div>

      {/* STRICT PROGRESS BAR (READ-ONLY, UNTOUCHABLE) */}
      <div className="bg-slate-950 px-5 py-3 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200">
              Progresso Obrigatório:
            </span>
            <span className="text-blue-400 font-mono font-bold">
              {progressPercent}%
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-amber-400">
            <Lock className="w-3 h-3" />
            <span>Barra de avanço bloqueada (assistir integralmente)</span>
          </div>
        </div>

        {/* Visual Progress Bar (Pointer events none to strictly prevent seeking) */}
        <div
          id="strict-progress-track"
          className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative select-none pointer-events-none"
        >
          <div
            id="strict-progress-fill"
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer Info / Anti-Cheat Guidance */}
      <div className="bg-slate-900/90 p-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Detector de presença e foco ativo. Ao voltar ou tentar pular, o vídeo reinicia do início.
          </span>
        </div>
        <div className="text-slate-300 font-medium">
          Mínimo para passar no quiz posterior:{' '}
          <strong className="text-emerald-400 font-bold">8.0 / 10</strong>
        </div>
      </div>
    </div>
  );
};
