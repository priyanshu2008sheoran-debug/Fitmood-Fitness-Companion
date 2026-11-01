import React, { useState, useEffect, useRef } from 'react';
import { WorkoutPlan, WarmupRoutine, WarmupExercise } from '../types';
import { WARMUP_ROUTINES, getRecommendedWarmup } from '../data/warmupData';
import {
  Play,
  Pause,
  SkipForward,
  CheckCircle2,
  X,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Timer,
  ChevronRight,
  Headphones,
  Eye,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Radio,
  Activity,
  Mic
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AthleticWarmupAnimator } from './AthleticWarmupAnimator';

interface WarmupModalProps {
  plan: WorkoutPlan;
  isOpen: boolean;
  onClose: () => void;
  onFinishWarmup: (routine: WarmupRoutine, bonusXp: number) => void;
  onSkipToWorkout: () => void;
}

export const WarmupModal: React.FC<WarmupModalProps> = ({
  plan,
  isOpen,
  onClose,
  onFinishWarmup,
  onSkipToWorkout
}) => {
  const recommended = getRecommendedWarmup(plan.category);
  const [selectedRoutine, setSelectedRoutine] = useState<WarmupRoutine>(recommended);
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'visual' | 'audio'>('visual');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    recommended.exercises[0]?.durationSeconds || 45
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Audio-only mode settings
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [beepsEnabled, setBeepsEnabled] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Play audio frequency tones via Web Audio API
  const playTone = (freq: number, durationSec: number = 0.12, type: OscillatorType = 'sine') => {
    if (!beepsEnabled || isVoiceMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationSec + 0.01);
    } catch {
      // Audio not permitted
    }
  };

  // Play start / transition chime
  const playTransitionChime = () => {
    playTone(523.25, 0.1, 'sine'); // C5
    setTimeout(() => playTone(659.25, 0.18, 'sine'), 110); // E5
  };

  // Verbal coaching cue narration using SpeechSynthesis
  const speakVerbalCue = (text: string, cancelPrevious: boolean = true) => {
    setSpokenTranscript(text);
    if (isVoiceMuted || !('speechSynthesis' in window)) return;

    try {
      if (cancelPrevious) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      speechUtteranceRef.current = utterance;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => setIsVoiceSpeaking(true);
      utterance.onend = () => setIsVoiceSpeaking(false);
      utterance.onerror = () => setIsVoiceSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsVoiceSpeaking(false);
    }
  };

  // Announce the full cues for an exercise
  const narrateExerciseStart = (ex: WarmupExercise, index: number, total: number) => {
    playTransitionChime();
    const narration = `Move ${index + 1} of ${total}: ${ex.name}. Duration: ${ex.durationSeconds} seconds. ${ex.instructions}. Coaching tip: ${ex.tips}`;
    speakVerbalCue(narration, true);
  };

  // Replay speech on user request
  const handleReplayVoiceCues = () => {
    if (!currentExercise) return;
    const narration = `Move ${currentExerciseIndex + 1}: ${currentExercise.name}. ${currentExercise.instructions}. Coaching tip: ${currentExercise.tips}`;
    speakVerbalCue(narration, true);
  };

  // Update routine if plan category changes
  useEffect(() => {
    const rec = getRecommendedWarmup(plan.category);
    setSelectedRoutine(rec);
    setCurrentExerciseIndex(0);
    setSecondsRemaining(rec.exercises[0]?.durationSeconds || 45);
    setIsGuidedMode(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [plan.id, plan.category]);

  const currentExercise: WarmupExercise | undefined = selectedRoutine.exercises[currentExerciseIndex];

  // Cleanup speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak cues when starting guided mode or switching exercise
  useEffect(() => {
    if (!isGuidedMode || !currentExercise) return;
    narrateExerciseStart(currentExercise, currentExerciseIndex, selectedRoutine.exercises.length);
  }, [isGuidedMode, currentExerciseIndex]);

  // Guided countdown timer & voice interval triggers
  useEffect(() => {
    if (!isGuidedMode || !isTimerRunning) return;

    // Check for halfway cue
    const totalDuration = currentExercise?.durationSeconds || 45;
    const halfway = Math.floor(totalDuration / 2);
    if (secondsRemaining === halfway && totalDuration >= 20) {
      playTone(784, 0.15, 'sine'); // G5 tone
      speakVerbalCue('Halfway mark! Keep your movement controlled and breathing steady.', false);
    }

    // Check for 3-2-1 countdown beeps and cues
    if (secondsRemaining === 3) {
      playTone(659.25, 0.1, 'sine');
      if (displayMode === 'audio' && !isVoiceMuted) {
        speakVerbalCue('Three', false);
      }
    } else if (secondsRemaining === 2) {
      playTone(659.25, 0.1, 'sine');
      if (displayMode === 'audio' && !isVoiceMuted) {
        speakVerbalCue('Two', false);
      }
    } else if (secondsRemaining === 1) {
      playTone(880, 0.14, 'sine');
      if (displayMode === 'audio' && !isVoiceMuted) {
        speakVerbalCue('One', false);
      }
    }

    if (secondsRemaining <= 0) {
      // Move to next exercise or finish
      if (currentExerciseIndex + 1 < selectedRoutine.exercises.length) {
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setSecondsRemaining(selectedRoutine.exercises[nextIndex].durationSeconds);
      } else {
        handleCompleteGuidedWarmup();
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isGuidedMode,
    isTimerRunning,
    secondsRemaining,
    currentExerciseIndex,
    selectedRoutine,
    displayMode,
    isVoiceMuted,
    currentExercise
  ]);

  if (!isOpen) return null;

  const handleStartGuided = (mode: 'visual' | 'audio' = 'visual') => {
    setDisplayMode(mode);
    setIsGuidedMode(true);
    setCurrentExerciseIndex(0);
    setSecondsRemaining(selectedRoutine.exercises[0]?.durationSeconds || 45);
    setIsTimerRunning(true);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex + 1 < selectedRoutine.exercises.length) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setSecondsRemaining(selectedRoutine.exercises[nextIndex].durationSeconds);
    } else {
      handleCompleteGuidedWarmup();
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      const prevIndex = currentExerciseIndex - 1;
      setCurrentExerciseIndex(prevIndex);
      setSecondsRemaining(selectedRoutine.exercises[prevIndex].durationSeconds);
    }
  };

  const handleCompleteGuidedWarmup = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    speakVerbalCue(
      'Warm-up complete! Your body and joints are primed. Moving to your workout!',
      true
    );
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {
      // fallback
    }
    onFinishWarmup(selectedRoutine, 15);
  };

  const handleToggleTimer = () => {
    const nextRunning = !isTimerRunning;
    setIsTimerRunning(nextRunning);
    if (!nextRunning && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsVoiceSpeaking(false);
    } else if (nextRunning) {
      speakVerbalCue('Resuming movement.', false);
    }
  };

  const handleToggleVoiceMute = () => {
    const nextMute = !isVoiceMuted;
    setIsVoiceMuted(nextMute);
    if (nextMute && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsVoiceSpeaking(false);
    } else if (!nextMute && currentExercise) {
      handleReplayVoiceCues();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto my-4 space-y-5 fixed-dark">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] uppercase tracking-wider font-extrabold mb-1">
              <Sparkles className="w-3 h-3 text-lime-400" />
              <span>Pre-Workout Mobility Prep</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isGuidedMode
                ? displayMode === 'audio'
                  ? 'Audio-Only Guided Warm-Up'
                  : 'Guided Warm-Up Routine'
                : 'Choose Your Warm-Up Sequence'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target routine: <strong className="text-white">{plan.title}</strong> ({plan.category} focus)
            </p>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            aria-label="Close"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isGuidedMode && currentExercise ? (
          /* Guided Interactive Warm-Up Player */
          <div className="space-y-4 py-1">
            {/* Mode Switcher Tabs & Step/XP Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300 text-xs">
                  Move {currentExerciseIndex + 1} of {selectedRoutine.exercises.length}
                </span>
                <span className="font-bold text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-lg border border-lime-400/20 text-xs">
                  +15 Warm-Up XP
                </span>
              </div>

              {/* Mode Switcher: Visual Demo vs Audio-Only */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setDisplayMode('visual')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    displayMode === 'visual'
                      ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visual Coach</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDisplayMode('audio');
                    handleReplayVoiceCues();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    displayMode === 'audio'
                      ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Audio-Only Mode</span>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-lime-400 h-full transition-all duration-300"
                style={{
                  width: `${((currentExerciseIndex + 1) / selectedRoutine.exercises.length) * 100}%`
                }}
              />
            </div>

            {/* Content: Visual Coach vs Audio-Only Experience */}
            {displayMode === 'visual' ? (
              /* Visual Coach Demonstration */
              <div className="relative">
                <AthleticWarmupAnimator
                  exercise={currentExercise}
                  currentStepIndex={currentExerciseIndex + 1}
                  totalSteps={selectedRoutine.exercises.length}
                  isTimerRunning={isTimerRunning}
                  onToggleTimer={handleToggleTimer}
                />

                {/* Floating Real-Time Countdown Badge */}
                <div className="absolute top-14 right-3 sm:right-5 bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl backdrop-blur-xs">
                  <Timer className="w-4 h-4 text-lime-400" />
                  <span className="font-mono text-xl sm:text-2xl font-black text-white">
                    {secondsRemaining}s
                  </span>
                </div>
              </div>
            ) : (
              /* Audio-Only Mode: Designed for hands-free movement without staring at screen */
              <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-lime-400/20 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl space-y-6">
                {/* Background Ambient Pulse Glow */}
                <div className="absolute inset-0 bg-radial from-lime-400/10 to-transparent pointer-events-none opacity-40 animate-pulse" />

                {/* Audio Mode Badge & Audio Controls Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/15 border border-lime-400/30 text-lime-400 text-xs font-bold">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Verbal Cues Active • Eyes-Free Mobility</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBeepsEnabled(!beepsEnabled)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                        beepsEnabled
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title={beepsEnabled ? 'Countdown Beeps Active' : 'Beeps Muted'}
                    >
                      {beepsEnabled ? <Bell className="w-4 h-4 text-lime-400" /> : <BellOff className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleVoiceMute}
                      className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                        !isVoiceMuted
                          ? 'bg-lime-400/15 text-lime-400 border-lime-400/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                      title={isVoiceMuted ? 'Voice Cues Muted' : 'Voice Cues Active'}
                    >
                      {!isVoiceMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Central Stage: Pulsing Sound Waveform & Gigantic Countdown */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 py-2">
                  {/* Concentric Animated Sound Rings */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`absolute w-36 h-36 rounded-full border border-lime-400/30 transition-all duration-700 ${
                        isVoiceSpeaking || isTimerRunning ? 'scale-110 opacity-70 animate-ping' : 'scale-100 opacity-20'
                      }`}
                    />
                    <div className="w-28 h-28 rounded-full bg-slate-900 border-2 border-lime-400/40 flex flex-col items-center justify-center shadow-xl shadow-lime-400/10">
                      <Headphones className={`w-8 h-8 text-lime-400 ${isVoiceSpeaking ? 'animate-bounce' : ''}`} />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-lime-300 mt-1">
                        {isVoiceSpeaking ? 'Speaking' : 'Listening'}
                      </span>
                    </div>
                  </div>

                  {/* Gigantic High-Contrast Countdown Timer */}
                  <div className="space-y-1">
                    <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
                      {secondsRemaining}
                      <span className="text-2xl sm:text-3xl font-bold text-lime-400 ml-1">s</span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-white tracking-wide">
                      {currentExercise.name}
                    </div>
                  </div>

                  {/* Dynamic Audio Visualizer Bars */}
                  <div className="flex items-center gap-1.5 h-8">
                    {[16, 24, 32, 20, 28, 14, 26, 30, 22, 18, 28, 20].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isVoiceSpeaking || (isTimerRunning && secondsRemaining % 2 === 0)
                            ? 'bg-lime-400 animate-pulse'
                            : 'bg-slate-700'
                        }`}
                        style={{
                          height: isVoiceSpeaking ? `${h}px` : isTimerRunning ? `${Math.max(8, h * 0.5)}px` : '6px'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Spoken Narration Transcript & Voice Cue Bubble */}
                <div className="relative z-10 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-lime-400">
                      <Mic className="w-3.5 h-3.5" />
                      <span>Verbal Cue Transcript</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleReplayVoiceCues}
                      className="text-[11px] font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Repeat Cues</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{spokenTranscript || currentExercise.instructions}"
                  </p>

                  {/* Target Joints */}
                  {currentExercise.targetJoints && currentExercise.targetJoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Target:</span>
                      {currentExercise.targetJoints.map((joint) => (
                        <span
                          key={joint}
                          className="text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md"
                        >
                          {joint}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleToggleTimer}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                </button>

                {currentExerciseIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePreviousExercise}
                    className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold"
                  >
                    Previous
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextExercise}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Next Move</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCompleteGuidedWarmup}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-lime-400/20 transition-all hover:scale-102"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Warm-Up & Start Workout →</span>
              </button>
            </div>
          </div>
        ) : (
          /* Selection Screen: Pick recommended sequence or skip */
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select 3-5 Minute Mobility Routine:
              </div>

              <div className="grid grid-cols-1 gap-3">
                {WARMUP_ROUTINES.map((routine) => {
                  const isSelected = selectedRoutine.id === routine.id;
                  const isBestMatch = routine.id === recommended.id;
                  return (
                    <div
                      key={routine.id}
                      onClick={() => setSelectedRoutine(routine)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-lime-400/10 border-lime-400 text-slate-900 dark:text-white shadow-md shadow-lime-400/10'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{routine.title}</h4>
                          {isBestMatch && (
                            <span className="px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 text-[10px] font-black uppercase">
                              Recommended for {plan.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-snug">{routine.description}</p>
                        <div className="text-[11px] text-slate-500 pt-1">
                          {routine.exercises.map((e) => e.name).join(' • ')}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1">
                        <span className="text-xs font-black text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-xl">
                          ~{routine.totalDurationMinutes} mins
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {routine.exercises.length} movements
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Sequence Preview */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                Sequence Moves for {selectedRoutine.title}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedRoutine.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/80"
                  >
                    <span className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">
                        {ex.name} ({ex.durationSeconds}s)
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{ex.instructions}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Start Guided (Visual vs Audio-Only) vs Skip */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onSkipToWorkout}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors text-center"
              >
                Skip Warm-Up & Start Workout
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Direct Audio-Only Mode Entry */}
                <button
                  type="button"
                  onClick={() => handleStartGuided('audio')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-lime-400/30 text-lime-300 font-bold text-xs shadow-md transition-all hover:scale-102"
                  title="Follow along with voice cues without watching the screen"
                >
                  <Headphones className="w-4 h-4 text-lime-400" />
                  <span>Audio-Only Mode</span>
                </button>

                {/* Standard Visual Mode Entry */}
                <button
                  type="button"
                  onClick={() => handleStartGuided('visual')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-lime-400/25 transition-all hover:scale-102"
                >
                  <span>Start Visual Coach</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
