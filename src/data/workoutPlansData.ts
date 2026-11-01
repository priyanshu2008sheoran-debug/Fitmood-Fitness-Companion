import { WorkoutPlan } from '../types';

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'full-body-beginner',
    title: 'Full-Body Foundation Routine',
    description: 'A friendly, balanced whole-body calisthenics routine that builds baseline functional strength without any equipment.',
    category: 'full_body',
    suitedMoods: ['energetic', 'happy', 'normal'],
    suitedGoals: ['general_fitness', 'build_muscle', 'lose_fat', 'strength'],
    durationMinutes: 20,
    difficulty: 'beginner',
    requiredEquipment: ['none'],
    equipmentSummary: 'No equipment (Bodyweight only)',
    recommendationReason: 'Perfect foundational circuit targeting all primary muscle groups with safe progressive steps.',
    warmUp: [
      '30 seconds arm circles (small to large)',
      '30 seconds gentle torso twists',
      '10 light bodyweight air hinges'
    ],
    exercises: [
      { exerciseId: 'incline-push-up', sets: 3, repsOrSeconds: '10 reps', restSeconds: 45 },
      { exerciseId: 'bodyweight-squat', sets: 3, repsOrSeconds: '12 reps', restSeconds: 60 },
      { exerciseId: 'glute-bridge', sets: 3, repsOrSeconds: '12 reps', restSeconds: 45 },
      { exerciseId: 'dead-bug', sets: 3, repsOrSeconds: '8 reps / side', restSeconds: 45 },
      { exerciseId: 'calf-raise', sets: 2, repsOrSeconds: '15 reps', restSeconds: 30 }
    ],
    coolDown: [
      'Child’s pose stretch (45 seconds)',
      'Standing quad stretch (20 seconds each leg)',
      '3 deep diaphragmatic cleansing breaths'
    ]
  },
  {
    id: 'quick-5min-spark',
    title: '5-Minute Low-Motivation Spark',
    description: 'Designed specifically when energy or motivation feels low. Just 3 gentle, enjoyable movements to get your blood circulating without friction.',
    category: 'full_body',
    suitedMoods: ['low_motivation', 'tired'],
    suitedGoals: ['general_fitness', 'maintain', 'lose_fat'],
    durationMinutes: 5,
    difficulty: 'beginner',
    requiredEquipment: ['none'],
    equipmentSummary: 'No equipment (Zero friction)',
    recommendationReason: 'Ultra-low friction routine to celebrate showing up and kickstart positive neurochemistry.',
    warmUp: [
      'Shoulder rolls and gentle neck tilts'
    ],
    exercises: [
      { exerciseId: 'wall-push-up', sets: 2, repsOrSeconds: '8 reps', restSeconds: 30 },
      { exerciseId: 'bodyweight-squat', sets: 2, repsOrSeconds: '8 gentle reps', restSeconds: 30 },
      { exerciseId: 'cat-cow-stretch', sets: 1, repsOrSeconds: '6 calm breaths', restSeconds: 0 }
    ],
    coolDown: [
      'Standing chest opener and big smile'
    ]
  },
  {
    id: 'stress-relief-mobility',
    title: 'De-Stress & Mobility Flow',
    description: 'A soothing routine to release neck, back, and hip tension accumulated from studying or working at a desk.',
    category: 'mobility',
    suitedMoods: ['stressed', 'tired'],
    suitedGoals: ['general_fitness', 'maintain'],
    durationMinutes: 10,
    difficulty: 'beginner',
    requiredEquipment: ['none'],
    equipmentSummary: 'No equipment (Yoga mat optional)',
    recommendationReason: 'Calms the nervous system and frees up stiff spine and hip joints without elevating cortisol.',
    warmUp: [
      'Slow neck half-circles',
      'Shoulder shrugs and relaxed exhales'
    ],
    exercises: [
      { exerciseId: 'cat-cow-stretch', sets: 2, repsOrSeconds: '10 deep breaths', restSeconds: 30 },
      { exerciseId: 'bird-dog', sets: 2, repsOrSeconds: '6 reps / side', restSeconds: 30 },
      { exerciseId: 'glute-bridge', sets: 2, repsOrSeconds: '10 gentle reps', restSeconds: 30 },
      { exerciseId: 'childs-pose-breathing', sets: 1, repsOrSeconds: '90 seconds', restSeconds: 0 }
    ],
    coolDown: [
      'Seated deep belly breathing with 4-count inhale and 6-count exhale'
    ]
  },
  {
    id: 'upper-body-power',
    title: 'Upper-Body Calisthenics Sculpt',
    description: 'Focus on chest, shoulders, triceps, and upper-back stability using bodyweight angles and leverage.',
    category: 'upper',
    suitedMoods: ['energetic', 'happy'],
    suitedGoals: ['build_muscle', 'strength'],
    durationMinutes: 25,
    difficulty: 'intermediate',
    requiredEquipment: ['none'],
    equipmentSummary: 'No equipment (Bodyweight only)',
    recommendationReason: 'High muscle engagement for upper body when you have ample energy to push yourself.',
    warmUp: [
      'Arm circles and cross-body hugs (45 seconds)',
      'Wrist mobility rotations and gentle wall presses'
    ],
    exercises: [
      { exerciseId: 'standard-push-up', sets: 3, repsOrSeconds: '10-12 reps', restSeconds: 60 },
      { exerciseId: 'incline-push-up', sets: 3, repsOrSeconds: '12 reps', restSeconds: 45 },
      { exerciseId: 'scapular-push-up', sets: 3, repsOrSeconds: '12 reps', restSeconds: 30 },
      { exerciseId: 'plank', sets: 3, repsOrSeconds: '30 seconds', restSeconds: 45 },
      { exerciseId: 'wall-push-up', sets: 2, repsOrSeconds: '15 burn-out reps', restSeconds: 30 }
    ],
    coolDown: [
      'Doorway pectoral stretch (30 seconds each side)',
      'Overhead triceps stretch'
    ]
  },
  {
    id: 'lower-body-tone',
    title: 'Lower-Body Legs & Glutes Tone',
    description: 'Develop strong quads, hamstrings, calves, and resilient knees without any heavy barbell or gym fee.',
    category: 'lower',
    suitedMoods: ['energetic', 'normal'],
    suitedGoals: ['build_muscle', 'lose_fat', 'strength'],
    durationMinutes: 20,
    difficulty: 'beginner',
    requiredEquipment: ['none'],
    equipmentSummary: 'No equipment (Bodyweight only)',
    recommendationReason: 'Strengthens the largest muscle groups to boost metabolism and lower body stamina.',
    warmUp: [
      'Leg swings (forward-back and side-to-side)',
      'Ankle circles and high knee marches'
    ],
    exercises: [
      { exerciseId: 'bodyweight-squat', sets: 3, repsOrSeconds: '15 reps', restSeconds: 60 },
      { exerciseId: 'reverse-lunge', sets: 3, repsOrSeconds: '10 reps / leg', restSeconds: 60 },
      { exerciseId: 'hip-hinge-good-mornings', sets: 3, repsOrSeconds: '12 reps', restSeconds: 45 },
      { exerciseId: 'glute-bridge', sets: 3, repsOrSeconds: '15 reps', restSeconds: 45 },
      { exerciseId: 'calf-raise', sets: 3, repsOrSeconds: '20 reps', restSeconds: 30 }
    ],
    coolDown: [
      'Hamstring reach and calf wall stretch',
      'Gentle kneeling hip flexor stretch'
    ]
  },
  {
    id: 'core-fortress',
    title: 'Core Fortress & Posture Support',
    description: 'Target deep stabilizers and abdominal muscles for a pain-free lower back and athletic posture.',
    category: 'core',
    suitedMoods: ['normal', 'energetic', 'happy'],
    suitedGoals: ['general_fitness', 'strength', 'build_muscle'],
    durationMinutes: 15,
    difficulty: 'beginner',
    requiredEquipment: ['none'],
    equipmentSummary: 'No equipment (Yoga mat optional)',
    recommendationReason: 'Solidifies midline stability and protects the lumbar spine against slouching.',
    warmUp: [
      'Pelvic tilts on mat',
      'Gentle cat-cow spinal waves'
    ],
    exercises: [
      { exerciseId: 'dead-bug', sets: 3, repsOrSeconds: '10 reps / side', restSeconds: 45 },
      { exerciseId: 'bird-dog', sets: 3, repsOrSeconds: '8 reps / side', restSeconds: 45 },
      { exerciseId: 'reverse-crunch', sets: 3, repsOrSeconds: '12 reps', restSeconds: 30 },
      { exerciseId: 'plank', sets: 3, repsOrSeconds: '25-35 seconds', restSeconds: 45 },
      { exerciseId: 'glute-bridge', sets: 2, repsOrSeconds: '12 reps', restSeconds: 30 }
    ],
    coolDown: [
      'Cobra / Sphinx gentle abdominal stretch',
      'Child’s pose'
    ]
  },
  {
    id: 'resistance-bands-fullbody',
    title: 'Resistance-Band Full-Body Sculpt',
    description: 'Harness elastic tension to stimulate upper back, rear delts, glutes, and arms with zero joint impact.',
    category: 'full_body',
    suitedMoods: ['energetic', 'happy', 'normal'],
    suitedGoals: ['build_muscle', 'strength', 'general_fitness', 'lose_fat'],
    durationMinutes: 25,
    difficulty: 'beginner',
    requiredEquipment: ['resistance_bands'],
    equipmentSummary: 'Requires: Resistance bands',
    recommendationReason: 'Utilizes your resistance bands to train back muscles and posterior chain rarely loaded in pure calisthenics.',
    warmUp: [
      'Arm circles and band dislocates (45s)',
      'Bodyweight air squats and ankle rocks'
    ],
    exercises: [
      { exerciseId: 'resistance-band-rows', sets: 3, repsOrSeconds: '12-15 reps', restSeconds: 45 },
      { exerciseId: 'banded-squat', sets: 3, repsOrSeconds: '12-15 reps', restSeconds: 45 },
      { exerciseId: 'resistance-band-pull-aparts', sets: 3, repsOrSeconds: '15-20 reps', restSeconds: 30 },
      { exerciseId: 'glute-bridge', sets: 3, repsOrSeconds: '15 reps', restSeconds: 45 },
      { exerciseId: 'incline-push-up', sets: 3, repsOrSeconds: '10-12 reps', restSeconds: 45 }
    ],
    coolDown: [
      'Child’s pose with band stretch',
      'Doorframe chest opener'
    ]
  },
  {
    id: 'dumbbells-upper-strength',
    title: 'Dumbbell Upper-Body Hypertrophy',
    description: 'Targeted free-weight training for upper back, shoulders, chest, and arms using dumbbells.',
    category: 'upper',
    suitedMoods: ['energetic', 'happy'],
    suitedGoals: ['build_muscle', 'strength'],
    durationMinutes: 25,
    difficulty: 'intermediate',
    requiredEquipment: ['dumbbells'],
    equipmentSummary: 'Requires: Dumbbells (Bench optional)',
    recommendationReason: 'Leverages your dumbbells for direct vertical pressing and heavy single-arm rows to build upper body mass.',
    warmUp: [
      'Shoulder rolls and arm swings (45s)',
      'Light scapular push-ups'
    ],
    exercises: [
      { exerciseId: 'dumbbell-rows', sets: 3, repsOrSeconds: '10-12 reps / arm', restSeconds: 60 },
      { exerciseId: 'dumbbell-shoulder-press', sets: 3, repsOrSeconds: '10-12 reps', restSeconds: 60 },
      { exerciseId: 'standard-push-up', sets: 3, repsOrSeconds: '10-15 reps', restSeconds: 45 },
      { exerciseId: 'plank-shoulder-taps', sets: 3, repsOrSeconds: '16 total taps', restSeconds: 45 }
    ],
    coolDown: [
      'Overhead triceps stretch',
      'Standing chest opener'
    ]
  },
  {
    id: 'dumbbells-lower-rdl',
    title: 'Dumbbell Legs & Posterior Chain',
    description: 'Build hamstring resilience, glute power, and quad density with loaded dumbbell Romanian deadlifts and squats.',
    category: 'lower',
    suitedMoods: ['energetic', 'normal'],
    suitedGoals: ['build_muscle', 'strength', 'lose_fat'],
    durationMinutes: 25,
    difficulty: 'intermediate',
    requiredEquipment: ['dumbbells'],
    equipmentSummary: 'Requires: Dumbbells',
    recommendationReason: 'Puts your dumbbells to work with Romanian deadlifts and loaded squats for maximum lower body development.',
    warmUp: [
      'Hip swings and knee hugs (45s)',
      'Bodyweight Good Mornings'
    ],
    exercises: [
      { exerciseId: 'dumbbell-romanian-deadlift', sets: 3, repsOrSeconds: '10-12 reps', restSeconds: 60 },
      { exerciseId: 'split-squat', sets: 3, repsOrSeconds: '10 reps / leg', restSeconds: 45 },
      { exerciseId: 'single-leg-glute-bridge', sets: 3, repsOrSeconds: '10 reps / leg', restSeconds: 45 },
      { exerciseId: 'calf-raise', sets: 3, repsOrSeconds: '20 reps', restSeconds: 30 }
    ],
    coolDown: [
      'Seated hamstring reach',
      'Standing quad stretch'
    ]
  },
  {
    id: 'pullup-bar-calisthenics',
    title: 'Pull-Up Bar Back & Core Mastery',
    description: 'Take full advantage of your pull-up bar with overhand pull-ups, chin-ups, and core decompression.',
    category: 'upper',
    suitedMoods: ['energetic', 'happy'],
    suitedGoals: ['build_muscle', 'strength'],
    durationMinutes: 20,
    difficulty: 'intermediate',
    requiredEquipment: ['pull_up_bar'],
    equipmentSummary: 'Requires: Pull-up bar',
    recommendationReason: 'Tailored for athletes with a pull-up bar to achieve complete vertical pulling hypertrophy.',
    warmUp: [
      'Dead hang for 20-30 seconds',
      'Arm swings and shoulder dislocates'
    ],
    exercises: [
      { exerciseId: 'pull-ups', sets: 3, repsOrSeconds: '6-8 reps', restSeconds: 90 },
      { exerciseId: 'chin-up', sets: 3, repsOrSeconds: '6-8 reps', restSeconds: 90 },
      { exerciseId: 'assisted-pull-up', sets: 2, repsOrSeconds: '8-10 reps', restSeconds: 60 },
      { exerciseId: 'hollow-body-hold', sets: 3, repsOrSeconds: '25-30 seconds', restSeconds: 45 }
    ],
    coolDown: [
      'Passive bar hang with deep exhales',
      'Child’s pose stretch'
    ]
  },
  {
    id: 'cardio-hiit-burn',
    title: 'Zero-Impact Cardio & Heart Spark',
    description: 'Elevate heart rate, burn energy, and boost endorphins with zero floor jumping or neighbor-disturbing noise.',
    category: 'full_body',
    suitedMoods: ['energetic', 'happy', 'stressed'],
    suitedGoals: ['lose_fat', 'general_fitness'],
    durationMinutes: 18,
    difficulty: 'beginner',
    requiredEquipment: ['none'],
    equipmentSummary: 'No equipment (Quiet & apartment-friendly)',
    recommendationReason: 'High metabolic rate stimulation without pounding joint impact or gym equipment.',
    warmUp: [
      'Gentle ankle rocks and shoulder rolls',
      'Torso rotations with soft knees'
    ],
    exercises: [
      { exerciseId: 'marching-in-place', sets: 3, repsOrSeconds: '45 seconds', restSeconds: 30 },
      { exerciseId: 'low-impact-jumping-jacks', sets: 3, repsOrSeconds: '45 seconds', restSeconds: 30 },
      { exerciseId: 'butt-kicks', sets: 3, repsOrSeconds: '35 seconds', restSeconds: 30 },
      { exerciseId: 'shadow-boxing-punches', sets: 3, repsOrSeconds: '40 seconds', restSeconds: 30 },
      { exerciseId: 'skater-hops', sets: 3, repsOrSeconds: '30 seconds', restSeconds: 30 }
    ],
    coolDown: [
      'Slow walking in place (60s)',
      'Standing calf stretch against wall',
      'Chest opener breathing'
    ]
  },
  {
    id: 'rest-and-relaxation',
    title: 'Active Recovery & Breath Reset',
    description: 'Rest is where muscles grow and your mind resets. A non-strenuous session focused on breathing and gentle joint un-sticking.',
    category: 'recovery',
    suitedMoods: ['tired', 'stressed'],
    suitedGoals: ['general_fitness', 'maintain'],
    durationMinutes: 10,
    difficulty: 'beginner',
    requiredEquipment: ['none'],
    equipmentSummary: 'No equipment (Yoga mat optional)',
    recommendationReason: 'Promotes muscle repair and lowers heart rate variability stress without burning out.',
    warmUp: [
      'Slow side-to-side head rolls'
    ],
    exercises: [
      { exerciseId: 'childs-pose-breathing', sets: 1, repsOrSeconds: '90 seconds', restSeconds: 0 },
      { exerciseId: 'cat-cow-stretch', sets: 2, repsOrSeconds: '8 calm breaths', restSeconds: 30 },
      { exerciseId: 'hamstring-stretch', sets: 2, repsOrSeconds: '30s / leg', restSeconds: 15 }
    ],
    coolDown: [
      'Box breathing (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s) for 3 minutes'
    ]
  }
];
