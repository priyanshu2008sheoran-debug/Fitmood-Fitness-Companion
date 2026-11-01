import { HabitItem, HabitStreakStats } from '../types';

export const DEFAULT_PRESET_HABITS: HabitItem[] = [
  {
    id: 'habit_hydration',
    title: 'Daily Hydration (2.5L+)',
    category: 'hydration',
    icon: 'droplet',
    description: 'Drink at least 8-10 glasses (2.5-3 Liters) of clean water to maintain muscle fullness and energy.',
    targetCount: 8,
    unit: 'glasses',
    color: '#0284c7', // Sky / Cyan
    createdAt: '2026-01-01'
  },
  {
    id: 'habit_sleep',
    title: '7-8 Hours Restful Sleep',
    category: 'sleep',
    icon: 'moon',
    description: 'Ensure a solid night of recovery sleep. Muscles repair, hormones balance, and nervous systems reset during sleep.',
    targetCount: 8,
    unit: 'hours',
    color: '#8b5cf6', // Violet
    createdAt: '2026-01-01'
  },
  {
    id: 'habit_steps',
    title: '7,000+ Daily Steps',
    category: 'movement',
    icon: 'footprints',
    description: 'Non-exercise physical activity (NEAT). Supports cardiovascular health, joint mobility, and healthy metabolism.',
    targetCount: 7000,
    unit: 'steps',
    color: '#10b981', // Emerald
    createdAt: '2026-01-01'
  },
  {
    id: 'habit_sunlight',
    title: '15-Min Outdoor Daylight',
    category: 'wellness',
    icon: 'sun',
    description: 'Get natural sunlight into your eyes and on skin in the morning to anchor your circadian rhythm and boost Vitamin D.',
    targetCount: 15,
    unit: 'minutes',
    color: '#f59e0b', // Amber
    createdAt: '2026-01-01'
  },
  {
    id: 'habit_mobility',
    title: '10-Min Mobility & Stretch',
    category: 'recovery',
    icon: 'sparkles',
    description: 'Gentle spinal decompression, shoulder rolls, and hip openers to counteract prolonged sitting or screen time.',
    targetCount: 10,
    unit: 'minutes',
    color: '#06b6d4', // Cyan
    createdAt: '2026-01-01'
  },
  {
    id: 'habit_protein',
    title: 'Hit Protein & Whole Foods',
    category: 'nutrition',
    icon: 'apple',
    description: 'Prioritize minimally processed whole foods with clean dietary protein (dal, paneer, eggs, tofu, or lean cuts).',
    targetCount: 1,
    unit: 'target',
    color: '#ea580c', // Orange
    createdAt: '2026-01-01'
  },
  {
    id: 'habit_mindset',
    title: '5-Min Mindful Breathing',
    category: 'mindset',
    icon: 'brain',
    description: 'Slow 4-second box breathing or quiet reflection to lower cortisol and switch into parasympathetic recovery.',
    targetCount: 5,
    unit: 'minutes',
    color: '#ec4899', // Rose/Pink
    createdAt: '2026-01-01'
  }
];

/**
 * Returns formatted date string in YYYY-MM-DD
 */
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates habit streak statistics based on completion history.
 */
export function calculateHabitStreakStats(
  habitLogs: { [date: string]: string[] } = {},
  targetYear?: number,
  targetMonth?: number // 0-indexed (0 = Jan, 11 = Dec)
): HabitStreakStats {
  const datesWithCompletions = Object.entries(habitLogs)
    .filter(([_, habits]) => habits && habits.length > 0)
    .map(([date]) => date)
    .sort();

  const totalDaysWithCompletions = datesWithCompletions.length;
  let totalHabitsCompleted = 0;
  Object.values(habitLogs).forEach((list) => {
    if (list) totalHabitsCompleted += list.length;
  });

  if (datesWithCompletions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysWithCompletions: 0,
      monthCompletionRate: 0,
      totalHabitsCompleted: 0
    };
  }

  // Calculate Current Streak
  const todayStr = formatDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateKey(yesterday);

  let currentStreak = 0;
  // If user completed habits today, count backwards starting today. If not today but yesterday, start from yesterday.
  let checkDate = new Date();
  if (!habitLogs[todayStr] || habitLogs[todayStr].length === 0) {
    if (habitLogs[yesterdayStr] && habitLogs[yesterdayStr].length > 0) {
      checkDate = yesterday;
    } else {
      checkDate = null as unknown as Date;
    }
  }

  if (checkDate) {
    const cursor = new Date(checkDate);
    while (true) {
      const key = formatDateKey(cursor);
      if (habitLogs[key] && habitLogs[key].length > 0) {
        currentStreak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate Longest Streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of datesWithCompletions) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  // Monthly Completion Rate for target month
  const now = new Date();
  const y = targetYear !== undefined ? targetYear : now.getFullYear();
  const m = targetMonth !== undefined ? targetMonth : now.getMonth();
  const daysInTargetMonth = new Date(y, m + 1, 0).getDate();

  const monthPrefix = `${y}-${String(m + 1).padStart(2, '0')}`;
  const daysCompletedInMonth = datesWithCompletions.filter((d) => d.startsWith(monthPrefix)).length;
  
  // If current month, only compare up to today
  let daysToCompare = daysInTargetMonth;
  if (y === now.getFullYear() && m === now.getMonth()) {
    daysToCompare = Math.max(1, now.getDate());
  }

  const monthCompletionRate = Math.min(100, Math.round((daysCompletedInMonth / daysToCompare) * 100));

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalDaysWithCompletions,
    monthCompletionRate,
    totalHabitsCompleted
  };
}

/**
 * Builds calendar grid cells for a given year & month.
 */
export interface CalendarDayCell {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  completedHabitIds: string[];
  completionRatio: number; // 0 to 1
}

export function buildCalendarDays(
  year: number,
  month: number, // 0-indexed
  habitLogs: { [date: string]: string[] } = {},
  activeHabitsCount: number = 7
): CalendarDayCell[] {
  const todayStr = formatDateKey(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarDayCell[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const date = new Date(year, month - 1, dayNum);
    const dateKey = formatDateKey(date);
    const completed = habitLogs[dateKey] || [];
    const ratio = activeHabitsCount > 0 ? completed.length / activeHabitsCount : 0;
    cells.push({
      date,
      dateKey,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateKey === todayStr,
      isFuture: date > today,
      completedHabitIds: completed,
      completionRatio: Math.min(1, ratio)
    });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const date = new Date(year, month, dayNum);
    const dateKey = formatDateKey(date);
    const completed = habitLogs[dateKey] || [];
    const ratio = activeHabitsCount > 0 ? completed.length / activeHabitsCount : 0;
    cells.push({
      date,
      dateKey,
      dayNumber: dayNum,
      isCurrentMonth: true,
      isToday: dateKey === todayStr,
      isFuture: date > today,
      completedHabitIds: completed,
      completionRatio: Math.min(1, ratio)
    });
  }

  // Trailing next month days to complete 35 or 42 grid cells
  const remainingCells = 42 - cells.length >= 7 ? 42 - cells.length : (35 - cells.length >= 0 ? 35 - cells.length : 42 - cells.length);
  for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
    const date = new Date(year, month + 1, dayNum);
    const dateKey = formatDateKey(date);
    const completed = habitLogs[dateKey] || [];
    const ratio = activeHabitsCount > 0 ? completed.length / activeHabitsCount : 0;
    cells.push({
      date,
      dateKey,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateKey === todayStr,
      isFuture: date > today,
      completedHabitIds: completed,
      completionRatio: Math.min(1, ratio)
    });
  }

  return cells;
}
