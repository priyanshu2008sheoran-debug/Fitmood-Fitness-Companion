import React, { useState } from 'react';
import {
  UserProfile,
  HabitItem,
  HabitCategory
} from '../types';
import {
  DEFAULT_PRESET_HABITS,
  formatDateKey,
  calculateHabitStreakStats,
  buildCalendarDays
} from '../data/habitsData';
import {
  Flame,
  Trophy,
  CheckCircle2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Droplets,
  Moon,
  Footprints,
  Sun,
  Sparkles,
  Apple,
  Brain,
  Check,
  Award,
  Zap,
  Clock,
  Target,
  X
} from 'lucide-react';
import { triggerCelebrationAudio } from './BadgeToast';

interface HabitsTrackerProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

const CATEGORY_ICONS: { [key: string]: React.ElementType } = {
  hydration: Droplets,
  sleep: Moon,
  movement: Footprints,
  wellness: Sun,
  recovery: Sparkles,
  nutrition: Apple,
  mindset: Brain,
  custom: Target
};

const CATEGORY_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  hydration: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30' },
  sleep: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  movement: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  wellness: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  recovery: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  nutrition: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  mindset: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  custom: { bg: 'bg-lime-500/15', text: 'text-lime-400', border: 'border-lime-500/30' }
};

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({
  userProfile,
  onUpdateProfile
}) => {
  const todayKey = formatDateKey(new Date());

  // Habits active list (preset + custom)
  const habits: HabitItem[] = userProfile?.habits && userProfile.habits.length > 0
    ? userProfile.habits
    : DEFAULT_PRESET_HABITS;

  // Habit completion logs map: { [date: string]: string[] (completed habit IDs) }
  const habitLogs: { [date: string]: string[] } = userProfile?.habitLogs || {
    // Seed today with 2 demo completions if first time so visual calendar has data
    [todayKey]: ['habit_hydration', 'habit_sunlight']
  };

  // Calendar month state
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string>(todayKey);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Habit form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('custom');
  const [newDescription, setNewDescription] = useState('');
  const [newTargetCount, setNewTargetCount] = useState<string>('1');
  const [newUnit, setNewUnit] = useState('times');

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth(); // 0 - 11

  const streakStats = calculateHabitStreakStats(habitLogs, currentYear, currentMonth);
  const calendarCells = buildCalendarDays(currentYear, currentMonth, habitLogs, habits.length);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleResetToCurrentMonth = () => {
    setCalendarDate(new Date());
    setSelectedDayKey(todayKey);
  };

  // Toggle habit completion for a specific date (defaults to today)
  const handleToggleHabit = (habitId: string, dateKey: string = todayKey) => {
    const dayCompleted = habitLogs[dateKey] || [];
    const isCompleted = dayCompleted.includes(habitId);

    let updatedDay: string[];
    if (isCompleted) {
      updatedDay = dayCompleted.filter((id) => id !== habitId);
    } else {
      updatedDay = [...dayCompleted, habitId];
      // Celebrate completion
      triggerCelebrationAudio();
    }

    const updatedLogs = {
      ...habitLogs,
      [dateKey]: updatedDay
    };

    // Calculate new streak stats
    const newStats = calculateHabitStreakStats(updatedLogs);

    if (userProfile) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        habits,
        habitLogs: updatedLogs,
        streakDays: Math.max(userProfile.streakDays || 1, newStats.currentStreak),
        xp: (userProfile.xp || 50) + (isCompleted ? 0 : 10), // +10 XP for completing a daily non-workout habit
        updatedAt: new Date().toISOString()
      };
      onUpdateProfile(updatedProfile);
    }
  };

  // Add custom habit
  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: HabitItem = {
      id: `custom_habit_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      icon: 'sparkles',
      description: newDescription.trim() || undefined,
      targetCount: Number(newTargetCount) || 1,
      unit: newUnit.trim() || 'target',
      color: '#a3e635',
      isCustom: true,
      createdAt: todayKey
    };

    const updatedHabits = [...habits, newHabit];

    if (userProfile) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        habits: updatedHabits,
        habitLogs,
        updatedAt: new Date().toISOString()
      };
      onUpdateProfile(updatedProfile);
    }

    // Reset and close
    setNewTitle('');
    setNewDescription('');
    setNewTargetCount('1');
    setNewUnit('times');
    setShowAddModal(false);
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter((h) => h.id !== habitId);

    // Remove from logs
    const updatedLogs: { [date: string]: string[] } = {};
    Object.entries(habitLogs).forEach(([d, list]) => {
      updatedLogs[d] = list.filter((id) => id !== habitId);
    });

    if (userProfile) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        habits: updatedHabits,
        habitLogs: updatedLogs,
        updatedAt: new Date().toISOString()
      };
      onUpdateProfile(updatedProfile);
    }
  };

  const todayCompletedIds = habitLogs[todayKey] || [];
  const selectedDayCompletedIds = habitLogs[selectedDayKey] || [];
  const isSelectedDayToday = selectedDayKey === todayKey;

  return (
    <div className="space-y-6">
      {/* 1. Habit Streaks & Progress Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Current Streak */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Streak</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 fill-orange-400 stroke-orange-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">{streakStats.currentStreak}</span>
              <span className="text-xs sm:text-sm font-bold text-orange-400">Days</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Keep it rolling today!</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Longest Streak */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Best Streak</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">{streakStats.longestStreak}</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400">Days</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Personal all-time record</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Total Habits Completed */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">{streakStats.totalHabitsCompleted}</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400">Total</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Non-workout milestones</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Monthly Consistency Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:border-lime-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Month Pace</span>
            <div className="w-8 h-8 rounded-xl bg-lime-500/20 text-lime-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">{streakStats.monthCompletionRate}%</span>
              <span className="text-xs sm:text-sm font-bold text-lime-400">Active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{monthNames[currentMonth]} consistency</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-lime-500/10 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* 2. Visual Calendar View of Completed Days */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        {/* Calendar Header with Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-lime-400/15 border border-lime-400/30 text-lime-400 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{monthNames[currentMonth]} {currentYear}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-bold text-slate-300">
                  {streakStats.totalDaysWithCompletions} Days Logged
                </span>
              </h2>
              <p className="text-xs text-slate-400">Click any day to inspect completed goals</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleResetToCurrentMonth}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              Today
            </button>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarCells.map((cell) => {
            const isSelected = cell.dateKey === selectedDayKey;
            const completedCount = cell.completedHabitIds.length;
            const hasCompletions = completedCount > 0;

            // Visual intensity based on completed goals count
            let badgeBg = 'bg-slate-950/60 text-slate-500 border-slate-800/80';
            let dotColor = 'bg-slate-700';

            if (hasCompletions) {
              if (completedCount >= 5) {
                badgeBg = 'bg-lime-400 text-slate-950 font-black border-lime-300 shadow-sm shadow-lime-400/20';
                dotColor = 'bg-slate-950';
              } else if (completedCount >= 3) {
                badgeBg = 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 font-bold';
                dotColor = 'bg-emerald-400';
              } else {
                badgeBg = 'bg-orange-500/25 text-orange-300 border-orange-500/40 font-bold';
                dotColor = 'bg-orange-400';
              }
            }

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => setSelectedDayKey(cell.dateKey)}
                disabled={cell.isFuture}
                className={`min-h-[52px] sm:min-h-[64px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between text-left relative ${
                  cell.isFuture
                    ? 'opacity-35 cursor-not-allowed border-transparent bg-slate-950/20'
                    : 'cursor-pointer hover:scale-102 hover:border-slate-600'
                } ${
                  isSelected
                    ? 'ring-2 ring-lime-400 ring-offset-2 ring-offset-slate-900 border-lime-400 bg-slate-800'
                    : badgeBg
                } ${
                  !cell.isCurrentMonth ? 'opacity-40' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-bold ${
                    isSelected
                      ? 'text-lime-400'
                      : cell.isToday
                        ? 'text-orange-400 underline decoration-2'
                        : 'text-inherit'
                  }`}>
                    {cell.dayNumber}
                  </span>
                  {cell.isToday && (
                    <span className="text-[9px] font-bold px-1 rounded bg-orange-500/20 text-orange-400">
                      Now
                    </span>
                  )}
                </div>

                {/* Completion Indicator Dot / Badge */}
                {hasCompletions ? (
                  <div className="mt-1 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      completedCount >= 5
                        ? 'bg-slate-950 text-lime-400'
                        : 'bg-slate-900/90 text-inherit'
                    }`}>
                      {completedCount} ✓
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  </div>
                ) : (
                  <div className="mt-1 h-3 flex items-center">
                    <span className="text-[10px] text-slate-600 font-mono">-</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-orange-500/30 border border-orange-500/40" />
              <span className="text-[11px]">1-2 Goals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500/40 border border-emerald-500/60" />
              <span className="text-[11px]">3-4 Goals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-lime-400 text-slate-950 font-bold text-[8px] flex items-center justify-center">✓</span>
              <span className="text-[11px]">5+ Power Day</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Streak holds as long as ≥1 goal completed daily.
          </div>
        </div>
      </div>

      {/* 3. Selected Day Inspection Panel (If not today, lets user inspect or back-log) */}
      {!isSelectedDayToday && (
        <div className="bg-slate-900 border border-lime-400/30 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-lime-400/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-lime-400 uppercase tracking-wider">Viewing Past Date</div>
              <div className="text-sm font-bold text-white">
                {selectedDayKey} — {selectedDayCompletedIds.length} of {habits.length} habits achieved
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDayKey(todayKey)}
            className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition-all shrink-0"
          >
            Return to Today
          </button>
        </div>
      )}

      {/* 4. Non-Workout Daily Goals Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Daily Health Disciplines</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {isSelectedDayToday ? "Today's Non-Workout Goals" : `Goals for ${selectedDayKey}`}
            </h3>
            <p className="text-xs text-slate-400">
              Check off daily habits to preserve your streak, earn +10 XP each, and build lifelong momentum.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-lime-400/40 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 font-bold text-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Goal</span>
          </button>
        </div>

        {/* Habit Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {habits.map((habit) => {
            const activeCompletedList = habitLogs[selectedDayKey] || [];
            const isCompleted = activeCompletedList.includes(habit.id);
            const IconComp = CATEGORY_ICONS[habit.category] || Sparkles;
            const colors = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.custom;

            return (
              <div
                key={habit.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 relative group ${
                  isCompleted
                    ? 'border-lime-400/50 bg-lime-400/10 shadow-sm shadow-lime-400/10'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Category Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colors.bg} ${colors.text} ${colors.border}`}>
                    <IconComp className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-xs sm:text-sm font-bold truncate ${isCompleted ? 'text-lime-300 line-through decoration-lime-400/50' : 'text-white'}`}>
                        {habit.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                        {habit.category}
                      </span>
                    </div>

                    {habit.description && (
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {habit.description}
                      </p>
                    )}

                    {habit.targetCount && habit.unit && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono text-slate-400">
                        <Target className="w-3 h-3 text-slate-500" />
                        <span>Target: {habit.targetCount} {habit.unit}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right controls: Delete (if custom) + Completion Check Button */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  {habit.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteHabit(habit.id)}
                      title="Delete Custom Habit"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-70 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleHabit(habit.id, selectedDayKey)}
                    aria-label={`Toggle habit: ${habit.title}`}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-lime-400 border-lime-400 text-slate-950 shadow-md shadow-lime-400/30 scale-105'
                        : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-slate-400 transition-all" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Celebration Banner when all habits done */}
        {todayCompletedIds.length === habits.length && habits.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-lime-400/20 via-emerald-500/20 to-lime-400/20 border border-lime-400/40 flex items-center justify-between gap-3 animate-subtle-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-lime-400/30">
                🎉
              </div>
              <div>
                <h4 className="text-sm font-black text-lime-400">All Daily Non-Workout Goals Crushed!</h4>
                <p className="text-xs text-slate-300">
                  Incredible discipline today. Your body, mind, and metabolism are operating at peak efficiency.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-lime-400 text-slate-950 px-3 py-1 rounded-xl shrink-0">
              +70 XP Total
            </span>
          </div>
        )}
      </div>

      {/* 5. Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Create Custom Daily Goal</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Read 20 mins, No processed sugar, Cold shower"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as HabitCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                  >
                    <option value="movement">Movement / Steps</option>
                    <option value="hydration">Hydration</option>
                    <option value="sleep">Sleep / Rest</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="mindset">Mindset / Focus</option>
                    <option value="recovery">Recovery</option>
                    <option value="custom">Other Discipline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Target & Unit
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      value={newTargetCount}
                      onChange={(e) => setNewTargetCount(e.target.value)}
                      className="w-16 px-2.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                    />
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="times / min"
                      className="flex-1 px-2.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Why this habit matters (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Reduces evening cortisol and increases focus."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs shadow-md shadow-lime-400/20 transition-all"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
