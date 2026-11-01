import { WorkoutPlan, UserProfile, MoodType, EquipmentOption } from '../types';
import { EXERCISES_DATABASE } from '../data/exercisesData';

/**
 * Returns a normalized array of all equipment options available to the user.
 */
export function getUserEquipment(profile: UserProfile | null): EquipmentOption[] {
  if (!profile) return ['none'];

  const list: EquipmentOption[] = [];

  if (Array.isArray(profile.availableEquipment) && profile.availableEquipment.length > 0) {
    list.push(...profile.availableEquipment);
  } else if (profile.equipment) {
    list.push(profile.equipment as EquipmentOption);
  }

  if (list.length === 0) {
    list.push('none');
  }

  return list;
}

/**
 * Maps any equipment-dependent exercise to a verified bodyweight / zero-equipment alternative.
 */
export function getSafeBodyweightAlternative(exerciseId: string, category: string = 'full_body'): string {
  const map: Record<string, string> = {
    'pull-ups': 'doorframe-rows',
    'chin-up': 'doorframe-rows',
    'assisted-pull-up': 'doorframe-rows',
    'safe-pull-ups': 'doorframe-rows',
    'dumbbell-rows': 'doorframe-rows',
    'resistance-band-rows': 'doorframe-rows',
    'resistance-band-pull-aparts': 'scapular-push-up',
    'dumbbell-shoulder-press': 'pike-push-up',
    'dumbbell-romanian-deadlift': 'hip-hinge-good-mornings',
    'banded-squat': 'bodyweight-squat',
    'chair-dips': 'incline-push-up',
    'chair-step-ups': 'reverse-lunge',
  };

  if (map[exerciseId]) {
    return map[exerciseId];
  }

  // Fallback by category
  if (category === 'upper') return 'incline-push-up';
  if (category === 'lower') return 'bodyweight-squat';
  if (category === 'core') return 'dead-bug';
  return 'incline-push-up';
}

/**
 * Checks whether an entire workout plan is compatible with the user's owned equipment.
 */
export function isWorkoutCompatible(plan: WorkoutPlan, userEquipment: EquipmentOption[]): boolean {
  // If user has full gym access, they have access to all machines and free weights
  if (userEquipment.includes('gym_access')) return true;

  // If plan requires no equipment or only yoga mat, it is universal
  if (!plan.requiredEquipment || plan.requiredEquipment.length === 0 || plan.requiredEquipment.includes('none')) {
    // Also verify individual exercises inside the plan
    return plan.exercises.every((item) => {
      const ex = EXERCISES_DATABASE.find((e) => e.id === item.exerciseId);
      if (!ex) return true;
      const needed = ex.equipmentNeeded;
      if (needed === 'none' || needed === 'yoga_mat') return true;
      return userEquipment.includes(needed as EquipmentOption);
    });
  }

  // Every required equipment piece must be present in userEquipment
  return plan.requiredEquipment.every((req) => {
    if (req === 'none' || req === 'yoga_mat') return true;
    return userEquipment.includes(req);
  });
}

/**
 * Adapts a workout plan to the user's available equipment, replacing any unowned equipment movements
 * with safe bodyweight alternatives so the user is never stuck.
 */
export function adaptWorkoutPlan(plan: WorkoutPlan, userEquipment: EquipmentOption[]): WorkoutPlan {
  if (userEquipment.includes('gym_access')) return plan;

  let hasReplacements = false;
  const adaptedExercises = plan.exercises.map((item) => {
    const ex = EXERCISES_DATABASE.find((e) => e.id === item.exerciseId);
    if (!ex) return item;

    const needed = ex.equipmentNeeded;
    if (needed !== 'none' && needed !== 'yoga_mat' && !userEquipment.includes(needed as EquipmentOption)) {
      hasReplacements = true;
      const subId = getSafeBodyweightAlternative(ex.id, ex.category);
      return {
        ...item,
        exerciseId: subId,
      };
    }
    return item;
  });

  return {
    ...plan,
    exercises: adaptedExercises,
    equipmentSummary: hasReplacements ? 'Adapted: Bodyweight Alternatives' : plan.equipmentSummary,
  };
}

/**
 * Selects the optimal recommended workout based on user's exact equipment, mood, goal, and level.
 */
export function getRecommendedWorkout(
  plans: WorkoutPlan[],
  profile: UserProfile | null,
  todayMood: MoodType | null
): WorkoutPlan {
  const userEquipment = getUserEquipment(profile);

  // Filter plans strictly by equipment compatibility
  const compatiblePlans = plans.filter((p) => isWorkoutCompatible(p, userEquipment));
  const pool = compatiblePlans.length > 0 ? compatiblePlans : plans.map((p) => adaptWorkoutPlan(p, userEquipment));

  // 1. Mood-based match
  if (todayMood) {
    const moodMatch = pool.find((p) => p.suitedMoods.includes(todayMood));
    if (moodMatch) {
      return adaptWorkoutPlan(moodMatch, userEquipment);
    }
  }

  // 2. Goal-based match
  if (profile?.fitnessGoal) {
    const goalMatch = pool.find((p) => p.suitedGoals.includes(profile.fitnessGoal!));
    if (goalMatch) {
      return adaptWorkoutPlan(goalMatch, userEquipment);
    }
  }

  // 3. Fallback to first compatible plan
  return adaptWorkoutPlan(pool[0], userEquipment);
}
