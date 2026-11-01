import React, { useState, useMemo } from 'react';
import {
  UserProfile,
  MoodType,
  WorkoutPlan,
  WorkoutLog,
  DailyChallenge,
  MoodCheckIn
} from '../types';
import { NavPageId } from '../components/Sidebar';
import { WORKOUT_PLANS } from '../data/workoutPlansData';
import { calculateLevelFromXP, getPlantStage } from '../data/badgesData';
import {
  getUserAvailableEquipment,
  getRecommendedWorkoutForUser,
  getPlanEquipmentSummary,
  EQUIPMENT_LABELS
} from '../utils/equipmentFilter';
import {
  Play,
  Smile,
  Utensils,
  TrendingUp,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  Award,
  Bot,
  Clock,
  Dumbbell,
  ShieldCheck,
  Zap,
  Activity,
  Heart,
  Mic,
  Video
} from 'lucide-react';
import { SocialLeaderboard } from '../components/SocialLeaderboard';
import { CalorieMeter } from '../components/CalorieMeter';
import { WaterTrackerCard } from '../components/WaterTrackerCard';
import { VideoReviewStudioModal } from '../components/VideoReviewStudioModal';

interface DashboardPageProps {
  userProfile: UserProfile | null;
  onNavigate: (page: NavPageId) => void;
  onStartWorkout: (plan: WorkoutPlan) => void;
  workoutLogs: WorkoutLog[];
  todayMood: MoodType | null;
  dailyChallenges: DailyChallenge[];
  onToggleChallenge: (challengeId: string) => void;
  onOpenOnboarding: () => void;
  onOpenAiCoach?: () => void;
  onOpenVoiceCoach?: () => void;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onSaveMoodCheckIn?: (checkIn: MoodCheckIn, recommendedPlan: WorkoutPlan | null) => void;
}

const WORKOUT_HERO_IMAGES: Record<string, string> = {
  'full-body-beginner': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
  'quick-5min-spark': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  'stress-relief-mobility': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  'upper-body-power': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
  'lower-body-tone': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
  'core-fortress': 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1200&q=80',
  'resistance-bands-fullbody': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80',
  'dumbbells-upper-strength': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  'dumbbells-lower-rdl': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
  'pullup-bar-calisthenics': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1200&q=80',
  'cardio-hiit-burn': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=80',
  'rest-and-relaxation': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userProfile,
  onNavigate,
  onStartWorkout,
  workoutLogs,
  todayMood,
  dailyChallenges,
  onToggleChallenge,
  onOpenOnboarding,
  onOpenAiCoach,
  onOpenVoiceCoach,
  onUpdateProfile,
  onSaveMoodCheckIn
}) => {
  const isProfileIncomplete = !userProfile || !userProfile.name;
  const [isReviewStudioOpen, setIsReviewStudioOpen] = useState<boolean>(false);

  // Equipment normalization
  const userEquipment = useMemo(() => {
    return getUserAvailableEquipment(userProfile);
  }, [userProfile]);

  // Today's recommended workout strictly adapting to equipment, mood, and goal
  const { recommendedPlan, matchReason, compatibleCount } = useMemo(() => {
    return getRecommendedWorkoutForUser(WORKOUT_PLANS, userProfile, todayMood);
  }, [userProfile, todayMood]);

  const planEquipmentInfo = useMemo(() => {
    return getPlanEquipmentSummary(recommendedPlan, userEquipment);
  }, [recommendedPlan, userEquipment]);

  // XP, plant companion, and level calculations
  const xp = userProfile?.xp || 0;
  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevelFromXP(xp);
  const plant = getPlantStage(xp);

  // Time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Today's workout activity stats
  const todayDateString = new Date().toISOString().slice(0, 10);
  const todayWorkouts = workoutLogs.filter((w) => w.completedAt?.startsWith(todayDateString));
  const todayCaloriesBurned = todayWorkouts.reduce((sum, w) => {
    const burned = Math.round(w.durationMinutes * ((userProfile?.weightKg || 70) / 70) * 6.5);
    return sum + burned;
  }, 0);
  const todayActiveMinutes = todayWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

  // Weekly workouts completed
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyCompleted = workoutLogs.filter((w) => new Date(w.completedAt) >= oneWeekAgo);

  // 7-day activity week calendar
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const isToday = i === 0;
      const count = workoutLogs.filter((w) => w.completedAt?.startsWith(iso)).length;
      days.push({
        date: d,
        iso,
        dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        dayNum: d.getDate(),
        isToday,
        hasWorkout: count > 0,
        count
      });
    }
    return days;
  }, [workoutLogs]);

  // Quick mood check-in handler
  const handleQuickMoodCheckIn = (mood: MoodType) => {
    if (onSaveMoodCheckIn) {
      const newCheckIn: MoodCheckIn = {
        id: `mood_${Date.now()}`,
        userId: userProfile?.id || 'guest',
        mood,
        note: 'Quick check-in from dashboard',
        isRestDay: mood === 'tired' || mood === 'low_motivation',
        workoutRecommendedId: recommendedPlan.id,
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().slice(0, 10)
      };
      onSaveMoodCheckIn(newCheckIn, recommendedPlan);
    } else {
      onNavigate('mood');
    }
  };

  const MOOD_OPTIONS: { id: MoodType; emoji: string; label: string }[] = [
    { id: 'energetic', emoji: '⚡', label: 'Energetic' },
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'normal', emoji: '😌', label: 'Balanced' },
    { id: 'tired', emoji: '🥱', label: 'Tired' },
    { id: 'stressed', emoji: '😮‍💨', label: 'Stressed' },
    { id: 'low_motivation', emoji: '🛋️', label: 'Low Motivation' }
  ];

  // Calculated progress values for smooth animated meters
  const completedQuestsCount = dailyChallenges.filter((q) => q.isCompleted).length;
  const questsPercent = dailyChallenges.length > 0
    ? Math.round((completedQuestsCount / dailyChallenges.length) * 100)
    : 0;
  const levelProgress = Math.round(xp % 100);

  const heroImage = WORKOUT_HERO_IMAGES[recommendedPlan.id] || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Onboarding Notice for Incomplete Profiles */}
      {isProfileIncomplete && (
        <div className="bg-gradient-to-r from-amber-500/20 via-lime-500/10 to-transparent border border-amber-500/30 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-white text-base">
                Set up your personal fitness equipment & goals
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Tell FitMood what gear you own so your workouts 100% adapt to your home setup.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenOnboarding}
            className="px-5 py-2.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-lime-400/20 whitespace-nowrap transition-transform hover:scale-102 cursor-pointer"
          >
            Personalize Profile Now
          </button>
        </div>
      )}

      {/* Top Welcome Bar & Streak Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-lime-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {greeting}, {userProfile?.name || 'Athlete'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {todayWorkouts.length > 0
              ? 'Great job moving today! Keep up the momentum or take time to stretch.'
              : 'Ready for today’s movement session? Move your body, boost your mind.'}
          </p>
        </div>

        {/* Top Badges (Streak & Plant Companion) */}
        <div className="flex items-center gap-3">
          {/* Streak Flame Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Streak</div>
              <div className="text-xs font-black text-white">
                {userProfile?.streakDays || 1} Day{userProfile?.streakDays === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {/* Plant Companion Growth with Level Progress Bar */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="text-2xl">{plant.emoji}</div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{plant.stageName}</span>
                <span className="text-[10px] font-bold text-lime-400 bg-lime-400/10 px-1.5 py-0.2 rounded">
                  Lv. {level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-lime-400 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onStartWorkout(recommendedPlan)}
          className="flex items-center gap-3 p-3.5 rounded-2xl btn-primary transition-all hover:scale-102 cursor-pointer group shadow-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-left">
            <div className="leading-tight font-black text-xs sm:text-sm">Start Workout</div>
            <div className="text-[10px] opacity-80 font-bold">Of the Day</div>
          </div>
        </button>

        <button
          onClick={() => {
            if (onOpenVoiceCoach) onOpenVoiceCoach();
            else if (onOpenAiCoach) onOpenAiCoach();
            else onNavigate('coach');
          }}
          className="flex items-center gap-3 p-3.5 rounded-2xl btn-secondary transition-all hover:scale-102 cursor-pointer shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-500 border border-orange-500/30 flex items-center justify-center shrink-0">
            <Mic className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="leading-tight font-bold text-xs sm:text-sm">Voice Coach</div>
            <div className="text-[10px] text-orange-500 font-bold">Live Spoken AI</div>
          </div>
        </button>

        <button
          onClick={() => {
            if (onOpenAiCoach) onOpenAiCoach();
            else onNavigate('coach');
          }}
          className="flex items-center gap-3 p-3.5 rounded-2xl btn-secondary transition-all hover:scale-102 cursor-pointer shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-lime-500/15 text-lime-600 dark:text-lime-400 border border-lime-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="leading-tight font-bold text-xs sm:text-sm">AI Coach</div>
            <div className="text-[10px] text-lime-600 dark:text-lime-400 font-bold">Milo Chat</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('foodlog')}
          className="flex items-center gap-3 p-3.5 rounded-2xl btn-secondary transition-all hover:scale-102 cursor-pointer shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="leading-tight font-bold text-xs sm:text-sm">Log Food</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Daily Meals</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('generator')}
          className="flex items-center gap-3 p-3.5 rounded-2xl btn-secondary transition-all hover:scale-102 cursor-pointer shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="leading-tight font-bold text-xs sm:text-sm">AI Generator</div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Custom Routines</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('progress')}
          className="flex items-center gap-3 p-3.5 rounded-2xl btn-secondary transition-all hover:scale-102 cursor-pointer shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="leading-tight font-bold text-xs sm:text-sm">Progress</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Body Stats</div>
          </div>
        </button>
      </div>

      {/* Mood & Energy Check-In Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-sky-400" />
              <span>Today’s Mood & Energy Check-in</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select how you feel right now. FitMood instantly adjusts the workout intensity and duration to protect your nervous system.
            </p>
          </div>

          {/* Quick Mood Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {MOOD_OPTIONS.map((m) => {
              const isSelected = todayMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleQuickMoodCheckIn(m.id)}
                  className={`px-3 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-md shadow-lime-400/20'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{m.emoji}</span>
                  <span>{m.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Workout of the Day + Right Column Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Workout of the Day (Equipment-Adaptive) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Hero Image Header */}
            <div className="relative h-60 sm:h-72 overflow-hidden">
              <img
                src={heroImage}
                alt={recommendedPlan.title}
                className="w-full h-full object-cover brightness-75 scale-100 hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                <span className="px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-lime-400/40 text-lime-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Workout of the Day</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-bold capitalize">
                  {recommendedPlan.difficulty} • {recommendedPlan.category.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Duration Overlay */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-lime-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
                    <Clock className="w-3.5 h-3.5" />
                    {recommendedPlan.durationMinutes} Minutes
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-slate-300 text-xs font-semibold">
                    {recommendedPlan.exercises.length} Exercises
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  {recommendedPlan.title}
                </h2>
              </div>
            </div>

            {/* Workout Details & Equipment Verification */}
            <div className="p-6 sm:p-7 space-y-5">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {recommendedPlan.description}
              </p>

              {/* Equipment Verification Badge */}
              <div className="p-3.5 rounded-2xl bg-lime-400/10 border border-lime-400/25 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                <div className="text-xs text-lime-300">
                  <div className="font-extrabold text-lime-400">
                    Verified for Your Equipment:
                  </div>
                  <div className="text-slate-300 mt-0.5">
                    {planEquipmentInfo.summaryText}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 italic">
                    {matchReason}
                  </div>
                </div>
              </div>

              {/* Included Exercises Previews */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Circuit Breakdown ({recommendedPlan.exercises.length} Movements):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedPlan.exercises.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white capitalize">
                          {item.exerciseId.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {item.sets} × {item.repsOrSeconds}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warm-Up & Start Actions */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span>Includes dynamic warm-up with Coach Alex</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => onNavigate('workouts')}
                    className="px-4 py-3 rounded-2xl btn-secondary text-xs transition-colors cursor-pointer w-full sm:w-auto text-center"
                  >
                    Browse All ({compatibleCount} available)
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReviewStudioOpen(true)}
                    className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    title="Inspect AI Video Demonstrations & Google Gemini Prompts"
                  >
                    <Video className="w-3.5 h-3.5 text-lime-400" />
                    <span>Demo Lab</span>
                  </button>

                  <button
                    onClick={() => onStartWorkout(recommendedPlan)}
                    className="px-6 py-3.5 rounded-2xl btn-primary text-sm shadow-xl transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Session Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Quests & Habits */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-lime-400" />
                  <span>Daily Health Quests</span>
                </h3>
                <p className="text-xs text-slate-400">Check off daily habits to earn XP and level up</p>
              </div>
            </div>

            {/* Daily Quests Completion Progress Bar with Smooth Transition */}
            <div className="mb-4 p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Habit Completion:</span>
                <span className="text-lime-400 font-mono">
                  {completedQuestsCount} / {dailyChallenges.length} Done ({questsPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${questsPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {dailyChallenges.map((quest) => (
                <div
                  key={quest.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={quest.isCompleted}
                  onClick={() => onToggleChallenge(quest.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onToggleChallenge(quest.id);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                    quest.isCompleted
                      ? 'bg-lime-400/5 border-lime-400/25 opacity-75'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        quest.isCompleted ? 'bg-lime-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${quest.isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {quest.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{quest.description}</div>
                    </div>
                  </div>

                  <span className="text-xs font-black text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-lg shrink-0">
                    +{quest.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Progress, Calorie Meter, Activity */}
        <div className="space-y-6">
          {/* Daily Workout Progress Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-lime-400" />
                <span>Today's Progress</span>
              </span>
              <span className="text-[11px] font-mono text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-md font-bold">
                {todayWorkouts.length} Session{todayWorkouts.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Active Minutes</div>
                <div className="text-xl font-black text-white mt-1">
                  {todayActiveMinutes} <span className="text-xs text-slate-400 font-normal">min</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Exercise Burn</div>
                <div className="text-xl font-black text-lime-400 mt-1">
                  {todayCaloriesBurned} <span className="text-xs text-slate-400 font-normal">kcal</span>
                </div>
              </div>
            </div>

            {/* Daily Move Target Progress Bar with Smooth Transition */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Active Minutes Goal (30m target):</span>
                <span className="text-lime-400 font-mono">
                  {todayActiveMinutes} / 30 min ({Math.min(100, Math.round((todayActiveMinutes / 30) * 100))}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, Math.round((todayActiveMinutes / 30) * 100))}%` }}
                />
              </div>
            </div>

            {/* 7-Day Activity Calendar Ring */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 mb-2.5">
                Past 7 Days Consistency:
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {weekDays.map((day, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                      day.hasWorkout
                        ? 'bg-lime-400/15 border-lime-400/40 text-lime-300 font-bold'
                        : day.isToday
                        ? 'bg-slate-950 border-slate-700 text-white'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] uppercase">{day.dayName}</span>
                    <span className="text-xs font-mono font-bold mt-0.5">{day.dayNum}</span>
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        day.hasWorkout ? 'bg-lime-400 shadow-sm shadow-lime-400' : 'bg-transparent'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Simple Log Water Card (Daily Hydration Tracker) */}
          <WaterTrackerCard
            userId={userProfile?.id || 'guest'}
            onWaterLogged={(glassesCount) => {
              if (glassesCount >= 1 && onToggleChallenge) {
                const waterQuest = dailyChallenges.find((q) => q.id === 'dc-1');
                if (waterQuest && !waterQuest.isCompleted) {
                  onToggleChallenge('dc-1');
                }
              }
            }}
          />

          {/* Interactive Calorie Meter (Accurate & Functional) */}
          <CalorieMeter
            userProfile={userProfile}
            workoutLogs={workoutLogs}
            onUpdateProfile={onUpdateProfile}
          />
        </div>
      </div>

      {/* Social Leaderboard Section */}
      <SocialLeaderboard
        userProfile={userProfile}
        onOpenWorkouts={() => onNavigate('workouts')}
      />

      {/* Video Review & Gemini Generation Studio Modal */}
      <VideoReviewStudioModal
        isOpen={isReviewStudioOpen}
        onClose={() => setIsReviewStudioOpen(false)}
      />
    </div>
  );
};
