export type Gender = 'male' | 'female' | 'other';

export type FitnessGoal = 'build_muscle' | 'lose_fat' | 'maintain' | 'strength' | 'general_fitness';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutLocation = 'home' | 'gym';

export type EquipmentOption =
  | 'none'
  | 'yoga_mat'
  | 'resistance_bands'
  | 'dumbbells'
  | 'barbell'
  | 'pull_up_bar'
  | 'push_up_bars'
  | 'kettlebell'
  | 'bench'
  | 'gym_access'
  | 'other';

export type DietaryPreference = 'vegetarian' | 'vegan' | 'eggetarian' | 'non_vegetarian';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type MoodType = 'energetic' | 'happy' | 'normal' | 'tired' | 'stressed' | 'low_motivation';

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  gender?: Gender;
  fitnessGoal?: FitnessGoal;
  experienceLevel?: ExperienceLevel;
  workoutLocation?: WorkoutLocation;
  equipment?: EquipmentOption | string;
  availableEquipment?: EquipmentOption[];
  workoutDurationMinutes?: number;
  dietaryPreference?: DietaryPreference;
  activityLevel?: ActivityLevel;
  allergies?: string;
  limitations?: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate?: string;
  theme?: AppThemeId;
  themeMode?: 'light' | 'dark';
  isPregnantOrMedicallyRestricted?: boolean;
  habits?: HabitItem[];
  habitLogs?: { [date: string]: string[] }; // Map date (YYYY-MM-DD) -> list of completed habit IDs
  createdAt: string;
  updatedAt: string;
}

export type AppThemeId =
  | 'sunset_orange'
  | 'light'
  | 'dark'
  | 'ocean_blue'
  | 'forest_green'
  | 'lavender';

export type ExerciseCategory = 'upper' | 'lower' | 'core' | 'full_body' | 'mobility' | 'recovery';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetMuscles: string[];
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  bodyRegions?: ('chest' | 'shoulders' | 'back' | 'biceps_triceps' | 'core' | 'glutes' | 'quads_hamstrings' | 'calves' | 'full_body')[];
  musclesExplanation?: string;
  equipmentNeeded: EquipmentOption | string;
  equipmentAlternatives?: string[];
  difficulty: ExperienceLevel;
  instructions: string[];
  breathingGuidance?: string;
  commonMistakes: string[];
  safetyTips: string[];
  easierAlternative: string;
  harderProgression?: string;
  defaultSets: number;
  defaultRepsOrSeconds: string;
  restIntervalSeconds: number;
  isPullUpOrNeedsBar?: boolean;
  svgBadge?: string;
  videoUrl?: string;
  secondaryVideoUrl?: string;
  videoSource?: string;
  secondaryVideoSource?: string;
  videoType?: 'embed' | 'direct';
  videoDurationSec?: number;
  isVerifiedVideo?: boolean;
  fallbackUrl?: string;
  youtubeId?: string;
  generatedVideoUrl?: string;
  videoGenerationStatus?: 'none' | 'generating' | 'ready' | 'failed' | 'fallback_animated';
  videoModelSource?: string;
}

export interface BadgeToastItem {
  id: string;
  badge: Badge;
  unlockedAt: string;
  bonusXp?: number;
}

export interface WarmupExercise {
  id: string;
  name: string;
  durationSeconds: number;
  instructions: string;
  targetJoints: string[];
  tips: string;
  videoUrl?: string;
}

export interface WarmupRoutine {
  id: string;
  title: string;
  description: string;
  suitedCategory: ExerciseCategory | 'general';
  totalDurationMinutes: number;
  exercises: WarmupExercise[];
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  streakDays: number;
  plantStageEmoji: string;
  plantStageName: string;
  lastActive: string;
  rank?: number;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  userId?: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  createdAt?: string;
  isError?: boolean;
  isFallback?: boolean;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  suitedMoods: MoodType[];
  suitedGoals: FitnessGoal[];
  durationMinutes: number;
  difficulty: ExperienceLevel;
  requiredEquipment?: EquipmentOption[];
  equipmentSummary?: string;
  warmUp: string[];
  exercises: {
    exerciseId: string;
    sets: number;
    repsOrSeconds: string;
    restSeconds: number;
  }[];
  coolDown: string[];
  recommendationReason?: string;
}

export interface MoodCheckIn {
  id: string;
  userId: string;
  mood: MoodType;
  note?: string;
  workoutRecommendedId?: string;
  isRestDay: boolean;
  date: string;
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  planId: string;
  planTitle: string;
  durationMinutes: number;
  completedExercisesCount: number;
  prescribedSetsCount?: number;
  completedSetsCount?: number;
  skippedExercisesCount?: number;
  userFeedback?: string;
  xpEarned: number;
  date: string;
  completedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'protein' | 'grain' | 'dairy' | 'snack' | 'vegetable';
  typicalMeal: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any';
  portionDescription: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams?: number;
  dietaryType: DietaryPreference;
  budgetRating: 1 | 2 | 3; // 1 = very cheap, 2 = moderate, 3 = premium
  budgetSubstituteTip?: string;
  allergens?: string[];
  isApproximate?: boolean;
}

export interface FoodLog {
  id: string;
  userId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  portion: string;
  calories: number;
  proteinGrams: number;
  carbsGrams?: number;
  fatsGrams?: number;
  fiberGrams?: number;
  isCustom?: boolean;
  date: string;
  createdAt: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  weightKg: number;
  waistCm?: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpThreshold?: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
}

export interface MealComboPlan {
  id: string;
  name: string;
  dietaryType: DietaryPreference;
  totalCalories: number;
  totalProteinGrams: number;
  budgetRating: 1 | 2 | 3;
  description: string;
  meals: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    items: string;
    calories: number;
    proteinGrams: number;
  }[];
}

export interface CalorieCalculationResult {
  bmr: number;
  maintenanceCalories: number;
  targetCalories: number;
  goalType: FitnessGoal;
  proteinGramsTarget: number;
  carbsGramsTarget: number;
  fatsGramsTarget: number;
  isSafetyRestricted?: boolean;
  safetyReason?: string;
  explanation: string;
}

export type HabitCategory =
  | 'hydration'
  | 'sleep'
  | 'movement'
  | 'nutrition'
  | 'mindset'
  | 'recovery'
  | 'wellness'
  | 'custom';

export interface HabitItem {
  id: string;
  title: string;
  category: HabitCategory;
  icon: string;
  description?: string;
  targetCount?: number;
  unit?: string;
  color?: string;
  isCustom?: boolean;
  createdAt: string;
}

export interface HabitDayLog {
  date: string; // YYYY-MM-DD
  completedHabitIds: string[];
}

export interface HabitStreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysWithCompletions: number;
  monthCompletionRate: number;
  totalHabitsCompleted: number;
}

export interface DailyWaterLog {
  userId: string;
  date: string; // YYYY-MM-DD
  glasses: number;
  targetGlasses?: number;
  updatedAt?: string;
}
