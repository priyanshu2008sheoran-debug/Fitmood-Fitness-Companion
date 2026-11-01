import { Badge, DailyChallenge } from '../types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first-set',
    title: 'First Set Completed',
    description: 'Completed your very first interactive set with Coach Milo!',
    iconName: 'CheckCircle2',
    xpThreshold: 20,
    isUnlocked: false
  },
  {
    id: 'first-workout',
    title: 'First Full Workout',
    description: 'Finished your first complete interactive workout session.',
    iconName: 'Award',
    xpThreshold: 100,
    isUnlocked: false
  },
  {
    id: 'three-workouts',
    title: 'Three Workouts Completed',
    description: 'Completed 3 full workout sessions on FitMood.',
    iconName: 'Flame',
    xpThreshold: 350,
    isUnlocked: false
  },
  {
    id: 'consistency-champion',
    title: 'Consistency Champion',
    description: 'Logged consistent workouts, listened to your body, and kept going.',
    iconName: 'Trophy',
    xpThreshold: 500,
    isUnlocked: false
  },
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Completed your very first workout on FitMood.',
    iconName: 'Footprints',
    xpThreshold: 50,
    isUnlocked: false
  },
  {
    id: 'calisthenics-rookie',
    title: 'Bodyweight Pioneer',
    description: 'Completed 3 calisthenics sessions without stepping into a gym.',
    iconName: 'Dumbbell',
    xpThreshold: 200,
    isUnlocked: false
  },
  {
    id: 'mood-master',
    title: 'Mindful Mover',
    description: 'Checked in your mood 3 times to honor your body and feelings.',
    iconName: 'HeartHandshake',
    xpThreshold: 150,
    isUnlocked: false
  },
  {
    id: 'consistent-streak',
    title: 'Habit Hero',
    description: 'Built a 3-day active or recovery streak.',
    iconName: 'Flame',
    xpThreshold: 300,
    isUnlocked: false
  },
  {
    id: 'protein-champion',
    title: 'Desi Protein Pro',
    description: 'Logged meals reaching your daily protein goal.',
    iconName: 'UtensilsCrossed',
    xpThreshold: 250,
    isUnlocked: false
  },
  {
    id: 'recovery-mindset',
    title: 'Rest & Repair',
    description: 'Completed an active recovery, mobility, or breathwork session.',
    iconName: 'Sparkles',
    xpThreshold: 100,
    isUnlocked: false
  },
  {
    id: 'level-5-warrior',
    title: 'Iron Will',
    description: 'Reached Level 5 in FitMood!',
    iconName: 'Trophy',
    xpThreshold: 1000,
    isUnlocked: false
  }
];

export const INITIAL_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'dc-1',
    title: 'Morning Water & Mood Check',
    description: 'Drink a glass of water and complete your daily mood check-in.',
    xpReward: 30,
    isCompleted: false
  },
  {
    id: 'dc-2',
    title: 'Finish Today’s Workout',
    description: 'Complete any 5 to 25 minute routine matched to your mood.',
    xpReward: 100,
    isCompleted: false
  },
  {
    id: 'dc-3',
    title: 'Log One High-Protein Meal',
    description: 'Add dal, soy chunks, boiled eggs, or sattu to your food log.',
    xpReward: 40,
    isCompleted: false
  }
];

export function calculateLevelFromXP(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  // Level threshold: 200 XP per level
  const xpPerLevel = 250;
  const level = Math.max(1, Math.floor(xp / xpPerLevel) + 1);
  const currentLevelBase = (level - 1) * xpPerLevel;
  const currentLevelXp = xp - currentLevelBase;
  const nextLevelXp = xpPerLevel;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));

  return { level, currentLevelXp, nextLevelXp, progressPercent };
}

export function getPlantStage(xp: number): { stageName: string; stageNumber: number; description: string; emoji: string } {
  if (xp < 100) {
    return { stageName: 'Sprouting Seed', stageNumber: 1, description: 'Your wellness habit is taking root in fertile soil.', emoji: '🌱' };
  } else if (xp < 350) {
    return { stageName: 'Young Sapling', stageNumber: 2, description: 'Fresh green leaves are reaching toward the light!', emoji: '🌿' };
  } else if (xp < 800) {
    return { stageName: 'Thriving Plant', stageNumber: 3, description: 'Sturdy stems and deep roots built from daily movement.', emoji: '🪴' };
  } else if (xp < 1500) {
    return { stageName: 'Blooming Bonsai', stageNumber: 4, description: 'Vibrant blossoms showing your sustained dedication!', emoji: '🌸' };
  } else {
    return { stageName: 'Mighty Wellness Tree', stageNumber: 5, description: 'A resilient powerhouse providing shade and inspiration.', emoji: '🌳' };
  }
}
