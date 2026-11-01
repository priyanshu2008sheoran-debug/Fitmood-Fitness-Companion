import { WorkoutPlan, ExerciseCategory, ExperienceLevel, FitnessGoal, MoodType } from '../types';

export interface AiWorkoutParameters {
  goal: FitnessGoal | string;
  availableTime: number;
  fitnessLevel: ExperienceLevel | string;
  limitations?: string;
  focusArea: 'full_body' | 'upper' | 'lower' | 'core' | 'mobility' | 'recovery';
  equipment?: string;
  mood?: MoodType | string;
  userName?: string;
}

export interface AiGeneratedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  repsOrSeconds: string;
  restSeconds: number;
  targetMuscle: string;
  coachingCue: string;
  beginnerAlternative?: string;
}

export interface AiGeneratedRoutine {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  durationMinutes: number;
  difficulty: ExperienceLevel;
  estimatedCaloriesBurned: number;
  targetMuscles: string[];
  warmUp: string[];
  exercises: AiGeneratedExercise[];
  coolDown: string[];
  recommendationReason: string;
  coachTip: string;
  createdAt?: string;
  isAiGenerated?: boolean;
}

export const aiWorkoutService = {
  // Generate a customized routine via Gemini endpoint
  async generateRoutine(params: AiWorkoutParameters): Promise<{
    routine: AiGeneratedRoutine;
    isAiGenerated: boolean;
    status: string;
  }> {
    try {
      const response = await fetch('/api/gemini/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data && data.routine) {
        return {
          routine: data.routine,
          isAiGenerated: Boolean(data.isAiGenerated),
          status: data.status || 'success',
        };
      }
      throw new Error('No routine data returned from AI server.');
    } catch (err: any) {
      console.warn('Network error reaching AI Workout Generator, creating client fallback:', err);
      // Generate client-side safety fallback
      const fallback = this.generateClientFallback(params);
      return {
        routine: fallback,
        isAiGenerated: false,
        status: 'client_fallback',
      };
    }
  },

  // Convert an AiGeneratedRoutine to a valid WorkoutPlan ready to be played in WorkoutPlayerModal
  convertToWorkoutPlan(routine: AiGeneratedRoutine): WorkoutPlan {
    const validCategory: ExerciseCategory = ['upper', 'lower', 'core', 'full_body', 'mobility', 'recovery'].includes(
      routine.category
    )
      ? routine.category
      : 'full_body';

    const validDifficulty: ExperienceLevel = ['beginner', 'intermediate', 'advanced'].includes(routine.difficulty)
      ? routine.difficulty
      : 'beginner';

    return {
      id: routine.id || `custom-ai-${Date.now()}`,
      title: routine.title,
      description: routine.description,
      category: validCategory,
      suitedMoods: ['energetic', 'happy', 'normal', 'tired', 'low_motivation'],
      suitedGoals: ['build_muscle', 'lose_fat', 'maintain', 'strength', 'general_fitness'],
      durationMinutes: routine.durationMinutes,
      difficulty: validDifficulty,
      warmUp: routine.warmUp || ['Marching in Place (45s)', 'Arm Swings (45s)', 'Gentle Torso Twists (45s)'],
      exercises: routine.exercises.map((ex) => ({
        exerciseId: ex.exerciseId || 'wall-push-up',
        sets: ex.sets || 3,
        repsOrSeconds: ex.repsOrSeconds || '10-12 reps',
        restSeconds: ex.restSeconds || 45,
      })),
      coolDown: routine.coolDown || ['Child’s Pose Breathing (60s)', 'Standing Quad Stretch (30s/leg)'],
      recommendationReason: routine.recommendationReason,
    };
  },

  // Save routine to user's saved list in localStorage
  saveRoutineToLocal(userId: string, routine: AiGeneratedRoutine): void {
    try {
      const key = `fitmood_custom_ai_routines_${userId || 'guest'}`;
      const existing = this.getSavedRoutines(userId);
      const filtered = existing.filter((r) => r.id !== routine.id);
      const updated = [{ ...routine, createdAt: new Date().toISOString() }, ...filtered].slice(0, 20);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save custom AI routine to localStorage:', err);
    }
  },

  // Get saved routines from localStorage
  getSavedRoutines(userId: string): AiGeneratedRoutine[] {
    try {
      const key = `fitmood_custom_ai_routines_${userId || 'guest'}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // Delete saved routine
  deleteSavedRoutine(userId: string, routineId: string): void {
    try {
      const key = `fitmood_custom_ai_routines_${userId || 'guest'}`;
      const existing = this.getSavedRoutines(userId);
      const updated = existing.filter((r) => r.id !== routineId);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete custom routine:', err);
    }
  },

  // Client-side fallback generator for offline resilience
  generateClientFallback(params: AiWorkoutParameters): AiGeneratedRoutine {
    const timeNum = params.availableTime || 15;
    const isBeg = params.fitnessLevel === 'beginner';
    const estCal = Math.round(timeNum * (isBeg ? 5.5 : 7.2));

    return {
      id: `client-ai-${Date.now()}`,
      title: `${params.userName || 'Athlete'}'s ${timeNum}-Min Calisthenics Blueprint`,
      description: `Hyper-customized bodyweight conditioning routine engineered to build lean strength without gym equipment.`,
      category: params.focusArea || 'full_body',
      durationMinutes: timeNum,
      difficulty: (params.fitnessLevel as ExperienceLevel) || 'beginner',
      estimatedCaloriesBurned: estCal,
      targetMuscles: ['Chest', 'Core Stabilizers', 'Quadriceps', 'Glutes', 'Upper Back'],
      warmUp: [
        'Arm Circles & Shoulder Rolls (45s)',
        'Marching in Place with Knee Drives (45s)',
        'Gentle Torso Rotations with Soft Knees (45s)',
      ],
      exercises: [
        {
          exerciseId: isBeg ? 'wall-push-up' : 'standard-push-up',
          exerciseName: isBeg ? 'Incline / Wall Push-Ups' : 'Floor Push-Ups',
          sets: 3,
          repsOrSeconds: isBeg ? '10-12 reps' : '12-15 reps',
          restSeconds: 45,
          targetMuscle: 'Chest, Shoulders & Triceps',
          coachingCue: 'Keep elbows tucked at a 45-degree angle; core locked tight.',
          beginnerAlternative: 'Elevate hands on a study table or wall.',
        },
        {
          exerciseId: isBeg ? 'chair-squats' : 'bodyweight-squat',
          exerciseName: isBeg ? 'Chair Squats' : 'Bodyweight Air Squats',
          sets: 3,
          repsOrSeconds: '12-15 reps',
          restSeconds: 45,
          targetMuscle: 'Quadriceps, Glutes & Hip Stabilizers',
          coachingCue: 'Drive knees outward over toes, chest proud and tall.',
          beginnerAlternative: 'Hold onto a chair for balance.',
        },
        {
          exerciseId: 'bird-dog',
          exerciseName: 'Bird-Dog Posterior Chain Reaches',
          sets: 3,
          repsOrSeconds: '8 reps / side (2s hold)',
          restSeconds: 30,
          targetMuscle: 'Erector Spinae & Glute Medius',
          coachingCue: 'Reach opposite arm and leg long; avoid arching lower back.',
          beginnerAlternative: 'Move legs only first while hands stay grounded.',
        },
        {
          exerciseId: 'plank',
          exerciseName: 'Forearm Core Plank',
          sets: 2,
          repsOrSeconds: isBeg ? '20-25 sec' : '35-45 sec',
          restSeconds: 45,
          targetMuscle: 'Transverse Abdominis & Serratus',
          coachingCue: 'Push floor away through elbows; squeeze glutes tight.',
          beginnerAlternative: 'Drop to knees for modified knee plank.',
        },
      ],
      coolDown: [
        'Child’s Pose Breathing (60s)',
        'Standing Quad & Hip Flexor Stretch (30s / leg)',
        'Doorframe Chest Opener (45s)',
      ],
      recommendationReason: `Calibrated specifically to your ${params.availableTime}m schedule, ${params.fitnessLevel} level, and ${params.goal} target.`,
      coachTip: `Consistency beats sporadic high intensity every single time. Move with intention and control your breathing!`,
      createdAt: new Date().toISOString(),
      isAiGenerated: false,
    };
  },
};
