// Coach Milo 3D Interactive Demonstration & Form Coaching System
// Replaces the old stickman with a high-fidelity 3D human-like fitness coach.
// Features: multiple camera angles, movement trajectory cues, muscle activation glow,
// spoken audio coaching, step-by-step beginner instructions, and interactive playback controls.

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
  Camera,
  Layers,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Wind,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Activity,
  Compass,
  Eye
} from 'lucide-react';

interface AiCartoonCoachProps {
  exercise: Exercise;
  currentSet?: number;
  totalSets?: number;
  repsOrTarget?: string;
  userName?: string;
  isWorkoutIntro?: boolean;
  onSkipIntro?: () => void;
  className?: string;
  autoPlaySpeech?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export const AiCartoonCoach: React.FC<AiCartoonCoachProps> = ({
  exercise,
  currentSet = 1,
  totalSets = 3,
  repsOrTarget,
  userName,
  isWorkoutIntro = false,
  onSkipIntro,
  className = '',
  autoPlaySpeech = false,
  onFullscreenChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const view3DRef = useRef<CoachMilo3DViewRef>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5x, 1.0x, 1.5x
  const [viewMode, setViewMode] = useState<CameraViewMode>('side');
  const [showVisualCues, setShowVisualCues] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showTeachingDetails, setShowTeachingDetails] = useState<boolean>(false);
  const [currentFormTip, setCurrentFormTip] = useState<string>('');
  const [cycleProgress, setCycleProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);

  // Retrieve comprehensive beginner-friendly teaching guide
  const teachingGuide = getExerciseTeachingGuide(exercise.id, exercise.name);

  // Determine Coach Milo's spoken speech dialogue
  const speechText = isWorkoutIntro
    ? `Hello ${userName || 'Athlete'}! Welcome back to FitMood. I'm Coach Milo, your 3D fitness instructor. I'll demonstrate every movement with precision, correct your form, and guide you through every set. Ready? Let's begin!`
    : currentSet === 1
    ? teachingGuide.coachDialogue
    : `Great focus! Now on Set ${currentSet} of ${totalSets} for ${exercise.name}. Maintain clean posture, breathe smoothly, and let's get those reps!`;

  // Speech synthesis integration
  const speakDialogue = useCallback((text: string) => {
    if (!('speechSynthesis' in window) || isAudioMuted) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
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

  // Request true browser fullscreen using Fullscreen API
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
      console.warn('Browser native requestFullscreen blocked or restricted:', err);
      setFullscreenError(
        'Browser permissions or iframe restrictions prevented native fullscreen. Activated full-viewport player.'
      );
    }

    // Always engage fullscreen layout (both native and full-viewport fallback)
    setIsFullscreen(true);
    onFullscreenChange?.(true);
    try {
      window.history.pushState({ isFullscreenCoach: true }, '');
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

  const handleToggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (nextMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (!nextMuted) {
      speakDialogue(speechText);
    }
  };

  const handleReplay = () => {
    setIsPlaying(true);
    view3DRef.current?.restartAnimation();
    if (!isAudioMuted) {
      speakDialogue(speechText);
    }
  };

  const handleCycleProgress = (prog: number, tip: string) => {
    setCycleProgress(prog);
    setCurrentFormTip(tip);
  };

  // Cycle speed across 0.5x, 1x, 1.5x as required
  const handleCycleSpeed = () => {
    let next = 1.0;
    if (playbackSpeed === 1.0) next = 1.5;
    else if (playbackSpeed === 1.5) next = 0.5;
    else next = 1.0;
    setPlaybackSpeed(next);
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col fixed-dark text-slate-100 transition-all ${
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
          1. TOP DOCK HEADER
          Character Branding, Set/Rep Counter, Camera Angles & FULLSCREEN ⛶
          ======================================================== */}
      <div
        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-900/95 border-b border-slate-800 text-xs shrink-0 z-20 ${
          isFullscreen ? 'px-6 py-3.5 bg-slate-900/95' : ''
        }`}
      >
        {/* Character Title & Set/Rep Counter */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-lime-400/20">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-white text-xs sm:text-sm">
              <span>Coach Milo</span>
              <span className="text-[10px] font-semibold text-lime-400 bg-lime-400/10 px-1.5 py-0.2 rounded-md">
                3D Coach
              </span>
            </div>
            {/* Set and Rep Counter */}
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

        {/* Camera Angles & Interactive Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Multiple View Angles Switcher */}
          <div className="hidden xs:flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setViewMode('side');
                view3DRef.current?.setCameraView('side');
              }}
              title="Side View: Optimal for posture, spine alignment, and movement depth"
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'side'
                  ? 'bg-lime-400 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('front');
                view3DRef.current?.setCameraView('front');
              }}
              title="Front View: Check hand width, stance width, and knee tracking"
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'front'
                  ? 'bg-lime-400 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('close_up');
                view3DRef.current?.setCameraView('close_up');
              }}
              title="Close-Up: Focus on joint angles (elbows, knees, hips)"
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'close_up'
                  ? 'bg-lime-400 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus
            </button>
          </div>

          {/* Visual Movement Cues Toggle */}
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
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Cues</span>
          </button>

          {/* Speed Selector (0.5x, 1x, 1.5x) */}
          <button
            type="button"
            onClick={handleCycleSpeed}
            title={
              playbackSpeed === 0.5
                ? 'Slow-Motion Breakdown (0.5x) - Master proper form'
                : playbackSpeed === 1.5
                ? 'Brisk Cadence (1.5x)'
                : 'Playback Speed (1x)'
            }
            className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
              playbackSpeed === 0.5
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : playbackSpeed === 1.5
                ? 'bg-sky-400/20 text-sky-300 border-sky-400/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {playbackSpeed}x{playbackSpeed === 0.5 ? ' Slow' : ''}
          </button>

          {/* Coach Voice Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            title={isAudioMuted ? 'Unmute Coach Milo Voice' : 'Mute Coach Milo Voice'}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              !isAudioMuted
                ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

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
          2. MAIN 3D VIEWPORT
          Studio 3D Canvas with Real-Time Kinematics & Speech Overlay
          ======================================================== */}
      <div
        className={`relative w-full bg-slate-950 overflow-hidden flex items-center justify-center ${
          isFullscreen
            ? 'flex-1 min-h-0 w-full p-2 sm:p-4'
            : 'aspect-video min-h-[240px] max-h-[380px]'
        }`}
      >
        <CoachMilo3DView
          ref={view3DRef}
          exerciseId={exercise.id}
          isIntro={isWorkoutIntro}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          viewMode={viewMode}
          showVisualCues={showVisualCues}
          onCycleProgress={handleCycleProgress}
          className="w-full h-full"
        />

        {/* Active Spoken Speech Bubble Overlay */}
        {speechText && (
          <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-4 z-10 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-lime-400/30 text-slate-200 shadow-xl flex items-start gap-2.5 max-w-xl mx-auto pointer-events-auto">
            <div className="w-6 h-6 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
              M
            </div>
            <div className="flex-1 text-[11px] leading-snug">
              <span className="font-bold text-lime-400 block mb-0.5">Coach Milo:</span>
              "{speechText}"
            </div>
            {isWorkoutIntro && onSkipIntro && (
              <button
                type="button"
                onClick={onSkipIntro}
                className="text-[10px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800 shrink-0 cursor-pointer"
              >
                Skip Intro
              </button>
            )}
          </div>
        )}

        {/* Real-time Movement Form Guidance Ribbon */}
        {currentFormTip && !isWorkoutIntro && (
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-xs text-slate-200 shadow-lg flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span className="font-semibold text-[11px] truncate">{currentFormTip}</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          3. PLAYBACK CONTROLS & FORM PROGRESS DOCK
          ======================================================== */}
      <div className={`px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-20 ${
        isFullscreen ? 'px-6 py-3.5' : ''
      }`}>
        <div className="flex items-center gap-2">
          {/* Play / Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-transform hover:scale-102 cursor-pointer shadow-sm shadow-lime-400/25"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Restart / Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Restart demonstration from beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Dedicated Speed Selector (0.5x, 1x, 1.5x) */}
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
        </div>

        {/* Repetition Cadence Meter & Form Details Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="hidden sm:inline font-mono">Form Cadence:</span>
            <div className="w-18 sm:w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/60">
              <div
                className="bg-lime-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${Math.round(cycleProgress * 100)}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowTeachingDetails(!showTeachingDetails)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-[11px] border border-slate-700 transition-colors cursor-pointer"
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
          4. COMPREHENSIVE COACHING INSTRUCTIONS ACCORDION
          Beginner-friendly step-by-step, breathing, common mistakes, sets/reps
          ======================================================== */}
      {showTeachingDetails && (
        <div
          className={`p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200 ${
            isFullscreen
              ? 'absolute bottom-16 left-3 right-3 sm:left-6 sm:right-6 max-h-[55vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl z-30 bg-slate-900/98 backdrop-blur-md'
              : ''
          }`}
        >
          {/* Quick Specifications Pill Bar */}
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
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Target Sets</span>
              <span className="font-bold text-white">{teachingGuide.recommendedSetsReps}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Rest Interval</span>
              <span className="font-bold text-sky-400">{teachingGuide.recommendedRest}</span>
            </div>
          </div>

          {/* Target Muscle Groups */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Activity className="w-3.5 h-3.5 text-lime-400" />
              <span>Target Muscle Groups</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {exercise.targetMuscles.map((muscle, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-medium"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Starting Position */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Starting Position</span>
            </span>
            <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
              {teachingGuide.startingPosition}
            </p>
          </div>

          {/* Step-by-Step Execution */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
              <span>Step-by-Step Movement Instructions</span>
            </span>
            <div className="space-y-1.5">
              {teachingGuide.stepByStep.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60"
                >
                  <span className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breathing Guidance */}
          <div className="p-3 rounded-2xl bg-sky-950/20 border border-sky-800/40 text-sky-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span>Breathing Guidance</span>
            </div>
            <p className="text-[11px] text-sky-200/90 leading-relaxed">
              {teachingGuide.breathing}
            </p>
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Common Mistakes to Avoid</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-200/90 leading-relaxed">
              {teachingGuide.commonMistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
