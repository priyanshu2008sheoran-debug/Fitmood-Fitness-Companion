import { Exercise } from '../types';

export const EXERCISES_DATABASE: Exercise[] = [
  // ==========================================
  // UPPER BODY: PUSH & PULL
  // ==========================================
  {
    id: 'wall-push-up',
    name: 'Wall Push-Ups',
    category: 'upper',
    targetMuscles: ['Chest (Pectorals)', 'Shoulders (Anterior Deltoids)', 'Triceps', 'Core'],
    primaryMuscles: ['Pectoralis Major (Chest)', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoids (Shoulders)', 'Core Stabilizers (Abs & Glutes)'],
    bodyRegions: ['chest', 'biceps_triceps', 'shoulders', 'core'],
    musclesExplanation: 'Pressing away from the wall fires your chest and triceps to extend your arms, while your core muscles brace your spine in an upright plank line.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand facing a sturdy wall about an arm’s length away.',
      'Place your palms flat on the wall at shoulder height and shoulder-width apart.',
      'Keep your feet flat on the floor and body in a straight line from head to heels.',
      'Slowly bend your elbows to bring your chest toward the wall until your nose almost touches.',
      'Press firmly through your hands to return smoothly to the starting position.'
    ],
    commonMistakes: [
      'Arching or sagging the lower back.',
      'Flaring elbows out to 90 degrees (keep them at a comfortable 45-degree arrow shape).',
      'Lifting heels off the ground unevenly.'
    ],
    safetyTips: [
      'Keep your core gently braced as if expecting a gentle tap.',
      'Ensure the wall surface is clean and not slippery.'
    ],
    easierAlternative: 'Step your feet closer to the wall to decrease the angle.',
    harderProgression: 'Incline Push-Ups on a sturdy table or kitchen counter.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-12 reps',
    restIntervalSeconds: 45,
    youtubeId: 'a6YHbXD2XlU',
    videoUrl: 'https://www.youtube.com/embed/a6YHbXD2XlU',
    secondaryVideoUrl: 'https://www.youtube.com/embed/cfns5VDvvvc',
    fallbackUrl: 'https://www.youtube.com/watch?v=a6YHbXD2XlU',
    videoSource: 'FitnessBlender Form Lab',
    secondaryVideoSource: 'Hybrid Calisthenics Routine',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'incline-push-up',
    name: 'Incline Push-Ups',
    category: 'upper',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders', 'Serratus Anterior'],
    primaryMuscles: ['Lower & Mid Pectorals (Chest)', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoids (Front Shoulders)', 'Serratus Anterior', 'Core'],
    bodyRegions: ['chest', 'biceps_triceps', 'shoulders', 'core'],
    musclesExplanation: 'Elevating the hands distributes bodyweight to allow clean chest contraction and triceps extension with less joint strain than floor push-ups.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Place your hands shoulder-width apart on an elevated, stable surface (bed, sofa, sturdy desk, or bench).',
      'Walk your feet back so your body forms an angled straight plank from head to ankles.',
      'Brace your core and lower your chest toward the edge with controlled breathing.',
      'Push back up until your arms are extended without locking the elbows abruptly.'
    ],
    commonMistakes: [
      'Letting the hips dip downward before the chest moves.',
      'Dropping the head and looking straight down between feet.'
    ],
    safetyTips: [
      'Verify the surface is stable and won’t slide forward under your weight.',
      'Tuck your elbows at roughly 45 degrees relative to your torso.'
    ],
    easierAlternative: 'Wall Push-Ups.',
    harderProgression: 'Knee Push-Ups or Standard Floor Push-Ups.',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-12 reps',
    restIntervalSeconds: 60,
    youtubeId: 'Z0bRiVhnO8Q',
    videoUrl: 'https://www.youtube.com/embed/Z0bRiVhnO8Q',
    secondaryVideoUrl: 'https://www.youtube.com/embed/4dF1DOWzf20',
    fallbackUrl: 'https://www.youtube.com/watch?v=Z0bRiVhnO8Q',
    videoSource: 'Calisthenics Form Academy',
    secondaryVideoSource: 'FitMood Movement Lab',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'knee-push-up',
    name: 'Knee Push-Ups',
    category: 'upper',
    targetMuscles: ['Pectorals (Chest)', 'Triceps', 'Anterior Deltoids', 'Core'],
    primaryMuscles: ['Pectoralis Major', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoids', 'Core Stabilizers'],
    bodyRegions: ['chest', 'biceps_triceps', 'shoulders', 'core'],
    musclesExplanation: 'Pivoting from the knees reduces the load to roughly 49% of bodyweight, allowing beginners to build chest and tricep pressing endurance.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Start in a push-up position with hands slightly wider than shoulder-width, knees resting on a mat.',
      'Form a straight line from your head down through your torso to your knees.',
      'Lower your chest toward the floor until it hovers 2 inches above the mat, keeping elbows at 45 degrees.',
      'Press smoothly through your palms back to the starting position.'
    ],
    commonMistakes: [
      'Sticking your glutes up in the air in an L-shape instead of a straight line from knees to head.',
      'Hyperextending the neck looking upward.'
    ],
    safetyTips: [
      'Place a folded towel or mat under your knees to prevent knee discomfort.'
    ],
    easierAlternative: 'Incline Push-Ups on a bed or couch.',
    harderProgression: 'Standard Floor Push-Ups.',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-12 reps',
    restIntervalSeconds: 45,
    youtubeId: 'WpHVU34V4uM',
    videoUrl: 'https://www.youtube.com/embed/WpHVU34V4uM',
    secondaryVideoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    fallbackUrl: 'https://www.youtube.com/watch?v=WpHVU34V4uM',
    videoSource: 'FitnessBlender Knee Push-Up Lab',
    secondaryVideoSource: 'Calisthenics Foundations',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'standard-push-up',
    name: 'Standard Floor Push-Ups',
    category: 'upper',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    primaryMuscles: ['Pectoralis Major (Chest)', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoids', 'Core Abdominals (Transverse Abdominis)', 'Serratus Anterior'],
    bodyRegions: ['chest', 'biceps_triceps', 'shoulders', 'core'],
    musclesExplanation: 'Full floor pressing loads approximately 64% of bodyweight, firing the chest fibers across horizontal adduction and triceps through elbow extension.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Start in a full high plank position with hands slightly wider than shoulder-width, fingers spread.',
      'Engage glutes and pull belly button toward your spine to keep a rigid spine.',
      'Inhale as you lower your body until your chest hovers 2-3 inches above the floor.',
      'Exhale and push through your palms back to the top position.'
    ],
    commonMistakes: [
      'Flaring elbows out sideways like a "T" shape instead of an arrow shape.',
      'Hips sagging or hiking up high into a pike.',
      'Half reps (not going deep enough).'
    ],
    safetyTips: [
      'If your wrists hurt, place hands on push-up handles or make flat knuckles on a mat.'
    ],
    easierAlternative: 'Incline Push-Ups or Knee Push-Ups.',
    harderProgression: 'Diamond Push-Ups or Decline Push-Ups (feet elevated on a chair).',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-15 reps',
    restIntervalSeconds: 60,
    youtubeId: 'IODxDxX7oi4',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    secondaryVideoUrl: 'https://www.youtube.com/embed/_l3ySVKYVJ8',
    fallbackUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    videoSource: 'Calisthenics Movement Academy',
    secondaryVideoSource: 'Athlean Form Analysis',
    videoType: 'embed',
    videoDurationSec: 45,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-Ups',
    category: 'upper',
    targetMuscles: ['Triceps Brachii', 'Inner Chest', 'Anterior Deltoids', 'Core'],
    primaryMuscles: ['Triceps Brachii (Lateral & Medial heads)', 'Pectoralis Major'],
    secondaryMuscles: ['Anterior Deltoids', 'Core Stabilizers'],
    bodyRegions: ['biceps_triceps', 'chest', 'shoulders', 'core'],
    musclesExplanation: 'Placing hands close together in a diamond shape shifts maximum mechanical leverage directly onto the triceps for intense arm development.',
    equipmentNeeded: 'none',
    difficulty: 'advanced',
    instructions: [
      'Set up in a push-up position, bringing index fingers and thumbs together under your center chest to form a diamond shape.',
      'Keep your core tight and body in a rigid plank line.',
      'Lower your chest until it taps or hovers just above your diamond hand placement, keeping elbows tucked close to your ribs.',
      'Press firmly through your palms to lock out your triceps at the top.'
    ],
    commonMistakes: [
      'Flaring elbows outward (keep elbows pointed back along your torso).',
      'Hips sagging down toward the floor.'
    ],
    safetyTips: [
      'If you feel wrist strain, widen your hands slightly from a strict diamond to 3 inches apart.'
    ],
    easierAlternative: 'Incline Diamond Push-Ups with hands on a desk or chair.',
    harderProgression: 'Decline Diamond Push-Ups with feet elevated.',
    defaultSets: 3,
    defaultRepsOrSeconds: '6-12 reps',
    restIntervalSeconds: 60,
    youtubeId: 'J0DnG1_S92I',
    videoUrl: 'https://www.youtube.com/embed/J0DnG1_S92I',
    secondaryVideoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    fallbackUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    videoSource: 'Hybrid Calisthenics Diamond Guide',
    secondaryVideoSource: 'Calisthenics Tricep Vault',
    videoType: 'embed',
    videoDurationSec: 40,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'decline-push-up',
    name: 'Decline Push-Ups (Feet Elevated)',
    category: 'upper',
    targetMuscles: ['Upper Chest (Clavicular Pectorals)', 'Anterior Deltoids', 'Triceps', 'Core'],
    primaryMuscles: ['Clavicular Pectorals (Upper Chest)', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Core Abdominals'],
    bodyRegions: ['chest', 'shoulders', 'biceps_triceps', 'core'],
    musclesExplanation: 'Elevating the feet shifts bodyweight upward toward the shoulders and upper chest fibers, increasing overall load to around 74% of bodyweight.',
    equipmentNeeded: 'none',
    difficulty: 'advanced',
    instructions: [
      'Place your toes on an elevated sturdy surface (bed, chair, or step) and hands flat on the floor shoulder-width apart.',
      'Brace your core and squeeze glutes so your body forms a straight downward slope.',
      'Lower your chest until it almost touches the floor, keeping elbows at 45 degrees.',
      'Press powerfully back up to arm lockout.'
    ],
    commonMistakes: [
      'Excessive arching of the lumbar spine.',
      'Allowing the neck to drop downward.'
    ],
    safetyTips: [
      'Ensure the elevated surface is stable and will not wobble during the set.'
    ],
    easierAlternative: 'Standard Floor Push-Ups.',
    harderProgression: 'Pike Push-Ups or Handstand Push-Up Negatives.',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-12 reps',
    restIntervalSeconds: 60,
    youtubeId: 'SKPab2YC8BE',
    videoUrl: 'https://www.youtube.com/embed/SKPab2YC8BE',
    secondaryVideoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    fallbackUrl: 'https://www.youtube.com/watch?v=SKPab2YC8BE',
    videoSource: 'Athlean-X Upper Chest Push-Ups',
    secondaryVideoSource: 'Calisthenics Form Lab',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-Ups',
    category: 'upper',
    targetMuscles: ['Anterior & Lateral Deltoids', 'Upper Chest', 'Triceps', 'Trapezius'],
    primaryMuscles: ['Anterior & Lateral Deltoids (Shoulders)', 'Upper Pectorals'],
    secondaryMuscles: ['Triceps Brachii', 'Trapezius', 'Core Stabilizers'],
    bodyRegions: ['shoulders', 'chest', 'biceps_triceps', 'back'],
    musclesExplanation: 'Hinged at the hips into an inverted V-shape, the pressing angle mimics an overhead barbell press, building boulder shoulders using pure bodyweight.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Start in a push-up position, then walk your feet forward and hike your hips high in the air to form an inverted V shape.',
      'Look toward your feet so your neck remains neutral.',
      'Bend elbows to lower your crown forward between and slightly in front of your hands (tripod shape).',
      'Push up and back through your shoulders to return to the pike position.'
    ],
    commonMistakes: [
      'Flaring elbows out sideways instead of tracking 45 degrees backward.',
      'Looking forward at hands, which strains the cervical spine.'
    ],
    safetyTips: [
      'Bend knees slightly if tight hamstrings prevent you from hiking hips high.'
    ],
    easierAlternative: 'Decline Push-Ups or Elevated Hand Pike Push-Ups.',
    harderProgression: 'Feet-Elevated Pike Push-Ups or Wall Handstand Push-Ups.',
    defaultSets: 3,
    defaultRepsOrSeconds: '6-10 reps',
    restIntervalSeconds: 60,
    youtubeId: 'sposDXWEB0A',
    videoUrl: 'https://www.youtube.com/embed/sposDXWEB0A',
    secondaryVideoUrl: 'https://www.youtube.com/embed/SKPab2YC8BE',
    fallbackUrl: 'https://www.youtube.com/watch?v=sposDXWEB0A',
    videoSource: 'Calisthenics Movement Shoulder Lab',
    secondaryVideoSource: 'Hybrid Calisthenics Pike Guide',
    videoType: 'embed',
    videoDurationSec: 40,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'chair-dips',
    name: 'Bench / Chair Tricep Dips',
    category: 'upper',
    targetMuscles: ['Triceps Brachii', 'Anterior Deltoids', 'Lower Chest'],
    primaryMuscles: ['Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoids (Shoulders)', 'Lower Pectorals', 'Upper Back'],
    bodyRegions: ['biceps_triceps', 'shoulders', 'chest'],
    musclesExplanation: 'Vertical arm extension behind the torso strongly isolates the long and lateral heads of the triceps while reinforcing shoulder extension.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Sit on the edge of a sturdy chair or couch, palms placed beside your hips gripping the front edge.',
      'Slide your butt off the chair with knees bent at 90 degrees and feet flat on the floor.',
      'Slowly lower your hips by bending your elbows until arms reach approximately 90 degrees.',
      'Press firmly through your palms to extend your arms back to the top.'
    ],
    commonMistakes: [
      'Shrugging shoulders into ears (keep chest proud and shoulders pressed down).',
      'Dipping too deep (past 90 degrees), which can overstretch the anterior shoulder capsule.'
    ],
    safetyTips: [
      'Keep your back close to the edge of the chair throughout the movement.'
    ],
    easierAlternative: 'Bent-knee dips with feet closer to the chair.',
    harderProgression: 'Straight-leg dips or elevating feet on a second chair.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-15 reps',
    restIntervalSeconds: 45,
    youtubeId: '0326dy_-CzM',
    videoUrl: 'https://www.youtube.com/embed/0326dy_-CzM',
    secondaryVideoUrl: 'https://www.youtube.com/embed/J0DnG1_S92I',
    fallbackUrl: 'https://www.youtube.com/watch?v=0326dy_-CzM',
    videoSource: 'FitnessBlender Chair Dips',
    secondaryVideoSource: 'Physical Therapy Form Guide',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'doorframe-pull-up',
    name: 'Safe Pull-Ups (Requires Bar)',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Biceps', 'Rhomboids', 'Forearms'],
    primaryMuscles: ['Latissimus Dorsi (Lats)', 'Biceps Brachii'],
    secondaryMuscles: ['Rhomboids', 'Posterior Deltoids', 'Forearm Flexors (Grip)', 'Core'],
    bodyRegions: ['back', 'biceps_triceps', 'shoulders', 'core'],
    musclesExplanation: 'Vertical pulling recruits the lats to adduct the upper arms while biceps flex the elbows and scapular retractors stabilize the shoulder girdle.',
    equipmentNeeded: 'other',
    difficulty: 'advanced',
    isPullUpOrNeedsBar: true,
    instructions: [
      'NOTE: This exercise requires a dedicated, properly tested doorframe pull-up bar or outdoor park bar.',
      'Grip the bar with palms facing away (pull-up) or facing you (chin-up), slightly wider than shoulder-width.',
      'Hang with arms fully extended and engage your lats by pulling your shoulder blades down and back.',
      'Pull your chest up toward the bar until your chin clears the bar.',
      'Lower yourself back down with full control.'
    ],
    commonMistakes: [
      'Kicking legs or kipping violently.',
      'Half reps without lowering to a controlled stretch.'
    ],
    safetyTips: [
      'Always test the mounting integrity of the bar before putting your full body weight on it.'
    ],
    easierAlternative: 'Doorframe Incline Rows or Towel Door Rows.',
    harderProgression: 'Chest-to-bar pull-ups or slow 5-second eccentric negatives.',
    defaultSets: 3,
    defaultRepsOrSeconds: '3-8 reps',
    restIntervalSeconds: 90,
    youtubeId: 'eGo4IYlbE5g',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    secondaryVideoUrl: 'https://www.youtube.com/embed/Hdc7Mw6BIEE',
    fallbackUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    videoSource: 'Calisthenics Progression Vault',
    secondaryVideoSource: 'FitnessFAQ Pull-Up Guide',
    videoType: 'embed',
    videoDurationSec: 45,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'doorframe-rows',
    name: 'Towel / Doorframe Incline Rows',
    category: 'upper',
    targetMuscles: ['Rhomboids', 'Mid-Trapezius', 'Latissimus Dorsi', 'Biceps'],
    primaryMuscles: ['Rhomboids', 'Mid-Trapezius', 'Latissimus Dorsi'],
    secondaryMuscles: ['Biceps Brachii', 'Posterior Deltoids', 'Core'],
    bodyRegions: ['back', 'biceps_triceps', 'shoulders', 'core'],
    musclesExplanation: 'Horizontal bodyweight pulling contracts the upper back and retracts shoulder blades, reversing desk posture without any gym machines.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand facing a sturdy doorframe or wrap a towel securely around a closed door handle/pillar.',
      'Grip firmly with both hands, lean your body back with arms straight and feet walked forward.',
      'Keep your body rigid in an inverted plank line.',
      'Pull your chest toward the doorframe by driving your elbows back and squeezing your shoulder blades together.',
      'Lower back down under smooth 2-second control.'
    ],
    commonMistakes: [
      'Letting the hips sag back or bending at the waist.',
      'Shrugging shoulders up toward ears.'
    ],
    safetyTips: [
      'Make sure the door is latched completely shut and pulls toward the doorframe jamb.'
    ],
    easierAlternative: 'Stand more upright with feet closer to the frame to decrease resistance.',
    harderProgression: 'Walk feet further under to increase the angle toward horizontal.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-15 reps',
    restIntervalSeconds: 45,
    youtubeId: 'rloXYB8M3vU',
    videoUrl: 'https://www.youtube.com/embed/rloXYB8M3vU',
    secondaryVideoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    fallbackUrl: 'https://www.youtube.com/watch?v=rloXYB8M3vU',
    videoSource: 'Hybrid Calisthenics Home Row Lab',
    secondaryVideoSource: 'FitnessBlender Bodyweight Rows',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },

  // ==========================================
  // LOWER BODY: LEGS & GLUTES
  // ==========================================
  {
    id: 'chair-squats',
    name: 'Chair / Box Squats',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core Stabilizers'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves', 'core'],
    musclesExplanation: 'Using a chair gives confidence and precise depth feedback while strengthening knee extension and hip hinging without joint strain.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand 4 inches in front of a sturdy chair with feet shoulder-width apart, toes slightly angled out.',
      'Hinge hips back and bend knees, lowering under control until your glutes lightly tap the chair seat.',
      'Pause for half a second without collapsing your weight entirely.',
      'Drive through your heels and midfoot to stand back up, squeezing your glutes at the top.'
    ],
    commonMistakes: [
      'Flopping backward onto the chair abruptly.',
      'Letting knees cave inward.'
    ],
    safetyTips: [
      'Keep your chest proud and arms extended forward for counterbalance.'
    ],
    easierAlternative: 'Use a slightly higher chair or place a firm cushion on the seat.',
    harderProgression: 'Free Bodyweight Air Squats without a chair.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-15 reps',
    restIntervalSeconds: 45,
    youtubeId: 'v9i_L2q4O5w',
    videoUrl: 'https://www.youtube.com/embed/v9i_L2q4O5w',
    secondaryVideoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    fallbackUrl: 'https://www.youtube.com/watch?v=v9i_L2q4O5w',
    videoSource: 'FitnessBlender Chair Squats',
    secondaryVideoSource: 'Calisthenics Foundations',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Air Squats',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    primaryMuscles: ['Quadriceps (Front Thighs)', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves (Gastrocnemius)', 'Core Stabilizers'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves', 'core'],
    musclesExplanation: 'Hinging at the hips and bending the knees activates quadriceps during knee extension and engages the glutes to lock out the hips as you stand tall.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward (10-15 degrees).',
      'Extend arms forward for balance or keep hands clasped at your chest.',
      'Hinge your hips back first, then bend your knees as if sitting back into an imaginary chair.',
      'Lower down until your thighs are roughly parallel to the floor, keeping your chest proud.',
      'Drive through your whole foot (heels and midfoot) to stand back up, squeezing glutes at the top.'
    ],
    commonMistakes: [
      'Knees collapsing inward (valgus collapse). Push knees out in line with toes.',
      'Heels lifting off the ground.',
      'Rounding the lower back.'
    ],
    safetyTips: [
      'If you have knee discomfort, limit squat depth to a 45-degree angle or sit down and stand up from a sturdy chair (Box Squats).'
    ],
    easierAlternative: 'Chair Squats (sit down and stand up from a dining chair).',
    harderProgression: 'Slow Tempo Squats (3 sec descent) or Jump Squats.',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-15 reps',
    restIntervalSeconds: 60,
    youtubeId: 'aclHkVaku9U',
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    secondaryVideoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8',
    fallbackUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    videoSource: 'Movement Foundations Lab',
    secondaryVideoSource: 'Calisthenics Squat Tutorial',
    videoType: 'embed',
    videoDurationSec: 40,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'sumo-squat',
    name: 'Sumo Squats (Wide Stance)',
    category: 'lower',
    targetMuscles: ['Adductors (Inner Thighs)', 'Glutes', 'Quadriceps', 'Hamstrings'],
    primaryMuscles: ['Adductors (Inner Thighs)', 'Gluteus Maximus'],
    secondaryMuscles: ['Quadriceps', 'Hamstrings', 'Calves'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves'],
    musclesExplanation: 'A wider foot stance with 45-degree flared toes shifts the mechanical load heavily toward the inner thigh adductors and lateral glutes.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Take a stance about 1.5 times shoulder-width apart, toes angled out at roughly 45 degrees.',
      'Clasp hands in front of your chest and keep your spine tall.',
      'Lower your hips straight down, actively pushing your knees outward in line with your toes.',
      'Descend until thighs are parallel to the floor, feeling an inner thigh stretch.',
      'Push through your heels to return to standing, squeezing glutes tightly.'
    ],
    commonMistakes: [
      'Letting knees cave inward away from the toe angle.',
      'Leaning too far forward at the waist.'
    ],
    safetyTips: [
      'Only widen your stance as far as your hip flexibility comfortably allows.'
    ],
    easierAlternative: 'Standard Air Squats or holding onto a doorframe for balance.',
    harderProgression: 'Sumo Squat with 3-second isometric hold at the bottom.',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-15 reps',
    restIntervalSeconds: 45,
    youtubeId: '9ZuDXYJmZ94',
    videoUrl: 'https://www.youtube.com/embed/9ZuDXYJmZ94',
    secondaryVideoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    fallbackUrl: 'https://www.youtube.com/watch?v=9ZuDXYJmZ94',
    videoSource: 'FitnessBlender Sumo Squat Guide',
    secondaryVideoSource: 'Athlean Lower Body Series',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunges',
    category: 'lower',
    targetMuscles: ['Glutes', 'Hamstrings', 'Quadriceps', 'Core Stability'],
    primaryMuscles: ['Gluteus Maximus', 'Quadriceps'],
    secondaryMuscles: ['Hamstrings', 'Adductors (Inner Thighs)', 'Calves', 'Core Stabilizers'],
    bodyRegions: ['glutes', 'quads_hamstrings', 'calves', 'core'],
    musclesExplanation: 'Unilateral stepping activates deep pelvic and glute stabilizers while quadriceps and hamstrings work together to decelerate and propel back up.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand tall with feet hip-width apart and hands on your hips or chest.',
      'Take a controlled, generous step backward with your right leg.',
      'Lower your hips until both knees are bent at approximately 90-degree angles.',
      'Keep your front knee stacked directly over or slightly behind your front ankle.',
      'Push through your front heel to step your right foot back up to the start.',
      'Repeat on the opposite leg.'
    ],
    commonMistakes: [
      'Banging the back knee onto hard flooring (hover it an inch above the floor).',
      'Leaning too far backward.',
      'Wobbly balance from placing feet in a tight single line (keep feet on "railroad tracks").'
    ],
    safetyTips: [
      'Hold onto a wall or chair back for balance if you feel unsteady.'
    ],
    easierAlternative: 'Static Split Squats with hands supporting on a sturdy surface.',
    harderProgression: 'Walking Lunges or Deficit Reverse Lunges.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10 reps each leg',
    restIntervalSeconds: 60,
    youtubeId: '7v1U7fcsf50',
    videoUrl: 'https://www.youtube.com/embed/7v1U7fcsf50',
    secondaryVideoUrl: 'https://www.youtube.com/embed/wrwwXE_x-pQ',
    fallbackUrl: 'https://www.youtube.com/watch?v=7v1U7fcsf50',
    videoSource: 'FitMood Movement Lab',
    secondaryVideoSource: 'Pure Form Calisthenics',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Hip Stabilizers'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves', 'core'],
    musclesExplanation: 'Moving continuously through lunges requires dynamic deceleration, single-leg stabilization, and athletic forward propulsion.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Stand at one end of a clear hallway or room with feet together.',
      'Take a generous step forward with right foot, bending both knees to 90 degrees.',
      'Push through front heel and swing the back left leg directly through into the next forward lunge.',
      'Continue walking forward smoothly in rhythm.'
    ],
    commonMistakes: [
      'Taking strides that are too short, causing front knee to push past toes.',
      'Losing balance by stepping with feet in a straight line.'
    ],
    safetyTips: [
      'Maintain an upright torso with gentle abdominal bracing.'
    ],
    easierAlternative: 'Reverse Lunges standing in one spot.',
    harderProgression: 'Pause Walking Lunges (hold bottom for 2 seconds each step).',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-16 total steps',
    restIntervalSeconds: 60,
    youtubeId: 'L8fvypPrzzs',
    videoUrl: 'https://www.youtube.com/embed/L8fvypPrzzs',
    secondaryVideoUrl: 'https://www.youtube.com/embed/7v1U7fcsf50',
    fallbackUrl: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
    videoSource: 'Athlean Walking Lunge Mechanics',
    secondaryVideoSource: 'FitnessBlender Form Lab',
    videoType: 'embed',
    videoDurationSec: 40,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'curtsy-lunge',
    name: 'Curtsy Lunges',
    category: 'lower',
    targetMuscles: ['Gluteus Medius', 'Gluteus Maximus', 'Quads', 'Inner Thighs'],
    primaryMuscles: ['Gluteus Medius (Outer Hips)', 'Gluteus Maximus'],
    secondaryMuscles: ['Quadriceps', 'Adductors', 'Core'],
    bodyRegions: ['glutes', 'quads_hamstrings', 'core'],
    musclesExplanation: 'Stepping diagonally behind targets the side glute (gluteus medius) to build hip stability, improve knee alignment, and shape hips.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Stand tall with feet hip-width apart and hands on hips.',
      'Step your right leg diagonally behind your left leg as if performing a polite curtsy.',
      'Bend both knees until front thigh is nearly parallel to the floor.',
      'Drive through your front left heel to return to the starting position, then repeat on opposite side.'
    ],
    commonMistakes: [
      'Twisting the front knee out of alignment with the front toes.',
      'Leaning the torso excessively sideways.'
    ],
    safetyTips: [
      'Keep hips squared forward as much as possible throughout the movement.'
    ],
    easierAlternative: 'Standard Reverse Lunges.',
    harderProgression: 'Curtsy Lunge with a side leg lift balance kick at the top.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10 reps each leg',
    restIntervalSeconds: 45,
    youtubeId: 'M-W8s8aQ-0Q',
    videoUrl: 'https://www.youtube.com/embed/M-W8s8aQ-0Q',
    secondaryVideoUrl: 'https://www.youtube.com/embed/7v1U7fcsf50',
    fallbackUrl: 'https://www.youtube.com/watch?v=M-W8s8aQ-0Q',
    videoSource: 'FitnessBlender Curtsy Lunge Guide',
    secondaryVideoSource: 'Calisthenics Lower Body Series',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridges',
    category: 'lower',
    targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Lower Back', 'Pelvic Floor'],
    primaryMuscles: ['Gluteus Maximus', 'Hamstrings'],
    secondaryMuscles: ['Erector Spinae (Lower Back)', 'Core Stabilizers', 'Pelvic Floor'],
    bodyRegions: ['glutes', 'quads_hamstrings', 'back', 'core'],
    musclesExplanation: 'Direct hip extension isolates the gluteus maximus without compressive shear forces on the lumbar spine or knee joints.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Lie on your back on a mat with knees bent and feet flat on the floor, hip-width apart.',
      'Place arms flat by your sides with palms down.',
      'Squeeze your glutes and push through your heels to raise your hips until knees, hips, and shoulders form a diagonal line.',
      'Hold the peak contraction for 1-2 seconds without over-arching your lower back.',
      'Slowly lower your hips back down until they just brush the mat, then immediately repeat.'
    ],
    commonMistakes: [
      'Hyperextending the lower back (feeling the strain in your spine instead of your butt).',
      'Pushing through the toes instead of the heels.'
    ],
    safetyTips: [
      'Tuck your pelvis slightly under (posterior pelvic tilt) to isolate the glutes safely.'
    ],
    easierAlternative: 'Glute Bridges with smaller range of motion or feet placed on an elevation.',
    harderProgression: 'Single-Leg Glute Bridges or 5-second isometric hold bridges.',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-15 reps',
    restIntervalSeconds: 45,
    youtubeId: 'wPM8icPu6H8',
    videoUrl: 'https://www.youtube.com/embed/wPM8icPu6H8',
    secondaryVideoUrl: 'https://www.youtube.com/embed/OUgsJ8-Vigk',
    fallbackUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8',
    videoSource: 'FitMood Physical Therapy Series',
    secondaryVideoSource: 'Glute Science Academy',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single-Leg Glute Bridges',
    category: 'lower',
    targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Pelvic Stabilizers', 'Core'],
    primaryMuscles: ['Gluteus Maximus', 'Hamstrings'],
    secondaryMuscles: ['Pelvic Stabilizers', 'Erector Spinae', 'Deep Core'],
    bodyRegions: ['glutes', 'quads_hamstrings', 'back', 'core'],
    musclesExplanation: 'Lifting on one leg doubles the load on the working glute and challenges rotary core stabilizers to keep the pelvis completely level.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart.',
      'Lift your left leg off the floor, either bent at 90 degrees or extended straight.',
      'Drive through your right heel to lift your hips into a bridge, keeping both hip bones level.',
      'Squeeze right glute hard at the top for 1 full second, then lower with control.'
    ],
    commonMistakes: [
      'Letting the non-working hip drop toward the floor.',
      'Pushing off the toes rather than driving through the heel.'
    ],
    safetyTips: [
      'Place hands on your hip bones to verify your pelvis stays parallel with the ceiling.'
    ],
    easierAlternative: 'Double-leg standard Glute Bridges.',
    harderProgression: 'Elevated Single-Leg Glute Bridge (foot on a chair or step).',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-12 reps per leg',
    restIntervalSeconds: 45,
    youtubeId: 'pzp_ZfW7s9k',
    videoUrl: 'https://www.youtube.com/embed/pzp_ZfW7s9k',
    secondaryVideoUrl: 'https://www.youtube.com/embed/wPM8icPu6H8',
    fallbackUrl: 'https://www.youtube.com/watch?v=pzp_ZfW7s9k',
    videoSource: 'Redefining Strength Single Leg Bridge',
    secondaryVideoSource: 'Physical Therapy Glute Lab',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'chair-step-ups',
    name: 'Chair / Step-Ups',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Balance Stabilizers'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves'],
    musclesExplanation: 'Unilateral stepping replicates climbing stairs, building leg strength, knee joint stability, and hip power for everyday activities.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand in front of a sturdy chair, step, or low bench.',
      'Place your entire right foot firmly onto the step surface.',
      'Press firmly through your right heel and midfoot to step up until your right leg is straight.',
      'Lower your left foot back down with slow 2-second control.',
      'Complete reps on one leg or alternate legs.'
    ],
    commonMistakes: [
      'Bouncing or pushing off heavily with the trailing back foot instead of using the top leg.',
      'Letting the knee on the step buckle inward.'
    ],
    safetyTips: [
      'Verify the chair or step is sturdy, level, and will not tip over.'
    ],
    easierAlternative: 'Use a lower step (e.g. 4-6 inch staircase step).',
    harderProgression: 'Step-Ups with high knee drive or slow 3-second descent.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10 reps each leg',
    restIntervalSeconds: 45,
    youtubeId: 'dQqApCGd5Ss',
    videoUrl: 'https://www.youtube.com/embed/dQqApCGd5Ss',
    secondaryVideoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    fallbackUrl: 'https://www.youtube.com/watch?v=dQqApCGd5Ss',
    videoSource: 'FitnessBlender Step-Up Tutorial',
    secondaryVideoSource: 'Hybrid Calisthenics Step-Ups',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'calf-raise',
    name: 'Standing Calf Raises',
    category: 'lower',
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Ankle Stabilizers'],
    primaryMuscles: ['Gastrocnemius (Upper Calves)', 'Soleus (Deep Calves)'],
    secondaryMuscles: ['Ankle Stabilizers', 'Tibialis Posterior', 'Foot Arches'],
    bodyRegions: ['calves'],
    musclesExplanation: 'Plantarflexion pushes weight through the metatarsal balls of your feet, conditioning the Achilles tendon, ankle complex, and calf muscles.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand upright with feet hip-width apart near a wall or sturdy chair for light balance.',
      'Slowly press up onto the balls of both feet, lifting your heels as high as possible.',
      'Squeeze your calf muscles tightly at the top of the movement for 1 full second.',
      'Lower your heels back down in a controlled 2-second tempo.'
    ],
    commonMistakes: [
      'Bouncing quickly off the floor without pausing at the top.',
      'Rolling weight onto the outer pinky edge of the feet.'
    ],
    safetyTips: [
      'Keep ankles aligned; avoid letting them roll outward.'
    ],
    easierAlternative: 'Seated Calf Raises on a chair with hands resting on thighs.',
    harderProgression: 'Single-Leg Calf Raises or Deficit Calf Raises on a secure step.',
    defaultSets: 3,
    defaultRepsOrSeconds: '15-20 reps',
    restIntervalSeconds: 45,
    youtubeId: '-M4-G8p8fmc',
    videoUrl: 'https://www.youtube.com/embed/-M4-G8p8fmc',
    secondaryVideoUrl: 'https://www.youtube.com/embed/gwLzBJYoWlI',
    fallbackUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
    videoSource: 'FitMood Mobility Lab',
    secondaryVideoSource: 'Calisthenics Lower Body Series',
    videoType: 'embed',
    videoDurationSec: 25,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit Isometric Hold',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Gluteus Medius', 'Calves', 'Core'],
    primaryMuscles: ['Quadriceps', 'Gluteus Medius'],
    secondaryMuscles: ['Calves', 'Hamstrings', 'Core'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves', 'core'],
    musclesExplanation: 'Static isometric contraction builds tremendous muscular endurance in the quads and patellar tendon without joint movement or impact.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand with your back against a flat wall, feet shoulder-width apart about 2 feet in front of the wall.',
      'Slide your back down the wall until your thighs are parallel to the floor (knees bent at 90 degrees).',
      'Make sure your knees are stacked directly over your ankles, not past your toes.',
      'Press your whole back and shoulders flat against the wall, breathing calmly.',
      'Hold for the target duration, then press through heels and use hands to slide back up.'
    ],
    commonMistakes: [
      'Resting hands or forearms on top of knees to cheat the weight.',
      'Letting knees extend way past toes.'
    ],
    safetyTips: [
      'If you have sensitive knees, slide down only to a 45-degree angle rather than a full 90 degrees.'
    ],
    easierAlternative: 'Higher angle wall sit (hips above knee level).',
    harderProgression: 'Single-leg wall sit or holding arms straight overhead.',
    defaultSets: 3,
    defaultRepsOrSeconds: '30-45 seconds',
    restIntervalSeconds: 45,
    youtubeId: 'y-wV4Venusw',
    videoUrl: 'https://www.youtube.com/embed/y-wV4Venusw',
    secondaryVideoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    fallbackUrl: 'https://www.youtube.com/watch?v=y-wV4Venusw',
    videoSource: 'FitnessBlender Wall Sit Tutorial',
    secondaryVideoSource: 'Athlean Leg Foundations',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },

  // ==========================================
  // CORE & ABDOMINALS
  // ==========================================
  {
    id: 'plank',
    name: 'Forearm Plank',
    category: 'core',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Shoulders', 'Glutes'],
    primaryMuscles: ['Transverse Abdominis (Deep Core)', 'Rectus Abdominis'],
    secondaryMuscles: ['Shoulders (Deltoids)', 'Glutes', 'Quadriceps', 'Serratus Anterior'],
    bodyRegions: ['core', 'shoulders', 'glutes'],
    musclesExplanation: 'Isometric anti-extension exercise requiring the entire abdominal wall and pelvic stabilizers to resist gravity and maintain a rigid horizontal posture.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Lie face down and place your forearms on the floor, elbows directly under your shoulders.',
      'Tuck your toes and lift your knees and body off the floor.',
      'Create tension throughout your whole body: squeeze your glutes, brace your abs, and press your forearms into the floor.',
      'Keep your neck neutral by gazing at the floor between your hands.',
      'Breathe steadily throughout the hold.'
    ],
    commonMistakes: [
      'Letting the hips sag toward the floor (strains lower back).',
      'Poking the butt way up in the air.',
      'Holding your breath.'
    ],
    safetyTips: [
      'Drop down immediately if your lower back begins to ache.'
    ],
    easierAlternative: 'Knee Plank (plank on knees instead of toes) or High Plank on hands.',
    harderProgression: 'Plank with shoulder taps or extended lever plank.',
    defaultSets: 3,
    defaultRepsOrSeconds: '20-30 seconds',
    restIntervalSeconds: 45,
    youtubeId: 'ASdvN_XEl_c',
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    secondaryVideoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
    fallbackUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    videoSource: 'FitMood Core Studio',
    secondaryVideoSource: 'Calisthenics Movement Plank Lab',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'plank-shoulder-taps',
    name: 'High Plank Shoulder Taps',
    category: 'core',
    targetMuscles: ['Transverse Abdominis', 'Obliques', 'Shoulders', 'Glutes'],
    primaryMuscles: ['Anti-Rotational Core', 'Transverse Abdominis'],
    secondaryMuscles: ['Anterior Deltoids', 'Serratus Anterior', 'Glutes'],
    bodyRegions: ['core', 'shoulders', 'glutes'],
    musclesExplanation: 'Removing one hand challenges rotary core stability, teaching your abs and hips to resist side-to-side torso rotation.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Start in a push-up high plank with hands directly under shoulders and feet slightly wider than shoulder-width.',
      'Engage glutes and brace your core so your hips stay completely still.',
      'Slowly lift right hand and tap your left shoulder, then place it back down.',
      'Lift left hand and tap your right shoulder with minimal hip sway.',
      'Continue alternating sides with slow, controlled cadence.'
    ],
    commonMistakes: [
      'Rocking hips violently from side to side with every tap.',
      'Hips hiking up in the air.'
    ],
    safetyTips: [
      'Widen your feet to create a more stable base of support.'
    ],
    easierAlternative: 'Shoulder Taps on knees or Incline Plank Shoulder Taps.',
    harderProgression: 'Plank Shoulder Tap into knee-to-elbow crunch.',
    defaultSets: 3,
    defaultRepsOrSeconds: '16-20 total taps',
    restIntervalSeconds: 45,
    youtubeId: 'gka_dE2_f1Q',
    videoUrl: 'https://www.youtube.com/embed/gka_dE2_f1Q',
    secondaryVideoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    fallbackUrl: 'https://www.youtube.com/watch?v=gka_dE2_f1Q',
    videoSource: 'FitnessBlender Plank Taps',
    secondaryVideoSource: 'Athlean Core Stability Lab',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'side-plank',
    name: 'Side Plank (Isometric Hold)',
    category: 'core',
    targetMuscles: ['Internal & External Obliques', 'Quadratus Lumborum', 'Gluteus Medius'],
    primaryMuscles: ['Internal & External Obliques', 'Quadratus Lumborum'],
    secondaryMuscles: ['Gluteus Medius', 'Deltoids', 'Deep Core'],
    bodyRegions: ['core', 'shoulders', 'glutes'],
    musclesExplanation: 'Lateral anti-flexion isometric hold strengthens the obliques and quadratus lumborum, which are vital for lumbar spine support and waist posture.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Lie on your right side with legs extended and feet stacked or staggered.',
      'Place your right elbow directly under your right shoulder, forearm pointing forward.',
      'Engage your core and lift your hips off the floor until your body forms a straight diagonal line from head to feet.',
      'Place left hand on left hip or extend it toward the ceiling.',
      'Hold steadily, breathing through your nose, then switch sides.'
    ],
    commonMistakes: [
      'Allowing hips to sag down toward the floor.',
      'Rotating top shoulder forward.'
    ],
    safetyTips: [
      'Align your elbow directly beneath your shoulder socket to avoid shoulder impingement.'
    ],
    easierAlternative: 'Side Plank from the knees (bend knees at 90 degrees).',
    harderProgression: 'Side Plank with top leg abduction raise.',
    defaultSets: 3,
    defaultRepsOrSeconds: '20-30s per side',
    restIntervalSeconds: 45,
    youtubeId: 'K2VljzCC16g',
    videoUrl: 'https://www.youtube.com/embed/K2VljzCC16g',
    secondaryVideoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    fallbackUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g',
    videoSource: 'FitnessBlender Side Plank',
    secondaryVideoSource: 'Calisthenics Movement Core Lab',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'dead-bug',
    name: 'Dead Bugs',
    category: 'core',
    targetMuscles: ['Deep Core (Transverse Abdominis)', 'Obliques', 'Hip Flexors'],
    primaryMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques'],
    secondaryMuscles: ['Hip Flexors', 'Latissimus Dorsi', 'Shoulders'],
    bodyRegions: ['core', 'shoulders', 'back'],
    musclesExplanation: 'Contralateral arm and leg extension trains deep lumbar stabilization while reinforcing neutral spine and posterior pelvic contact with the floor.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Lie flat on your back on a mat, pressing your lower back firmly into the floor (no gap!).',
      'Raise your arms straight up toward the ceiling.',
      'Lift your legs so your hips and knees are both bent at 90 degrees (tabletop position).',
      'Slowly extend your right arm overhead while simultaneously extending your left leg straight out hovering above the ground.',
      'Return to starting tabletop position, then repeat with left arm and right leg.',
      'Perform with slow, deliberate control.'
    ],
    commonMistakes: [
      'Letting your lower back arch and peel off the floor.',
      'Rushing through the motion without engaging the core.',
      'Moving the wrong arm and leg at the same time.'
    ],
    safetyTips: [
      'If your lower back arches, do not lower your leg as far—tap your heel closer to your glutes instead.'
    ],
    easierAlternative: 'Dead Bug with heel taps (keep knees bent and tap floor).',
    harderProgression: 'Dead Bug with a light resistance band or slow 4-second negative.',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-10 reps per side',
    restIntervalSeconds: 45,
    youtubeId: 'g_BYB0R-4Ws',
    videoUrl: 'https://www.youtube.com/embed/g_BYB0R-4Ws',
    secondaryVideoUrl: 'https://www.youtube.com/embed/4XLEnwUr1d8',
    fallbackUrl: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
    videoSource: 'FitMood Core Studio',
    secondaryVideoSource: 'Physical Therapy Rehab Lab',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    category: 'core',
    targetMuscles: ['Erector Spinae', 'Glutes', 'Deep Core', 'Shoulders'],
    primaryMuscles: ['Erector Spinae (Spine Stabilizers)', 'Gluteus Maximus'],
    secondaryMuscles: ['Posterior Deltoids', 'Trapezius', 'Deep Core (Transverse Abdominis)'],
    bodyRegions: ['back', 'glutes', 'core', 'shoulders'],
    musclesExplanation: 'Contralateral arm and leg reach challenges rotary core stability and builds isometric endurance throughout the posterior chain.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Start on all fours (quadruped position) with hands under shoulders and knees under hips.',
      'Brace your core so your back remains flat like a tabletop.',
      'Simultaneously reach your right arm straight forward and kick your left leg straight back.',
      'Hold the extended position for 1 second, reaching long rather than kicking high.',
      'Smoothly bring arm and leg back down without shifting your hips side-to-side.',
      'Switch to left arm and right leg.'
    ],
    commonMistakes: [
      'Rotating or tilting hips to the side.',
      'Hyperextending the neck (keep gaze directed toward the floor).'
    ],
    safetyTips: [
      'Pad your knees with a folded towel or mat if your floor is hard.'
    ],
    easierAlternative: 'Lifting only one limb at a time (just legs, then just arms).',
    harderProgression: 'Bird Dog with elbow-to-knee crunch in between reps.',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-10 reps per side',
    restIntervalSeconds: 45,
    youtubeId: 'wiFNA3sqjCA',
    videoUrl: 'https://www.youtube.com/embed/wiFNA3sqjCA',
    secondaryVideoUrl: 'https://www.youtube.com/embed/v0z1_4U7Zp8',
    fallbackUrl: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
    videoSource: 'FitMood Spine & Core',
    secondaryVideoSource: 'Physical Therapy Spine Lab',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunches',
    category: 'core',
    targetMuscles: ['Rectus Abdominis', 'Obliques', 'Hip Flexors', 'Transverse Abdominis'],
    primaryMuscles: ['Rectus Abdominis (6-Pack)', 'Internal & External Obliques'],
    secondaryMuscles: ['Hip Flexors', 'Transverse Abdominis'],
    bodyRegions: ['core'],
    musclesExplanation: 'Cross-body torso rotation with alternating leg extensions produces one of the highest EMG muscle activation levels for both the rectus abdominis and obliques.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on your back, knees bent, hands lightly supporting the back of your head (elbows wide).',
      'Lift shoulder blades off the floor into a gentle crunch.',
      'Bring right elbow across to meet left knee while extending your right leg straight out at 45 degrees.',
      'Without letting shoulder blades touch down, twist and bring left elbow across to right knee.',
      'Perform with smooth, controlled bicycling motion.'
    ],
    commonMistakes: [
      'Yanking violently on the neck with hands.',
      'Rushing reps through momentum rather than muscular contraction.'
    ],
    safetyTips: [
      'Keep your fingertips light on your ears or temples; do not pull your head.'
    ],
    easierAlternative: 'Keep one foot resting on the floor while curling opposite elbow.',
    harderProgression: 'Slow 3-second hold on every cross-body rotation.',
    defaultSets: 3,
    defaultRepsOrSeconds: '16-20 total reps',
    restIntervalSeconds: 45,
    youtubeId: '9FGilxCbdz8',
    videoUrl: 'https://www.youtube.com/embed/9FGilxCbdz8',
    secondaryVideoUrl: 'https://www.youtube.com/embed/g_BYB0R-4Ws',
    fallbackUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
    videoSource: 'FitnessBlender Bicycle Crunches',
    secondaryVideoSource: 'Athlean Ab Lab',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Tuck Hold',
    category: 'core',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Hip Flexors', 'Quadriceps'],
    primaryMuscles: ['Transverse Abdominis', 'Rectus Abdominis'],
    secondaryMuscles: ['Hip Flexors', 'Quadriceps', 'Serratus'],
    bodyRegions: ['core', 'quads_hamstrings'],
    musclesExplanation: 'The gold standard calisthenics gymnast core position, creating total abdominal tension by gluing the lumbar spine to the floor in a shallow banana curve.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on your back with knees hugged into your chest.',
      'Press your lower back flat into the ground, eliminating any daylight underneath.',
      'Lift your head, neck, and shoulder blades off the floor, reaching arms forward past your hips.',
      'Extend legs forward into a tuck or straight angle while maintaining firm lower back contact.',
      'Hold this rigid boat shape while breathing rhythmically.'
    ],
    commonMistakes: [
      'Lower back peeling or arching off the ground.',
      'Holding breath.'
    ],
    safetyTips: [
      'If lower back lifts, tuck knees closer to chest immediately.'
    ],
    easierAlternative: 'Tuck Hollow Hold (knees pulled toward chest).',
    harderProgression: 'Full Hollow Body with arms fully extended overhead.',
    defaultSets: 3,
    defaultRepsOrSeconds: '20-30 seconds',
    restIntervalSeconds: 45,
    youtubeId: 'LlDNef4k5dI',
    videoUrl: 'https://www.youtube.com/embed/LlDNef4k5dI',
    secondaryVideoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    fallbackUrl: 'https://www.youtube.com/watch?v=LlDNef4k5dI',
    videoSource: 'Calisthenics Movement Hollow Body',
    secondaryVideoSource: 'Gymnastics Method Core',
    videoType: 'embed',
    videoDurationSec: 40,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'lying-leg-raises',
    name: 'Lying Leg Raises',
    category: 'core',
    targetMuscles: ['Lower Rectus Abdominis', 'Hip Flexors', 'Obliques'],
    primaryMuscles: ['Lower Rectus Abdominis', 'Hip Flexors (Psoas)'],
    secondaryMuscles: ['Obliques', 'Adductors', 'Transverse Abdominis'],
    bodyRegions: ['core', 'quads_hamstrings'],
    musclesExplanation: 'Lifting leg weight against gravity forces the lower abdominal wall to engage and control the pelvic angle without putting torque on spinal discs.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on your back on a mat, hands placed palms-down under your glutes for lumbar support.',
      'Extend legs straight with feet pressed together.',
      'Engage your abs and slowly raise both legs toward the ceiling until hips reach 90 degrees.',
      'Slowly lower legs under control until heels hover 2-3 inches above the floor.',
      'Pause for a fraction of a second, then raise again without letting feet touch the ground.'
    ],
    commonMistakes: [
      'Allowing lower back to hyper-arch during the descent.',
      'Using swinging momentum instead of abdominal pull.'
    ],
    safetyTips: [
      'Place hands under glutes to preserve comfortable pelvic alignment.'
    ],
    easierAlternative: 'Bent-knee reverse crunches or alternating single-leg drops.',
    harderProgression: 'Candlestick / Dragon Flag progressions or hanging leg raises.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-12 reps',
    restIntervalSeconds: 45,
    youtubeId: 'JB2oyawG9KI',
    videoUrl: 'https://www.youtube.com/embed/JB2oyawG9KI',
    secondaryVideoUrl: 'https://www.youtube.com/embed/g_BYB0R-4Ws',
    fallbackUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    videoSource: 'FitnessBlender Leg Raises',
    secondaryVideoSource: 'Calisthenics Core Foundations',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists (Bodyweight)',
    category: 'core',
    targetMuscles: ['Internal & External Obliques', 'Rectus Abdominis', 'Hip Flexors'],
    primaryMuscles: ['Internal & External Obliques'],
    secondaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Hip Flexors'],
    bodyRegions: ['core'],
    musclesExplanation: 'Rotational torque while balancing on the sit bones fires both superficial and deep oblique muscle groups that stabilize the torso.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Sit on your mat with knees bent and feet flat on the floor.',
      'Lean your torso back to a 45-degree angle, keeping chest open and spine straight.',
      'Clasp hands in front of your chest and gently brace your abs.',
      'Rotate your torso to tap the floor on your right side with both hands.',
      'Rotate smoothly across to tap the floor on your left side.',
      'Keep your gaze following your hands to ensure thoracic rotation.'
    ],
    commonMistakes: [
      'Moving only the arms while keeping shoulders static (rotate the whole ribcage).',
      'Rounding and slouching the spine into a C-curve.'
    ],
    safetyTips: [
      'Keep heels resting on the floor initially to ensure solid lumbar stabilization.'
    ],
    easierAlternative: 'Sit more upright with heels firmly grounded.',
    harderProgression: 'Elevate feet 3 inches off the ground (V-sit position).',
    defaultSets: 3,
    defaultRepsOrSeconds: '16-20 total twists',
    restIntervalSeconds: 45,
    youtubeId: 'wkD8rjkodUI',
    videoUrl: 'https://www.youtube.com/embed/wkD8rjkodUI',
    secondaryVideoUrl: 'https://www.youtube.com/embed/9FGilxCbdz8',
    fallbackUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    videoSource: 'FitnessBlender Russian Twists',
    secondaryVideoSource: 'Calisthenics Oblique Guide',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'core',
    targetMuscles: ['Core Abdominals', 'Hip Flexors', 'Shoulders', 'Cardio'],
    primaryMuscles: ['Core Abdominals', 'Hip Flexors'],
    secondaryMuscles: ['Anterior Deltoids', 'Quadriceps', 'Cardiovascular System'],
    bodyRegions: ['core', 'shoulders', 'quads_hamstrings', 'full_body'],
    musclesExplanation: 'Dynamic alternating knee drives in a high plank position combine isometric core stability with high-rate hip flexion and calorie burning.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Start in a full high plank position with hands under shoulders, fingers spread.',
      'Brace your core, keeping hips level and shoulders packed.',
      'Drive your right knee up toward your chest without touching the floor.',
      'Step right foot back while simultaneously driving your left knee forward.',
      'Establish a smooth, rapid running cadence while maintaining a flat back.'
    ],
    commonMistakes: [
      'Hips bouncing high up into the air.',
      'Hands drifting out in front of the shoulders.'
    ],
    safetyTips: [
      'Perform at a moderate walking pace first before speeding up.'
    ],
    easierAlternative: 'Incline Mountain Climbers with hands on a sturdy chair or couch.',
    harderProgression: 'Cross-body mountain climbers (knee driven to opposite elbow).',
    defaultSets: 3,
    defaultRepsOrSeconds: '30 seconds',
    restIntervalSeconds: 45,
    youtubeId: 'nmwgirgXLYM',
    videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM',
    secondaryVideoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    fallbackUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    videoSource: 'FitnessBlender Mountain Climbers',
    secondaryVideoSource: 'Athlean Conditioning Series',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },

  // ==========================================
  // MOBILITY & RECOVERY
  // ==========================================
  {
    id: 'cat-cow-stretch',
    name: 'Cat-Cow Mobility Flow',
    category: 'mobility',
    targetMuscles: ['Thoracic Spine', 'Lumbar Spine', 'Neck', 'Abdominals'],
    primaryMuscles: ['Thoracic & Lumbar Spine Muscles', 'Neck Extensors/Flexors'],
    secondaryMuscles: ['Abdominals', 'Pelvic Stabilizers', 'Shoulders'],
    bodyRegions: ['back', 'core', 'shoulders'],
    musclesExplanation: 'Alternating between spinal flexion (Cat) and extension (Cow) rehydrates intervertebral discs and mobilizes the entire vertebral column.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Begin on hands and knees with wrists under shoulders and knees under hips.',
      'Inhale: drop your belly toward the mat, lift your chest, and look forward gently (Cow pose).',
      'Exhale: round your spine toward the ceiling, tuck your chin to your chest, and draw your navel inward (Cat pose).',
      'Flow smoothly between both shapes in sync with your breathing.'
    ],
    commonMistakes: [
      'Cranking the neck too far back during cow.',
      'Rushing through the transitions.'
    ],
    safetyTips: [
      'Move only within a comfortable, pain-free range of motion for your back.'
    ],
    easierAlternative: 'Seated Cat-Cow on a chair.',
    harderProgression: 'Thoracic needle-thread rotations.',
    defaultSets: 2,
    defaultRepsOrSeconds: '8-10 breaths',
    restIntervalSeconds: 30,
    youtubeId: 's2vGv1g2w98',
    videoUrl: 'https://www.youtube.com/embed/s2vGv1g2w98',
    secondaryVideoUrl: 'https://www.youtube.com/embed/ESQ_rFp9v0M',
    fallbackUrl: 'https://www.youtube.com/watch?v=s2vGv1g2w98',
    videoSource: 'FitMood Yoga & Mobility',
    secondaryVideoSource: 'Spine Health Academy',
    videoType: 'embed',
    videoDurationSec: 40,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'childs-pose-breathing',
    name: 'Child’s Pose & Deep Breathing',
    category: 'recovery',
    targetMuscles: ['Lats', 'Hips', 'Lower Back', 'Parasympathetic Nervous System'],
    primaryMuscles: ['Latissimus Dorsi', 'Hip Extensors / Glutes'],
    secondaryMuscles: ['Lower Back (Erector Spinae)', 'Ankles', 'Diaphragm'],
    bodyRegions: ['back', 'glutes', 'full_body'],
    musclesExplanation: 'Passive hip flexion and long lat stretch gently decompresses the spine while diaphragmatic breathing activates parasympathetic recovery.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Kneel on the floor, bring big toes together, and spread knees comfortably apart.',
      'Sit your hips back toward your heels and walk your hands forward on the mat.',
      'Rest your forehead gently on the ground or a soft pillow.',
      'Extend arms long in front or let them rest by your sides.',
      'Breathe deeply in through your nose for 4 counts, expand your ribcage, and exhale slowly for 6 counts.'
    ],
    commonMistakes: [
      'Holding tension in the shoulders or clenching the jaw.'
    ],
    safetyTips: [
      'Place a cushion under your hips or knees if you experience tightness.'
    ],
    easierAlternative: 'Elevated child’s pose with arms on a bed or couch.',
    harderProgression: 'Side-reaching child’s pose to open lats deeper.',
    defaultSets: 1,
    defaultRepsOrSeconds: '60-90 seconds',
    restIntervalSeconds: 0,
    youtubeId: '2MJGg-dUKh0',
    videoUrl: 'https://www.youtube.com/embed/2MJGg-dUKh0',
    secondaryVideoUrl: 'https://www.youtube.com/embed/eqVMAPM00DM',
    fallbackUrl: 'https://www.youtube.com/watch?v=2MJGg-dUKh0',
    videoSource: 'FitMood Recovery Series',
    secondaryVideoSource: 'Calm Yoga Studio',
    videoType: 'embed',
    videoDurationSec: 60,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'worlds-greatest-stretch',
    name: 'World’s Greatest Stretch',
    category: 'mobility',
    targetMuscles: ['Thoracic Spine', 'Hip Flexors', 'Hamstrings', 'Groin'],
    primaryMuscles: ['Thoracic Spine', 'Hip Flexors (Psoas)', 'Hamstrings'],
    secondaryMuscles: ['Glutes', 'Ankles', 'Shoulders'],
    bodyRegions: ['back', 'quads_hamstrings', 'glutes', 'shoulders'],
    musclesExplanation: 'Integrates a deep runner’s lunge with an elbow-to-instep drop and a full thoracic reach, unlocking hip mobility and thoracic rotation simultaneously.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Step forward into a deep lunge with your left foot outside your left hand.',
      'Keep your back right leg long and engaged.',
      'Drop your left elbow down toward your left instep, feeling a deep groin and hip stretch.',
      'Rotate your left arm up toward the ceiling, following your hand with your eyes.',
      'Place left hand back down, rock back to straighten front leg for a quick hamstring stretch, then switch sides.'
    ],
    commonMistakes: [
      'Letting the front knee collapse inward.',
      'Rushing through the rotational twist without breathing.'
    ],
    safetyTips: [
      'Drop the back knee to the floor if maintaining a floating high lunge feels unstable.'
    ],
    easierAlternative: 'Kneeling low lunge with simple chest twist.',
    harderProgression: 'Adding an overhead reach and hip extension sweep.',
    defaultSets: 2,
    defaultRepsOrSeconds: '5 reps each side',
    restIntervalSeconds: 30,
    youtubeId: '2qZ517Sw6rE',
    videoUrl: 'https://www.youtube.com/embed/2qZ517Sw6rE',
    secondaryVideoUrl: 'https://www.youtube.com/embed/s2vGv1g2w98',
    fallbackUrl: 'https://www.youtube.com/watch?v=2qZ517Sw6rE',
    videoSource: 'Athlean Worlds Greatest Stretch',
    secondaryVideoSource: 'Mobility WOD Tutorial',
    videoType: 'embed',
    videoDurationSec: 45,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'thread-the-needle',
    name: 'Thoracic Thread-the-Needle',
    category: 'mobility',
    targetMuscles: ['Thoracic Spine', 'Rhomboids', 'Rear Deltoids', 'Upper Back'],
    primaryMuscles: ['Thoracic Spine', 'Rhomboids', 'Upper Trapezius'],
    secondaryMuscles: ['Posterior Deltoids', 'Neck Muscles', 'Lats'],
    bodyRegions: ['back', 'shoulders'],
    musclesExplanation: 'Gentle rotational stretch targeting the thoracic vertebrae and rhomboids, releasing desk-slouch stiffness between the shoulder blades.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Start on all fours with wrists under shoulders and knees under hips.',
      'Inhale and reach your right arm high toward the ceiling, opening your chest.',
      'Exhale and slide (thread) your right arm under your chest across to the left, lowering your right shoulder and ear gently to the mat.',
      'Hold for 3-5 deep nasal breaths, feeling the upper back release.',
      'Press through left palm to return to all fours and repeat on the opposite side.'
    ],
    commonMistakes: [
      'Shifting hips heavily off-center to the side.',
      'Forcing the shoulder down aggressively.'
    ],
    safetyTips: [
      'Support your head with a pillow if your ear does not reach the ground comfortably.'
    ],
    easierAlternative: 'Seated torso twists with hands across chest.',
    harderProgression: 'Wrap the top hand behind lower back for a deeper bind.',
    defaultSets: 2,
    defaultRepsOrSeconds: '4-5 reps per side',
    restIntervalSeconds: 30,
    youtubeId: 's2r4H1Vkvb0',
    videoUrl: 'https://www.youtube.com/embed/s2r4H1Vkvb0',
    secondaryVideoUrl: 'https://www.youtube.com/embed/s2vGv1g2w98',
    fallbackUrl: 'https://www.youtube.com/watch?v=s2r4H1Vkvb0',
    videoSource: 'FitnessBlender Thread Needle',
    secondaryVideoSource: 'Yoga Journal Spine Lab',
    videoType: 'embed',
    videoDurationSec: 40,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'ninety-ninety-hip-flow',
    name: '90-90 Hip Mobility Flow',
    category: 'mobility',
    targetMuscles: ['Hip Internal Rotators', 'Hip External Rotators', 'Glutes', 'Hip Capsule'],
    primaryMuscles: ['Hip Internal & External Rotators', 'Gluteus Medius'],
    secondaryMuscles: ['Piriformis', 'Adductors', 'Iliopsoas'],
    bodyRegions: ['glutes', 'quads_hamstrings'],
    musclesExplanation: 'Positions one leg in 90-degree external rotation and the other in 90-degree internal rotation, unlocking deep rotational freedom in the femoral head.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Sit on the floor, bending your front leg at 90 degrees in front of you and trailing leg at 90 degrees to your side.',
      'Sit tall through your spine without slouching.',
      'Hinge forward gently over your front shin to stretch the front glute.',
      'Sit upright and smoothly rotate both knees across to the opposite side like windshield wipers without lifting your hips off the floor.',
      'Repeat on the opposite side.'
    ],
    commonMistakes: [
      'Rounding the lower back when folding forward.',
      'Collapsing through the shoulders.'
    ],
    safetyTips: [
      'Place hands on the floor behind you for balance if your hips feel tight.'
    ],
    easierAlternative: 'Windshield wiper legs lying flat on your back.',
    harderProgression: 'Perform without using hands on the ground for support.',
    defaultSets: 2,
    defaultRepsOrSeconds: '8-10 transitions',
    restIntervalSeconds: 30,
    youtubeId: '0hY48qH_194',
    videoUrl: 'https://www.youtube.com/embed/0hY48qH_194',
    secondaryVideoUrl: 'https://www.youtube.com/embed/2qZ517Sw6rE',
    fallbackUrl: 'https://www.youtube.com/watch?v=0hY48qH_194',
    videoSource: 'Squat University 90-90 Hip Flow',
    secondaryVideoSource: 'Mobility Foundations',
    videoType: 'embed',
    videoDurationSec: 45,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'cobra-stretch',
    name: 'Cobra / Sphinx Back Stretch',
    category: 'mobility',
    targetMuscles: ['Abdominals', 'Spinal Extensors', 'Chest', 'Shoulders'],
    primaryMuscles: ['Abdominals', 'Spinal Extensors (Erector Spinae)'],
    secondaryMuscles: ['Chest', 'Shoulders', 'Hip Flexors'],
    bodyRegions: ['back', 'core', 'chest'],
    musclesExplanation: 'Gentle active spinal extension stretches tight abdominal muscles and counters the chronic forward flexion of sitting at computers.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Lie face down on a mat with legs straight and tops of feet flat on the floor.',
      'Place hands under your shoulders, elbows hugged tight against your ribs.',
      'Inhale and gently press through your hands to peel your chest off the floor.',
      'Keep your shoulders down and back, away from your ears.',
      'Hold for 10-15 seconds with smooth nasal breathing, then slowly lower down.'
    ],
    commonMistakes: [
      'Shrugging shoulders up into the ears.',
      'Crunching into the lower back (think of lengthening forward rather than bending backward).'
    ],
    safetyTips: [
      'If you have sensitive lumbar discs, rest on your forearms in Sphinx Pose instead of straight arms.'
    ],
    easierAlternative: 'Sphinx pose resting on forearms.',
    harderProgression: 'Upward-Facing Dog with thighs lifted off the mat.',
    defaultSets: 2,
    defaultRepsOrSeconds: '20-30 seconds hold',
    restIntervalSeconds: 30,
    youtubeId: 'fOdrW7nf9gw',
    videoUrl: 'https://www.youtube.com/embed/fOdrW7nf9gw',
    secondaryVideoUrl: 'https://www.youtube.com/embed/s2vGv1g2w98',
    fallbackUrl: 'https://www.youtube.com/watch?v=fOdrW7nf9gw',
    videoSource: 'FitnessBlender Cobra Stretch',
    secondaryVideoSource: 'Yoga Recovery Studio',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },

  // ==========================================
  // CARDIO & METABOLIC CONDITIONING
  // ==========================================
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks (Cardio Spark)',
    category: 'full_body',
    targetMuscles: ['Cardiovascular System', 'Calves', 'Deltoids', 'Core'],
    primaryMuscles: ['Cardiovascular System', 'Calves (Gastrocnemius)'],
    secondaryMuscles: ['Deltoids (Shoulders)', 'Core Stabilizers', 'Hip Abductors/Adductors'],
    bodyRegions: ['full_body', 'calves', 'shoulders', 'core'],
    musclesExplanation: 'Dynamic, multi-joint whole-body jumping coordinates upper and lower limbs, elevating cardiac output while building reactive ankle elasticity.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand upright with feet together and arms resting comfortably by your sides.',
      'Bend your knees slightly and jump feet out sideways while sweeping arms overhead.',
      'Land softly on the balls of your feet with knees relaxed.',
      'Immediately jump back to the starting position with arms returning to sides.',
      'Maintain a light, rhythmic breathing rhythm throughout.'
    ],
    commonMistakes: [
      'Landing heavily on stiff flat heels (stay light on the balls of your feet).',
      'Flaring shoulders excessively without soft elbow bends.'
    ],
    safetyTips: [
      'If low-impact is needed for knee comfort, perform Step Jacks (step one foot out at a time without jumping).'
    ],
    easierAlternative: 'Low-Impact Step Jacks (no hopping).',
    harderProgression: 'Star Jumps or High-Pace Interval Jacks.',
    defaultSets: 3,
    defaultRepsOrSeconds: '30 seconds',
    restIntervalSeconds: 45,
    youtubeId: 'c4DAnQ6DtF8',
    videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    secondaryVideoUrl: 'https://www.youtube.com/embed/2W4ZNSwoW_4',
    fallbackUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    videoSource: 'FitMood Cardio Basics',
    secondaryVideoSource: 'FitnessBlender Warmup Lab',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'high-knees',
    name: 'High Knees (Cardio & Hip Drive)',
    category: 'full_body',
    targetMuscles: ['Cardiovascular System', 'Hip Flexors', 'Calves', 'Core'],
    primaryMuscles: ['Cardiovascular System', 'Hip Flexors (Psoas)', 'Calves'],
    secondaryMuscles: ['Quadriceps', 'Core Abdominals', 'Glutes'],
    bodyRegions: ['full_body', 'calves', 'quads_hamstrings', 'core'],
    musclesExplanation: 'Rapid running in place with high knee drive fires hip flexors, activates the deep abdominal wall, and accelerates heart rate.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Stand tall with feet hip-width apart and arms bent at 90 degrees.',
      'Drive your right knee up toward your chest, aiming for hip height.',
      'As right foot lands softly on the ball of the foot, immediately drive your left knee up.',
      'Pump your arms in synchronization with opposite legs.',
      'Maintain an upright posture and quick, light footwork.'
    ],
    commonMistakes: [
      'Leaning backward to compensate for lifting the knees.',
      'Slapping heels down hard.'
    ],
    safetyTips: [
      'Stay bouncy on the balls of your feet with relaxed ankles.'
    ],
    easierAlternative: 'Marching in place with high knee lift (no jump impact).',
    harderProgression: 'Sprinting High Knees or Butt Kickers intervals.',
    defaultSets: 3,
    defaultRepsOrSeconds: '30 seconds',
    restIntervalSeconds: 45,
    youtubeId: 'oDdkytliOqE',
    videoUrl: 'https://www.youtube.com/embed/oDdkytliOqE',
    secondaryVideoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    fallbackUrl: 'https://www.youtube.com/watch?v=oDdkytliOqE',
    videoSource: 'FitnessBlender High Knees Tutorial',
    secondaryVideoSource: 'Athlean Cardio Lab',
    videoType: 'embed',
    videoDurationSec: 30,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'shadow-boxing-punches',
    name: 'Shadow Boxing Speed Punches',
    category: 'full_body',
    targetMuscles: ['Deltoids', 'Rotational Core', 'Cardio', 'Lats'],
    primaryMuscles: ['Deltoids (Shoulders)', 'Rotational Obliques', 'Cardio'],
    secondaryMuscles: ['Latissimus Dorsi', 'Calves', 'Forearms'],
    bodyRegions: ['shoulders', 'core', 'full_body'],
    musclesExplanation: 'Rhythmic rotational punches recruit the hips and core through kinetic chain transfer while burning calories with zero joint impact.',
    equipmentNeeded: 'none',
    difficulty: 'beginner',
    instructions: [
      'Stand in an athletic boxer stance with one foot slightly forward, knees soft, hands guarding chin.',
      'Punch straight forward with leading hand (jab), rotating palm downward at extension.',
      'Snap back to chin and drive trailing hand forward (cross), pivoting slightly on rear ball of foot.',
      'Maintain a fluid 1-2 rhythm with rhythmic breathing (sharp exhalation on each punch).'
    ],
    commonMistakes: [
      'Hyperextending and locking out elbow joints abruptly.',
      'Dropping hands away from face.'
    ],
    safetyTips: [
      'Keep punches snappy but soft at the elbows to protect joint cartilage.'
    ],
    easierAlternative: 'Standing arm pulses or slow-motion jab-cross.',
    harderProgression: 'Shadow boxing with footwork duck and weave slips.',
    defaultSets: 3,
    defaultRepsOrSeconds: '30-45 seconds',
    restIntervalSeconds: 30,
    youtubeId: '8v_R1H891hU',
    videoUrl: 'https://www.youtube.com/embed/8v_R1H891hU',
    secondaryVideoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    fallbackUrl: 'https://www.youtube.com/watch?v=8v_R1H891hU',
    videoSource: 'FitnessBlender Boxing Cardio',
    secondaryVideoSource: 'Calisthenics Cardio Lab',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'skater-hops',
    name: 'Skater Hops (Lateral Bounding)',
    category: 'full_body',
    targetMuscles: ['Gluteus Medius', 'Quadriceps', 'Calves', 'Core Balance'],
    primaryMuscles: ['Gluteus Medius (Side Glutes)', 'Calves', 'Quadriceps'],
    secondaryMuscles: ['Hamstrings', 'Ankle Stabilizers', 'Core'],
    bodyRegions: ['glutes', 'quads_hamstrings', 'calves', 'core'],
    musclesExplanation: 'Lateral bounding builds frontal plane athleticism, dynamic knee and ankle stability, and burns energy without high linear impact.',
    equipmentNeeded: 'none',
    difficulty: 'intermediate',
    instructions: [
      'Start in a slight quarter squat, bounding sideways onto your right foot.',
      'Land softly on your right foot, bending your right knee and swinging left leg behind like a speed skater.',
      'Immediately push off your right foot and leap sideways to land on your left foot.',
      'Swing your arms in a natural running cadence for momentum and balance.'
    ],
    commonMistakes: [
      'Landing with a stiff, locked knee (absorb impact by bending knee and hip).',
      'Stumbling due to rushing before finding balance.'
    ],
    safetyTips: [
      'Ensure the floor has good traction and no loose mats or socks that can slip.'
    ],
    easierAlternative: 'Side-to-side curtsy step taps without the jumping bound.',
    harderProgression: 'Explosive high-distance skater leaps touching floor with opposite hand.',
    defaultSets: 3,
    defaultRepsOrSeconds: '30 seconds',
    restIntervalSeconds: 45,
    youtubeId: '4RuxhVBCfs0',
    videoUrl: 'https://www.youtube.com/embed/4RuxhVBCfs0',
    secondaryVideoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    fallbackUrl: 'https://www.youtube.com/watch?v=4RuxhVBCfs0',
    videoSource: 'FitnessBlender Skater Hops',
    secondaryVideoSource: 'Athlean Lateral Movement',
    videoType: 'embed',
    videoDurationSec: 35,
    isVerifiedVideo: true,
    videoGenerationStatus: 'fallback_animated',
    videoModelSource: 'Coach Milo 2D Motion Engine'
  },
  {
    id: 'wide-grip-push-up',
    name: 'Wide-Grip Push-Ups',
    category: 'upper',
    targetMuscles: ['Pectoralis Major (Outer Chest)', 'Anterior Deltoids', 'Triceps', 'Core'],
    primaryMuscles: ['Pectoralis Major', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Core Stabilizers'],
    bodyRegions: ['chest', 'shoulders', 'biceps_triceps', 'core'],
    musclesExplanation: 'Widening your hand placement emphasizes the outer and lower fibers of the chest while reducing triceps leverage.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['yoga_mat'],
    difficulty: 'intermediate',
    instructions: [
      'Assume a push-up position with hands placed approximately 1.5 times shoulder-width apart.',
      'Maintain a rigid straight line from head through hips to heels by bracing your core and glutes.',
      'Inhale and lower your chest until it is approximately 2 inches from the floor.',
      'Exhale and press powerfully through your palms to return to full arm extension without locking elbows.'
    ],
    breathingGuidance: 'Inhale smoothly during the 2-second descent; exhale firmly as you press away from the floor.',
    commonMistakes: [
      'Flaring elbows out to 90 degrees (maintain a 45-60 degree angle from torso).',
      'Sagging hips or arching the lumbar spine.'
    ],
    safetyTips: [
      'If you feel discomfort in your front shoulder capsules, narrow your grip slightly.'
    ],
    easierAlternative: 'Incline Wide-Grip Push-Ups on a sturdy desk or table.',
    harderProgression: 'Decline Wide-Grip Push-Ups with feet elevated on a bed or chair.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-12 reps',
    restIntervalSeconds: 45,
    youtubeId: 'a6YHbXD2XlU',
    videoUrl: 'https://www.youtube-nocookie.com/embed/a6YHbXD2XlU',
    videoSource: 'FitnessBlender Human Form Lab',
    fallbackUrl: 'https://www.youtube.com/watch?v=a6YHbXD2XlU',
    isVerifiedVideo: true
  },
  {
    id: 'scapular-push-up',
    name: 'Scapular Push-Ups',
    category: 'upper',
    targetMuscles: ['Serratus Anterior', 'Scapular Stabilizers', 'Rotator Cuff', 'Core'],
    primaryMuscles: ['Serratus Anterior', 'Rhomboids'],
    secondaryMuscles: ['Trapezius', 'Core Stabilizers'],
    bodyRegions: ['shoulders', 'back', 'core'],
    musclesExplanation: 'Moving solely through scapular protraction and retraction activates the serratus anterior, bulletproofing your shoulders for calisthenics.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['yoga_mat'],
    difficulty: 'beginner',
    instructions: [
      'Start in a high plank position with arms completely straight and locked at the elbows.',
      'Without bending your elbows, pinch your shoulder blades together allowing your chest to sink slightly toward the floor.',
      'Press firmly through your hands, spreading your shoulder blades as far apart as possible (protraction) at the peak.',
      'Hold the peak protraction for 1 second before lowering into the next repetition.'
    ],
    breathingGuidance: 'Inhale as shoulder blades retract; exhale as you push the ground away.',
    commonMistakes: [
      'Bending elbows (keep arms completely locked throughout the entire movement).',
      'Dropping the hips or losing core rigidity.'
    ],
    safetyTips: [
      'Focus on slow, mindful control over range of motion rather than speed.'
    ],
    easierAlternative: 'Perform scapular push-ups from the knees or standing against a wall.',
    harderProgression: 'Perform scapular push-ups from a forearm plank or with feet elevated.',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-15 reps',
    restIntervalSeconds: 30,
    youtubeId: '3F1uT7uG0G4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/3F1uT7uG0G4',
    videoSource: 'Calisthenicmovement Scapular Health',
    fallbackUrl: 'https://www.youtube.com/watch?v=3F1uT7uG0G4',
    isVerifiedVideo: true
  },
  {
    id: 'pull-ups',
    name: 'Standard Overhand Pull-Ups',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Biceps Brachii', 'Trapezius', 'Posterior Deltoids', 'Core'],
    primaryMuscles: ['Latissimus Dorsi (Lats)', 'Teres Major', 'Biceps Brachii'],
    secondaryMuscles: ['Rhomboids', 'Forearm Flexors', 'Abs'],
    bodyRegions: ['back', 'biceps_triceps', 'shoulders', 'core'],
    musclesExplanation: 'The quintessential upper-body vertical pull, developing massive lat width, scapular depression, and grip power.',
    equipmentNeeded: 'pull_up_bar',
    equipmentAlternatives: ['gym_access'],
    difficulty: 'intermediate',
    instructions: [
      'Grip the pull-up bar with an overhand grip (palms facing away), slightly wider than shoulder-width.',
      'Hang with arms fully extended into an active dead-hang with engaged shoulders.',
      'Drive your elbows down and back toward your ribs, pulling your chest up toward the bar until your chin clears.',
      'Pause for a fraction of a second at the top, then lower under control for 2-3 seconds to a full hang.'
    ],
    breathingGuidance: 'Inhale at the bottom; exhale forcefully as you drive elbows down to pull yourself up.',
    commonMistakes: [
      'Kicking or kipping with legs to gain momentum.',
      'Stopping halfway without reaching full elbow extension at the bottom.'
    ],
    safetyTips: [
      'Ensure the pull-up bar is securely mounted and tested before putting full bodyweight on it.'
    ],
    easierAlternative: 'Resistance-band assisted pull-ups, chair-assisted pull-ups, or negative pull-ups.',
    harderProgression: 'Slow 5-second eccentric pull-ups or L-Sit Pull-Ups.',
    defaultSets: 3,
    defaultRepsOrSeconds: '6-8 reps',
    restIntervalSeconds: 90,
    youtubeId: 'eGo4IYlbE5g',
    videoUrl: 'https://www.youtube-nocookie.com/embed/eGo4IYlbE5g',
    videoSource: 'Calisthenicmovement Pull-Up Form',
    fallbackUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    isVerifiedVideo: true
  },
  {
    id: 'chin-up',
    name: 'Underhand Chin-Ups',
    category: 'upper',
    targetMuscles: ['Biceps Brachii', 'Latissimus Dorsi', 'Pectorals', 'Upper Back'],
    primaryMuscles: ['Biceps Brachii', 'Latissimus Dorsi'],
    secondaryMuscles: ['Forearms', 'Posterior Deltoids', 'Core'],
    bodyRegions: ['back', 'biceps_triceps', 'shoulders'],
    musclesExplanation: 'Underhand grip places the biceps in their strongest mechanical pulling position while recruiting lower lats.',
    equipmentNeeded: 'pull_up_bar',
    equipmentAlternatives: ['gym_access'],
    difficulty: 'intermediate',
    instructions: [
      'Grip the bar with palms facing you (supinated grip) shoulder-width apart.',
      'Hang with full arm extension, bracing your abdomen.',
      'Pull your chest up toward the bar, driving your elbows down toward your hips until your chin clears the bar.',
      'Lower under control over 2-3 seconds to full extension.'
    ],
    breathingGuidance: 'Exhale on the pull; inhale during the controlled descent.',
    commonMistakes: [
      'Rounding shoulders forward at the top.',
      'Swinging legs for momentum.'
    ],
    safetyTips: [
      'Keep wrists straight and neutral over the bar to avoid joint strain.'
    ],
    easierAlternative: 'Resistance-band assisted chin-ups or towel-assisted foot hangs.',
    harderProgression: 'Weighted chin-ups or slow 4-second negatives.',
    defaultSets: 3,
    defaultRepsOrSeconds: '6-10 reps',
    restIntervalSeconds: 90,
    youtubeId: 'brhRXlOhsAM',
    videoUrl: 'https://www.youtube-nocookie.com/embed/brhRXlOhsAM',
    videoSource: 'Athlean-X Chin-Up Form Lab',
    fallbackUrl: 'https://www.youtube.com/watch?v=brhRXlOhsAM',
    isVerifiedVideo: true
  },
  {
    id: 'assisted-pull-up',
    name: 'Resistance Band / Chair Assisted Pull-Ups',
    category: 'upper',
    targetMuscles: ['Lats', 'Biceps', 'Rhomboids', 'Core'],
    primaryMuscles: ['Latissimus Dorsi', 'Biceps'],
    secondaryMuscles: ['Scapular Retractors', 'Forearms'],
    bodyRegions: ['back', 'biceps_triceps'],
    musclesExplanation: 'Reduces the percentage of bodyweight you lift, teaching the central nervous system the exact motor pattern for full pull-ups.',
    equipmentNeeded: 'pull_up_bar',
    equipmentAlternatives: ['resistance_bands', 'gym_access'],
    difficulty: 'beginner',
    instructions: [
      'Loop a resistance band securely around the pull-up bar, placing one foot or knee inside the loop.',
      'Alternatively, place toes on a sturdy chair directly underneath the bar.',
      'Grip the bar slightly wider than shoulder-width and pull your chest to the bar with minimal foot assistance.',
      'Lower smoothly to a full dead hang.'
    ],
    breathingGuidance: 'Exhale as you pull up; inhale as you lower down.',
    commonMistakes: [
      'Relying entirely on leg drive instead of contracting your lats.',
      'Shortening the bottom range of motion.'
    ],
    safetyTips: [
      'Ensure the band is centered securely on your foot so it does not slip off.'
    ],
    easierAlternative: 'Use a thicker resistance band or doorframe isometric rows.',
    harderProgression: 'Switch to a lighter resistance band or single-toe chair assistance.',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-10 reps',
    restIntervalSeconds: 60,
    youtubeId: '3vE22gYdD7I',
    videoUrl: 'https://www.youtube-nocookie.com/embed/3vE22gYdD7I',
    videoSource: 'FitnessBlender Assisted Pull-Up Lab',
    fallbackUrl: 'https://www.youtube.com/watch?v=3vE22gYdD7I',
    isVerifiedVideo: true
  },
  {
    id: 'resistance-band-rows',
    name: 'Resistance-Band Seated / Standing Rows',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps'],
    primaryMuscles: ['Middle Trapezius', 'Rhomboids', 'Lats'],
    secondaryMuscles: ['Biceps', 'Erector Spinae'],
    bodyRegions: ['back', 'biceps_triceps', 'shoulders'],
    musclesExplanation: 'Provides continuous horizontal pulling tension to counteract slouching and strengthen the upper back without free weights.',
    equipmentNeeded: 'resistance_bands',
    equipmentAlternatives: ['gym_access'],
    difficulty: 'beginner',
    instructions: [
      'Sit on the floor with legs extended, loop the middle of a resistance band around your feet.',
      'Hold the handles with palms facing each other, keeping your spine tall and neutral.',
      'Pull the band back toward your lower ribs, squeezing your shoulder blades together firmly at peak contraction.',
      'Pause for 1 second, then slowly return hands forward under control.'
    ],
    breathingGuidance: 'Exhale as you pull elbows backward; inhale as you slowly extend arms.',
    commonMistakes: [
      'Shrugging shoulders up toward the ears (keep shoulders down and back).',
      'Rounding the lower back.'
    ],
    safetyTips: [
      'Inspect the resistance band for tears or wear before pulling with maximum force.'
    ],
    easierAlternative: 'Sit closer to feet to decrease band stretch tension.',
    harderProgression: 'Hold the peak contraction for 3 seconds on each rep or use a heavier resistance band.',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-15 reps',
    restIntervalSeconds: 45,
    youtubeId: 'c1EwG9W0-bE',
    videoUrl: 'https://www.youtube-nocookie.com/embed/c1EwG9W0-bE',
    videoSource: 'FitnessBlender Band Form',
    fallbackUrl: 'https://www.youtube.com/watch?v=c1EwG9W0-bE',
    isVerifiedVideo: true
  },
  {
    id: 'resistance-band-pull-aparts',
    name: 'Resistance-Band Pull-Aparts',
    category: 'upper',
    targetMuscles: ['Rear Deltoids', 'Rhomboids', 'Mid & Lower Trapezius', 'Rotator Cuff'],
    primaryMuscles: ['Posterior Deltoids', 'Rhomboids'],
    secondaryMuscles: ['Infraspinatus', 'Trapezius'],
    bodyRegions: ['shoulders', 'back'],
    musclesExplanation: 'One of the best postural correctors in physical therapy, engaging the upper posterior chain and external rotators.',
    equipmentNeeded: 'resistance_bands',
    equipmentAlternatives: ['gym_access'],
    difficulty: 'beginner',
    instructions: [
      'Stand tall holding a resistance band horizontally in front of your chest with hands shoulder-width apart.',
      'Keep your arms straight with only a soft micro-bend in the elbows.',
      'Pull the band horizontally apart until it touches your sternum, pinching your shoulder blades together.',
      'Slowly return to the starting position over 2 seconds.'
    ],
    breathingGuidance: 'Exhale as you pull the band apart; inhale as hands return together.',
    commonMistakes: [
      'Arching lower back and thrusting ribs forward.',
      'Bending elbows excessively and turning it into a triceps extension.'
    ],
    safetyTips: [
      'Choose a lighter band tension so you can complete the full range of motion without neck tension.'
    ],
    easierAlternative: 'Grip the band wider to decrease resistance.',
    harderProgression: 'Grip the band closer together or pause for 2 seconds at the chest.',
    defaultSets: 3,
    defaultRepsOrSeconds: '15-20 reps',
    restIntervalSeconds: 30,
    youtubeId: '2B3h6m86QpE',
    videoUrl: 'https://www.youtube-nocookie.com/embed/2B3h6m86QpE',
    videoSource: 'Athlean-X Posture Lab',
    fallbackUrl: 'https://www.youtube.com/watch?v=2B3h6m86QpE',
    isVerifiedVideo: true
  },
  {
    id: 'dumbbell-rows',
    name: 'Single-Arm Dumbbell Row',
    category: 'upper',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps', 'Core'],
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids'],
    secondaryMuscles: ['Biceps Brachii', 'Forearms', 'Core Stabilizers'],
    bodyRegions: ['back', 'biceps_triceps', 'shoulders'],
    musclesExplanation: 'Unilateral free-weight row developing balanced back thickness, grip strength, and core anti-rotation stability.',
    equipmentNeeded: 'dumbbells',
    equipmentAlternatives: ['gym_access', 'kettlebell'],
    difficulty: 'intermediate',
    instructions: [
      'Place one hand and knee on a sturdy bench or chair, keeping your spine flat and parallel to the floor.',
      'Hold a dumbbell in the opposite hand with arm hanging straight down.',
      'Pull the dumbbell up toward your hip pocket, driving your elbow toward the ceiling.',
      'Squeeze your back muscles at the top for 1 second, then lower slowly over 2 seconds.'
    ],
    breathingGuidance: 'Exhale as you row the weight up; inhale as you lower the dumbbell under control.',
    commonMistakes: [
      'Twisting torso and rotating shoulders to fling the weight up.',
      'Pulling toward the chest instead of driving the elbow toward the hip.'
    ],
    safetyTips: [
      'Keep your neck neutral in line with your spine; do not crane your neck up to look in a mirror.'
    ],
    easierAlternative: 'Doorframe bodyweight incline row or lighter dumbbell weight.',
    harderProgression: 'Perform without a bench support in a standing staggered hinge stance.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-12 reps / arm',
    restIntervalSeconds: 45,
    youtubeId: 'roCP6wCXPqo',
    videoUrl: 'https://www.youtube-nocookie.com/embed/roCP6wCXPqo',
    videoSource: 'Bowflex Dumbbell Form Lab',
    fallbackUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    isVerifiedVideo: true
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Dumbbell Overhead Shoulder Press',
    category: 'upper',
    targetMuscles: ['Anterior Deltoids', 'Lateral Deltoids', 'Triceps', 'Upper Trapezius', 'Core'],
    primaryMuscles: ['Deltoids (Shoulders)', 'Triceps Brachii'],
    secondaryMuscles: ['Upper Trapezius', 'Core Stabilizers'],
    bodyRegions: ['shoulders', 'biceps_triceps', 'core'],
    musclesExplanation: 'Builds foundational overhead pressing strength, shoulder cap volume, and core bracing resilience.',
    equipmentNeeded: 'dumbbells',
    equipmentAlternatives: ['gym_access', 'resistance_bands'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet shoulder-width apart, holding dumbbells at shoulder height with elbows tucked at roughly 45 degrees.',
      'Brace your abs and glutes to avoid hyperextending your lower back.',
      'Press the dumbbells vertically overhead until arms are extended, keeping weights balanced over your shoulders.',
      'Lower under control over 2 seconds back to ear level.'
    ],
    breathingGuidance: 'Exhale forcefully as you press upward; inhale as you lower the weights.',
    commonMistakes: [
      'Arching lower back and leaning backward (indicates weight is too heavy).',
      'Flaring elbows out to 90 degrees in a dangerous impingement position.'
    ],
    safetyTips: [
      'Keep core braced like taking a punch to lock your ribcage down.'
    ],
    easierAlternative: 'Seated Dumbbell Shoulder Press or Pike Push-Ups.',
    harderProgression: 'Standing Alternating Dumbbell Press or tempo 3-second descents.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-12 reps',
    restIntervalSeconds: 60,
    youtubeId: 'B-aVuyhvLHU',
    videoUrl: 'https://www.youtube-nocookie.com/embed/B-aVuyhvLHU',
    videoSource: 'Bowflex Shoulder Mechanics',
    fallbackUrl: 'https://www.youtube.com/watch?v=B-aVuyhvLHU',
    isVerifiedVideo: true
  },
  {
    id: 'forward-lunge',
    name: 'Alternating Forward Lunges',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves', 'Core Balance'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Hip Stabilizers', 'Calves'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves', 'core'],
    musclesExplanation: 'Decelerating your forward momentum requires high eccentric quad activation and athletic balance.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['dumbbells', 'yoga_mat'],
    difficulty: 'intermediate',
    instructions: [
      'Stand tall with feet hip-width apart and hands on hips or at chest.',
      'Take a controlled, large step forward with your right leg.',
      'Lower your hips until both front and back knees are bent at approximately 90 degrees.',
      'Push firmly through the front midfoot and heel to return to the starting position, then alternate legs.'
    ],
    breathingGuidance: 'Inhale as you step forward and lower; exhale as you push back to standing.',
    commonMistakes: [
      'Letting the front knee collapse inward or slamming back knee onto the hard floor.',
      'Leaning the torso excessively forward.'
    ],
    safetyTips: [
      'Ensure the front knee stays aligned with the second toe and does not buckle inward.'
    ],
    easierAlternative: 'Reverse Lunges (easier on knee joint) or Stationary Split Squats.',
    harderProgression: 'Walking Lunges or Dumbbell Loaded Lunges.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-12 reps / leg',
    restIntervalSeconds: 45,
    youtubeId: 'QOVaHwm-Q6U',
    videoUrl: 'https://www.youtube-nocookie.com/embed/QOVaHwm-Q6U',
    videoSource: 'FitnessBlender Lunge Mastery',
    fallbackUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    isVerifiedVideo: true
  },
  {
    id: 'split-squat',
    name: 'Stationary Split Squat',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hip Flexors', 'Core'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Calves'],
    bodyRegions: ['quads_hamstrings', 'glutes'],
    musclesExplanation: 'Keeping feet in place removes deceleration shear stress, allowing pure targeted quad and glute hypertrophy.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['dumbbells', 'yoga_mat'],
    difficulty: 'beginner',
    instructions: [
      'Take a staggered split stance with one foot forward and the back foot elevated on the ball of the foot.',
      'Lower straight down like an elevator until your back knee is hovering an inch from the floor.',
      'Drive straight up through your front heel and midfoot to return to the top of the split position.',
      'Complete all reps on one leg before switching sides.'
    ],
    breathingGuidance: 'Inhale on the descent; exhale as you press up.',
    commonMistakes: [
      'Pushing through the front toes instead of keeping the front heel planted.',
      'Losing balance by walking on a tightrope (keep feet hip-width apart).'
    ],
    safetyTips: [
      'Place a yoga mat or folded towel under your back knee for cushion.'
    ],
    easierAlternative: 'Hold onto a chair or wall with one hand for balance.',
    harderProgression: 'Bulgarian Split Squat with rear foot elevated on a chair or bench.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-12 reps / leg',
    restIntervalSeconds: 45,
    youtubeId: 'SGHnCftrZkA',
    videoUrl: 'https://www.youtube-nocookie.com/embed/SGHnCftrZkA',
    videoSource: 'FitnessBlender Split Squat',
    fallbackUrl: 'https://www.youtube.com/watch?v=SGHnCftrZkA',
    isVerifiedVideo: true
  },
  {
    id: 'supported-single-leg-squat',
    name: 'Supported Single-Leg Squat (Pistol Prep)',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Glutes', 'Ankles', 'Hip Stabilizers'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus & Medius'],
    secondaryMuscles: ['Ankle Dorsiflexors', 'Hamstrings', 'Core'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves'],
    musclesExplanation: 'Unlocks ultimate unilateral lower body power, ankle mobility, and single-leg balance without weights.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['bench'],
    difficulty: 'advanced',
    instructions: [
      'Stand on one leg with the other leg hovering slightly forward.',
      'Hold onto a doorframe, pole, or chair with one or both hands for support.',
      'Hinge at the hip and knee, lowering down as deep as your mobility allows while keeping the chest proud.',
      'Drive through the working foot to press back to a full stand.'
    ],
    breathingGuidance: 'Inhale on the deep descent; exhale firmly as you press out of the hole.',
    commonMistakes: [
      'Allowing the standing heel to lift off the floor.',
      'Caving the working knee inward.'
    ],
    safetyTips: [
      'Only lower to a depth where your heel remains firmly glued to the floor.'
    ],
    easierAlternative: 'Single-leg box squats onto a chair or sofa.',
    harderProgression: 'Full unsupported Pistol Squat.',
    defaultSets: 3,
    defaultRepsOrSeconds: '6-8 reps / leg',
    restIntervalSeconds: 60,
    youtubeId: '8L3Yk7M360Q',
    videoUrl: 'https://www.youtube-nocookie.com/embed/8L3Yk7M360Q',
    videoSource: 'Hybrid Calisthenics Pistol Progression',
    fallbackUrl: 'https://www.youtube.com/watch?v=8L3Yk7M360Q',
    isVerifiedVideo: true
  },
  {
    id: 'hip-hinge-good-mornings',
    name: 'Bodyweight Hip Hinges / Good Mornings',
    category: 'lower',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae', 'Core'],
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Erector Spinae (Lower Back)', 'Lats'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'back'],
    musclesExplanation: 'Teaches proper hip hinge mechanics, protecting the lumbar spine and developing posterior chain flexibility.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Stand tall with feet shoulder-width apart and fingertips gently resting behind your head.',
      'Keep a soft 10-degree micro-bend in your knees that does not change throughout the rep.',
      'Push your hips straight back toward the wall behind you while maintaining a flat, neutral spine.',
      'Lower your torso until you feel a deep stretch in your hamstrings, then drive hips forward to stand.'
    ],
    breathingGuidance: 'Inhale as your hips reach backward; exhale as you drive hips forward and squeeze glutes.',
    commonMistakes: [
      'Rounding the upper or lower spine.',
      'Squatting by bending the knees instead of hinging at the hips.'
    ],
    safetyTips: [
      'Keep weight balanced over the middle and heel of your feet, not just the toes.'
    ],
    easierAlternative: 'Wall Hip Hinge drills touching hips to the wall.',
    harderProgression: 'Single-Leg Bodyweight Deadlifts or Banded Good Mornings.',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-15 reps',
    restIntervalSeconds: 45,
    youtubeId: 'eE7R_o8qHw0',
    videoUrl: 'https://www.youtube-nocookie.com/embed/eE7R_o8qHw0',
    videoSource: 'FitnessBlender Hip Hinge Lab',
    fallbackUrl: 'https://www.youtube.com/watch?v=eE7R_o8qHw0',
    isVerifiedVideo: true
  },
  {
    id: 'dumbbell-romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'lower',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Lower Back', 'Grip'],
    primaryMuscles: ['Hamstrings', 'Gluteus Maximus'],
    secondaryMuscles: ['Erector Spinae', 'Latissimus Dorsi', 'Forearms'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'back'],
    musclesExplanation: 'The premier free-weight exercise for posterior chain hypertrophy and hamstring resilience.',
    equipmentNeeded: 'dumbbells',
    equipmentAlternatives: ['barbell', 'kettlebell', 'gym_access'],
    difficulty: 'intermediate',
    instructions: [
      'Stand tall holding a pair of dumbbells against the front of your thighs with feet hip-width apart.',
      'Unlock your knees slightly and push your hips backward, skimming the dumbbells close along your shins.',
      'Lower until you reach mid-shin and feel maximum tension in the hamstrings with a flat spine.',
      'Drive hips forward and squeeze glutes hard to return to an upright standing posture.'
    ],
    breathingGuidance: 'Inhale as the dumbbells descend; exhale forcefully as hips lock out at the top.',
    commonMistakes: [
      'Letting the dumbbells drift away from the legs, putting shear stress on the lower back.',
      'Rounding the lower back at the bottom of the movement.'
    ],
    safetyTips: [
      'Stop descending as soon as your hips stop moving backward; do not bend from the waist.'
    ],
    easierAlternative: 'Bodyweight Good Mornings or Glute Bridges.',
    harderProgression: 'Single-Leg Dumbbell RDL.',
    defaultSets: 3,
    defaultRepsOrSeconds: '10-12 reps',
    restIntervalSeconds: 60,
    youtubeId: '2SHsk9A_td8',
    videoUrl: 'https://www.youtube-nocookie.com/embed/2SHsk9A_td8',
    videoSource: 'Bowflex RDL Form Guide',
    fallbackUrl: 'https://www.youtube.com/watch?v=2SHsk9A_td8',
    isVerifiedVideo: true
  },
  {
    id: 'banded-squat',
    name: 'Resistance-Band Air Squat',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Glutes', 'Adductors', 'Core'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    bodyRegions: ['quads_hamstrings', 'glutes'],
    musclesExplanation: 'Stepping on a band with handles at shoulders adds ascending resistance where you are strongest at the top.',
    equipmentNeeded: 'resistance_bands',
    equipmentAlternatives: ['gym_access'],
    difficulty: 'beginner',
    instructions: [
      'Stand with both feet on the center of the band, holding the handles at shoulder height in a front-rack position.',
      'Initiate the squat by breaking at hips and knees simultaneously, descending until thighs are parallel to the floor.',
      'Drive through your whole foot to return to standing against increasing band tension.',
      'Squeeze glutes at the top of the repetition.'
    ],
    breathingGuidance: 'Inhale on the descent; exhale as you power up against the band.',
    commonMistakes: [
      'Letting the band pull your chest forward (stay proud and upright).',
      'Knees collapsing inward.'
    ],
    safetyTips: [
      'Ensure feet are planted firmly on the band so it does not slide out.'
    ],
    easierAlternative: 'Bodyweight Air Squats without the resistance band.',
    harderProgression: 'Pause Banded Squats (3-second hold at the bottom).',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-15 reps',
    restIntervalSeconds: 45,
    youtubeId: 'V3b_8Vw1J-4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/V3b_8Vw1J-4',
    videoSource: 'FitnessBlender Band Squat',
    fallbackUrl: 'https://www.youtube.com/watch?v=V3b_8Vw1J-4',
    isVerifiedVideo: true
  },
  {
    id: 'knee-plank',
    name: 'Modified Knee Plank',
    category: 'core',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Serratus Anterior', 'Core'],
    primaryMuscles: ['Transverse Abdominis', 'Rectus Abdominis'],
    secondaryMuscles: ['Shoulders', 'Glutes'],
    bodyRegions: ['core', 'shoulders'],
    musclesExplanation: 'Shortens the lever arm, allowing beginners to master posterior pelvic tilt and deep core bracing safely.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['yoga_mat'],
    difficulty: 'beginner',
    instructions: [
      'Lie face down, resting on your forearms with elbows directly under your shoulders.',
      'Lift your hips off the floor while keeping your knees bent and resting on the ground.',
      'Form a straight line from your head through your spine to your knees.',
      'Pull your belly button inward toward your spine and breathe calmly into your belly.'
    ],
    breathingGuidance: 'Take slow, measured diaphragmatic breaths without releasing core abdominal tension.',
    commonMistakes: [
      'Sagging the lower back toward the floor.',
      'Poking the hips high in the air.'
    ],
    safetyTips: [
      'Use a yoga mat or folded towel beneath your knees for joint cushioning.'
    ],
    easierAlternative: 'Incline Plank against a wall or counter.',
    harderProgression: 'Full Forearm Plank on toes.',
    defaultSets: 3,
    defaultRepsOrSeconds: '20-30 seconds',
    restIntervalSeconds: 30,
    youtubeId: 'WJUm_iZ1Fms',
    videoUrl: 'https://www.youtube-nocookie.com/embed/WJUm_iZ1Fms',
    videoSource: 'FitnessBlender Knee Plank',
    fallbackUrl: 'https://www.youtube.com/watch?v=WJUm_iZ1Fms',
    isVerifiedVideo: true
  },
  {
    id: 'reverse-crunch',
    name: 'Reverse Crunches',
    category: 'core',
    targetMuscles: ['Lower Rectus Abdominis', 'Transverse Abdominis', 'Hip Flexors'],
    primaryMuscles: ['Lower Rectus Abdominis'],
    secondaryMuscles: ['Obliques', 'Hip Flexors'],
    bodyRegions: ['core'],
    musclesExplanation: 'Lifting the pelvis toward the ribcage targets lower abdominal fibers with zero strain on the cervical spine.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['yoga_mat'],
    difficulty: 'beginner',
    instructions: [
      'Lie flat on your back with arms at your sides and knees bent at 90 degrees.',
      'Contract your lower abs to curl your hips off the floor, bringing your knees toward your chest.',
      'Pause for a beat at the top, then slowly lower your pelvis back to the floor under control.',
      'Do not let your feet touch the floor between reps to maintain constant tension.'
    ],
    breathingGuidance: 'Exhale as your pelvis curls up; inhale as you slowly lower your hips.',
    commonMistakes: [
      'Swinging the legs and using momentum instead of abdominal contraction.',
      'Lifting your head and straining the neck.'
    ],
    safetyTips: [
      'Keep your upper back and head resting relaxed on the floor throughout.'
    ],
    easierAlternative: 'Dead Bug with alternating heel taps.',
    harderProgression: 'Straight-Leg Reverse Crunches or Lying Leg Raises.',
    defaultSets: 3,
    defaultRepsOrSeconds: '12-15 reps',
    restIntervalSeconds: 30,
    youtubeId: 'gAy_Z3Z4kO8',
    videoUrl: 'https://www.youtube-nocookie.com/embed/gAy_Z3Z4kO8',
    videoSource: 'FitnessBlender Reverse Crunch',
    fallbackUrl: 'https://www.youtube.com/watch?v=gAy_Z3Z4kO8',
    isVerifiedVideo: true
  },
  {
    id: 'marching-in-place',
    name: 'High Knee Marching in Place',
    category: 'full_body',
    targetMuscles: ['Hip Flexors', 'Quadriceps', 'Core', 'Cardiovascular System'],
    primaryMuscles: ['Hip Flexors', 'Quadriceps'],
    secondaryMuscles: ['Calves', 'Core', 'Heart'],
    bodyRegions: ['quads_hamstrings', 'glutes', 'calves', 'core'],
    musclesExplanation: 'Gentle, zero-impact cardio that lubricates the hips, warms the body temperature, and activates core stabilizers.',
    equipmentNeeded: 'none',
    equipmentAlternatives: [],
    difficulty: 'beginner',
    instructions: [
      'Stand tall with your chest lifted, shoulders relaxed, and arms bent at 90 degrees.',
      'Lift your right knee smoothly up to hip level while pumping your left arm forward.',
      'Lower your right foot with a soft landing and immediately drive your left knee up with the opposite arm.',
      'Maintain an upright posture and establish a steady, rhythmic breathing tempo.'
    ],
    breathingGuidance: 'Breathe rhythmically in through the nose and out through the mouth.',
    commonMistakes: [
      'Leaning backward when lifting the knees.',
      'Slapping feet loudly onto the floor (stay soft on the midfoot).'
    ],
    safetyTips: [
      'Wear supportive sneakers or ensure bare feet have solid grip on the floor.'
    ],
    easierAlternative: 'Lower knee height marches holding onto a wall for stability.',
    harderProgression: 'Explosive High Knees running in place.',
    defaultSets: 3,
    defaultRepsOrSeconds: '45 seconds',
    restIntervalSeconds: 30,
    youtubeId: 'c_n8WdE_u9M',
    videoUrl: 'https://www.youtube-nocookie.com/embed/c_n8WdE_u9M',
    videoSource: 'FitnessBlender Low-Impact Cardio',
    fallbackUrl: 'https://www.youtube.com/watch?v=c_n8WdE_u9M',
    isVerifiedVideo: true
  },
  {
    id: 'low-impact-jumping-jacks',
    name: 'Low-Impact Step Jacks',
    category: 'full_body',
    targetMuscles: ['Calves', 'Deltoids', 'Heart', 'Full Body'],
    primaryMuscles: ['Cardiovascular System', 'Deltoids'],
    secondaryMuscles: ['Calves', 'Core', 'Adductors'],
    bodyRegions: ['full_body'],
    musclesExplanation: 'Provides all the aerobic and shoulder benefits of standard jumping jacks with zero joint pounding impact.',
    equipmentNeeded: 'none',
    equipmentAlternatives: [],
    difficulty: 'beginner',
    instructions: [
      'Start standing with feet together and arms at your sides.',
      'Step your right foot wide to the side while raising both arms overhead.',
      'Step your right foot back to center while lowering arms.',
      'Immediately step your left foot to the side while raising arms overhead, repeating continuously in rhythm.'
    ],
    breathingGuidance: 'Inhale as arms raise; exhale as arms return to sides.',
    commonMistakes: [
      'Rushing the tempo and losing coordination.',
      'Dropping arms halfway without full overhead extension.'
    ],
    safetyTips: [
      'Ideal for anyone with knee discomfort or who lives in an upstairs apartment needing quiet workouts.'
    ],
    easierAlternative: 'Perform arm raises only without foot steps.',
    harderProgression: 'Standard Jumping Jacks or Speed Jacks.',
    defaultSets: 3,
    defaultRepsOrSeconds: '45 seconds',
    restIntervalSeconds: 30,
    youtubeId: 'UpH7rm0cYbM',
    videoUrl: 'https://www.youtube-nocookie.com/embed/UpH7rm0cYbM',
    videoSource: 'FitnessBlender Low Impact Jack',
    fallbackUrl: 'https://www.youtube.com/watch?v=UpH7rm0cYbM',
    isVerifiedVideo: true
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks & Arm Drive',
    category: 'full_body',
    targetMuscles: ['Hamstrings', 'Quadriceps Stretch', 'Cardiovascular System'],
    primaryMuscles: ['Hamstrings', 'Cardiovascular System'],
    secondaryMuscles: ['Calves', 'Quadriceps'],
    bodyRegions: ['quads_hamstrings', 'calves'],
    musclesExplanation: 'Dynamically stretches the front quadriceps while actively firing the hamstrings and boosting metabolic rate.',
    equipmentNeeded: 'none',
    equipmentAlternatives: [],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet hip-width apart and arms in an athletic running runner stance.',
      'Bend your right knee to kick your right heel back toward your right glute.',
      'Return softly to the floor and immediately kick your left heel toward your left glute.',
      'Maintain an active running pump with your arms in coordination.'
    ],
    breathingGuidance: 'Deep rhythmic nasal breathing.',
    commonMistakes: [
      'Leaning excessively forward.',
      'Stomping feet on the floor.'
    ],
    safetyTips: [
      'Land softly on the balls of your feet to protect your knees and ankles.'
    ],
    easierAlternative: 'Step-and-kick butt kicks without running bounce.',
    harderProgression: 'Fast high-cadence athletic butt kick sprints.',
    defaultSets: 3,
    defaultRepsOrSeconds: '35 seconds',
    restIntervalSeconds: 30,
    youtubeId: 'vXb_X45lWw8',
    videoUrl: 'https://www.youtube-nocookie.com/embed/vXb_X45lWw8',
    videoSource: 'FitnessBlender Butt Kicks',
    fallbackUrl: 'https://www.youtube.com/watch?v=vXb_X45lWw8',
    isVerifiedVideo: true
  },
  {
    id: 'burpees-modified',
    name: 'Modified Low-Impact Burpees',
    category: 'full_body',
    targetMuscles: ['Chest', 'Quadriceps', 'Core', 'Cardiovascular Endurance'],
    primaryMuscles: ['Full Body', 'Cardiovascular System'],
    secondaryMuscles: ['Pectorals', 'Core', 'Glutes'],
    bodyRegions: ['full_body'],
    musclesExplanation: 'Provides total-body conditioning without the jarring impact of floor drops or explosive vertical jumps.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['chair'],
    difficulty: 'beginner',
    instructions: [
      'Stand tall, bend your knees, and place hands flat on the floor or on a sturdy chair.',
      'Step one foot back, then the other foot back into a solid high plank position.',
      'Step feet forward one at a time toward your hands.',
      'Stand up tall, reaching arms overhead and extending hips.'
    ],
    breathingGuidance: 'Exhale as you stand up; inhale as hands touch the floor.',
    commonMistakes: [
      'Sagging hips during the plank transition.',
      'Landing heavily on stiff legs.'
    ],
    safetyTips: [
      'Use a sturdy chair or couch if bending all the way to the floor causes back discomfort.'
    ],
    easierAlternative: 'Incline Hands-on-Chair Step Burpees.',
    harderProgression: 'Full Chest-to-Floor Burpee with explosive vertical jump.',
    defaultSets: 3,
    defaultRepsOrSeconds: '8-10 reps',
    restIntervalSeconds: 60,
    youtubeId: 'dZgVxmf6jkA',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dZgVxmf6jkA',
    videoSource: 'FitnessBlender Modified Burpee',
    fallbackUrl: 'https://www.youtube.com/watch?v=dZgVxmf6jkA',
    isVerifiedVideo: true
  },
  {
    id: 'hamstring-stretch',
    name: 'Standing Single-Leg Hamstring Stretch',
    category: 'mobility',
    targetMuscles: ['Hamstrings', 'Calves', 'Lower Back'],
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Gastrocnemius', 'Lower Back'],
    bodyRegions: ['quads_hamstrings', 'calves'],
    musclesExplanation: 'Relieves posterior chain tension, increases hip flexion freedom, and mitigates lower back tightness.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['yoga_mat'],
    difficulty: 'beginner',
    instructions: [
      'Stand and place your right heel forward with toes flexed toward the ceiling.',
      'Hinge backward at your hips, resting hands on your bent left thigh for balance.',
      'Keep your chest proud and back flat as you gently sink hips back until you feel a pleasant hamstring stretch.',
      'Hold calmly for 30 seconds, then switch legs.'
    ],
    breathingGuidance: 'Take long, calm 4-count exhales as you settle deeper into the stretch.',
    commonMistakes: [
      'Rounding the spine to try to touch toes.',
      'Pushing forcefully into sharp pain.'
    ],
    safetyTips: [
      'Never bounce; hold a steady, soothing static stretch.'
    ],
    easierAlternative: 'Seated Hamstring Stretch on the edge of a chair.',
    harderProgression: 'Standing elevated heel stretch on a low step.',
    defaultSets: 2,
    defaultRepsOrSeconds: '30s / leg',
    restIntervalSeconds: 15,
    youtubeId: '12Z0KfZc33U',
    videoUrl: 'https://www.youtube-nocookie.com/embed/12Z0KfZc33U',
    videoSource: 'FitnessBlender Hamstring Stretch',
    fallbackUrl: 'https://www.youtube.com/watch?v=12Z0KfZc33U',
    isVerifiedVideo: true
  },
  {
    id: 'calf-stretch',
    name: 'Wall-Supported Calf & Achilles Stretch',
    category: 'mobility',
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Achilles Tendon'],
    primaryMuscles: ['Gastrocnemius', 'Soleus'],
    secondaryMuscles: ['Ankle Joint Capsule'],
    bodyRegions: ['calves'],
    musclesExplanation: 'Essential for deep squat depth without heel lift and preventing plantar fasciitis or Achilles stiffness.',
    equipmentNeeded: 'none',
    equipmentAlternatives: [],
    difficulty: 'beginner',
    instructions: [
      'Stand facing a wall with hands flat against it at shoulder height.',
      'Step one leg back, pressing the back heel flat into the floor with back leg straight.',
      'Bend the front knee and lean toward the wall until you feel a firm stretch in the back calf.',
      'Hold for 30 seconds per side.'
    ],
    breathingGuidance: 'Deep, slow diaphragmatic breathing throughout.',
    commonMistakes: [
      'Lifting the back heel off the floor.',
      'Turning the back foot outward.'
    ],
    safetyTips: [
      'Ensure both feet point straight ahead in line with your hips.'
    ],
    easierAlternative: 'Shorten the distance between your front and back foot.',
    harderProgression: 'Bend the back knee slightly to target the deeper soleus muscle.',
    defaultSets: 2,
    defaultRepsOrSeconds: '30s / leg',
    restIntervalSeconds: 15,
    youtubeId: '9G0hFz7gU98',
    videoUrl: 'https://www.youtube-nocookie.com/embed/9G0hFz7gU98',
    videoSource: 'FitnessBlender Calf Mobility',
    fallbackUrl: 'https://www.youtube.com/watch?v=9G0hFz7gU98',
    isVerifiedVideo: true
  },
  {
    id: 'shoulder-circles',
    name: 'Controlled Shoulder Rolls & Circles',
    category: 'mobility',
    targetMuscles: ['Scapula', 'Rotator Cuff', 'Upper Trapezius', 'Pectorals'],
    primaryMuscles: ['Trapezius', 'Rhomboids'],
    secondaryMuscles: ['Rotator Cuff', 'Deltoids'],
    bodyRegions: ['shoulders', 'back'],
    musclesExplanation: 'Stimulates synovial fluid in the shoulder joint and releases postural strain from mobile phone or computer use.',
    equipmentNeeded: 'none',
    equipmentAlternatives: [],
    difficulty: 'beginner',
    instructions: [
      'Stand tall with arms relaxed at your sides.',
      'Elevate shoulders toward ears, roll them backward pinching blades together, and glide them down smoothly.',
      'Complete 15 backward rolls, then reverse direction for 15 forward rolls.'
    ],
    breathingGuidance: 'Inhale as shoulders shrug up; exhale as shoulders slide back and down.',
    commonMistakes: [
      'Jutting the chin forward during rotation.',
      'Moving quickly without exploring the full circular path.'
    ],
    safetyTips: [
      'Keep movement gentle; never force joint clicking.'
    ],
    easierAlternative: 'Smaller diameter circles seated in a chair.',
    harderProgression: 'Wall Angels with elbows and wrists against the wall.',
    defaultSets: 2,
    defaultRepsOrSeconds: '30 seconds',
    restIntervalSeconds: 15,
    youtubeId: 'y8y3g3m5Z4A',
    videoUrl: 'https://www.youtube-nocookie.com/embed/y8y3g3m5Z4A',
    videoSource: 'FitnessBlender Shoulder Health',
    fallbackUrl: 'https://www.youtube.com/watch?v=y8y3g3m5Z4A',
    isVerifiedVideo: true
  },
  {
    id: 'ankle-mobility-drills',
    name: 'Ankle Dorsiflexion Mobility Rocks',
    category: 'mobility',
    targetMuscles: ['Talocrural Joint', 'Soleus', 'Anterior Tibialis', 'Achilles'],
    primaryMuscles: ['Ankle Joint Capsule', 'Soleus'],
    secondaryMuscles: ['Calves', 'Foot Arch'],
    bodyRegions: ['calves'],
    musclesExplanation: 'Unlocks deeper, safer squats by increasing the forward knee translation over toes without heel lift.',
    equipmentNeeded: 'none',
    equipmentAlternatives: ['yoga_mat'],
    difficulty: 'beginner',
    instructions: [
      'Start in a half-kneeling split stance with front foot flat on the floor.',
      'Gently drive your front knee forward over your middle toes without letting the front heel peel up.',
      'Hold the end-range stretch for 2 seconds, then pulse back to start.',
      'Perform 10 smooth pulses per ankle.'
    ],
    breathingGuidance: 'Exhale on each forward stretch; inhale on the return.',
    commonMistakes: [
      'Letting the front heel lift off the ground.',
      'Driving the knee inward (track it directly over the 2nd and 3rd toes).'
    ],
    safetyTips: [
      'Cushion your back knee with a mat or towel.'
    ],
    easierAlternative: 'Standing ankle rocks against a wall.',
    harderProgression: 'Place a light dumbbell across the front knee for gentle loaded stretching.',
    defaultSets: 2,
    defaultRepsOrSeconds: '45s / ankle',
    restIntervalSeconds: 15,
    youtubeId: '_J4d14E5HqU',
    videoUrl: 'https://www.youtube-nocookie.com/embed/_J4d14E5HqU',
    videoSource: 'FitnessBlender Ankle Mobility',
    fallbackUrl: 'https://www.youtube.com/watch?v=_J4d14E5HqU',
    isVerifiedVideo: true
  }
];
