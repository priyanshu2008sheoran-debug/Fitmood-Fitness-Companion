import { EquipmentOption, Exercise, WorkoutPlan, UserProfile, MoodType } from '../types';

export interface EquipmentItemMeta {
  id: EquipmentOption;
  label: string;
  description: string;
  category: 'bodyweight' | 'free_weights' | 'bars' | 'accessories';
}

export const EQUIPMENT_OPTIONS_LIST: EquipmentItemMeta[] = [
  {
    id: 'none',
    label: 'No equipment — bodyweight only',
    description: 'Push-ups, squats, lunges, glute bridges, planks and calisthenics',
    category: 'bodyweight'
  },
  {
    id: 'yoga_mat',
    label: 'Yoga mat',
    description: 'Cushioned floor comfort for core, mobility and stretches',
    category: 'accessories'
  },
  {
    id: 'resistance_bands',
    label: 'Resistance bands',
    description: 'Loop and tube bands for pulling, rows and assisted reps',
    category: 'accessories'
  },
  {
    id: 'dumbbells',
    label: 'Dumbbells',
    description: 'Fixed or adjustable hand weights for progressive resistance',
    category: 'free_weights'
  },
  {
    id: 'barbell',
    label: 'Barbell and weight plates',
    description: 'Standard or Olympic barbell with weight plates',
    category: 'free_weights'
  },
  {
    id: 'pull_up_bar',
    label: 'Pull-up bar',
    description: 'Doorway, wall-mounted, or calisthenics park pull-up bar',
    category: 'bars'
  },
  {
    id: 'push_up_bars',
    label: 'Push-up bars',
    description: 'Ergonomic parallettes for wrist relief and deep chest press',
    category: 'bars'
  },
  {
    id: 'kettlebell',
    label: 'Kettlebell',
    description: 'Cast iron bells for explosive swings, cleans and squats',
    category: 'free_weights'
  },
  {
    id: 'bench',
    label: 'Bench',
    description: 'Flat or adjustable training bench for presses and step-ups',
    category: 'accessories'
  },
  {
    id: 'gym_access',
    label: 'Gym access',
    description: 'Full commercial or community fitness center equipment',
    category: 'accessories'
  },
  {
    id: 'other',
    label: 'Other equipment',
    description: 'Suspension trainers, dip bars, jump rope, ab roller',
    category: 'accessories'
  }
];

export const EQUIPMENT_LABELS: Record<EquipmentOption, string> = {
  none: 'Bodyweight Only (No Equipment)',
  yoga_mat: 'Yoga Mat',
  resistance_bands: 'Resistance Bands',
  dumbbells: 'Dumbbells',
  barbell: 'Barbell & Plates',
  pull_up_bar: 'Pull-Up Bar',
  push_up_bars: 'Push-Up Bars',
  kettlebell: 'Kettlebell',
  bench: 'Workout Bench',
  gym_access: 'Full Gym Access',
  other: 'Specialized Gear'
};

/**
 * Normalizes user equipment list from profile.
 * Always includes 'none' (bodyweight) because every user has their bodyweight.
 */
export function getUserAvailableEquipment(profile?: UserProfile | null): EquipmentOption[] {
  if (!profile) return ['none'];

  const set = new Set<EquipmentOption>();
  set.add('none'); // Universal bodyweight fallback

  if (Array.isArray(profile.availableEquipment) && profile.availableEquipment.length > 0) {
    profile.availableEquipment.forEach((eq) => set.add(eq));
  } else if (profile.equipment) {
    set.add(profile.equipment as EquipmentOption);
  }

  return Array.from(set);
}

/**
 * Checks if a specific exercise can be safely performed with the user's available equipment.
 */
export function isExerciseCompatible(
  exercise: Exercise,
  userEquipment: EquipmentOption[]
): boolean {
  // If user has gym access, all standard equipment is accessible
  if (userEquipment.includes('gym_access')) return true;

  const required = exercise.equipmentNeeded as EquipmentOption;

  // Bodyweight movements need no equipment
  if (!required || required === 'none' || required === 'yoga_mat') {
    return true;
  }

  // Exact match with owned equipment
  return userEquipment.includes(required);
}

/**
 * Checks if a workout plan is compatible with the user's available equipment.
 */
export function isPlanCompatible(
  plan: WorkoutPlan,
  userEquipment: EquipmentOption[]
): boolean {
  if (userEquipment.includes('gym_access')) return true;

  const requiredList = plan.requiredEquipment || ['none'];

  // If plan only requires none or yoga_mat, it is always compatible
  const nonBodyweightReqs = requiredList.filter(
    (eq) => eq !== 'none' && eq !== 'yoga_mat'
  );

  if (nonBodyweightReqs.length === 0) return true;

  // All non-bodyweight equipment must be owned by the user
  return nonBodyweightReqs.every((req) =>
    userEquipment.includes(req as EquipmentOption)
  );
}

/**
 * Filter exercises strictly matching user equipment.
 */
export function filterCompatibleExercises(
  exercises: Exercise[],
  userEquipment: EquipmentOption[]
): Exercise[] {
  return exercises.filter((ex) => isExerciseCompatible(ex, userEquipment));
}

/**
 * Filter plans strictly matching user equipment.
 */
export function filterCompatiblePlans(
  plans: WorkoutPlan[],
  userEquipment: EquipmentOption[]
): WorkoutPlan[] {
  return plans.filter((plan) => isPlanCompatible(plan, userEquipment));
}

/**
 * Provides an equipment audit report for a plan given the user's equipment.
 */
export function getPlanEquipmentSummary(
  plan: WorkoutPlan,
  userEquipment: EquipmentOption[]
): {
  summaryText: string;
  isFullyMatched: boolean;
  missingEquipment: EquipmentOption[];
  equipmentBadges: string[];
} {
  const required = plan.requiredEquipment || ['none'];
  const missing: EquipmentOption[] = [];
  const badges: string[] = [];

  const hasGym = userEquipment.includes('gym_access');

  required.forEach((eq) => {
    const label = EQUIPMENT_LABELS[eq as EquipmentOption] || eq;
    badges.push(label);
    if (!hasGym && eq !== 'none' && eq !== 'yoga_mat' && !userEquipment.includes(eq as EquipmentOption)) {
      missing.push(eq as EquipmentOption);
    }
  });

  const isFullyMatched = missing.length === 0;
  const summaryText = plan.equipmentSummary || badges.join(', ') || 'No equipment (Bodyweight)';

  return {
    summaryText,
    isFullyMatched,
    missingEquipment: missing,
    equipmentBadges: badges
  };
}

/**
 * Selects the optimal recommended workout plan strictly adapting to:
 * 1. User equipment (must be 100% compatible)
 * 2. Today's mood (energetic, tired, stressed, etc.)
 * 3. User fitness goal
 * 4. Experience level
 */
export function getRecommendedWorkoutForUser(
  allPlans: WorkoutPlan[],
  userProfile: UserProfile | null,
  todayMood: MoodType | null
): {
  recommendedPlan: WorkoutPlan;
  matchReason: string;
  compatibleCount: number;
} {
  const userEquipment = getUserAvailableEquipment(userProfile);
  const compatiblePlans = filterCompatiblePlans(allPlans, userEquipment);

  // If no compatible plan somehow (fallback safety), use standard full body beginner
  const pool = compatiblePlans.length > 0 ? compatiblePlans : allPlans.filter(p => !p.requiredEquipment || p.requiredEquipment.includes('none'));
  const safeFallback = pool[0] || allPlans[0];

  const goal = userProfile?.fitnessGoal || 'general_fitness';
  const level = userProfile?.experienceLevel || 'beginner';

  // 1. Try matching both mood AND goal AND difficulty
  if (todayMood) {
    const perfectMatch = pool.find(
      (p) =>
        p.suitedMoods.includes(todayMood) &&
        p.suitedGoals.includes(goal) &&
        (p.difficulty === level || level === 'advanced')
    );
    if (perfectMatch) {
      return {
        recommendedPlan: perfectMatch,
        matchReason: `Customized for your ${todayMood.replace('_', ' ')} mood and ${goal.replace('_', ' ')} goal using your selected equipment.`,
        compatibleCount: pool.length
      };
    }

    // 2. Try matching mood within compatible equipment
    const moodMatch = pool.find((p) => p.suitedMoods.includes(todayMood));
    if (moodMatch) {
      return {
        recommendedPlan: moodMatch,
        matchReason: `Selected to match your current feeling (${todayMood.replace('_', ' ')}) using your verified equipment.`,
        compatibleCount: pool.length
      };
    }
  }

  // 3. Match user goal
  const goalMatch = pool.find((p) => p.suitedGoals.includes(goal));
  if (goalMatch) {
    return {
      recommendedPlan: goalMatch,
      matchReason: `Tailored for your ${goal.replace('_', ' ')} goal with your current available equipment.`,
      compatibleCount: pool.length
    };
  }

  return {
    recommendedPlan: safeFallback,
    matchReason: 'Balanced foundation routine verified 100% compatible with your available equipment.',
    compatibleCount: pool.length
  };
}
