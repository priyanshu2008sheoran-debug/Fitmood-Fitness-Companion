import React, { useState, useEffect } from 'react';
import { WorkoutPlan, Exercise, WorkoutLog, UserProfile, Badge } from '../types';
import { EXERCISES_DATABASE } from '../data/exercisesData';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import { AiCartoonCoach } from './AiCartoonCoach';
import { MuscleMapDiagram } from './MuscleMapDiagram';
import {
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  RotateCcw,
  X,
  Sparkles,
  Flame,
  ChevronRight,
  RefreshCw,
  Info,
  Timer,
  AlertTriangle,
  Video,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Bot,
  HeartCrack,
  ThumbsUp,
  Trophy,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkoutPlayerModalProps {
  plan: WorkoutPlan;
  userId: string;
  userProfile?: UserProfile | null;
  onClose: () => void;
  onFinishWorkout: (log: WorkoutLog, xpEarned: number) => void;
  onOpenAiCoach?: () => void;
  onTriggerBadgeToast?: (badge: Badge, xp?: number) => void;
}

export type DemonstrationMode = 'cartoon' | 'video' | 'muscle_map';

export const WorkoutPlayerModal: React.FC<WorkoutPlayerModalProps> = ({
  plan,
  userId,
  userProfile,
  onClose,
  onFinishWorkout,
  onOpenAiCoach,
  onTriggerBadgeToast
}) => {
  const [phase, setPhase] = useState<'intro' | 'warmup' | 'active' | 'cooldown' | 'summary'>('intro');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [demoMode, setDemoMode] = useState<DemonstrationMode>('cartoon');
  const [isDemoFullscreen, setIsDemoFullscreen] = useState<boolean>(false);

  // Interactive Set State
  // 'performing' = active set in progress
  // 'feedback' = paused completion screen waiting for user response
  // 'resting' = rest period countdown
  const [setStatus, setSetStatus] = useState<'performing' | 'feedback' | 'resting'>('performing');
  const [restSecondsLeft, setRestSecondsLeft] = useState(30);
  const [isRestPaused, setIsRestPaused] = useState(false);

  // Track sets completed & skipped
  const [completedSetsTotal, setCompletedSetsTotal] = useState(0);
  const [skippedSetsTotal, setSkippedSetsTotal] = useState(0);
  const [userFeedbackLog, setUserFeedbackLog] = useState<string[]>([]);
  const [safetyStopAlert, setSafetyStopAlert] = useState<string | null>(null);

  // Custom adjusted targets per exercise (if user requested fewer reps or easier variation)
  const [customExerciseIds, setCustomExerciseIds] = useState<{ [index: number]: string }>({});
  const [customReps, setCustomReps] = useState<{ [index: number]: string }>({});
  const [showAllInstructions, setShowAllInstructions] = useState(false);

  // Target exercise info
  const currentExerciseItem = plan.exercises[exerciseIndex];
  const activeExerciseId = customExerciseIds[exerciseIndex] || currentExerciseItem?.exerciseId;
  const currentExerciseDetail =
    EXERCISES_DATABASE.find((e) => e.id === activeExerciseId) || EXERCISES_DATABASE[0];

  const nextExerciseItem = plan.exercises[exerciseIndex + 1];
  const nextExerciseDetail = nextExerciseItem
    ? EXERCISES_DATABASE.find((e) => e.id === nextExerciseItem.exerciseId)
    : null;

  const totalPrescribedSets = plan.exercises.reduce((sum, e) => sum + e.sets, 0);

  // Elapsed timer (stops when paused or in summary)
  useEffect(() => {
    if (isPaused || phase === 'summary') return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, phase]);

  // Rest countdown timer
  useEffect(() => {
    if (setStatus !== 'resting' || isRestPaused || isPaused) return;

    if (restSecondsLeft <= 0) {
      // Rest finished, prompt user to start next set
      setSetStatus('performing');
      return;
    }

    const interval = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          setSetStatus('performing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setStatus, restSecondsLeft, isRestPaused, isPaused]);

  // Reset exercise-specific toggles when advancing exercise
  useEffect(() => {
    setCurrentSet(1);
    setSetStatus('performing');
    setSafetyStopAlert(null);
  }, [exerciseIndex]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // User confirms set is complete -> Pause and show Completion Screen
  const handleMarkSetComplete = () => {
    setSetStatus('feedback');

    // If this is the very first set completed, award achievement badge toast
    if (completedSetsTotal === 0 && onTriggerBadgeToast) {
      onTriggerBadgeToast({
        id: 'first-set',
        title: 'First Set Completed',
        description: 'Completed your very first interactive set with Coach Milo!',
        iconName: 'CheckCircle2',
        isUnlocked: true
      }, 20);
    }
  };

  // Feedback Action 1: Done - Next Set
  const handleDoneNextSet = () => {
    setCompletedSetsTotal((prev) => prev + 1);
    const totalSets = currentExerciseItem.sets;

    if (currentSet < totalSets) {
      // Advance set & start rest timer
      setCurrentSet((prev) => prev + 1);
      const configuredRest = currentExerciseItem.restSeconds || 30;
      setRestSecondsLeft(configuredRest);
      setSetStatus('resting');
    } else {
      // All sets of this exercise complete!
      if (exerciseIndex + 1 < plan.exercises.length) {
        setExerciseIndex((prev) => prev + 1);
        const configuredRest = currentExerciseItem.restSeconds || 45;
        setRestSecondsLeft(configuredRest);
        setSetStatus('resting');
      } else {
        setPhase('cooldown');
      }
    }
  };

  // Feedback Action 2: That Was Difficult (Adaptation)
  const handleThatWasDifficult = () => {
    setUserFeedbackLog((prev) => [...prev, `${currentExerciseDetail.name} felt difficult`]);

    // Check if easier alternative is available
    if (currentExerciseDetail.easierAlternative) {
      // Offer easier regression
      const replacement = EXERCISES_DATABASE.find(
        (e) =>
          e.category === currentExerciseDetail.category &&
          e.id !== currentExerciseDetail.id &&
          e.difficulty === 'beginner'
      );
      if (replacement) {
        setCustomExerciseIds((prev) => ({ ...prev, [exerciseIndex]: replacement.id }));
      }
    }

    // Give extra rest
    setCompletedSetsTotal((prev) => prev + 1);
    const totalSets = currentExerciseItem.sets;
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      const configuredRest = (currentExerciseItem.restSeconds || 30) + 20; // +20s rest
      setRestSecondsLeft(configuredRest);
      setSetStatus('resting');
    } else {
      if (exerciseIndex + 1 < plan.exercises.length) {
        setExerciseIndex((prev) => prev + 1);
        setRestSecondsLeft(45);
        setSetStatus('resting');
      } else {
        setPhase('cooldown');
      }
    }
  };

  // Feedback Action 3: Show Me Again
  const handleShowMeAgain = () => {
    setDemoMode('cartoon');
    setSetStatus('performing');
  };

  // Feedback Action 4: I Need More Rest
  const handleNeedMoreRest = (addedSeconds = 20) => {
    setRestSecondsLeft((prev) => prev + addedSeconds);
    setSetStatus('resting');
  };

  // Feedback Action 5: Skip This Exercise (without false completion credit)
  const handleSkipExercise = () => {
    const uncompletedSets = currentExerciseItem.sets - currentSet + 1;
    setSkippedSetsTotal((prev) => prev + uncompletedSets);

    if (exerciseIndex + 1 < plan.exercises.length) {
      setExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
      setSetStatus('performing');
    } else {
      setPhase('cooldown');
    }
  };

  // Safety Feedback: Pain / Dizziness
  const handleReportPainOrDizziness = () => {
    setSafetyStopAlert(
      "Your health and safety come first! Stop this exercise immediately. Sit or lie down in a comfortable position, take slow sips of water, and rest. If pain, tightness, or dizziness persists, please consult a qualified healthcare professional."
    );
    setUserFeedbackLog((prev) => [...prev, 'Stopped due to discomfort/dizziness']);
  };

  // Final Workout Completion
  const handleFinishWorkoutSummary = () => {
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const xpReward = Math.round(completedSetsTotal * 20 + durationMinutes * 5 + 50);

    const log: WorkoutLog = {
      id: `wlog_${Date.now()}`,
      userId,
      planId: plan.id,
      planTitle: plan.title,
      durationMinutes,
      completedExercisesCount: Math.min(plan.exercises.length, Math.ceil(completedSetsTotal / 3)),
      prescribedSetsCount: totalPrescribedSets,
      completedSetsCount: completedSetsTotal,
      skippedExercisesCount: skippedSetsTotal > 0 ? 1 : 0,
      userFeedback: userFeedbackLog.join('; '),
      xpEarned: xpReward,
      date: new Date().toISOString().split('T')[0],
      completedAt: new Date().toISOString()
    };

    // Check Full Workout Badge
    if (completedSetsTotal >= 3 && onTriggerBadgeToast) {
      onTriggerBadgeToast({
        id: 'first-workout',
        title: 'First Full Workout',
        description: 'Finished your first complete interactive workout session with Coach Milo!',
        iconName: 'Award',
        isUnlocked: true
      }, 50);
    }

    try {
      confetti({ particleCount: 130, spread: 90, origin: { y: 0.6 } });
    } catch {
      // fallback
    }

    onFinishWorkout(log, xpReward);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all ${
        isDemoFullscreen
          ? 'p-0 m-0 overflow-hidden bg-slate-950'
          : 'p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto'
      }`}
    >
      <div
        className={`relative w-full bg-slate-900 border border-slate-800 text-slate-100 flex flex-col fixed-dark transition-all ${
          isDemoFullscreen
            ? 'w-screen h-[100dvh] max-w-none max-h-none rounded-none border-0 m-0 p-0 overflow-hidden'
            : 'max-w-4xl max-h-[94vh] rounded-3xl shadow-2xl overflow-hidden'
        }`}
      >
        {/* Header Bar */}
        {!isDemoFullscreen && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-lime-400/20">
                ⚡
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-lime-400 flex items-center gap-1.5">
                  <span>Interactive Workout Session</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-white truncate max-w-xs sm:max-w-md">
                  {plan.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Ask Gemini Coach Button */}
              {onOpenAiCoach && (
                <button
                  onClick={onOpenAiCoach}
                  title="Ask FitMood Gemini AI Coach"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-lime-400 border border-slate-700 text-xs font-bold transition-all"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask Coach</span>
                </button>
              )}

              {/* Timer Toggle */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? 'Resume Workout Timer' : 'Pause Workout Timer'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold transition-all ${
                  isPaused
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                {isPaused ? <Play className="w-3 h-3 fill-amber-300" /> : <Pause className="w-3 h-3" />}
                <span>{formatTime(elapsedSeconds)}</span>
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Exit workout"
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div
          className={`flex-1 flex flex-col ${
            isDemoFullscreen
              ? 'p-0 m-0 overflow-hidden min-h-0'
              : 'overflow-y-auto p-4 sm:p-6 space-y-5'
          }`}
        >
          {/* Phase 0: Intro Greeting from Cartoon Coach Milo */}
          {phase === 'intro' && (
            <div className="space-y-6 text-center py-4 sm:py-8 max-w-lg mx-auto">
              {/* Friendly Coach Milo Character Box */}
              <div className="max-w-xs mx-auto">
                <AiCartoonCoach
                  exercise={currentExerciseDetail}
                  userName={userProfile?.name}
                  isWorkoutIntro={true}
                  onSkipIntro={() => setPhase('active')}
                  onFullscreenChange={setIsDemoFullscreen}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  Ready to train, {userProfile?.name || 'Athlete'}?
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Coach Milo will guide you set-by-set with animated demonstrations, muscle targeting maps, and rest countdowns.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setPhase('warmup')}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold"
                >
                  Warm-Up Checklist
                </button>
                <button
                  onClick={() => setPhase('active')}
                  className="px-8 py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-lime-400/25 transition-transform hover:scale-102"
                >
                  Start Set 1 Now →
                </button>
              </div>
            </div>
          )}

          {/* Phase 1: Warmup */}
          {phase === 'warmup' && (
            <div className="space-y-6 text-center py-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center mx-auto text-2xl">
                🔥
              </div>
              <div>
                <h4 className="text-xl font-black text-white">Joint Mobility & Warm-Up</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Lubricate your shoulders, hips, and knees before starting Set 1.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-2">
                {plan.warmUp.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPhase('active')}
                className="px-8 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-lime-400/25 transition-transform hover:scale-102"
              >
                Let’s Begin First Exercise →
              </button>
            </div>
          )}

          {/* Phase 2: Active Multi-Set Workout */}
          {phase === 'active' && (
            <div className="space-y-5">
              {/* Progress Counters & Multi-Set Tracker */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">
                    Exercise {exerciseIndex + 1} of {plan.exercises.length}:
                  </span>
                  <span className="text-white font-extrabold">{currentExerciseDetail.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/20 font-mono">
                    Set {currentSet} of {currentExerciseItem.sets}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({completedSetsTotal}/{totalPrescribedSets} sets done)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/60">
                <div
                  className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${((exerciseIndex + (currentSet - 1) / currentExerciseItem.sets) / plan.exercises.length) * 100}%`
                  }}
                />
              </div>

              {/* Safety Stop Notice if User Reported Pain */}
              {safetyStopAlert && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500 text-rose-200 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-black text-rose-300 text-sm">
                    <ShieldCheck className="w-5 h-5 text-rose-400" />
                    <span>Safety Protection Alert</span>
                  </div>
                  <p className="leading-relaxed">{safetyStopAlert}</p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setPhase('cooldown')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      End Active Workout Safely
                    </button>
                    <button
                      onClick={() => setSafetyStopAlert(null)}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs"
                    >
                      Dismiss Alert
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-STATE A: REST PERIOD ----------------- */}
              {setStatus === 'resting' && (
                <div className="bg-slate-950 border border-lime-400/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 animate-subtle-pulse shadow-xl">
                  <div className="text-xs font-black uppercase tracking-wider text-lime-400 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-lime-400" />
                    <span>Rest & Recover — Breathe Through Your Diaphragm</span>
                  </div>

                  <div className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tight">
                    {restSecondsLeft}s
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    {currentSet <= currentExerciseItem.sets ? (
                      <>Next up: <strong>Set {currentSet}</strong> of {currentExerciseDetail.name}. Shake out your arms and legs!</>
                    ) : (
                      <>Next up: <strong>{nextExerciseDetail?.name || 'Cool Down'}</strong>. Catch your breath!</>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setIsRestPaused(!isRestPaused)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300"
                    >
                      {isRestPaused ? 'Resume Rest' : 'Pause Rest'}
                    </button>

                    <button
                      onClick={() => setRestSecondsLeft((prev) => prev + 15)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-lime-400 border border-slate-700"
                    >
                      +15s Rest
                    </button>

                    <button
                      onClick={() => setSetStatus('performing')}
                      className="px-6 py-2.5 rounded-xl bg-lime-400 text-slate-950 text-xs font-black shadow-md shadow-lime-400/20 hover:bg-lime-300 transition-all hover:scale-102"
                    >
                      Skip Rest & Start Set! →
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-STATE B: SET COMPLETION INTERACTIVE SCREEN ----------------- */}
              {setStatus === 'feedback' && (
                <div className="bg-slate-950 border-2 border-lime-400/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md shadow-lime-400/20">
                      ⚡
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-lime-400">
                        Set {currentSet} Completed
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        Great work! Have you completed this set?
                      </h4>
                    </div>
                  </div>

                  {/* 3 Core Functional Options Specified by User */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* 1. Yes, next set */}
                    <button
                      type="button"
                      onClick={handleDoneNextSet}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-lime-400/25 transition-all hover:scale-102 text-left cursor-pointer"
                    >
                      <CheckCircle className="w-6 h-6 shrink-0 stroke-[2.5]" />
                      <div>
                        <div>Yes, next set</div>
                        <div className="text-[10px] font-semibold text-slate-900/80">Confirm set & begin rest timer</div>
                      </div>
                    </button>

                    {/* 2. Repeat demonstration */}
                    <button
                      type="button"
                      onClick={handleShowMeAgain}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all hover:scale-102 text-left cursor-pointer"
                    >
                      <RotateCcw className="w-6 h-6 shrink-0 text-lime-400" />
                      <div>
                        <div>Repeat demonstration</div>
                        <div className="text-[10px] text-slate-400 font-normal">Replay movement & form cues</div>
                      </div>
                    </button>

                    {/* 3. Take a break */}
                    <button
                      type="button"
                      onClick={() => handleNeedMoreRest(45)}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all hover:scale-102 text-left cursor-pointer"
                    >
                      <Timer className="w-6 h-6 shrink-0 text-sky-400" />
                      <div>
                        <div>Take a break</div>
                        <div className="text-[10px] text-slate-400 font-normal">Add +45s recovery time</div>
                      </div>
                    </button>
                  </div>

                  {/* Secondary Adaptation & Safety Controls */}
                  <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleThatWasDifficult}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-300 font-medium text-left cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-[11px]">That Was Difficult (Adapt)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipExercise}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 font-medium text-left cursor-pointer"
                    >
                      <SkipForward className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-[11px]">Skip This Exercise</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReportPainOrDizziness}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium text-left cursor-pointer"
                    >
                      <HeartCrack className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-[11px]">I Feel Pain / Dizziness</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-STATE C: ACTIVE DEMONSTRATION & SET PERFORMING ----------------- */}
              {setStatus === 'performing' && (
                <div className={`space-y-4 ${isDemoFullscreen ? 'w-full h-full flex-1 min-h-0 flex flex-col !space-y-0' : ''}`}>
                  {/* Demonstration Switcher Tabs: Cartoon Coach, Verified Video, Muscles Map */}
                  {!isDemoFullscreen && (
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setDemoMode('cartoon')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            demoMode === 'cartoon'
                              ? 'bg-lime-400 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>⚡ 3D Coach Milo</span>
                        </button>

                        <button
                          onClick={() => setDemoMode('video')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            demoMode === 'video'
                              ? 'bg-lime-400 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Real Video Demo</span>
                        </button>

                        <button
                          onClick={() => setDemoMode('muscle_map')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            demoMode === 'muscle_map'
                              ? 'bg-lime-400 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Muscles Map</span>
                        </button>
                      </div>

                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        Target: <strong className="text-white">{customReps[exerciseIndex] || currentExerciseItem.repsOrSeconds}</strong>
                      </span>
                    </div>
                  )}

                  {/* Active Demonstration Component based on selected tab */}
                  <div className={isDemoFullscreen ? 'w-full h-full flex-1 min-h-0 flex flex-col' : 'grid grid-cols-1 lg:grid-cols-12 gap-5 items-start'}>
                    <div className={isDemoFullscreen ? 'w-full h-full flex-1 min-h-0 flex flex-col' : 'lg:col-span-7'}>
                      {demoMode === 'cartoon' && (
                        <AiCartoonCoach
                          exercise={currentExerciseDetail}
                          currentSet={currentSet}
                          totalSets={currentExerciseItem.sets}
                          repsOrTarget={customReps[exerciseIndex] || currentExerciseItem.repsOrSeconds}
                          userName={userProfile?.name}
                          onFullscreenChange={setIsDemoFullscreen}
                          className={isDemoFullscreen ? 'w-full h-full flex-1' : ''}
                        />
                      )}

                      {demoMode === 'video' && (
                        <ExerciseVideoPlayer
                          exercise={currentExerciseDetail}
                          currentSet={currentSet}
                          totalSets={currentExerciseItem.sets}
                          repsOrTarget={customReps[exerciseIndex] || currentExerciseItem.repsOrSeconds}
                          className={isDemoFullscreen ? 'w-full h-full flex-1' : 'shadow-xl'}
                          onFullscreenChange={setIsDemoFullscreen}
                        />
                      )}

                      {demoMode === 'muscle_map' && (
                        <MuscleMapDiagram
                          exercise={currentExerciseDetail}
                          className="shadow-xl"
                        />
                      )}

                      {/* Next Exercise Preview */}
                      {!isDemoFullscreen && nextExerciseDetail && (
                        <div className="mt-2.5 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                          <span className="text-[11px] font-semibold">
                            Up Next: <strong className="text-slate-200">{nextExerciseDetail.name}</strong>
                          </span>
                          <span className="text-[10px] text-lime-400 font-mono">
                            {nextExerciseItem.sets} sets × {nextExerciseItem.repsOrSeconds}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Exercise Target Pointers & Gemini Coach Assist */}
                    {!isDemoFullscreen && (
                      <div className="lg:col-span-5 space-y-3">
                        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-3.5">
                          {/* Muscle Targets */}
                          <div>
                            <div className="text-[10px] font-black uppercase text-lime-400 tracking-wider mb-1">
                              {currentExerciseDetail.category} Calisthenics
                            </div>
                            <h4 className="text-lg font-black text-white">{currentExerciseDetail.name}</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {currentExerciseDetail.targetMuscles.map((m, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Set, Target Reps, Rest stats */}
                          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                            <div>
                              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Set</div>
                              <div className="text-xs font-black text-lime-400 mt-0.5">
                                {currentSet} / {currentExerciseItem.sets}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Target</div>
                              <div className="text-xs font-black text-white mt-0.5 truncate">
                                {customReps[exerciseIndex] || currentExerciseItem.repsOrSeconds}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Rest</div>
                              <div className="text-xs font-black text-slate-300 mt-0.5">
                                {currentExerciseItem.restSeconds || 30}s
                              </div>
                            </div>
                          </div>

                          {/* Step Instructions */}
                          <div className="space-y-1.5 border-t border-slate-800/80 pt-2.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                Instructions:
                              </span>
                              {currentExerciseDetail.instructions.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => setShowAllInstructions(!showAllInstructions)}
                                  className="text-[10px] font-semibold text-lime-400 hover:underline flex items-center gap-0.5"
                                >
                                  <span>{showAllInstructions ? 'Show Less' : `All (${currentExerciseDetail.instructions.length})`}</span>
                                  {showAllInstructions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                            <ol className="space-y-1 list-decimal list-inside text-slate-400">
                              {(showAllInstructions
                                ? currentExerciseDetail.instructions
                                : currentExerciseDetail.instructions.slice(0, 2)
                              ).map((inst, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {inst}
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Quick Gemini In-Workout Assist Pills */}
                          {onOpenAiCoach && (
                            <div className="border-t border-slate-800/80 pt-2.5 space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <Bot className="w-3 h-3 text-lime-400" />
                                <span>Ask AI Coach about this exercise:</span>
                              </span>
                              <div className="flex flex-wrap gap-1">
                                <button
                                  onClick={onOpenAiCoach}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-300 text-left transition-colors"
                                >
                                  "Which muscles does this work?"
                                </button>
                                <button
                                  onClick={onOpenAiCoach}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-300 text-left transition-colors"
                                >
                                  "How do I make this easier?"
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accessible Set Actions Footer */}
                  {!isDemoFullscreen && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleThatWasDifficult}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
                          title="Swap to easier variation or decrease repetitions"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-lime-400" />
                          <span>Easier Variation</span>
                        </button>

                        <button
                          onClick={handleSkipExercise}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 text-xs font-semibold transition-colors"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                          <span>Skip Exercise</span>
                        </button>
                      </div>

                      <button
                        onClick={handleMarkSetComplete}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-lime-400/25 transition-all hover:scale-102"
                      >
                        <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                        <span>Finish Set {currentSet}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Phase 3: Cool Down */}
          {phase === 'cooldown' && (
            <div className="space-y-6 text-center py-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto text-3xl">
                🧘
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  Great Work! Time to Recover
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  You completed {completedSetsTotal} interactive sets. Let's finish with slow nasal breathing and gentle stretches.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Cool-Down & Stretches:
                </div>
                {plan.coolDown.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleFinishWorkoutSummary}
                className="px-8 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-lime-400/25 transition-transform hover:scale-102"
              >
                Claim XP & View Summary 🎉
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
