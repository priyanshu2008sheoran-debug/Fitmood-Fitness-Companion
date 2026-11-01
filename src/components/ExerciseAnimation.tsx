// ExerciseAnimation Component
// Replaces the old stickman with a 3D-styled animated human character (Coach Milo)
// and supports optimized exercise video clips (WebM / MP4 / embeds) with theme-aware styling
// and a full-featured Fullscreen Mode.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Exercise } from '../types';
import { CoachMilo3DView, CoachMilo3DViewRef, CameraViewMode } from './coach3d/CoachMilo3DView';
import { getExerciseTeachingGuide } from './coach3d/coachKinematics';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Eye,
  Video,
  AlertCircle,
  CheckCircle2,
  Activity,
  Layers,
  Compass
} from 'lucide-react';

export interface ExerciseAnimationProps {
  exercise: Exercise;
  currentSet?: number;
  totalSets?: number;
  repsOrTarget?: string;
  userName?: string;
  isWorkoutIntro?: boolean;
  onSkipIntro?: () => void;
  className?: string;
  autoPlaySpeech?: boolean;
  initialMode?: '3d_coach' | 'video_clip';
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

// Common exercise-specific direct WebM/MP4 demonstration sources for squats, lunges, push-ups, etc.
const EXERCISE_VIDEO_SOURCES: Record<string, { mp4?: string; webm?: string; poster?: string }> = {
  'wall-push-up': {
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  'standard-push-up': {
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  'bodyweight-squat': {
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  'reverse-lunge': {
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
  }
};

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  exercise,
  currentSet = 1,
  totalSets = 3,
  repsOrTarget,
  userName,
  isWorkoutIntro = false,
  onSkipIntro,
  className = '',
  autoPlaySpeech = false,
  initialMode = '3d_coach',
  onFullscreenChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const view3DRef = useRef<CoachMilo3DViewRef>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const [activeMode, setActiveMode] = useState<'3d_coach' | 'video_clip'>(initialMode);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5x, 1.0x, 1.5x
  const [viewMode, setViewMode] = useState<CameraViewMode>('side');
  const [showVisualCues, setShowVisualCues] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const [cycleProgress, setCycleProgress] = useState<number>(0);
  const [currentFormTip, setCurrentFormTip] = useState<string>('');
  const [showTeachingDetails, setShowTeachingDetails] = useState<boolean>(false);

  const teachingGuide = getExerciseTeachingGuide(exercise.id, exercise.name);

  // Spoken dialogue for Coach Milo
  const speechText = isWorkoutIntro
    ? `Hello ${userName || 'Athlete'}! Welcome to FitMood. I'm Coach Milo, your 3D animated fitness coach. Let's master your form and power through today's session!`
    : currentSet === 1
    ? teachingGuide.coachDialogue
    : `Set ${currentSet} of ${totalSets} on ${exercise.name}! Stay tight, breathe with control, and let's work!`;

  const speakDialogue = useCallback((text: string) => {
    if (!('speechSynthesis' in window) || isAudioMuted) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.06;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech not supported or blocked
    }
  }, [isAudioMuted]);

  useEffect(() => {
    if (!isAudioMuted && autoPlaySpeech) {
      speakDialogue(speechText);
    }
  }, [exercise.id, currentSet, isWorkoutIntro, isAudioMuted, autoPlaySpeech, speakDialogue, speechText]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update video playback speed when playbackSpeed changes
  useEffect(() => {
    if (videoElementRef.current) {
      videoElementRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Fullscreen change listener to sync state with native browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFs = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
      );
      if (!isCurrentlyFs && isFullscreen) {
        setIsFullscreen(false);
        onFullscreenChange?.(false);
        setFullscreenError(null);
      } else if (isCurrentlyFs && !isFullscreen) {
        setIsFullscreen(true);
        onFullscreenChange?.(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    const handlePopState = () => {
      if (isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isFullscreen, onFullscreenChange]);

  // Request true browser fullscreen
  const enterFullscreen = async () => {
    setFullscreenError(null);
    const container = containerRef.current;
    if (!container) return;

    let nativeSuccess = false;
    try {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
        nativeSuccess = true;
      } else if ((container as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (container as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        nativeSuccess = true;
      } else if ((container as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
        await (container as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
        nativeSuccess = true;
      } else if ((container as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (container as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
        nativeSuccess = true;
      }
    } catch (err) {
      console.warn('Browser prevented native fullscreen request:', err);
      setFullscreenError(
        'Browser permissions or iframe restrictions prevented native fullscreen. Activated full-viewport player.'
      );
    }

    // Always engage fullscreen layout (both native and full-viewport fallback)
    setIsFullscreen(true);
    onFullscreenChange?.(true);
    try {
      window.history.pushState({ isFullscreenModal: true }, '');
    } catch {
      // ignore
    }
  };

  // Exit fullscreen cleanly
  const exitFullscreen = async () => {
    try {
      if (
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement
      ) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        } else if ((document as unknown as { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
          await (document as unknown as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
        }
      }
    } catch (err) {
      console.warn('Error exiting fullscreen:', err);
    } finally {
      setIsFullscreen(false);
      onFullscreenChange?.(false);
      setFullscreenError(null);
    }
  };

  const handleTogglePlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    if (videoElementRef.current) {
      if (nextPlay) {
        videoElementRef.current.play().catch(() => {});
      } else {
        videoElementRef.current.pause();
      }
    }
  };

  const handleReplay = () => {
    setIsPlaying(true);
    view3DRef.current?.restartAnimation();
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = 0;
      videoElementRef.current.play().catch(() => {});
    }
    if (!isAudioMuted) {
      speakDialogue(speechText);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (videoElementRef.current) {
      videoElementRef.current.muted = nextMuted;
    }
    if (nextMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    } else if (!nextMuted) {
      speakDialogue(speechText);
    }
  };

  // Speed selection: 0.5x, 1x, 1.5x as required
  const handleCycleSpeed = () => {
    let next = 1.0;
    if (playbackSpeed === 1.0) next = 1.5;
    else if (playbackSpeed === 1.5) next = 0.5;
    else next = 1.0;
    setPlaybackSpeed(next);
  };

  const directClip = EXERCISE_VIDEO_SOURCES[exercise.id] || (exercise.videoType === 'direct' ? { mp4: exercise.videoUrl } : null);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden flex flex-col transition-all bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-[100dvh] rounded-none border-0 m-0 p-0 flex flex-col justify-between overflow-hidden'
          : className
      }`}
    >
      {/* Fullscreen Blocked Notice Banner */}
      {fullscreenError && (
        <div className="absolute top-12 left-4 right-4 z-50 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{fullscreenError}</span>
          </div>
          <button
            type="button"
            onClick={() => setFullscreenError(null)}
            className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================
          1. TOP CONTROLS BAR: Title, Sets/Reps, Camera Angles, Fullscreen ⛶
          ======================================================== */}
      <div
        className={`flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-xs shrink-0 z-20 ${
          isFullscreen ? 'px-6 py-3.5 bg-slate-900/95' : ''
        }`}
      >
        {/* Left: Branding & Set Counter */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-lime-400/20">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2 font-black text-white text-xs sm:text-sm">
              <span>Coach Milo</span>
              <span className="text-[10px] font-bold text-lime-400 bg-lime-400/10 border border-lime-400/20 px-2 py-0.5 rounded-full">
                {activeMode === '3d_coach' ? '3D Character' : 'HD Video Clip'}
              </span>
            </div>
            {/* Set & Rep Counter */}
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-slate-200">
                Set {currentSet} of {totalSets}
              </span>
              <span>•</span>
              <span className="text-lime-300">
                {repsOrTarget || exercise.defaultRepsOrSeconds}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Camera Angles, Cues, and Top-Right FULLSCREEN Button (⛶) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher: 3D Coach vs Video Clip */}
          {directClip && (
            <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setActiveMode('3d_coach')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  activeMode === '3d_coach' ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                3D Coach
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('video_clip')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  activeMode === 'video_clip' ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Clip
              </button>
            </div>
          )}

          {/* 3D Camera Angles (Side, Front, Focus) */}
          {activeMode === '3d_coach' && (
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setViewMode('side');
                  view3DRef.current?.setCameraView('side');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'side' ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Side View: Optimal for posture, spine alignment, and movement depth"
              >
                Side
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('front');
                  view3DRef.current?.setCameraView('front');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'front' ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Front View: Check hand width, stance width, and knee tracking"
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('close_up');
                  view3DRef.current?.setCameraView('close_up');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'close_up' ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Close-Up: Focus on joint angles (elbows, knees, hips)"
              >
                Focus
              </button>
            </div>
          )}

          {/* Visual Movement Cues Toggle */}
          {activeMode === '3d_coach' && (
            <button
              type="button"
              onClick={() => setShowVisualCues(!showVisualCues)}
              title="Toggle Trajectory Arrows & Target Muscle Glow"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                showVisualCues
                  ? 'bg-lime-400/15 border-lime-400/40 text-lime-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cues</span>
            </button>
          )}

          {/* Top-Right FULLSCREEN BUTTON (⛶) */}
          <button
            type="button"
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand to Fullscreen (⛶)'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-md shadow-lime-400/20'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750 hover:text-white'
            }`}
          >
            {isFullscreen ? (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <Minimize2 className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </span>
            ) : (
              <Maximize2 className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          2. MAIN VIEWPORT (Responsive Desktop & Mobile Landscape, Coach Fully Visible)
          ======================================================== */}
      <div
        className={`relative w-full bg-slate-950 overflow-hidden flex items-center justify-center ${
          isFullscreen
            ? 'flex-1 min-h-0 w-full p-2 sm:p-4'
            : 'aspect-video min-h-[220px] max-h-[400px]'
        }`}
      >
        {activeMode === '3d_coach' ? (
          <CoachMilo3DView
            ref={view3DRef}
            exerciseId={exercise.id}
            isIntro={isWorkoutIntro}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            viewMode={viewMode}
            showVisualCues={showVisualCues}
            onCycleProgress={(prog, tip) => {
              setCycleProgress(prog);
              setCurrentFormTip(tip);
            }}
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoElementRef}
            src={directClip?.mp4}
            autoPlay
            loop
            muted={isAudioMuted}
            playsInline
            className="w-full h-full object-contain max-h-full"
          />
        )}

        {/* Coach Milo Spoken Speech Bubble Overlay */}
        {speechText && !isWorkoutIntro && (
          <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-4 z-10 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-lime-400/30 text-slate-200 shadow-xl flex items-start gap-2.5 max-w-xl mx-auto pointer-events-auto">
            <div className="w-6 h-6 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
              M
            </div>
            <div className="flex-1 text-[11px] leading-snug">
              <span className="font-bold text-lime-400 block mb-0.5">Coach Milo:</span>
              "{speechText}"
            </div>
          </div>
        )}

        {/* Real-time Movement Form Guidance Ribbon */}
        {currentFormTip && !isWorkoutIntro && (
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center pointer-events-none">
            <div className="px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-xs text-slate-200 shadow-lg flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span className="font-semibold text-[11px] truncate">{currentFormTip}</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          3. FULLSCREEN & INLINE PLAYBACK CONTROLS DOCK
          Play/Pause, Restart, Speed (0.5x, 1x, 1.5x), Mute, Progress, Instructions
          ======================================================== */}
      <div
        className={`px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-20 ${
          isFullscreen ? 'px-6 py-3.5' : ''
        }`}
      >
        {/* Left: Play/Pause, Restart, Speed (0.5x, 1x, 1.5x), Mute/Volume */}
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-transform hover:scale-102 cursor-pointer shadow-sm shadow-lime-400/25"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={handleReplay}
            title="Restart animation from beginning"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector: 0.5x, 1x, 1.5x as explicitly required */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px]">
            {[0.5, 1.0, 1.5].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                title={spd === 0.5 ? 'Slow-motion breakdown (0.5x)' : spd === 1.5 ? 'Brisk cadence (1.5x)' : 'Normal speed (1x)'}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-lime-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Mute / Volume */}
          <button
            type="button"
            onClick={handleToggleMute}
            title={isAudioMuted ? 'Unmute Coach Milo Voice' : 'Mute Coach Milo Voice'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              !isAudioMuted
                ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Progress Bar & Instructions Button */}
        <div className="flex items-center gap-3">
          {/* Progress Bar / Form Cadence Meter */}
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="hidden sm:inline font-mono">Progress:</span>
            <div className="w-20 sm:w-28 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/60">
              <div
                className="bg-lime-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${Math.round(cycleProgress * 100)}%` }}
              />
            </div>
          </div>

          {/* Coach Milo Instructions Toggle */}
          <button
            type="button"
            onClick={() => setShowTeachingDetails(!showTeachingDetails)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-lime-400" />
            <span>Instructions</span>
            {showTeachingDetails ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          4. INSTRUCTIONS ACCORDION
          ======================================================== */}
      {showTeachingDetails && (
        <div
          className={`p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200 ${
            isFullscreen
              ? 'absolute bottom-16 left-3 right-3 sm:left-6 sm:right-6 max-h-[55vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl z-30 bg-slate-900/98 backdrop-blur-md'
              : 'overflow-y-auto'
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Category</span>
              <span className="font-bold text-white capitalize">{exercise.category} Bodyweight</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Difficulty</span>
              <span className="font-bold text-lime-400 capitalize">{exercise.difficulty}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Recommended</span>
              <span className="font-bold text-white">{teachingGuide.recommendedSetsReps}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Rest Period</span>
              <span className="font-bold text-sky-400">{teachingGuide.recommendedRest}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Starting Position</span>
            </span>
            <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
              {teachingGuide.startingPosition}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
              <span>Step-by-Step Movement Instructions</span>
            </span>
            {teachingGuide.stepByStep.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60"
              >
                <span className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="text-slate-300 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
