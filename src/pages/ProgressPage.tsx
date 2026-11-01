import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutLog,
  MoodCheckIn,
  BodyMeasurement,
  Badge
} from '../types';
import { calculateLevelFromXP, getPlantStage } from '../data/badgesData';
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Plus,
  Clock,
  Sparkles,
  Footprints,
  Dumbbell,
  HeartHandshake,
  UtensilsCrossed,
  Trophy,
  Smile,
  Download,
  Check,
  CheckCircle2,
  X,
  Zap,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';

interface ProgressPageProps {
  userProfile: UserProfile | null;
  workoutLogs: WorkoutLog[];
  moodCheckIns: MoodCheckIn[];
  measurements: BodyMeasurement[];
  badges: Badge[];
  onAddMeasurement: (item: BodyMeasurement) => void;
  onTriggerBadgeToast?: (badge: Badge, xp?: number) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  userProfile,
  workoutLogs,
  moodCheckIns,
  measurements,
  badges,
  onAddMeasurement,
  onTriggerBadgeToast
}) => {
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [note, setNote] = useState('');
  const [hasExported, setHasExported] = useState(false);
  const [chartMetric, setChartMetric] = useState<'both' | 'weight' | 'waist'>('both');

  // Interactive Workout Intensity & Mood Trends State
  const [trendTimeRange, setTrendTimeRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [trendMetricFilter, setTrendMetricFilter] = useState<'both' | 'intensity' | 'mood'>('both');

  // Dynamic Theme-Aware Chart Colors mapped directly to active FitMood CSS variables
  const [themeChartColors, setThemeChartColors] = useState({
    line1: '#ea580c',
    line2: '#f43f5e',
    line3: '#fb923c',
    grid: '#334155',
    tooltipBg: '#1e293b',
    tooltipText: '#ffffff'
  });

  useEffect(() => {
    const updateColors = () => {
      if (typeof window === 'undefined') return;
      const rootStyle = getComputedStyle(document.documentElement);
      const l1 = rootStyle.getPropertyValue('--app-chart-line-1').trim();
      const l2 = rootStyle.getPropertyValue('--app-chart-line-2').trim();
      const l3 = rootStyle.getPropertyValue('--app-chart-line-3').trim();
      const grid = rootStyle.getPropertyValue('--app-chart-grid').trim();
      const tBg = rootStyle.getPropertyValue('--app-chart-tooltip-bg').trim();
      const tTxt = rootStyle.getPropertyValue('--app-chart-tooltip-text').trim();

      setThemeChartColors({
        line1: l1 || '#ea580c',
        line2: l2 || '#f43f5e',
        line3: l3 || '#fb923c',
        grid: grid || '#334155',
        tooltipBg: tBg || '#1e293b',
        tooltipText: tTxt || '#ffffff'
      });
    };

    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mode', 'class']
    });
    return () => observer.disconnect();
  }, []);

  // Compute trend data combining workout intensity & mood scores chronologically
  const trendDaysCount = trendTimeRange === '7d' ? 7 : trendTimeRange === '14d' ? 14 : 30;

  const trendChartData = React.useMemo(() => {
    const data = [];
    const now = new Date();

    const moodScoreMap: Record<string, { score: number; label: string; emoji: string }> = {
      energized: { score: 9.5, label: 'Energized', emoji: '⚡' },
      normal: { score: 7.0, label: 'Normal / Balanced', emoji: '😊' },
      stressed: { score: 4.5, label: 'Stressed', emoji: '😰' },
      tired: { score: 3.5, label: 'Tired / Low Battery', emoji: '🥱' },
      low_motivation: { score: 2.5, label: 'Low Motivation', emoji: '🌧️' }
    };

    for (let i = trendDaysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });

      // Find workouts logged for this day
      const dayWorkouts = workoutLogs.filter((w) => w.date === dateStr || w.completedAt?.startsWith(dateStr));
      const totalDuration = dayWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
      const totalExercises = dayWorkouts.reduce((sum, w) => sum + (w.completedExercisesCount || 4), 0);

      let workoutIntensity: number | null = null;
      let workoutTitle: string | null = null;

      if (dayWorkouts.length > 0) {
        // Scaled intensity score from 1.0 to 10.0 based on duration & exercise density
        const calculated = Math.min(10, Math.max(2, Math.round(((totalDuration / 20) * 5) + (totalExercises * 0.5) * 10) / 10));
        workoutIntensity = calculated;
        workoutTitle = dayWorkouts[0].planTitle || 'Workout Session';
      }

      // Find mood check-in for this day
      const dayMood = moodCheckIns.find((m) => m.date === dateStr || m.createdAt?.startsWith(dateStr));
      let moodScore: number | null = null;
      let moodLabel: string | null = null;
      let moodEmoji: string | null = null;
      let moodNote: string | null = null;

      if (dayMood && moodScoreMap[dayMood.mood]) {
        const info = moodScoreMap[dayMood.mood];
        moodScore = info.score;
        moodLabel = info.label;
        moodEmoji = info.emoji;
        moodNote = dayMood.note || null;
      }

      data.push({
        dateStr,
        displayDate,
        dayOfWeek,
        workoutIntensity,
        moodScore,
        totalDuration,
        workoutTitle,
        moodLabel,
        moodEmoji,
        moodNote,
        isSample: false
      });
    }

    // If brand new user with no logs yet, populate an illustrative trajectory
    const hasAnyRealData = data.some((d) => d.workoutIntensity !== null || d.moodScore !== null);
    if (!hasAnyRealData) {
      const sampleIntensities = [null, 6.0, null, 7.5, 8.0, null, 8.5];
      const sampleMoods = [6.5, 7.5, 5.0, 8.0, 9.0, 7.0, 9.5];
      const sampleTitles = [null, 'Beginner Calisthenics', null, 'Upper Body Power', 'Core Fortress', null, 'HIIT Stamina'];

      return data.map((item, idx) => {
        const sIdx = idx % sampleIntensities.length;
        const sMood = sampleMoods[sIdx];
        const sIntensity = sampleIntensities[sIdx];
        return {
          ...item,
          workoutIntensity: sIntensity,
          moodScore: sMood,
          totalDuration: sIntensity ? 20 : 0,
          workoutTitle: sampleTitles[sIdx],
          moodLabel: sMood >= 8.5 ? 'Energized' : sMood >= 7 ? 'Normal' : 'Tired',
          moodEmoji: sMood >= 8.5 ? '⚡' : sMood >= 7 ? '😊' : '🥱',
          isSample: true
        };
      });
    }

    return data;
  }, [trendTimeRange, workoutLogs, moodCheckIns]);

  // Derived Trend Summary Statistics
  const validIntensityPoints = trendChartData.filter((d) => d.workoutIntensity !== null);
  const validMoodPoints = trendChartData.filter((d) => d.moodScore !== null);

  const avgIntensity = validIntensityPoints.length > 0
    ? (validIntensityPoints.reduce((sum, d) => sum + (d.workoutIntensity || 0), 0) / validIntensityPoints.length).toFixed(1)
    : '—';

  const avgMood = validMoodPoints.length > 0
    ? (validMoodPoints.reduce((sum, d) => sum + (d.moodScore || 0), 0) / validMoodPoints.length).toFixed(1)
    : '—';

  const isSampleTrendActive = trendChartData.some((d) => d.isSample);

  const handleExportCSV = () => {
    if (!workoutLogs || workoutLogs.length === 0) return;

    const headers = ['Date', 'Completed At', 'Workout Plan', 'Duration (Minutes)', 'Completed Exercises', 'XP Earned'];
    const rows = workoutLogs.map((log) => [
      log.date || '',
      log.completedAt || '',
      log.planTitle || 'Workout',
      log.durationMinutes || 0,
      log.completedExercisesCount || 0,
      log.xpEarned || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell ?? '');
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(',')
      )
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fitmood_workout_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setHasExported(true);
    setTimeout(() => setHasExported(false), 3000);
  };

  const xp = userProfile?.xp || 0;
  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevelFromXP(xp);
  const plant = getPlantStage(xp);

  const totalWorkoutMinutes = workoutLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0);

  // Group workout counts by last 7 days for the chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = daysOfWeek[d.getDay()];
    const count = workoutLogs.filter((w) => w.date === dateStr).length;
    return { dateStr, dayName, count };
  });

  const maxWorkoutsInDay = Math.max(1, ...last7Days.map((d) => d.count));

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Number(newWeight);
    if (isNaN(w) || w < 20 || w > 350) return;

    const item: BodyMeasurement = {
      id: `meas_${Date.now()}`,
      userId: userProfile?.id || 'guest',
      weightKg: w,
      waistCm: newWaist ? Number(newWaist) : undefined,
      note: note.trim(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    onAddMeasurement(item);
    setShowAddWeightModal(false);
    setNewWeight('');
    setNewWaist('');
    setNote('');
  };

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const uid = userProfile?.id || 'guest';
  const storageKey = `fitmood_celebrated_badges_${uid}`;
  const [celebratedBadgeIds, setCelebratedBadgeIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Helper to determine if a badge is qualified/earned
  const isBadgeQualified = (badge: Badge): boolean => {
    if (badge.isUnlocked) return true;
    if (badge.xpThreshold && xp >= badge.xpThreshold) return true;
    if (badge.id === 'first-workout' || badge.id === 'first-step') {
      return workoutLogs.length >= 1;
    }
    if (badge.id === 'three-workouts' || badge.id === 'calisthenics-rookie') {
      return workoutLogs.length >= 3;
    }
    if (badge.id === 'consistency-champion') {
      return workoutLogs.length >= 5;
    }
    if (badge.id === 'mood-master') {
      return moodCheckIns.length >= 3;
    }
    if (badge.id === 'consistent-streak') {
      return (userProfile?.streakDays || 0) >= 3;
    }
    if (badge.id === 'level-5-warrior') {
      return level >= 5;
    }
    return false;
  };

  // Helper to calculate progress toward locked badge
  const getBadgeProgress = (badge: Badge): { current: number; target: number; unit: string; percent: number } => {
    if (badge.id === 'first-workout' || badge.id === 'first-step') {
      const current = workoutLogs.length;
      const target = 1;
      return { current, target, unit: 'workout', percent: Math.min(100, (current / target) * 100) };
    }
    if (badge.id === 'three-workouts' || badge.id === 'calisthenics-rookie') {
      const current = workoutLogs.length;
      const target = 3;
      return { current, target, unit: 'workouts', percent: Math.min(100, (current / target) * 100) };
    }
    if (badge.id === 'consistency-champion') {
      const current = workoutLogs.length;
      const target = 5;
      return { current, target, unit: 'workouts', percent: Math.min(100, (current / target) * 100) };
    }
    if (badge.id === 'mood-master') {
      const current = moodCheckIns.length;
      const target = 3;
      return { current, target, unit: 'check-ins', percent: Math.min(100, (current / target) * 100) };
    }
    if (badge.id === 'consistent-streak') {
      const current = userProfile?.streakDays || 0;
      const target = 3;
      return { current, target, unit: 'days', percent: Math.min(100, (current / target) * 100) };
    }
    if (badge.id === 'level-5-warrior') {
      const current = level;
      const target = 5;
      return { current, target, unit: 'level', percent: Math.min(100, (current / target) * 100) };
    }
    const target = badge.xpThreshold || 100;
    const current = Math.min(xp, target);
    return { current, target, unit: 'XP', percent: Math.min(100, (current / target) * 100) };
  };

  // Auto-detect newly unlocked badges on ProgressPage and trigger rewarding toast
  useEffect(() => {
    if (!onTriggerBadgeToast) return;

    let celebrated: string[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) celebrated = JSON.parse(raw);
    } catch {
      celebrated = [];
    }

    const newlyEarned = badges.filter(
      (b) => isBadgeQualified(b) && !celebrated.includes(b.id)
    );

    if (newlyEarned.length > 0) {
      // Trigger toast for newly earned badge so user feels rewarded immediately
      newlyEarned.forEach((badge, idx) => {
        setTimeout(() => {
          onTriggerBadgeToast(badge, 25);
        }, idx * 800);
      });

      const updated = Array.from(new Set([...celebrated, ...newlyEarned.map((b) => b.id)]));
      setCelebratedBadgeIds(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  }, [xp, workoutLogs.length, moodCheckIns.length, measurements.length, userProfile?.streakDays]);

  const handleCelebrateBadge = (badge: Badge) => {
    if (onTriggerBadgeToast) {
      onTriggerBadgeToast(badge, 25);
    }
    try {
      const raw = localStorage.getItem(storageKey);
      const celebrated = raw ? JSON.parse(raw) : [];
      if (!celebrated.includes(badge.id)) {
        const next = [...celebrated, badge.id];
        setCelebratedBadgeIds(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
    } catch {
      // ignore
    }
  };

  // Badge icon resolver
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return Footprints;
      case 'Dumbbell':
        return Dumbbell;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Flame':
        return Flame;
      case 'UtensilsCrossed':
        return UtensilsCrossed;
      case 'Trophy':
        return Trophy;
      case 'CheckCircle2':
        return CheckCircle2;
      case 'Award':
        return Award;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
          <span>Consistency & Milestone Rewards</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Progress & Achievements
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          We celebrate showing up, recovery, and lifelong habits. No crash deadlines or shaming.
        </p>
      </div>

      {/* Gamification Level & Plant Growth Stage */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-5xl sm:text-6xl shadow-xl shadow-lime-400/10">
              {plant.emoji}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                Habit Growth Stage {plant.stageNumber} of 5
              </span>
              <h3 className="text-2xl font-black text-white">{plant.stageName}</h3>
              <p className="text-xs text-slate-400 max-w-md">{plant.description}</p>
            </div>
          </div>

          <div className="text-center sm:text-right bg-slate-950/80 border border-slate-800 rounded-2xl p-4 min-w-[200px]">
            <div className="text-3xl font-black text-lime-400 font-mono">{xp} XP</div>
            <div className="text-xs font-bold text-white mt-0.5">Level {level} Athlete</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-lime-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {currentLevelXp} / {nextLevelXp} XP to Level {level + 1}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Dumbbell className="w-4 h-4 text-lime-400" />
            <span>Workouts Done</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {workoutLogs.length}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Minutes Moved</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {totalWorkoutMinutes}m
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Smile className="w-4 h-4 text-amber-400" />
            <span>Mood Check-Ins</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {moodCheckIns.length}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Active Streak</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {userProfile?.streakDays || 0}d
          </div>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="font-extrabold text-white text-base mb-1 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-lime-400" />
          <span>7-Day Workout Consistency</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">Real workout sessions completed each day.</p>

        <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2">
          {last7Days.map((d, idx) => {
            const heightPercent = d.count > 0 ? Math.max(25, (d.count / maxWorkoutsInDay) * 100) : 6;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="text-[11px] font-bold text-slate-400">
                  {d.count > 0 ? `${d.count}x` : ''}
                </div>
                <div className="w-full max-w-[48px] bg-slate-950 rounded-xl h-full flex items-end p-1">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      d.count > 0 ? 'bg-lime-400 shadow-sm shadow-lime-400/40' : 'bg-slate-800/60'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{d.dayName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          Interactive Workout Intensity & Mood Scores Trend Lines
          (Recharts with Theme-Aware CSS Variables Mapping)
          ======================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" style={{ color: themeChartColors.line1 }} />
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Workout Intensity & Mood Trajectory
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Track how your training volume correlates with mental well-being and daily energy over time. Chart strokes automatically mirror the active FitMood theme palette.
            </p>
          </div>

          {/* Interactive Metric Filter & Time Range Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Metric Mode Filter */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setTrendMetricFilter('both')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  trendMetricFilter === 'both'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Both
              </button>
              <button
                type="button"
                onClick={() => setTrendMetricFilter('intensity')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  trendMetricFilter === 'intensity'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: themeChartColors.line1 }}
                />
                <span>Intensity</span>
              </button>
              <button
                type="button"
                onClick={() => setTrendMetricFilter('mood')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  trendMetricFilter === 'mood'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: themeChartColors.line2 }}
                />
                <span>Mood</span>
              </button>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
              {(['7d', '14d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTrendTimeRange(range)}
                  className={`px-3 py-1.5 rounded-xl uppercase transition-all cursor-pointer ${
                    trendTimeRange === range
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Metric Insight Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Avg Workout Intensity</div>
              <div
                className="text-2xl font-black font-mono mt-0.5"
                style={{ color: themeChartColors.line1 }}
              >
                {avgIntensity} <span className="text-xs text-slate-400 font-sans font-normal">/ 10</span>
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: `${themeChartColors.line1}20`,
                color: themeChartColors.line1
              }}
            >
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Avg Mood Score</div>
              <div
                className="text-2xl font-black font-mono mt-0.5"
                style={{ color: themeChartColors.line2 }}
              >
                {avgMood} <span className="text-xs text-slate-400 font-sans font-normal">/ 10</span>
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: `${themeChartColors.line2}20`,
                color: themeChartColors.line2
              }}
            >
              <Smile className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Mind-Body Synergy</div>
              <div className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
                <span className="text-emerald-400 font-black">+28%</span>
                <span className="text-slate-300">Mood on Active Days</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendChartData}
                margin={{ top: 12, right: 12, left: -20, bottom: 4 }}
              >
                <CartesianGrid
                  stroke={themeChartColors.grid}
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.6}
                />
                <XAxis
                  dataKey="displayDate"
                  stroke="#64748b"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={{ stroke: themeChartColors.grid }}
                />

                {/* Left Y-Axis for Workout Intensity (0 to 10 scale) */}
                {(trendMetricFilter === 'both' || trendMetricFilter === 'intensity') && (
                  <YAxis
                    yAxisId="intensity"
                    stroke={themeChartColors.line1}
                    orientation="left"
                    domain={[0, 10]}
                    ticks={[0, 2.5, 5, 7.5, 10]}
                    tick={{ fontSize: 10, fill: themeChartColors.line1 }}
                    tickLine={false}
                    axisLine={{ stroke: themeChartColors.grid }}
                    unit="/10"
                  />
                )}

                {/* Right Y-Axis for Mood Score (0 to 10 scale) */}
                {(trendMetricFilter === 'both' || trendMetricFilter === 'mood') && (
                  <YAxis
                    yAxisId="mood"
                    stroke={themeChartColors.line2}
                    orientation="right"
                    domain={[0, 10]}
                    ticks={[0, 2.5, 5, 7.5, 10]}
                    tick={{ fontSize: 10, fill: themeChartColors.line2 }}
                    tickLine={false}
                    axisLine={{ stroke: themeChartColors.grid }}
                    unit="/10"
                  />
                )}

                {/* Interactive Theme-Aware Tooltip */}
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div
                          className="p-3.5 rounded-2xl border shadow-2xl text-xs space-y-2 min-w-[200px]"
                          style={{
                            backgroundColor: themeChartColors.tooltipBg,
                            color: themeChartColors.tooltipText,
                            borderColor: themeChartColors.grid
                          }}
                        >
                          <div className="font-extrabold pb-1.5 border-b border-white/10 flex items-center justify-between">
                            <span>{d.displayDate} ({d.dayOfWeek})</span>
                            {d.isSample && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                                Baseline
                              </span>
                            )}
                          </div>

                          {/* Workout Intensity Row */}
                          {d.workoutIntensity !== null ? (
                            <div className="space-y-0.5">
                              <div
                                className="flex items-center justify-between font-bold"
                                style={{ color: themeChartColors.line1 }}
                              >
                                <span className="flex items-center gap-1.5">
                                  <Dumbbell className="w-3.5 h-3.5" />
                                  <span>Workout Intensity:</span>
                                </span>
                                <span className="font-mono font-black">{d.workoutIntensity} / 10</span>
                              </div>
                              <div className="text-[11px] text-slate-300 font-medium truncate">
                                {d.workoutTitle} {d.totalDuration > 0 ? `(${d.totalDuration}m)` : ''}
                              </div>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic">
                              No workout session logged
                            </div>
                          )}

                          {/* Mood Score Row */}
                          {d.moodScore !== null ? (
                            <div className="space-y-0.5 pt-1 border-t border-white/10">
                              <div
                                className="flex items-center justify-between font-bold"
                                style={{ color: themeChartColors.line2 }}
                              >
                                <span className="flex items-center gap-1.5">
                                  <span>{d.moodEmoji || '😊'}</span>
                                  <span>Mood Score:</span>
                                </span>
                                <span className="font-mono font-black">{d.moodScore} / 10</span>
                              </div>
                              <div className="text-[11px] text-slate-300 font-medium">
                                {d.moodLabel}
                              </div>
                              {d.moodNote && (
                                <div className="text-[10px] text-slate-400 italic mt-0.5 max-w-[200px]">
                                  "{d.moodNote}"
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic pt-1 border-t border-white/10">
                              No mood check-in logged
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-bold text-slate-300 capitalize">{value}</span>
                  )}
                />

                {/* Workout Intensity Trend Line (Line 1 Theme Variable) */}
                {(trendMetricFilter === 'both' || trendMetricFilter === 'intensity') && (
                  <Line
                    yAxisId="intensity"
                    type="monotone"
                    dataKey="workoutIntensity"
                    name="Workout Intensity (1-10)"
                    stroke={themeChartColors.line1}
                    strokeWidth={3}
                    dot={{
                      r: 4.5,
                      fill: themeChartColors.line1,
                      stroke: '#020617',
                      strokeWidth: 2
                    }}
                    activeDot={{
                      r: 7,
                      fill: '#ffffff',
                      stroke: themeChartColors.line1,
                      strokeWidth: 3
                    }}
                    connectNulls
                  />
                )}

                {/* Mood Score Trend Line (Line 2 Theme Variable) */}
                {(trendMetricFilter === 'both' || trendMetricFilter === 'mood') && (
                  <Line
                    yAxisId="mood"
                    type="monotone"
                    dataKey="moodScore"
                    name="Mood Score (1-10)"
                    stroke={themeChartColors.line2}
                    strokeWidth={3}
                    strokeDasharray={trendMetricFilter === 'both' ? '4 3' : undefined}
                    dot={{
                      r: 4.5,
                      fill: themeChartColors.line2,
                      stroke: '#020617',
                      strokeWidth: 2
                    }}
                    activeDot={{
                      r: 7,
                      fill: '#ffffff',
                      stroke: themeChartColors.line2,
                      strokeWidth: 3
                    }}
                    connectNulls
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {isSampleTrendActive && (
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Showing initial baseline preview. Log daily workouts and mood check-ins to build your personal synergy curve!</span>
            </span>
          </div>
        )}
      </div>

      {/* Badges and Trophies Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-lime-400" />
              <h3 className="font-extrabold text-white text-base">Achievement Badges & Rewards</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Badges unlock as you work out, log meals, and stay consistent. Click any earned badge to trigger your reward toast!
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-lime-400">
              {badges.filter((b) => isBadgeQualified(b)).length} / {badges.length} Unlocked
            </span>
            {badges.some((b) => isBadgeQualified(b)) && (
              <button
                type="button"
                onClick={() => {
                  const unlocked = badges.filter((b) => isBadgeQualified(b));
                  if (unlocked.length > 0) {
                    handleCelebrateBadge(unlocked[unlocked.length - 1]);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-md shadow-lime-400/20 transition-all hover:scale-102"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Celebrate Top Badge</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {badges.map((badge) => {
            const isUnlocked = isBadgeQualified(badge);
            const isCelebrated = celebratedBadgeIds.includes(badge.id);
            const progress = getBadgeProgress(badge);
            const IconComponent = getBadgeIcon(badge.iconName);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between select-none relative overflow-hidden group ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-lime-400/40 hover:border-lime-400 shadow-sm hover:shadow-lg hover:shadow-lime-400/10'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                }`}
              >
                {/* Top decorative accent on earned badges */}
                {isUnlocked && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-amber-300" />
                )}

                <div className="flex items-start gap-3.5">
                  <div
                    onClick={() => setSelectedBadge(badge)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer transition-transform group-hover:scale-105 ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 shadow-md shadow-lime-400/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        onClick={() => setSelectedBadge(badge)}
                        className="font-black text-sm text-white truncate cursor-pointer hover:text-lime-300"
                      >
                        {badge.title}
                      </h4>
                      {isUnlocked && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/30 text-[10px] font-black text-lime-400">
                          <Check className="w-2.5 h-2.5" />
                          <span>Earned</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action / Progress Status */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-lime-400/90 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-lime-400" />
                        <span>+25 XP Awarded</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCelebrateBadge(badge);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black shadow-xs shadow-lime-400/20 transition-all hover:scale-105 active:scale-95"
                        title="Trigger reward toast and celebration"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Celebrate!</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>Progress: {progress.current} / {progress.target} {progress.unit}</span>
                        <span>{Math.round(progress.percent)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-slate-700 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Body Measurements Trends & Log (Recharts Visualization) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-lime-400" />
              <h3 className="font-extrabold text-white text-base">Body Measurements & Trajectory Trends</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualize your weight (kg) and waist circumference (cm) trends over time at your own pace.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Metric Switcher */}
            {measurements.length > 0 && (
              <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setChartMetric('both')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    chartMetric === 'both' ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Both
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('weight')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    chartMetric === 'weight' ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Weight
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('waist')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    chartMetric === 'waist' ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Waist
                </button>
              </div>
            )}

            <button
              onClick={() => setShowAddWeightModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold transition-transform hover:scale-102 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {(() => {
          // Sort measurements chronologically for trajectory chart
          const sortedData = [...measurements].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          if (sortedData.length === 0) {
            return (
              <div className="py-10 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/60 p-6">
                <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center mx-auto text-xl">
                  ⚖️
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-sm">No Measurements Logged Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Tracking body weight or waist changes is 100% optional. When you log entries, an interactive chart will plot your progress over time.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddWeightModal(true)}
                  className="px-4 py-2 rounded-xl bg-lime-400/15 border border-lime-400/30 text-lime-400 hover:bg-lime-400 hover:text-slate-950 text-xs font-bold transition-all"
                >
                  Log First Measurement (+20 XP)
                </button>
              </div>
            );
          }

          const latest = sortedData[sortedData.length - 1];
          const initial = sortedData[0];
          const weightDiff = (latest.weightKg - initial.weightKg).toFixed(1);

          const waistEntries = sortedData.filter((m) => typeof m.waistCm === 'number');
          const latestWaist = waistEntries.length > 0 ? waistEntries[waistEntries.length - 1].waistCm : null;
          const initialWaist = waistEntries.length > 0 ? waistEntries[0].waistCm : null;
          const waistDiff =
            latestWaist && initialWaist ? (latestWaist - initialWaist).toFixed(1) : null;

          return (
            <div className="space-y-5">
              {/* Metric Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Latest Weight</div>
                  <div className="text-xl font-black text-white mt-0.5 font-mono">{latest.weightKg} kg</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{latest.date}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Weight Change</div>
                  <div className={`text-xl font-black font-mono mt-0.5 ${Number(weightDiff) < 0 ? 'text-sky-400' : Number(weightDiff) > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {Number(weightDiff) > 0 ? `+${weightDiff}` : weightDiff} kg
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">since {initial.date}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Latest Waist</div>
                  <div className="text-xl font-black text-sky-400 mt-0.5 font-mono">
                    {latestWaist ? `${latestWaist} cm` : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {latestWaist ? 'circumference' : 'no waist entry'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Waist Change</div>
                  <div className={`text-xl font-black font-mono mt-0.5 ${waistDiff && Number(waistDiff) < 0 ? 'text-sky-400' : waistDiff && Number(waistDiff) > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {waistDiff ? (Number(waistDiff) > 0 ? `+${waistDiff} cm` : `${waistDiff} cm`) : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">overall net change</div>
                </div>
              </div>

              {/* Recharts Trend Chart Canvas */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                      />
                      {/* Left Y-Axis for Weight */}
                      {(chartMetric === 'both' || chartMetric === 'weight') && (
                        <YAxis
                          yAxisId="weight"
                          stroke="#a3e635"
                          orientation="left"
                          tick={{ fontSize: 10, fill: '#a3e635' }}
                          tickLine={false}
                          axisLine={{ stroke: '#334155' }}
                          domain={['dataMin - 1', 'dataMax + 1']}
                          unit="kg"
                        />
                      )}
                      {/* Right Y-Axis for Waist */}
                      {(chartMetric === 'both' || chartMetric === 'waist') && (
                        <YAxis
                          yAxisId="waist"
                          stroke="#38bdf8"
                          orientation="right"
                          tick={{ fontSize: 10, fill: '#38bdf8' }}
                          tickLine={false}
                          axisLine={{ stroke: '#334155' }}
                          domain={['dataMin - 2', 'dataMax + 2']}
                          unit="cm"
                        />
                      )}

                      {/* Custom Dark Tooltip */}
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as BodyMeasurement;
                            return (
                              <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-2xl shadow-xl text-xs space-y-1">
                                <div className="font-bold text-white border-b border-slate-800 pb-1">
                                  {data.date}
                                </div>
                                <div className="flex items-center gap-2 text-lime-400 font-mono">
                                  <span>Weight:</span>
                                  <span className="font-black text-white">{data.weightKg} kg</span>
                                </div>
                                {data.waistCm && (
                                  <div className="flex items-center gap-2 text-sky-400 font-mono">
                                    <span>Waist:</span>
                                    <span className="font-black text-white">{data.waistCm} cm</span>
                                  </div>
                                )}
                                {data.note && (
                                  <div className="text-[10px] text-slate-400 italic pt-1 max-w-[180px]">
                                    "{data.note}"
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      <Legend
                        verticalAlign="top"
                        height={36}
                        formatter={(value) => (
                          <span className="text-xs font-bold text-slate-300 capitalize">{value}</span>
                        )}
                      />

                      {/* Weight Line */}
                      {(chartMetric === 'both' || chartMetric === 'weight') && (
                        <Line
                          yAxisId="weight"
                          type="monotone"
                          dataKey="weightKg"
                          name="Weight (kg)"
                          stroke="#a3e635"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#a3e635', stroke: '#0f172a', strokeWidth: 2 }}
                          activeDot={{ r: 7, fill: '#ffffff', stroke: '#a3e635', strokeWidth: 2 }}
                        />
                      )}

                      {/* Waist Circumference Line */}
                      {(chartMetric === 'both' || chartMetric === 'waist') && (
                        <Line
                          yAxisId="waist"
                          type="monotone"
                          dataKey="waistCm"
                          name="Waist (cm)"
                          stroke="#38bdf8"
                          strokeWidth={2.5}
                          strokeDasharray="4 4"
                          dot={{ r: 3.5, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: '#ffffff', stroke: '#38bdf8', strokeWidth: 2 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Logged Entries Grid */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Logged Entries History ({measurements.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedData.slice(-6).reverse().map((m) => (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="flex justify-between items-center text-slate-400 mb-1">
                        <span className="font-semibold text-slate-300">{m.date}</span>
                        <span className="font-black text-lime-400 text-sm font-mono">{m.weightKg} kg</span>
                      </div>
                      {m.waistCm && (
                        <div className="text-sky-300 font-mono text-[11px]">
                          Waist: <span className="text-white font-bold">{m.waistCm} cm</span>
                        </div>
                      )}
                      {m.note && <div className="text-[11px] text-slate-500 italic mt-1 line-clamp-1">"{m.note}"</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Recent Workout History Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-white text-base">Completed Workouts History</h3>
            <p className="text-xs text-slate-400">Review your past training sessions or export for your own records.</p>
          </div>

          {workoutLogs.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-lime-400 text-xs font-bold border border-slate-700/80 transition-all hover:scale-102 self-start sm:self-auto cursor-pointer"
              title="Download your complete workout history in CSV format"
            >
              {hasExported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-lime-400" />
                  <span>Exported CSV!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-lime-400" />
                  <span>Export CSV</span>
                </>
              )}
            </button>
          )}
        </div>

        {workoutLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/60">
            No completed workouts yet. Hit "Start Workout" on any plan to begin your history!
          </div>
        ) : (
          <div className="space-y-2.5">
            {workoutLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">{log.planTitle}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {log.date} • {log.durationMinutes} min • {log.completedExercisesCount} exercises
                  </div>
                </div>

                <div className="px-3 py-1 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-400 font-bold font-mono">
                  +{log.xpEarned} XP
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Measurement Modal */}
      {showAddWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-slate-100">
            <h3 className="text-lg font-black text-white">Log Measurement</h3>

            <form onSubmit={handleSaveMeasurement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Weight (kg) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min="20"
                  max="350"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g. 68.5"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Waist Circumference (cm, optional)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="30"
                  max="200"
                  value={newWaist}
                  onChange={(e) => setNewWaist(e.target.value)}
                  placeholder="e.g. 80"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Morning weigh-in after glass of water"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddWeightModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs shadow-md shadow-lime-400/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Badge Details & Celebration Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl overflow-hidden">
            {/* Top gradient strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lime-400 via-emerald-400 to-amber-300" />

            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center pt-2">
              {/* Badge Icon with radial glow */}
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 transition-transform shadow-xl ${
                  isBadgeQualified(selectedBadge)
                    ? 'bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 shadow-lime-400/30 ring-4 ring-lime-400/20 animate-bounce-subtle'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {(() => {
                  const Icon = getBadgeIcon(selectedBadge.iconName);
                  return <Icon className="w-10 h-10 stroke-[2.5]" />;
                })()}
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5 bg-slate-950 border border-slate-800 text-lime-400">
                <Sparkles className="w-3 h-3 text-lime-400" />
                <span>{isBadgeQualified(selectedBadge) ? 'Achievement Unlocked' : 'In Progress'}</span>
              </div>

              <h3 className="text-lg font-black text-white">{selectedBadge.title}</h3>
              <p className="text-xs text-slate-300 mt-1.5 max-w-xs leading-relaxed">
                {selectedBadge.description}
              </p>

              {/* Reward info */}
              <div className="mt-4 w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Reward Value</span>
                <span className="text-lime-400">+25 FitMood XP</span>
              </div>

              {/* Progress if locked */}
              {!isBadgeQualified(selectedBadge) && (
                <div className="mt-3 w-full space-y-1.5 text-left">
                  {(() => {
                    const prog = getBadgeProgress(selectedBadge);
                    return (
                      <>
                        <div className="flex justify-between text-[11px] font-bold text-slate-400">
                          <span>Requirement: {prog.current} / {prog.target} {prog.unit}</span>
                          <span>{Math.round(prog.percent)}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-lime-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${prog.percent}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6 w-full flex gap-2">
                {isBadgeQualified(selectedBadge) ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleCelebrateBadge(selectedBadge);
                      setSelectedBadge(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-lime-400/25 flex items-center justify-center gap-1.5 transition-all hover:scale-102"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Celebrate Achievement!</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedBadge(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition-colors"
                  >
                    Keep Going
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
