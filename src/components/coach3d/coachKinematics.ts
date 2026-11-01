// Biomechanical kinematics calculations for Coach Milo 3D
// Computes joint rotations, translations, and camera poses per exercise

export interface JointPose {
  // Root translation & rotation
  rootPosition: [number, number, number];
  rootRotation: [number, number, number]; // pitch (x), yaw (y), roll (z) in radians

  // Spine & Torso
  spineRotation: [number, number, number];
  chestRotation: [number, number, number];
  headRotation: [number, number, number];

  // Left Arm
  leftShoulderRotation: [number, number, number];
  leftElbowRotation: number; // flexion
  leftWristRotation: [number, number, number];

  // Right Arm
  rightShoulderRotation: [number, number, number];
  rightElbowRotation: number;
  rightWristRotation: [number, number, number];

  // Left Leg
  leftHipRotation: [number, number, number];
  leftKneeRotation: number; // flexion
  leftAnkleRotation: number; // dorsiflexion / plantarflexion

  // Right Leg
  rightHipRotation: [number, number, number];
  rightKneeRotation: number;
  rightAnkleRotation: number;

  // Environment props visibility
  showWall: boolean;
  showBench: boolean;
  showMat: boolean;
  showPullUpBar: boolean;

  // Active muscle highlight regions
  activeMuscles: ('chest' | 'triceps' | 'shoulders' | 'core' | 'quads' | 'glutes' | 'calves' | 'back')[];

  // Movement cue direction: 'down_up' | 'push_away' | 'hinge' | 'jump' | 'hold'
  cueType: 'down_up' | 'push_away' | 'hinge' | 'jump' | 'hold';
  cueIntensity: number; // 0 to 1
  formTip: string;
}

export interface ExerciseGuide {
  startingPosition: string;
  stepByStep: string[];
  breathing: string;
  commonMistakes: string[];
  recommendedSetsReps: string;
  recommendedRest: string;
  coachDialogue: string;
}

// Generate comprehensive coaching guide for any exercise
export function getExerciseTeachingGuide(exerciseId: string, exerciseName: string): ExerciseGuide {
  const id = exerciseId.toLowerCase();

  if (id.includes('wall-push-up')) {
    return {
      startingPosition: 'Stand facing a sturdy wall about an arm’s length away. Place both palms flat on the wall at shoulder height and shoulder-width apart. Keep feet together, core braced, and body in a rigid straight line from head to heels.',
      stepByStep: [
        'Brace your core and glutes to keep your spine straight—do not let hips sag forward or stick out.',
        'Slowly inhale as you bend your elbows at roughly a 45-degree arrow angle, bringing your chest toward the wall.',
        'Stop when your nose or forehead gently hovers 1–2 inches from the wall.',
        'Exhale powerfully as you push through your palms and extend your arms back to the starting stance.'
      ],
      breathing: 'Inhale smoothly as you lower toward the wall; exhale forcefully through your mouth as you push away.',
      commonMistakes: [
        'Arching or sagging the lower back—keep core tight.',
        'Flaring elbows out sideways like a "T" (keep them tucked at 45°).',
        'Shrugging shoulders up toward your ears.'
      ],
      recommendedSetsReps: '3 sets of 10–15 controlled reps',
      recommendedRest: '45 seconds between sets',
      coachDialogue: `Hi! I'm Coach Milo. Today we're doing wall push-ups. Place your palms on the wall at shoulder height. Keep your body straight. Slowly bend your elbows as you move toward the wall, then push back. Breathe in as you lower and breathe out as you push away. Let's begin!`
    };
  }

  if (id.includes('incline-push-up')) {
    return {
      startingPosition: 'Place palms shoulder-width apart on a sturdy bench, chair, or sofa. Walk feet back into an angled straight plank.',
      stepByStep: [
        'Engage abs and glutes so your body forms an angled line from head to heels.',
        'Lower your chest toward the bench edge by bending elbows backward at 45 degrees.',
        'Pause momentarily as your chest reaches the bench surface.',
        'Push firmly through your hands back up to full arm extension.'
      ],
      breathing: 'Inhale as your chest lowers toward the bench; exhale as you press back up.',
      commonMistakes: [
        'Letting hips dip downward before chest moves.',
        'Looking straight down at your feet—keep neck neutral.'
      ],
      recommendedSetsReps: '3 sets of 8–12 reps',
      recommendedRest: '60 seconds between sets',
      coachDialogue: `Hey athlete! Coach Milo here for incline push-ups. Hands on the bench shoulder-width apart, body in a rigid plank. Lower your chest with control, elbows at 45 degrees, then press back up. Stay strong!`
    };
  }

  if (id.includes('knee-push-up')) {
    return {
      startingPosition: 'Begin on all fours on a comfortable mat. Place hands slightly wider than shoulder-width, and walk knees back until your body forms a straight line from head through hips to knees.',
      stepByStep: [
        'Tuck your pelvis and brace your core so your hips don’t stick up in an L-shape.',
        'Inhale and lower your chest until it hovers 2 inches above the mat.',
        'Keep elbows tracking back at 45 degrees.',
        'Exhale and push evenly through your palms back to starting lockout.'
      ],
      breathing: 'Breathe in on the way down; breathe out forcefully as you press upward.',
      commonMistakes: [
        'Bending only at the hips while chest stays high.',
        'Flaring elbows 90 degrees outward.'
      ],
      recommendedSetsReps: '3 sets of 8–12 reps',
      recommendedRest: '45–60 seconds between sets',
      coachDialogue: `Coach Milo here! For knee push-ups, keep a straight line from your head right through to your knees. Lower your chest all the way down, elbows at 45 degrees, and push up strong!`
    };
  }

  if (id.includes('standard-push-up') || id.includes('push-up')) {
    return {
      startingPosition: 'Start in a full high plank on a mat. Hands placed directly under or slightly wider than shoulders, fingers splayed. Feet hip-width apart.',
      stepByStep: [
        'Squeeze your glutes, brace your core, and grip the floor with your palms.',
        'Inhale as you lower your entire body in one solid piece until your chest hovers 2–3 inches off the ground.',
        'Keep elbows tucked at a 45-degree arrow shape relative to your torso.',
        'Exhale and push the floor away powerfully until arms are fully extended.'
      ],
      breathing: 'Inhale smoothly during the descent; exhale with power on the push.',
      commonMistakes: [
        'Hips sagging down or sticking up in a pike.',
        'Doing half reps—aim for full chest depth.',
        'Craning your neck up or down.'
      ],
      recommendedSetsReps: '3 sets of 8–15 reps',
      recommendedRest: '60 seconds between sets',
      coachDialogue: `Let's master the standard push-up! Keep your core braced tight like a board. Lower your chest until it almost touches the floor, elbows tucked at 45 degrees, and press away powerfully!`
    };
  }

  if (id.includes('squat')) {
    return {
      startingPosition: 'Stand tall with feet shoulder-width apart, toes turned outward 10–15 degrees. Chest proud, shoulders back and down.',
      stepByStep: [
        'Initiate the movement by sending your hips backward, as if sitting into an imaginary chair behind you.',
        'Bend knees and sink down until thighs are parallel to the floor, keeping knees tracking in line with toes.',
        'Keep your chest upright at roughly 45 degrees and arms reaching forward for balance.',
        'Drive through mid-foot and heels to return to standing, fully extending hips and squeezing glutes at the top.'
      ],
      breathing: 'Inhale deeply as you descend into the squat; exhale as you drive back up to standing.',
      commonMistakes: [
        'Knees caving inward (valgus collapse)—press knees out over toes.',
        'Heels lifting off the floor—keep weight balanced over midfoot.',
        'Rounding the lower back—keep spine neutral and chest proud.'
      ],
      recommendedSetsReps: '3 sets of 12–20 reps',
      recommendedRest: '60 seconds between sets',
      coachDialogue: `Coach Milo with you for squats! Feet shoulder-width, toes slightly out. Send your hips back, sink down until thighs are parallel to the floor, keep knees in line with toes, and drive up strong through your heels!`
    };
  }

  if (id.includes('lunge')) {
    return {
      startingPosition: 'Stand upright with feet hip-width apart, hands on your hips or held at your chest.',
      stepByStep: [
        'Take a controlled step backward (or forward), landing on the ball of the rear foot.',
        'Lower your hips straight down until both front and back knees form clean 90-degree angles.',
        'Keep front knee stacked directly over the front ankle and rear knee hovering 2 inches above the mat.',
        'Push firmly through the front heel to return smoothly to the standing start.'
      ],
      breathing: 'Inhale as you lower into the lunge; exhale as you press back to standing.',
      commonMistakes: [
        'Letting the front knee drift far past the toes or collapse inward.',
        'Leaning torso excessively forward or slamming the back knee onto the floor.'
      ],
      recommendedSetsReps: '3 sets of 10–12 reps per leg',
      recommendedRest: '45–60 seconds between sets',
      coachDialogue: `Lunges time with Coach Milo! Take a solid step, lower both knees to 90 degrees with your front knee right over your ankle. Keep your chest tall and push back with control!`
    };
  }

  if (id.includes('plank')) {
    return {
      startingPosition: 'Lie face down on a mat. Place forearms flat on the floor with elbows directly under shoulders, legs extended straight back, toes tucked.',
      stepByStep: [
        'Press forearms into the mat and lift your body into a straight, rigid horizontal line.',
        'Squeeze your glutes tightly, brace your abdominal wall as if preparing for a punch.',
        'Keep your neck neutral by gazing at your hands on the mat.',
        'Hold this rock-solid position while breathing steadily through your diaphragm.'
      ],
      breathing: 'Maintain calm, steady belly breathing—never hold your breath during a plank.',
      commonMistakes: [
        'Letting hips sag toward the mat, stressing the lumbar spine.',
        'Hiking hips up into an inverted V pike.',
        'Holding your breath.'
      ],
      recommendedSetsReps: '3 sets of 20–45 second holds',
      recommendedRest: '45 seconds between sets',
      coachDialogue: `Forearm plank! Keep your body in a dead-straight line from head to heels. Squeeze your glutes, lock in your core, and breathe steadily. Don't let those hips drop!`
    };
  }

  if (id.includes('glute-bridge')) {
    return {
      startingPosition: 'Lie on your back on a mat with knees bent at 90 degrees and feet flat on the floor, hip-width apart. Arms resting by your sides.',
      stepByStep: [
        'Engage your core to flatten your lower back slightly against the mat.',
        'Press through your heels and drive your hips upward toward the ceiling.',
        'At the peak, squeeze glutes hard so knees, hips, and shoulders form a straight diagonal line.',
        'Pause for 1 second, then lower hips with control back to the mat.'
      ],
      breathing: 'Exhale as you drive hips upward and squeeze; inhale as you lower down.',
      commonMistakes: [
        'Over-arching the lower back instead of squeezing glutes.',
        'Pushing from toes rather than driving through heels.'
      ],
      recommendedSetsReps: '3 sets of 12–15 reps with a 1s peak hold',
      recommendedRest: '45 seconds between sets',
      coachDialogue: `Glute bridges! Drive hard through your heels, lift your hips until they align with your knees and shoulders, and give your glutes a firm squeeze at the top!`
    };
  }

  if (id.includes('jumping-jack')) {
    return {
      startingPosition: 'Stand tall with feet together, arms resting relaxed by your sides.',
      stepByStep: [
        'Slightly bend knees and hop feet outward wider than shoulder-width.',
        'Simultaneously sweep arms outward and overhead in a smooth circular arc until hands meet.',
        'Immediately spring back off the balls of your feet, bringing legs together and arms to sides.',
        'Maintain a light, springy rhythm without stomping hard on the floor.'
      ],
      breathing: 'Breathe rhythmically in and out through your nose and mouth in sync with your jumps.',
      commonMistakes: [
        'Landing flat-footed with stiff, locked knees.',
        'Incomplete arm sweeps that barely reach shoulder height.'
      ],
      recommendedSetsReps: '3 sets of 30–45 seconds',
      recommendedRest: '30 seconds between sets',
      coachDialogue: `Jumping jacks! Stay light and springy on the balls of your feet. Sweep your arms all the way overhead, keep a steady rhythm, and breathe easy!`
    };
  }

  // Default / Universal calisthenics guide
  return {
    startingPosition: `Stand tall in athletic posture with feet shoulder-width apart, chest proud, and core engaged.`,
    stepByStep: [
      `Set up your foundation with stable foot placement and a braced core.`,
      `Move with controlled tempo: 2 seconds lowering, 1 second pause at peak, 2 seconds returning.`,
      `Focus on squeezing the target muscles through their complete natural range of motion.`,
      `Keep breathing smooth and uninterrupted throughout each rep.`
    ],
    breathing: `Inhale during the preparation phase; exhale during the active exertion phase.`,
    commonMistakes: [
      `Using momentum instead of controlled muscle contraction.`,
      `Rushing the tempo or losing core tension.`
    ],
    recommendedSetsReps: `3 sets of 10–12 reps`,
    recommendedRest: '45–60 seconds between sets',
    coachDialogue: `Hi, I'm Coach Milo! Let's perform ${exerciseName} with proper form. Focus on controlled tempo, keep your core braced, and let's execute every rep with great technique!`
  };
}

// Compute 3D joint rotations and translations based on exercise ID and normalized phase progress p (0 to 1)
export function computeCoachJointPose(exerciseId: string, progress: number, isIntro = false): JointPose {
  const id = exerciseId.toLowerCase();
  // Sine wave smooth easing back and forth: 0 at start, 1 at peak depth, 0 at end
  const wave = isIntro ? 0 : (1 - Math.cos(progress * 2 * Math.PI)) / 2;

  // 1. Intro Greeting Pose: Coach Milo standing warmly, smiling, waving right hand
  if (isIntro) {
    const waveHand = Math.sin(progress * 8 * Math.PI) * 0.35;
    return {
      rootPosition: [0, 0, 0],
      rootRotation: [0, 0, 0],
      spineRotation: [0, 0.05, 0],
      chestRotation: [0, 0.05, 0],
      headRotation: [0.05, -0.1, 0.05],

      // Left arm relaxed at side
      leftShoulderRotation: [0.1, 0, -0.15],
      leftElbowRotation: 0.2,
      leftWristRotation: [0, 0, 0],

      // Right arm raised in friendly wave
      rightShoulderRotation: [-0.6, 0.2, 1.4],
      rightElbowRotation: 1.5 + waveHand,
      rightWristRotation: [0, waveHand * 0.8, 0],

      // Legs standing athletic hip-width
      leftHipRotation: [0, 0, -0.08],
      leftKneeRotation: 0.05,
      leftAnkleRotation: 0,

      rightHipRotation: [0, 0, 0.08],
      rightKneeRotation: 0.05,
      rightAnkleRotation: 0,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: [],
      cueType: 'hold',
      cueIntensity: 0,
      formTip: "Coach Milo: Welcome to your workout! Ready to begin?"
    };
  }

  // 2. WALL PUSH-UPS (Exact user specification)
  // 1. Coach stands facing a wall
  // 2. Both palms placed against wall at shoulder height
  // 3. Feet positioned slightly away from wall, body kept straight
  // 4. Slowly bend elbows and lean toward wall
  // 5. Chest approaches wall without excessive hip bend
  // 6. Push away by extending arms
  if (id.includes('wall-push-up')) {
    // Wall is located at z = 0.95
    // Distance from wall changes from 0.42 (arms extended) to 0.12 (chest near wall)
    const leanZ = 0.52 + wave * 0.28; // moves forward toward wall
    const elbowFlex = 0.15 + wave * 1.35; // 0.15 rad (near straight) to 1.5 rad (90° flexion)
    const shoulderAngleZ = 0.65 + wave * 0.25; // 45° tucked angle
    const shoulderPitchX = -1.35 + wave * 0.2; // arms forward reaching wall

    return {
      rootPosition: [0, 0.02, leanZ],
      rootRotation: [-0.18, 0, 0], // slight rigid forward plank angle
      spineRotation: [0.02, 0, 0],
      chestRotation: [0.02, 0, 0],
      headRotation: [-0.05, 0, 0], // looking forward at wall

      // Left Arm: palm on wall, elbow tucks 45°
      leftShoulderRotation: [shoulderPitchX, 0.2, -shoulderAngleZ],
      leftElbowRotation: elbowFlex,
      leftWristRotation: [0.8 - wave * 0.3, 0, -0.2], // palms flat against wall

      // Right Arm: symmetrical
      rightShoulderRotation: [shoulderPitchX, -0.2, shoulderAngleZ],
      rightElbowRotation: elbowFlex,
      rightWristRotation: [0.8 - wave * 0.3, 0, 0.2],

      // Feet planted slightly back, body straight
      leftHipRotation: [0.18, 0, -0.06],
      leftKneeRotation: 0.04,
      leftAnkleRotation: -0.15,

      rightHipRotation: [0.18, 0, 0.06],
      rightKneeRotation: 0.04,
      rightAnkleRotation: -0.15,

      showWall: true,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['chest', 'triceps', 'shoulders', 'core'],
      cueType: 'push_away',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Peak Chest Squeeze — Nose Near Wall" : "Keep Body Straight — Inhale as you lower"
    };
  }

  // 3. INCLINE PUSH-UPS (Hands on elevated bench, body angled 35°)
  if (id.includes('incline-push-up')) {
    const elbowFlex = 0.2 + wave * 1.3;
    const bodyDropY = 0.38 - wave * 0.16;
    const bodyForwardZ = 0.15 + wave * 0.22;

    return {
      rootPosition: [0, bodyDropY, bodyForwardZ],
      rootRotation: [-0.55, 0, 0], // angled plank
      spineRotation: [0, 0, 0],
      chestRotation: [0, 0, 0],
      headRotation: [0.2, 0, 0],

      leftShoulderRotation: [-1.2, 0.25, -0.65 - wave * 0.2],
      leftElbowRotation: elbowFlex,
      leftWristRotation: [0.65, 0, 0],

      rightShoulderRotation: [-1.2, -0.25, 0.65 + wave * 0.2],
      rightElbowRotation: elbowFlex,
      rightWristRotation: [0.65, 0, 0],

      leftHipRotation: [0.55, 0, -0.06],
      leftKneeRotation: 0.05,
      leftAnkleRotation: -0.25,

      rightHipRotation: [0.55, 0, 0.06],
      rightKneeRotation: 0.05,
      rightAnkleRotation: -0.25,

      showWall: false,
      showBench: true,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['chest', 'triceps', 'shoulders', 'core'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Chest to Bench — Elbows at 45°" : "Controlled Lowering — Core Rigid"
    };
  }

  // 4. KNEE PUSH-UPS (Pivoting from knees on mat)
  if (id.includes('knee-push-up')) {
    const elbowFlex = 0.2 + wave * 1.35;
    const chestDropY = 0.28 - wave * 0.15;

    return {
      rootPosition: [0, chestDropY, 0.1],
      rootRotation: [-0.45, 0, 0], // straight line from knees to shoulders
      spineRotation: [0, 0, 0],
      chestRotation: [0, 0, 0],
      headRotation: [0.3, 0, 0],

      leftShoulderRotation: [-1.3, 0.2, -0.65 - wave * 0.2],
      leftElbowRotation: elbowFlex,
      leftWristRotation: [0.9, 0, 0],

      rightShoulderRotation: [-1.3, -0.2, 0.65 + wave * 0.2],
      rightElbowRotation: elbowFlex,
      rightWristRotation: [0.9, 0, 0],

      // Knees bent 90° resting on mat
      leftHipRotation: [0.45, 0, -0.08],
      leftKneeRotation: 1.55,
      leftAnkleRotation: 0.2,

      rightHipRotation: [0.45, 0, 0.08],
      rightKneeRotation: 1.55,
      rightAnkleRotation: 0.2,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['chest', 'triceps', 'core'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Chest Hovers 2\" Above Mat" : "Straight Line From Knees to Head"
    };
  }

  // 5. STANDARD FLOOR PUSH-UPS (Full horizontal plank)
  if (id.includes('diamond-push-up')) {
    // Diamond push-up: hands touch under center chest, elbows tucked tight to ribs
    const elbowFlex = 0.2 + wave * 1.45;
    const chestDropY = 0.24 - wave * 0.14;

    return {
      rootPosition: [0, chestDropY, 0],
      rootRotation: [-1.52, 0, 0], // horizontal plank
      spineRotation: [0, 0, 0],
      chestRotation: [0, 0, 0],
      headRotation: [0.15, 0, 0],

      // Hands close together under sternum, elbows tuck backwards along ribs
      leftShoulderRotation: [-1.45, 0.5, -0.3],
      leftElbowRotation: elbowFlex,
      leftWristRotation: [1.2, 0.4, 0],

      rightShoulderRotation: [-1.45, -0.5, 0.3],
      rightElbowRotation: elbowFlex,
      rightWristRotation: [1.2, -0.4, 0],

      leftHipRotation: [1.52, 0, -0.05],
      leftKneeRotation: 0.05,
      leftAnkleRotation: -0.4,

      rightHipRotation: [1.52, 0, 0.05],
      rightKneeRotation: 0.05,
      rightAnkleRotation: -0.4,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['triceps', 'chest', 'core'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Diamond Hand Touch — Triceps Burn" : "Elbows Tucked Close to Ribs"
    };
  }

  if (id.includes('push-up') || id.includes('decline-push-up')) {
    // Standard Floor Push-Up
    const elbowFlex = 0.2 + wave * 1.38;
    const chestDropY = 0.25 - wave * 0.15;

    return {
      rootPosition: [0, chestDropY, 0],
      rootRotation: [-1.52, 0, 0], // full horizontal plank
      spineRotation: [0, 0, 0],
      chestRotation: [0, 0, 0],
      headRotation: [0.15, 0, 0],

      leftShoulderRotation: [-1.4, 0.25, -0.7 - wave * 0.2],
      leftElbowRotation: elbowFlex,
      leftWristRotation: [1.1, 0, 0],

      rightShoulderRotation: [-1.4, -0.25, 0.7 + wave * 0.2],
      rightElbowRotation: elbowFlex,
      rightWristRotation: [1.1, 0, 0],

      leftHipRotation: [1.52, 0, -0.06],
      leftKneeRotation: 0.05,
      leftAnkleRotation: -0.4,

      rightHipRotation: [1.52, 0, 0.06],
      rightKneeRotation: 0.05,
      rightAnkleRotation: -0.4,

      showWall: false,
      showBench: id.includes('decline'),
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['chest', 'triceps', 'shoulders', 'core'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Full Depth — Chest 2\" Off Mat" : "Solid Plank — Inhale Down, Exhale Up"
    };
  }

  // 6. PIKE PUSH-UPS (Inverted V posture, shoulder press)
  if (id.includes('pike-push-up')) {
    const elbowFlex = 0.2 + wave * 1.3;
    const headDropY = 0.35 - wave * 0.14;
    const forwardZ = 0.1 + wave * 0.15;

    return {
      rootPosition: [0, headDropY, forwardZ],
      rootRotation: [-0.75, 0, 0], // hips hiked high in pike
      spineRotation: [0, 0, 0],
      chestRotation: [0, 0, 0],
      headRotation: [-0.3, 0, 0], // head looking back toward toes

      leftShoulderRotation: [-2.1, 0.2, -0.6],
      leftElbowRotation: elbowFlex,
      leftWristRotation: [1.0, 0, 0],

      rightShoulderRotation: [-2.1, -0.2, 0.6],
      rightElbowRotation: elbowFlex,
      rightWristRotation: [1.0, 0, 0],

      leftHipRotation: [1.3, 0, -0.1],
      leftKneeRotation: 0.15,
      leftAnkleRotation: -0.4,

      rightHipRotation: [1.3, 0, 0.1],
      rightKneeRotation: 0.15,
      rightAnkleRotation: -0.4,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['shoulders', 'triceps', 'chest'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Crown of Head Lowers in Tripod Pattern" : "Hips High — Press Through Shoulders"
    };
  }

  // 7. SQUATS (Hips back, knees track over toes to parallel, arms reach forward)
  if (id.includes('squat')) {
    const hipHingeX = 0.1 + wave * 0.45; // torso leans 35° forward for balance
    const hipDropY = -wave * 0.42; // drop down to parallel
    const kneeBend = 0.05 + wave * 1.45; // 0 to 85° knee bend
    const armRaiseX = -0.15 - wave * 1.25; // arms raise to horizontal counter-balance

    return {
      rootPosition: [0, hipDropY, -wave * 0.18], // hips travel backward
      rootRotation: [0, 0, 0],
      spineRotation: [hipHingeX, 0, 0],
      chestRotation: [hipHingeX * 0.5, 0, 0],
      headRotation: [-hipHingeX * 0.8, 0, 0], // gaze forward

      // Arms extend forward horizontally for balance
      leftShoulderRotation: [armRaiseX, 0, -0.15],
      leftElbowRotation: 0.1,
      leftWristRotation: [0, 0, 0],

      rightShoulderRotation: [armRaiseX, 0, 0.15],
      rightElbowRotation: 0.1,
      rightWristRotation: [0, 0, 0],

      // Hips & Knees bend to parallel
      leftHipRotation: [0.1 + wave * 1.35, 0, -0.12],
      leftKneeRotation: kneeBend,
      leftAnkleRotation: wave * 0.35,

      rightHipRotation: [0.1 + wave * 1.35, 0, 0.12],
      rightKneeRotation: kneeBend,
      rightAnkleRotation: wave * 0.35,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['quads', 'glutes', 'core'],
      cueType: 'hinge',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Thighs Parallel to Floor — Drive Through Heels" : "Hips Back, Knees Over Toes, Chest Proud"
    };
  }

  // 8. LUNGES (Reverse/Forward Lunge: 90° angles front and back)
  if (id.includes('lunge')) {
    const lungeDropY = -wave * 0.36;
    const frontKneeBend = 0.05 + wave * 1.4;
    const rearKneeBend = 0.05 + wave * 1.45;

    return {
      rootPosition: [0, lungeDropY, 0],
      rootRotation: [0, 0, 0],
      spineRotation: [0.05, 0, 0],
      chestRotation: [0.05, 0, 0],
      headRotation: [0, 0, 0],

      // Hands on hips
      leftShoulderRotation: [0.35, 0.2, -0.45],
      leftElbowRotation: 1.2,
      leftWristRotation: [0, 0, -0.5],

      rightShoulderRotation: [0.35, -0.2, 0.45],
      rightElbowRotation: 1.2,
      rightWristRotation: [0, 0, 0.5],

      // Front Leg (Left)
      leftHipRotation: [0.05 + wave * 1.3, 0, -0.05],
      leftKneeRotation: frontKneeBend,
      leftAnkleRotation: wave * 0.25,

      // Rear Leg (Right) stepping back
      rightHipRotation: [-0.05 - wave * 0.3, 0, 0.05],
      rightKneeRotation: rearKneeBend,
      rightAnkleRotation: -wave * 0.5,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['quads', 'glutes', 'calves'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "90° Front Knee Over Ankle — Back Knee Hovers" : "Step Controlled — Torso Upright"
    };
  }

  // 9. FOREARM PLANK (Rigid core hold with gentle breathing diaphragm pulsation)
  if (id.includes('plank')) {
    const breath = Math.sin(progress * 4 * Math.PI) * 0.015;

    return {
      rootPosition: [0, 0.22 + breath, 0],
      rootRotation: [-1.52, 0, 0], // horizontal plank
      spineRotation: [0, 0, 0],
      chestRotation: [0, 0, 0],
      headRotation: [0.15, 0, 0], // gaze at forearms

      // Forearms on mat
      leftShoulderRotation: [-1.45, 0.2, -0.4],
      leftElbowRotation: 1.5,
      leftWristRotation: [0, 0, 0],

      rightShoulderRotation: [-1.45, -0.2, 0.4],
      rightElbowRotation: 1.5,
      rightWristRotation: [0, 0, 0],

      leftHipRotation: [1.52, 0, -0.06],
      leftKneeRotation: 0.04,
      leftAnkleRotation: -0.4,

      rightHipRotation: [1.52, 0, 0.06],
      rightKneeRotation: 0.04,
      rightAnkleRotation: -0.4,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['core', 'shoulders', 'glutes'],
      cueType: 'hold',
      cueIntensity: 0.8,
      formTip: "Braced Abs & Glutes — Breathe Steadily, Avoid Hip Sag"
    };
  }

  // 10. GLUTE BRIDGE (Supine on mat, hips driving to straight diagonal)
  if (id.includes('glute-bridge')) {
    const hipDrive = wave * 0.35;

    return {
      rootPosition: [0, 0.08 + hipDrive, 0],
      rootRotation: [1.52 - wave * 0.45, 0, 0], // supine, pelvis tilts up
      spineRotation: [-wave * 0.2, 0, 0],
      chestRotation: [-wave * 0.2, 0, 0],
      headRotation: [-0.1, 0, 0],

      // Arms flat on mat by sides
      leftShoulderRotation: [0.2, 0, -0.15],
      leftElbowRotation: 0.05,
      leftWristRotation: [0, 0, 0],

      rightShoulderRotation: [0.2, 0, 0.15],
      rightElbowRotation: 0.05,
      rightWristRotation: [0, 0, 0],

      // Knees bent 90°, driving through heels
      leftHipRotation: [-1.2 + wave * 0.7, 0, -0.1],
      leftKneeRotation: 1.45 - wave * 0.3,
      leftAnkleRotation: -0.2,

      rightHipRotation: [-1.2 + wave * 0.7, 0, 0.1],
      rightKneeRotation: 1.45 - wave * 0.3,
      rightAnkleRotation: -0.2,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['glutes', 'core'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Peak Glute Squeeze — Knees, Hips, Shoulders in Line" : "Drive Through Heels — Controlled Descent"
    };
  }

  // 11. JUMPING JACKS (Rhythmic wide hop & overhead arm sweep)
  if (id.includes('jumping-jack')) {
    const legSpread = wave * 0.38;
    const armSweepZ = wave * 2.2; // arms sweep from side up to overhead
    const jumpBounceY = Math.sin(progress * 2 * Math.PI) * 0.08;

    return {
      rootPosition: [0, Math.max(0, jumpBounceY), 0],
      rootRotation: [0, 0, 0],
      spineRotation: [0, 0, 0],
      chestRotation: [0, 0, 0],
      headRotation: [0, 0, 0],

      // Left arm sweeps overhead
      leftShoulderRotation: [0, 0, -0.15 - armSweepZ],
      leftElbowRotation: 0.1,
      leftWristRotation: [0, 0, 0],

      // Right arm sweeps overhead
      rightShoulderRotation: [0, 0, 0.15 + armSweepZ],
      rightElbowRotation: 0.1,
      rightWristRotation: [0, 0, 0],

      // Legs jump apart
      leftHipRotation: [0, 0, -0.08 - legSpread],
      leftKneeRotation: 0.12,
      leftAnkleRotation: -0.1,

      rightHipRotation: [0, 0, 0.08 + legSpread],
      rightKneeRotation: 0.12,
      rightAnkleRotation: -0.1,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['calves', 'shoulders', 'core'],
      cueType: 'jump',
      cueIntensity: wave,
      formTip: "Light on Balls of Feet • Full Arm Sweep Overhead"
    };
  }

  // 12. CHAIR / BENCH DIPS
  if (id.includes('chair-dip') || id.includes('bench-dip')) {
    const dipDropY = 0.22 - wave * 0.25;
    const elbowFlex = 0.15 + wave * 1.35;

    return {
      rootPosition: [0, dipDropY, 0.35],
      rootRotation: [0, 0, 0], // seated upright
      spineRotation: [0.05, 0, 0],
      chestRotation: [0.05, 0, 0],
      headRotation: [0, 0, 0],

      // Arms gripping bench behind torso
      leftShoulderRotation: [0.65, 0, -0.2],
      leftElbowRotation: elbowFlex,
      leftWristRotation: [-0.4, 0, 0],

      rightShoulderRotation: [0.65, 0, 0.2],
      rightElbowRotation: elbowFlex,
      rightWristRotation: [-0.4, 0, 0],

      // Legs extended forward
      leftHipRotation: [1.2, 0, -0.06],
      leftKneeRotation: 0.2,
      leftAnkleRotation: 0,

      rightHipRotation: [1.2, 0, 0.06],
      rightKneeRotation: 0.2,
      rightAnkleRotation: 0,

      showWall: false,
      showBench: true,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['triceps', 'shoulders', 'chest'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Elbows at 90° — Chest Proud, Press Up" : "Back Glides Close to Bench"
    };
  }

  // 13. PULL-UPS (Hanging from bar, chin over bar)
  if (id.includes('pull-up')) {
    const pullUpY = 0.35 + wave * 0.42;
    const elbowFlex = 0.15 + wave * 1.6;

    return {
      rootPosition: [0, pullUpY, 0],
      rootRotation: [0, 0, 0],
      spineRotation: [0, 0, 0],
      chestRotation: [0.1, 0, 0],
      headRotation: [0.25, 0, 0], // looking up toward bar

      // Arms gripping overhead bar
      leftShoulderRotation: [-2.4 + wave * 0.9, 0, -0.4],
      leftElbowRotation: elbowFlex,
      leftWristRotation: [0, 0, 0],

      rightShoulderRotation: [-2.4 + wave * 0.9, 0, 0.4],
      rightElbowRotation: elbowFlex,
      rightWristRotation: [0, 0, 0],

      leftHipRotation: [0.2, 0, -0.05],
      leftKneeRotation: 0.4,
      leftAnkleRotation: 0,

      rightHipRotation: [0.2, 0, 0.05],
      rightKneeRotation: 0.4,
      rightAnkleRotation: 0,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: true,
      activeMuscles: ['back', 'triceps', 'core'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Chin Over Bar — Drive Elbows Down" : "Full Hang at Bottom — Engage Lats"
    };
  }

  // 14. CALF RAISES (Ankles plantarflex high onto balls of feet)
  if (id.includes('calf-raise')) {
    const heelLiftY = wave * 0.12;

    return {
      rootPosition: [0, heelLiftY, 0],
      rootRotation: [0, 0, 0],
      spineRotation: [0, 0, 0],
      chestRotation: [0, 0, 0],
      headRotation: [0, 0, 0],

      leftShoulderRotation: [0.2, 0, -0.15],
      leftElbowRotation: 0.1,
      leftWristRotation: [0, 0, 0],

      rightShoulderRotation: [0.2, 0, 0.15],
      rightElbowRotation: 0.1,
      rightWristRotation: [0, 0, 0],

      leftHipRotation: [0, 0, -0.06],
      leftKneeRotation: 0.05,
      leftAnkleRotation: -wave * 0.65, // high on toes

      rightHipRotation: [0, 0, 0.06],
      rightKneeRotation: 0.05,
      rightAnkleRotation: -wave * 0.65,

      showWall: false,
      showBench: false,
      showMat: true,
      showPullUpBar: false,
      activeMuscles: ['calves'],
      cueType: 'down_up',
      cueIntensity: wave,
      formTip: wave > 0.7 ? "Squeeze Calves at Apex — 1s Hold" : "Smooth Rise on Balls of Feet"
    };
  }

  // Default Universal Movement (Controlled tempo calisthenics)
  const defaultFlex = 0.1 + wave * 0.9;
  return {
    rootPosition: [0, -wave * 0.15, 0],
    rootRotation: [0, 0, 0],
    spineRotation: [0.05, 0, 0],
    chestRotation: [0.05, 0, 0],
    headRotation: [0, 0, 0],

    leftShoulderRotation: [-0.4 - wave * 0.6, 0, -0.3],
    leftElbowRotation: defaultFlex,
    leftWristRotation: [0, 0, 0],

    rightShoulderRotation: [-0.4 - wave * 0.6, 0, 0.3],
    rightElbowRotation: defaultFlex,
    rightWristRotation: [0, 0, 0],

    leftHipRotation: [0.1 + wave * 0.6, 0, -0.08],
    leftKneeRotation: defaultFlex * 1.1,
    leftAnkleRotation: 0,

    rightHipRotation: [0.1 + wave * 0.6, 0, 0.08],
    rightKneeRotation: defaultFlex * 1.1,
    rightAnkleRotation: 0,

    showWall: false,
    showBench: false,
    showMat: true,
    showPullUpBar: false,
    activeMuscles: ['core', 'quads'],
    cueType: 'down_up',
    cueIntensity: wave,
    formTip: "Controlled 2s Tempo • Maintain Solid Posture"
  };
}
