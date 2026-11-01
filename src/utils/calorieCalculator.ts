import { ActivityLevel, FitnessGoal, Gender, CalorieCalculationResult } from '../types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { multiplier: number; label: string; description: string }> = {
  sedentary: { multiplier: 1.2, label: 'Sedentary', description: 'Desk job, little to no intentional exercise' },
  light: { multiplier: 1.375, label: 'Lightly Active', description: 'Light walking or exercise 1-3 days/week' },
  moderate: { multiplier: 1.55, label: 'Moderately Active', description: 'Moderate exercise/workouts 3-5 days/week' },
  active: { multiplier: 1.725, label: 'Very Active', description: 'Hard exercise/sports 6-7 days/week' },
  very_active: { multiplier: 1.9, label: 'Extra Active', description: 'Physical job or twice-daily rigorous training' }
};

// Compendium of Physical Activities MET Ratings for Calisthenics & Movement
export interface ExerciseMetDefinition {
  id: string;
  label: string;
  met: number;
  description: string;
}

export const EXERCISE_MET_RATES: Record<string, ExerciseMetDefinition> = {
  calisthenics_moderate: {
    id: 'calisthenics_moderate',
    label: 'Bodyweight Calisthenics (Moderate)',
    met: 5.0,
    description: 'Controlled push-ups, bodyweight squats, lunges, regular pauses'
  },
  calisthenics_vigorous: {
    id: 'calisthenics_vigorous',
    label: 'Calisthenics Circuit (Vigorous)',
    met: 8.0,
    description: 'High tempo, pull-ups, dips, jump squats, minimal rest'
  },
  warmup_mobility: {
    id: 'warmup_mobility',
    label: 'Joint Mobility & Warm-Up',
    met: 3.2,
    description: 'Arm circles, hip rotations, cat-cows, dynamic scapular prep'
  },
  core_abs: {
    id: 'core_abs',
    label: 'Core & Abdominal Conditioning',
    met: 4.2,
    description: 'Planks, hollow body holds, crunches, bird-dogs'
  },
  hiit_cardio: {
    id: 'hiit_cardio',
    label: 'High-Intensity Calisthenics / Burpees',
    met: 8.8,
    description: 'Burpees, mountain climbers, explosive pushups'
  },
  recovery_stretching: {
    id: 'recovery_stretching',
    label: 'Cool-Down & Breathwork',
    met: 2.5,
    description: 'Deep breathing, static stretches, parasympathetic relaxation'
  }
};

/**
 * Scientific Active Calorie Expenditure estimation via Metabolic Equivalent of Task (MET)
 * Formula: Calories (kcal) = (MET × 3.5 × weightInKg / 200) × durationInMinutes
 */
export function estimateExerciseCaloriesBurned(params: {
  exerciseTypeId?: string;
  durationMinutes: number;
  weightKg?: number;
}): { caloriesBurned: number; metUsed: number; formula: string } {
  const { exerciseTypeId = 'calisthenics_moderate', durationMinutes, weightKg = 68 } = params;

  const validWeight = Math.max(20, Math.min(350, weightKg));
  const validDuration = Math.max(1, Math.min(360, durationMinutes));

  const def = EXERCISE_MET_RATES[exerciseTypeId] || EXERCISE_MET_RATES.calisthenics_moderate;
  const met = def.met;

  // Standard ACSM metabolic formula: (MET * 3.5 * kg / 200) * minutes
  const caloriesBurned = Math.round((met * 3.5 * validWeight / 200) * validDuration);

  return {
    caloriesBurned,
    metUsed: met,
    formula: `(${met} MET × 3.5 × ${validWeight} kg / 200) × ${validDuration} min`
  };
}

/**
 * Validate input metrics with granular user-friendly errors
 */
export function validateCalorieInputs(params: {
  age?: number | string;
  heightCm?: number | string;
  weightKg?: number | string;
}): { isValid: boolean; errors: { age?: string; height?: string; weight?: string } } {
  const errors: { age?: string; height?: string; weight?: string } = {};

  const numAge = Number(params.age);
  if (!params.age || isNaN(numAge)) {
    errors.age = 'Please enter your age';
  } else if (numAge < 10 || numAge > 115) {
    errors.age = 'Age must be between 10 and 115';
  }

  const numHeight = Number(params.heightCm);
  if (!params.heightCm || isNaN(numHeight)) {
    errors.height = 'Please enter your height';
  } else if (numHeight < 60 || numHeight > 260) {
    errors.height = 'Height must be between 60 and 260 cm';
  }

  const numWeight = Number(params.weightKg);
  if (!params.weightKg || isNaN(numWeight)) {
    errors.weight = 'Please enter your weight';
  } else if (numWeight < 25 || numWeight > 350) {
    errors.weight = 'Weight must be between 25 and 350 kg';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Daily Caloric Needs calculation using the Mifflin - St Jeor Equation
 */
export function calculateCalories(params: {
  age?: number;
  heightCm?: number;
  weightKg?: number;
  gender?: Gender;
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
  isPregnantOrMedicallyRestricted?: boolean;
}): CalorieCalculationResult | null {
  const {
    age,
    heightCm,
    weightKg,
    gender = 'male',
    activityLevel = 'moderate',
    fitnessGoal = 'general_fitness',
    isPregnantOrMedicallyRestricted = false
  } = params;

  if (!age || !heightCm || !weightKg) {
    return null;
  }

  // Safety check 1: Under 18 restriction for weight-loss targets
  if (age < 18 && fitnessGoal === 'lose_fat') {
    return {
      bmr: 0,
      maintenanceCalories: 0,
      targetCalories: 0,
      goalType: fitnessGoal,
      proteinGramsTarget: 0,
      carbsGramsTarget: 0,
      fatsGramsTarget: 0,
      isSafetyRestricted: true,
      safetyReason:
        'Under 18 Notice: Automatic caloric deficit targets are not prescribed for adolescents whose bodies are actively growing and developing bones, organs, and hormones. Please prioritize intuitive eating, balanced whole foods, and joyful movement rather than restriction.',
      explanation: 'Calorie deficit disabled for individuals under 18 years of age.'
    };
  }

  // Safety check 2: Pregnancy or medical / eating disorder restriction
  if (isPregnantOrMedicallyRestricted) {
    return {
      bmr: 0,
      maintenanceCalories: 0,
      targetCalories: 0,
      goalType: fitnessGoal,
      proteinGramsTarget: 0,
      carbsGramsTarget: 0,
      fatsGramsTarget: 0,
      isSafetyRestricted: true,
      safetyReason:
        'Health Notice: If you are currently pregnant, nursing, recovering from an eating disorder, or managing a metabolic medical condition, automated calorie prescriptions are unsafe. Please consult a qualified clinical dietitian or physician for tailored guidance.',
      explanation: 'Automated calorie goals disabled for medical safety.'
    };
  }

  // Mifflin - St Jeor Equation
  // BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + s
  // where s is +5 for males, -161 for females, and -78 for other/neutral average
  let s = 5;
  if (gender === 'female') {
    s = -161;
  } else if (gender === 'other') {
    s = -78;
  }

  const bmr = Math.round((10 * weightKg) + (6.25 * heightCm) - (5 * age) + s);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel]?.multiplier || 1.375;
  const maintenanceCalories = Math.round(bmr * multiplier);

  let targetCalories = maintenanceCalories;
  let explanation = '';

  switch (fitnessGoal) {
    case 'build_muscle':
    case 'strength':
      // Gentle surplus of +250 kcal
      targetCalories = maintenanceCalories + 250;
      explanation = `Based on your calculated maintenance of ~${maintenanceCalories} kcal/day (TDEE), a modest surplus of +250 kcal (~${targetCalories} kcal) provides energy to synthesize new muscle tissue without unwanted excess fat accumulation.`;
      break;

    case 'lose_fat':
      // Modest sustainable deficit of -350 kcal, never dropping below safe floor (1250 for females, 1500 for males)
      const safeFloor = gender === 'female' ? 1250 : 1500;
      targetCalories = Math.max(safeFloor, maintenanceCalories - 350);
      explanation = `Based on a maintenance of ~${maintenanceCalories} kcal/day, a gentle deficit of -350 kcal (~${targetCalories} kcal) promotes steady, sustainable fat loss (~0.3-0.4 kg/week) while protecting lean muscle mass and metabolic health.`;
      break;

    case 'maintain':
    case 'general_fitness':
    default:
      targetCalories = maintenanceCalories;
      explanation = `Based on your physical parameters and activity level, ~${maintenanceCalories} kcal/day provides energy balance to maintain weight while enhancing stamina, cardiovascular health, and muscle tone.`;
      break;
  }

  // Macronutrient distribution
  // Protein: 1.6g to 2.0g per kg of body weight for active/strength goals, 1.2g to 1.5g for general fitness
  const proteinPerKg = (fitnessGoal === 'build_muscle' || fitnessGoal === 'strength') ? 1.8 : 1.4;
  const proteinGramsTarget = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinGramsTarget * 4;

  // Fats: ~25% of total calories
  const fatsCalories = Math.round(targetCalories * 0.25);
  const fatsGramsTarget = Math.round(fatsCalories / 9);

  // Carbs: remaining calories
  const carbsCalories = Math.max(0, targetCalories - proteinCalories - fatsCalories);
  const carbsGramsTarget = Math.round(carbsCalories / 4);

  return {
    bmr,
    maintenanceCalories,
    targetCalories,
    goalType: fitnessGoal,
    proteinGramsTarget,
    carbsGramsTarget,
    fatsGramsTarget,
    isSafetyRestricted: false,
    explanation
  };
}
