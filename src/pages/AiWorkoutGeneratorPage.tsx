import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutPlan,
  FitnessGoal,
  ExperienceLevel,
  MoodType,
  ExerciseCategory
} from '../types';
import {
  aiWorkoutService,
  AiWorkoutParameters,
  AiGeneratedRoutine
} from '../services/aiWorkoutService';
import {
  Sparkles,
  Bot,
  Play,
  Clock,
  Flame,
  CheckCircle2,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Copy,
  Info,
  ChevronRight,
  Shield,
  Zap,
  Sliders,
  Dumbbell,
  Heart,
  ChevronDown,
  Trash2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiWorkoutGeneratorPageProps {
  userProfile: UserProfile | null;
  onStartWorkout: (plan: WorkoutPlan) => void;
  onNavigateToExercises?: () => void;
}

export const AiWorkoutGeneratorPage: React.FC<AiWorkoutGeneratorPageProps> = ({
  userProfile,
  onStartWorkout
}) => {
  const userId = userProfile?.id || 'guest';
  const userName = userProfile?.name || 'Athlete';

  // Generator form state initialized from profile
  const [goal, setGoal] = useState<FitnessGoal>(userProfile?.fitnessGoal || 'general_fitness');
  const [availableTime, setAvailableTime] = useState<number>(userProfile?.workoutDurationMinutes || 15);
  const [fitnessLevel, setFitnessLevel] = useState<ExperienceLevel>(userProfile?.experienceLevel || 'beginner');
  const [focusArea, setFocusArea] = useState<ExerciseCategory>('full_body');
  const [equipment, setEquipment] = useState<string>(userProfile?.equipment || 'none');
  const [mood, setMood] = useState<MoodType>('normal');
  const [limitationsText, setLimitationsText] = useState<string>(userProfile?.limitations || '');
  const [selectedQuickLimitations, setSelectedQuickLimitations] = useState<string[]>([]);

  // Generation status state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [currentRoutine, setCurrentRoutine] = useState<AiGeneratedRoutine | null>(null);
  const [savedRoutines, setSavedRoutines] = useState<AiGeneratedRoutine[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'saved'>('generator');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Load saved routines on mount
  useEffect(() => {
    const list = aiWorkoutService.getSavedRoutines(userId);
    setSavedRoutines(list);
  }, [userId]);

  // Sync with profile if updated
  const handleSyncWithProfile = () => {
    if (userProfile) {
      if (userProfile.fitnessGoal) setGoal(userProfile.fitnessGoal);
      if (userProfile.workoutDurationMinutes) setAvailableTime(userProfile.workoutDurationMinutes);
      if (userProfile.experienceLevel) setFitnessLevel(userProfile.experienceLevel);
      if (userProfile.limitations) setLimitationsText(userProfile.limitations);
      if (userProfile.equipment) setEquipment(userProfile.equipment);
    }
  };

  // Quick limitation toggles
  const quickLimitations = [
    'Wrist-Friendly (No floor pressure)',
    'Knee-Friendly (Low impact)',
    'No Jumping (Quiet home)',
    'Lower Back Safe',
    'Neck & Shoulder Gentle'
  ];

  const toggleQuickLimitation = (item: string) => {
    if (selectedQuickLimitations.includes(item)) {
      setSelectedQuickLimitations(selectedQuickLimitations.filter((i) => i !== item));
    } else {
      setSelectedQuickLimitations([...selectedQuickLimitations, item]);
    }
  };

  // Generate routine with animated progressive loading steps
  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    setGenerationStep(1);
    setIsSaved(false);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 700);

    const combinedLimitations = [
      ...selectedQuickLimitations,
      limitationsText.trim()
    ]
      .filter(Boolean)
      .join(', ');

    const params: AiWorkoutParameters = {
      goal,
      availableTime,
      fitnessLevel,
      limitations: combinedLimitations,
      focusArea: focusArea as any,
      equipment,
      mood,
      userName
    };

    try {
      const result = await aiWorkoutService.generateRoutine(params);
      clearInterval(stepInterval);
      setGenerationStep(3);

      setTimeout(() => {
        setCurrentRoutine(result.routine);
        setIsGenerating(false);

        // Confetti celebration for AI routine ready
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      console.error('Error generating routine:', err);
    }
  };

  // Start workout now
  const handleStartWorkout = (routineToStart: AiGeneratedRoutine) => {
    const workoutPlan = aiWorkoutService.convertToWorkoutPlan(routineToStart);
    onStartWorkout(workoutPlan);
  };

  // Save routine
  const handleSaveRoutine = (routineToSave: AiGeneratedRoutine) => {
    aiWorkoutService.saveRoutineToLocal(userId, routineToSave);
    setIsSaved(true);
    setSavedRoutines(aiWorkoutService.getSavedRoutines(userId));
  };

  // Delete saved routine
  const handleDeleteSavedRoutine = (routineId: string) => {
    aiWorkoutService.deleteSavedRoutine(userId, routineId);
    setSavedRoutines(aiWorkoutService.getSavedRoutines(userId));
  };

  // Copy routine text to clipboard
  const handleCopyRoutine = () => {
    if (!currentRoutine) return;
    const text = `FitMood AI Workout: ${currentRoutine.title}
Duration: ${currentRoutine.durationMinutes} min | Caloric Burn: ~${currentRoutine.estimatedCaloriesBurned} kcal
Focus: ${currentRoutine.category.toUpperCase()} | Level: ${currentRoutine.difficulty}

WARM-UP:
${currentRoutine.warmUp.map((w) => `• ${w}`).join('\n')}

MAIN CIRCUIT:
${currentRoutine.exercises
  .map(
    (ex, i) =>
      `${i + 1}. ${ex.exerciseName} — ${ex.sets} sets × ${ex.repsOrSeconds} (Rest: ${ex.restSeconds}s)\n   Target: ${ex.targetMuscle}\n   Form Cue: ${ex.coachingCue}`
  )
  .join('\n\n')}

COOL-DOWN:
${currentRoutine.coolDown.map((c) => `• ${c}`).join('\n')}

AI Coach Tip: ${currentRoutine.coachTip}`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-lime-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Gemini 3.8 Flash</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              AI Workout Architect
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Generate custom, sports-science backed calisthenics routines tailored to your exact available minutes, fitness level, target muscles, and physical limitations.
            </p>
          </div>

          {/* Quick Stats & Navigation */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-2xl">
              <Bot className="w-4 h-4 text-lime-400" />
              <span className="text-xs font-semibold text-slate-300">
                Hi, <strong className="text-white">{userName}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === 'generator'
                    ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Generator
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'saved'
                    ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Saved</span>
                {savedRoutines.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-lime-400 text-[10px] font-black flex items-center justify-center">
                    {savedRoutines.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'saved' ? (
        /* Saved Routines View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">My Saved AI Routines</h2>
            <button
              onClick={() => setActiveTab('generator')}
              className="text-xs font-bold text-lime-400 hover:underline"
            >
              + Create New Routine
            </button>
          </div>

          {savedRoutines.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Saved AI Routines Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Generate a custom routine with Gemini and click "Save Routine" to store it here for one-click access!
              </p>
              <button
                onClick={() => setActiveTab('generator')}
                className="mt-2 px-5 py-2.5 rounded-2xl bg-lime-400 text-slate-950 text-xs font-black shadow-lg shadow-lime-400/20"
              >
                Build My First Routine
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20">
                        {routine.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                        <span>{routine.durationMinutes} min</span>
                        <span>•</span>
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        <span>~{routine.estimatedCaloriesBurned} kcal</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white">{routine.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{routine.description}</p>

                    {/* Exercises count */}
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <strong>{routine.exercises.length} Exercises:</strong>{' '}
                      {routine.exercises.map((e) => e.exerciseName).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleDeleteSavedRoutine(routine.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete saved routine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleStartWorkout(routine)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Start Workout</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Generator & Form View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Form Controls (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-lime-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Routine Parameters
                  </h3>
                </div>
                <button
                  onClick={handleSyncWithProfile}
                  className="text-[11px] font-bold text-lime-400 hover:underline flex items-center gap-1"
                  title="Load defaults from your profile"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Sync Profile</span>
                </button>
              </div>

              {/* 1. Available Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <label className="text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-lime-400" />
                    <span>Available Time</span>
                  </label>
                  <span className="text-lime-400 font-mono text-sm font-black">
                    {availableTime} mins
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[10, 15, 20, 30, 45].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAvailableTime(t)}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                        availableTime === t
                          ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}m
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Fitness Experience Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Fitness Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beginner', label: 'Beginner', desc: 'Joint Safe' },
                    { id: 'intermediate', label: 'Intermediate', desc: 'Standard' },
                    { id: 'advanced', label: 'Advanced', desc: 'High Tempo' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setFitnessLevel(lvl.id as ExperienceLevel)}
                      className={`p-2.5 rounded-2xl text-center border transition-all ${
                        fitnessLevel === lvl.id
                          ? 'bg-lime-400/10 border-lime-400/40 text-lime-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-black">{lvl.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Primary Fitness Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Primary Fitness Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'build_muscle', label: 'Build Muscle', icon: Dumbbell },
                    { id: 'lose_fat', label: 'Burn Fat & Tone', icon: Flame },
                    { id: 'strength', label: 'Core Strength', icon: Shield },
                    { id: 'general_fitness', label: 'General Fitness', icon: Zap }
                  ].map((g) => {
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id as FitnessGoal)}
                        className={`flex items-center gap-2 p-2.5 rounded-2xl text-left border transition-all ${
                          goal === g.id
                            ? 'bg-lime-400/10 border-lime-400/40 text-lime-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-bold">{g.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Target Focus Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Muscle & Movement Focus
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'full_body', label: 'Full Body Ignition' },
                    { id: 'upper', label: 'Upper Push & Pull' },
                    { id: 'lower', label: 'Lower Body & Glutes' },
                    { id: 'core', label: 'Core Fortress' },
                    { id: 'mobility', label: 'Mobility & Posture' },
                    { id: 'recovery', label: 'Gentle Recovery' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFocusArea(f.id as ExerciseCategory)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        focusArea === f.id
                          ? 'bg-lime-400/10 border-lime-400/40 text-lime-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Physical Limitations / Joint Cares */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-lime-400" />
                  <span>Safety & Joint Modifications</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickLimitations.map((item) => {
                    const isSelected = selectedQuickLimitations.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleQuickLimitation(item)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-amber-400/15 border-amber-400/40 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={limitationsText}
                  onChange={(e) => setLimitationsText(e.target.value)}
                  placeholder="Other notes (e.g. sore right knee, no equipment)..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-lime-400 text-white text-xs rounded-xl px-3 py-2 outline-none mt-1"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateWorkout}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-2xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-lime-400/25 transition-all transform active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini is Crafting Routine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Custom Routine with Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: AI Result Presentation (7 cols on lg) */}
          <div className="lg:col-span-7">
            {isGenerating ? (
              /* Loading State */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[460px]">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 animate-pulse">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 rounded-full animate-ping"></div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-lg font-black text-white">
                    Architecting Your Routine
                  </h3>
                  <p className="text-xs text-slate-400">
                    Applying calisthenics biomechanics and progressive overload algorithms...
                  </p>
                </div>

                {/* Stepper */}
                <div className="space-y-2 w-full max-w-xs text-left">
                  {[
                    'Analyzing joint angles & muscle fatigue limits...',
                    'Calibrating sets, reps, and recovery intervals...',
                    'Generating actionable form cues & alternatives...'
                  ].map((stepText, idx) => {
                    const stepNum = idx + 1;
                    const isDone = generationStep > stepNum;
                    const isCurrent = generationStep === stepNum;
                    return (
                      <div
                        key={stepText}
                        className={`flex items-center gap-2.5 text-xs ${
                          isDone
                            ? 'text-lime-400'
                            : isCurrent
                            ? 'text-white font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-lime-400" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-lime-400 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span>{stepText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : currentRoutine ? (
              /* Generated Routine Display */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
                {/* Routine Hero Title & Metrics */}
                <div className="space-y-3 pb-5 border-b border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400 text-xs font-black uppercase tracking-wider">
                        {currentRoutine.category.replace('_', ' ')}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold capitalize">
                        {currentRoutine.difficulty}
                      </span>
                    </div>

                    {/* Calorie & Duration Pills */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-bold">
                        <Flame className="w-3.5 h-3.5" />
                        <span>~{currentRoutine.estimatedCaloriesBurned} kcal</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                        <span>{currentRoutine.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {currentRoutine.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                      {currentRoutine.description}
                    </p>
                  </div>

                  {/* Muscle Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentRoutine.targetMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="text-[11px] font-semibold bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Coach Insight / Why this routine */}
                <div className="bg-slate-950/70 border border-lime-400/20 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Coach Insight</span>
                      <span className="text-[10px] text-lime-400 font-normal">Personalized</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {currentRoutine.recommendationReason}
                    </p>
                    <p className="text-slate-400 text-[11px] italic pt-1 border-t border-slate-900">
                      "{currentRoutine.coachTip}"
                    </p>
                  </div>
                </div>

                {/* Dynamic Warm-Up Preview */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-lime-400" />
                      <span>Dynamic Warm-Up (3 mins)</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Joint Pre-Activation</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    {currentRoutine.warmUp.map((w, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                        <span className="truncate">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Calisthenics Circuit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200 uppercase tracking-wider text-[11px]">
                      Main Circuit ({currentRoutine.exercises.length} Movements)
                    </span>
                    <span className="text-slate-400 text-[11px]">Click movement for cues</span>
                  </div>

                  <div className="space-y-2.5">
                    {currentRoutine.exercises.map((ex, index) => {
                      const isExpanded = expandedExerciseId === ex.exerciseId || expandedExerciseId === String(index);
                      return (
                        <div
                          key={index}
                          className="bg-slate-950 border border-slate-800 rounded-2xl p-4 transition-all hover:border-slate-700"
                        >
                          <div
                            onClick={() =>
                              setExpandedExerciseId(isExpanded ? null : ex.exerciseId || String(index))
                            }
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-slate-800 text-lime-400 font-mono text-xs font-black flex items-center justify-center">
                                {index + 1}
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-white">{ex.exerciseName}</h4>
                                <span className="text-[11px] text-slate-400">{ex.targetMuscle}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-xs font-black text-lime-400">
                                  {ex.sets} sets × {ex.repsOrSeconds}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Rest: {ex.restSeconds}s
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform ${
                                  isExpanded ? 'rotate-180 text-lime-400' : ''
                                }`}
                              />
                            </div>
                          </div>

                          {/* Expanded Coaching Cues & Form Alternative */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs animate-in fade-in">
                              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                                <strong className="text-lime-400 block mb-0.5">Form Execution Cue:</strong>
                                {ex.coachingCue}
                              </div>
                              {ex.beginnerAlternative && (
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-400">
                                  <strong className="text-amber-400 block mb-0.5">Easier Regression:</strong>
                                  {ex.beginnerAlternative}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cool-Down Preview */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-sky-400" />
                      <span>Post-Workout Decompression & Stretches</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Parasympathetic Reset</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    {currentRoutine.coolDown.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleStartWorkout(currentRoutine)}
                    className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-lime-400/25 transition-transform active:scale-[0.98]"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Start Workout Now</span>
                  </button>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => handleSaveRoutine(currentRoutine)}
                      className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        isSaved
                          ? 'bg-lime-400/15 border-lime-400/40 text-lime-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-lime-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span>{isSaved ? 'Saved' : 'Save Routine'}</span>
                    </button>

                    <button
                      onClick={handleCopyRoutine}
                      className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copySuccess ? 'Copied!' : 'Copy Plan'}</span>
                    </button>

                    <button
                      onClick={handleGenerateWorkout}
                      className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-Generate</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Initial State */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[460px]">
                <div className="w-16 h-16 rounded-3xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-black text-white">
                    Ready to Generate Your Personalized Routine
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select your available time, fitness level, and target focus on the left, then click{' '}
                    <strong className="text-lime-400 font-bold">Generate Custom Routine</strong> to have Gemini create a scientifically tailored workout plan!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
