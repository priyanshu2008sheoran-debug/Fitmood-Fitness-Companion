import { WarmupRoutine, ExerciseCategory } from '../types';

export const WARMUP_ROUTINES: WarmupRoutine[] = [
  {
    id: 'warmup-upper',
    title: 'Upper-Body Mobility & Shoulder Health',
    description: 'Prepares rotator cuffs, wrists, shoulder capsules, and upper spine for push-ups and upper calisthenics.',
    suitedCategory: 'upper',
    totalDurationMinutes: 3,
    exercises: [
      {
        id: 'w-arm-circles',
        name: 'Arm Swings & Chest Hugs',
        durationSeconds: 45,
        targetJoints: ['Shoulders (Glenohumeral)', 'Pectorals', 'Upper Back'],
        instructions: 'Stand tall. Swing arms wide to open chest, then cross them across your torso into an exaggerated hug. Alternate which arm crosses on top.',
        tips: 'Keep movements smooth and fluid without snapping the joints.'
      },
      {
        id: 'w-wrist-mobilizer',
        name: 'Wrist Waves & Palms Flexion',
        durationSeconds: 45,
        targetJoints: ['Wrists', 'Forearm Flexors & Extensors'],
        instructions: 'Interlace fingers and roll wrists in gentle figure-eights for 20 seconds. Then extend arms forward with palms facing away and gently pull fingers back.',
        tips: 'Essential before floor push-ups to prevent wrist compression discomfort.'
      },
      {
        id: 'w-scap-slides',
        name: 'Wall Angels / Scapular Slides',
        durationSeconds: 45,
        targetJoints: ['Scapula', 'Rotator Cuff', 'Thoracic Spine'],
        instructions: 'Stand with your back against a wall or in open space. Bend elbows at 90 degrees and slowly slide arms upward into a "Y" shape while keeping shoulder blades pinched back.',
        tips: 'Do not arch your lower back away from the wall.'
      },
      {
        id: 'w-thoracic-reach',
        name: 'Standing Torso Twists & Reach',
        durationSeconds: 45,
        targetJoints: ['Thoracic Spine', 'Obliques', 'Lats'],
        instructions: 'Feet hip-width apart. Gently rotate your torso from left to right, reaching your opposite hand across your body with soft knees.',
        tips: 'Allow your back heel to pivot naturally to protect your knees.'
      }
    ]
  },
  {
    id: 'warmup-lower',
    title: 'Hip Opener & Knee Pre-Activation',
    description: 'Increases synovial fluid in the hips, activates glutes, and primes ankles for squats, lunges, and calf raises.',
    suitedCategory: 'lower',
    totalDurationMinutes: 4,
    exercises: [
      {
        id: 'w-deep-squat-pry',
        name: 'Assisted Deep Squat Hold & Pry',
        durationSeconds: 60,
        targetJoints: ['Hips', 'Ankles', 'Adductors'],
        instructions: 'Hold onto a doorframe or chair. Lower down into a comfortable deep squat. Gently pry your knees outward with your elbows while keeping chest proud.',
        tips: 'Keep heels flat on the floor; hold onto support as much as needed.'
      },
      {
        id: 'w-leg-swings',
        name: 'Dynamic Leg Swings (Front & Back)',
        durationSeconds: 60,
        targetJoints: ['Hip Flexors', 'Hamstrings', 'Glutes'],
        instructions: 'Place one hand on a wall for balance. Swing your outside leg like a pendulum, forward to stretch hamstrings and backward to open hip flexors (30s per leg).',
        tips: 'Control the swing; avoid twisting your lower back excessively.'
      },
      {
        id: 'w-ankle-rocks',
        name: 'Ankle Dorsiflexion Rocks',
        durationSeconds: 60,
        targetJoints: ['Ankles (Talocrural)', 'Calves', 'Achilles Tendon'],
        instructions: 'In a half-kneeling or standing split stance, drive your front knee forward past your toes without letting the front heel lift. Pulse gently for 30s per side.',
        tips: 'Crucial for deep squat depth without leaning forward.'
      },
      {
        id: 'w-glute-wake',
        name: 'Bodyweight Glute Squeeze & March',
        durationSeconds: 60,
        targetJoints: ['Gluteus Maximus', 'Hip Extensors'],
        instructions: 'Stand tall. March in place, lifting each knee to hip height and actively squeezing the standing glute hard at the top of each step.',
        tips: 'Focus on mind-muscle connection in the glute.'
      }
    ]
  },
  {
    id: 'warmup-fullbody',
    title: 'Dynamic Full-Body Flow & Cardio Spark',
    description: 'Elevates core body temperature, lubricates all major joints, and activates the central nervous system.',
    suitedCategory: 'full_body',
    totalDurationMinutes: 4,
    exercises: [
      {
        id: 'w-inchworm',
        name: 'Inchworm Walkouts (No Push-Up)',
        durationSeconds: 60,
        targetJoints: ['Hamstrings', 'Shoulders', 'Core'],
        instructions: 'Stand tall, hinge at your hips, and touch hands to the floor. Walk your hands forward into a high plank. Pause for 1 second, then walk hands back to feet and stand up.',
        tips: 'Bend your knees slightly if your hamstrings feel tight.'
      },
      {
        id: 'w-high-knee-march',
        name: 'Rhythmic High-Knee March & Arm Pump',
        durationSeconds: 60,
        targetJoints: ['Cardiovascular', 'Hip Flexors', 'Shoulders'],
        instructions: 'March vigorously in place, driving knees up toward your chest while swinging opposite arms with athletic cadence.',
        tips: 'Breathe steadily in through the nose and out through the mouth.'
      },
      {
        id: 'w-step-jacks',
        name: 'Low-Impact Step Jacks',
        durationSeconds: 60,
        targetJoints: ['Calves', 'Deltoids', 'Full Body'],
        instructions: 'Step your right foot out to the side while sweeping both arms overhead. Return to center and immediately step left foot out.',
        tips: 'Zero impact on knees while priming heart rate.'
      },
      {
        id: 'w-torso-windmill',
        name: 'Standing Torso Windmill Reaches',
        durationSeconds: 60,
        targetJoints: ['Hamstrings', 'Spine', 'Hips'],
        instructions: 'Stand with feet wide. Reach your right hand toward your left foot while extending left arm toward the ceiling. Alternate smoothly side to side.',
        tips: 'Keep knees soft and core lightly braced.'
      }
    ]
  },
  {
    id: 'warmup-core',
    title: 'Spine & Deep Core Awakening',
    description: 'Restores spinal flexion, extension, and rotation while awakening the transverse abdominis and pelvic floor.',
    suitedCategory: 'core',
    totalDurationMinutes: 3,
    exercises: [
      {
        id: 'w-cat-cow',
        name: 'Cat-Cow Breathing Articulation',
        durationSeconds: 60,
        targetJoints: ['Cervical & Lumbar Spine', 'Shoulders'],
        instructions: 'On hands and knees: inhale and arch your back gently (cow), then exhale and round your spine toward the ceiling while tucking chin (cat).',
        tips: 'Move segment by segment through your spine.'
      },
      {
        id: 'w-quadruped-bird',
        name: 'Quadruped Bird-Dog Reaches',
        durationSeconds: 60,
        targetJoints: ['Erector Spinae', 'Glutes', 'Core Stabilizers'],
        instructions: 'On hands and knees, reach right arm forward and left leg backward in a straight line. Hold for 2 seconds, return, and switch sides.',
        tips: 'Keep hips level as if balancing a cup of water on your lower back.'
      },
      {
        id: 'w-childs-reach',
        name: 'Side-Reaching Child’s Pose',
        durationSeconds: 60,
        targetJoints: ['Lats', 'Thoracolumbar Fascia', 'Hips'],
        instructions: 'Sink hips back onto heels into child’s pose. Walk both hands 45 degrees to the left for 30s to stretch right side, then walk to the right.',
        tips: 'Take deep breaths into your lateral ribcage.'
      }
    ]
  },
  {
    id: 'warmup-express',
    title: 'Express 2-Minute Quick Warm-Up',
    description: 'A rapid joint sweep for days when time is tight.',
    suitedCategory: 'general',
    totalDurationMinutes: 2,
    exercises: [
      {
        id: 'w-exp-rolls',
        name: 'Shoulder & Neck Gentle Rolls',
        durationSeconds: 40,
        targetJoints: ['Neck', 'Trapezius', 'Shoulders'],
        instructions: 'Roll shoulders backward in big circles for 20s, then roll forward. Gently tilt head ear-to-shoulder with relaxed jaw.',
        tips: 'Do not force or crank the neck.'
      },
      {
        id: 'w-exp-twists',
        name: 'Torso Twists with Arm Swings',
        durationSeconds: 40,
        targetJoints: ['Spine', 'Hips', 'Shoulders'],
        instructions: 'Swing arms loosely from side to side, letting hands tap your hips/lower back as you rotate.',
        tips: 'Stay loose and relaxed.'
      },
      {
        id: 'w-exp-squat-pulses',
        name: 'Gentle Quarter Squats & Ankle Bounces',
        durationSeconds: 40,
        targetJoints: ['Knees', 'Hips', 'Ankles'],
        instructions: 'Perform soft quarter-depth squats, rising up onto the balls of your feet at the top to wake up calf muscles.',
        tips: 'Keep movement rhythmic and light.'
      }
    ]
  }
];

export function getRecommendedWarmup(category: ExerciseCategory): WarmupRoutine {
  const match = WARMUP_ROUTINES.find((w) => w.suitedCategory === category);
  if (match) return match;
  return WARMUP_ROUTINES.find((w) => w.suitedCategory === 'full_body') || WARMUP_ROUTINES[0];
}
