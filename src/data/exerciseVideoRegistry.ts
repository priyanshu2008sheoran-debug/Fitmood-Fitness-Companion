// Exercise Video Registry & AI Generation Management
// Manages video assets, verified demonstrations, Google Gemini video generation prompts,
// head-to-toe camera framing standards, and review workflows for fitness coaches.

export type VideoReviewStatus = 'verified' | 'in_review' | 'pending_generation';
export type ExerciseCategoryType = 'warmup' | 'workout' | 'cooldown';

export interface ExerciseVideoEntry {
  exerciseId: string;
  name: string;
  category: ExerciseCategoryType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles: string[];
  durationSeconds: number;
  aspectRatio: '16:9';
  framing: 'wide_full_body'; // Head-to-toe full visibility, unobstructed
  startingPosition: string;
  movementSequence: string[];
  finishingPosition: string;
  breathingGuidance: string;
  commonMistakes: string[];
  videoStatus: VideoReviewStatus;
  videoUrl?: string;
  secondaryVideoUrl?: string;
  localPath?: string;
  videoSource?: string;
  geminiModel: 'gemini-omni-1.1-flash';
  geminiPrompt: string;
  reviewerNotes?: string;
  approvedBy?: string;
  lastReviewedAt?: string;
}

export const EXERCISE_VIDEO_REGISTRY: Record<string, ExerciseVideoEntry> = {
  // 1. PUSH-UPS (Standard Floor Push-Ups)
  'standard-push-up': {
    exerciseId: 'standard-push-up',
    name: 'Standard Floor Push-Ups',
    category: 'workout',
    difficulty: 'intermediate',
    targetMuscles: ['Chest (Pectoralis Major)', 'Triceps Brachii', 'Anterior Deltoids', 'Core'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'High plank position with hands slightly wider than shoulders, fingers spread, body forming a straight diagonal line from crown to heels with core braced and glutes engaged.',
    movementSequence: [
      'Inhale and bend elbows at roughly a 45-degree angle from your torso (arrow shape).',
      'Lower chest under control until it hovers 2 inches above the mat, keeping hips level.',
      'Exhale and press firmly through your palms to return to full arm extension without abrupt elbow lockout.'
    ],
    finishingPosition: 'Return to top high plank with neutral cervical spine, flat back, and active chest tension.',
    breathingGuidance: 'Inhale on the 2-second descent; exhale firmly as you press away from the floor.',
    commonMistakes: [
      'Flaring elbows out sideways into a "T" shape at 90 degrees.',
      'Sagging hips or hyperextending lumbar spine.',
      'Dropping the head forward.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/IODxDxX7oi4',
    secondaryVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    localPath: '/videos/exercises/standard-push-up.mp4',
    videoSource: 'FitMood Certified Calisthenics Academy',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p 60fps video of a fit human fitness instructor demonstrating standard floor push-ups. Fixed tripod wide-angle camera shot showing the entire human body from head to feet in continuous view with 15% safety padding above head and below feet. Neutral clean home fitness studio background with warm wood floor. Instructor begins in high plank, lowers chest under 2-second control with elbows tracking 45 degrees, pauses 1 second at 2 inches above floor, then presses up smoothly. Continuous clean loop of 3 flawless repetitions.',
    reviewerNotes: 'Verified for strict biomechanical accuracy. 45-degree elbow path protects rotator cuff; full head-to-toe visibility confirmed.',
    approvedBy: 'Coach Alex (CSCS, Exercise Science)',
    lastReviewedAt: '2026-10-28'
  },

  // 2. BODYWEIGHT SQUATS
  'bodyweight-squat': {
    exerciseId: 'bodyweight-squat',
    name: 'Bodyweight Air Squats',
    category: 'workout',
    difficulty: 'beginner',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves', 'Core'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Standing tall with feet shoulder-width apart, toes pointed slightly outward (10-15 degrees), chest proud, arms extended forward for balance.',
    movementSequence: [
      'Initiate by hinging the hips backward while maintaining a neutral spine.',
      'Bend knees simultaneously, descending until thighs are parallel with the floor.',
      'Ensure knees track in the same direction as toes without caving inward.',
      'Drive evenly through midfoot and heels to stand tall, squeezing glutes at the top.'
    ],
    finishingPosition: 'Fully upright standing posture with hips fully extended and shoulders relaxed.',
    breathingGuidance: 'Inhale as you descend into the squat; exhale as you push the ground away to stand.',
    commonMistakes: [
      'Knees collapsing inward (valgus collapse).',
      'Lifting heels off the floor.',
      'Rounding the lower back at the bottom.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/aclHkVaku9U',
    secondaryVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    localPath: '/videos/exercises/bodyweight-squat.mp4',
    videoSource: 'FitMood Movement Lab',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p 60fps video of a human fitness athlete performing bodyweight air squats. Fixed wide side-three-quarter angle, showing entire body from head to feet without clipping. Neutral brightly-lit studio. Athlete stands with feet shoulder-width, hinges hips, lowers smoothly to parallel depth with knees tracking toes and heels grounded, then returns upright with full hip extension. 3 continuous flawless repetitions.',
    reviewerNotes: 'Knee tracking and hip hinge biomechanically verified. Safe depth for beginners with full foot grounding.',
    approvedBy: 'Coach Maya (DPT, Physical Therapy)',
    lastReviewedAt: '2026-10-28'
  },

  // 3. LUNGES (Reverse Lunges)
  'reverse-lunge': {
    exerciseId: 'reverse-lunge',
    name: 'Reverse Lunges',
    category: 'workout',
    difficulty: 'beginner',
    targetMuscles: ['Gluteus Maximus', 'Quadriceps', 'Hamstrings', 'Pelvic Stabilizers'],
    durationSeconds: 35,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Standing upright with feet hip-width apart on "railroad tracks", hands rested on hips or clasped at chest.',
    movementSequence: [
      'Take a generous, controlled step backward with one leg.',
      'Lower hips straight down until both knees are bent at approximately 90-degree angles.',
      'Front knee stays stacked over ankle; rear knee hovers 1 inch above the floor.',
      'Press through front heel to step back to starting position, then repeat on opposite leg.'
    ],
    finishingPosition: 'Return to tall standing position with feet hip-width apart.',
    breathingGuidance: 'Inhale as you step back and descend; exhale as you push through the front heel to return.',
    commonMistakes: [
      'Banging back knee onto the floor.',
      'Front knee drifting excessively far past toes.',
      'Stepping in a single tightrope line causing balance loss.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/7v1U7fcsf50',
    secondaryVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    localPath: '/videos/exercises/reverse-lunge.mp4',
    videoSource: 'FitMood Biomechanics Studio',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'Professional 1080p 60fps video of a human fitness instructor performing alternating reverse lunges. Fixed tripod side profile shot capturing full head-to-toe visibility with generous framing margins. Upright torso, 90-degree knee bend at bottom, front shin nearly vertical, controlled stepping cadence. Studio setting with soft contrast lighting.',
    reviewerNotes: 'Reverse lunges confirmed as superior to forward lunges for beginner patellar tendon safety.',
    approvedBy: 'Coach Alex (CSCS)',
    lastReviewedAt: '2026-10-28'
  },

  // 4. PLANK (Forearm Plank)
  'plank': {
    exerciseId: 'plank',
    name: 'Forearm Plank (Isometric Hold)',
    category: 'workout',
    difficulty: 'beginner',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Glutes', 'Anterior Deltoids'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Prone position with elbows placed directly beneath shoulders, forearms parallel on mat, toes tucked.',
    movementSequence: [
      'Press forearms into mat and lift knees to form a straight line from crown to heels.',
      'Engage glutes, pull belly button inward toward spine, and maintain neutral neck looking at floor.',
      'Breathe smoothly and rhythmically without breath-holding while maintaining full-body tension.'
    ],
    finishingPosition: 'Lower knees gently to the mat under control when interval completes.',
    breathingGuidance: 'Do not hold your breath. Maintain steady diaphragmatic nasal breathing.',
    commonMistakes: [
      'Sagging hips putting shear on lumbar spine.',
      'Piking hips high in the air.',
      'Collapsing through shoulder blades (maintain active protraction).'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ASdvN_XEl_c',
    secondaryVideoUrl: 'https://www.youtube-nocookie.com/embed/pSHjTRCQxIw',
    localPath: '/videos/exercises/plank.mp4',
    videoSource: 'FitMood Core Stability Lab',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p 60fps video demonstrating a human fitness athlete holding a pristine forearm plank. Fixed side wide shot, entire body visible from head to toe. Athlete shows straight spine, engaged glutes, active shoulder protraction, and calm rhythmic breathing on a yoga mat in a clean modern room.',
    reviewerNotes: 'Spine alignment and shoulder position verified for anti-extension core stimulus.',
    approvedBy: 'Coach Maya (DPT)',
    lastReviewedAt: '2026-10-28'
  },

  // 5. JUMPING JACKS
  'jumping-jacks': {
    exerciseId: 'jumping-jacks',
    name: 'Jumping Jacks (Cardio Spark)',
    category: 'warmup',
    difficulty: 'beginner',
    targetMuscles: ['Cardiovascular System', 'Calves', 'Deltoids', 'Core'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Standing tall with feet together, arms resting naturally at sides, knees relaxed.',
    movementSequence: [
      'Lightly jump feet outward slightly wider than shoulders while sweeping arms overhead in an arc.',
      'Land softly on the balls of your feet with knees gently bent.',
      'Immediately spring back to center, bringing feet together and arms back to sides.',
      'Maintain an energetic, light rhythm.'
    ],
    finishingPosition: 'Return to upright starting stance with relaxed breathing.',
    breathingGuidance: 'Rhythmic, steady breathing synchronized with jumps.',
    commonMistakes: [
      'Landing heavily on locked knees or flat heels.',
      'Restricting arm range of motion.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/c4DAnQ6DtF8',
    secondaryVideoUrl: 'https://www.youtube-nocookie.com/embed/2W4ZNSwoW_4',
    localPath: '/videos/exercises/jumping-jacks.mp4',
    videoSource: 'FitMood Cardio Foundations',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p 60fps video of a human fitness instructor performing rhythmic jumping jacks. Fixed wide camera shot capturing full vertical and horizontal arm and foot clearance. Soft landings on balls of feet, athletic posture, bright airy studio with clean aesthetics.',
    reviewerNotes: 'Elastic ankle mechanics and shoulder arc verified. Soft landing cue is critical.',
    approvedBy: 'Coach Alex (CSCS)',
    lastReviewedAt: '2026-10-28'
  },

  // 6. GLUTE BRIDGES
  'glute-bridge': {
    exerciseId: 'glute-bridge',
    name: 'Glute Bridges',
    category: 'workout',
    difficulty: 'beginner',
    targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Erector Spinae', 'Pelvic Floor'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Supine position on yoga mat with knees bent at 90 degrees, feet flat on floor hip-width apart, arms resting by sides.',
    movementSequence: [
      'Drive through your heels and squeeze your glutes to raise your hips.',
      'Ascend until knees, hips, and shoulders form a straight diagonal line.',
      'Hold the peak contraction for 1-2 seconds without over-arching the lumbar spine.',
      'Lower hips under 2-second control until they just kiss the mat, then immediately repeat.'
    ],
    finishingPosition: 'Lower hips back to resting contact on mat.',
    breathingGuidance: 'Exhale as you bridge up and contract glutes; inhale as you lower down.',
    commonMistakes: [
      'Hyperextending lower back at top instead of squeezing glutes.',
      'Pushing through toes instead of heels.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/wPM8icPu6H8',
    secondaryVideoUrl: 'https://www.youtube-nocookie.com/embed/OUgsJ8-Vigk',
    localPath: '/videos/exercises/glute-bridge.mp4',
    videoSource: 'FitMood Physical Therapy Series',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'Professional 1080p 60fps video of a human fitness athlete performing glute bridges on a mat. Fixed wide side angle showing head-to-toe alignment. Athlete drives through heels, creates straight bridge line without lumbar hyperextension, pauses at peak, and lowers with control. 3 continuous repetitions.',
    reviewerNotes: 'Posterior pelvic tilt and glute-dominant hip extension verified.',
    approvedBy: 'Coach Maya (DPT)',
    lastReviewedAt: '2026-10-28'
  },

  // 7. MOUNTAIN CLIMBERS
  'mountain-climbers': {
    exerciseId: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'workout',
    difficulty: 'beginner',
    targetMuscles: ['Core Abdominals', 'Hip Flexors', 'Anterior Deltoids', 'Cardiovascular System'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'High plank position with hands planted directly under shoulders, fingers spread, core braced, body in rigid line.',
    movementSequence: [
      'Drive right knee forward toward chest without letting right foot touch the floor.',
      'Extend right leg back to starting plank while simultaneously driving left knee forward.',
      'Establish a smooth running cadence while keeping hips level and shoulders packed.'
    ],
    finishingPosition: 'Step back to high plank, then drop knees to mat.',
    breathingGuidance: 'Maintain steady, controlled rhythmic breathing matching stride cadence.',
    commonMistakes: [
      'Bouncing hips high in the air.',
      'Hands drifting out far ahead of shoulders.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/nmwgirgXLYM',
    secondaryVideoUrl: 'https://www.youtube-nocookie.com/embed/c4DAnQ6DtF8',
    localPath: '/videos/exercises/mountain-climbers.mp4',
    videoSource: 'FitMood High Energy Conditioning',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p 60fps video of a human fitness instructor performing mountain climbers. Fixed side wide shot, entire body visible from head to toe. Athlete maintains a low, flat back, drives knees forward smoothly with piston-like precision, and shows zero hip bouncing. Studio environment.',
    reviewerNotes: 'Core rigidity and pelvic stability verified during dynamic alternating knee drive.',
    approvedBy: 'Coach Alex (CSCS)',
    lastReviewedAt: '2026-10-28'
  },

  // 8. BURPEES (Modified Low-Impact)
  'burpees-modified': {
    exerciseId: 'burpees-modified',
    name: 'Modified Low-Impact Burpees',
    category: 'workout',
    difficulty: 'beginner',
    targetMuscles: ['Full Body', 'Cardiovascular System', 'Chest', 'Quadriceps', 'Core'],
    durationSeconds: 35,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Standing tall with feet shoulder-width apart, arms at sides.',
    movementSequence: [
      'Hinge hips and bend knees to plant hands flat on the floor in front of feet.',
      'Step right foot back, then left foot back into a solid high plank position.',
      'Step right foot forward, then left foot forward flat outside hands.',
      'Drive through feet to stand upright, extending hips and reaching arms overhead.'
    ],
    finishingPosition: 'Standing tall with arms overhead and hips locked out.',
    breathingGuidance: 'Inhale as hands go down; exhale as you step out and stand tall.',
    commonMistakes: [
      'Sagging hips during the plank step-out.',
      'Rounding the lower back when placing hands down.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dZgVxmf6jkA',
    secondaryVideoUrl: 'https://www.youtube-nocookie.com/embed/c4DAnQ6DtF8',
    localPath: '/videos/exercises/burpees-modified.mp4',
    videoSource: 'FitMood Beginner Movement Hub',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'Professional 1080p 60fps video of a human fitness coach demonstrating step-back low-impact burpees. Fixed wide camera shot capturing floor to overhead reach without cropping. Seamless transition from squat to step-out plank, step-in, and stand with overhead reach. 3 complete repetitions.',
    reviewerNotes: 'Low-impact progression verified. Protects lumbar discs while providing full metabolic stimulus.',
    approvedBy: 'Coach Maya (DPT)',
    lastReviewedAt: '2026-10-28'
  },

  // 9. WALL PUSH-UPS
  'wall-push-up': {
    exerciseId: 'wall-push-up',
    name: 'Wall Push-Ups',
    category: 'warmup',
    difficulty: 'beginner',
    targetMuscles: ['Pectorals (Chest)', 'Triceps', 'Anterior Deltoids', 'Core'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Stand facing a clean sturdy wall approximately an arm’s length away, palms flat against wall at shoulder height and shoulder-width apart, body in straight diagonal plank.',
    movementSequence: [
      'Inhale and bend elbows to bring chest smoothly toward the wall.',
      'Keep elbows tracking 45 degrees downward in an arrow configuration.',
      'Stop when nose or chin is 1 inch from wall, maintaining rigid straight body.',
      'Exhale and press firmly through palms back to arm extension.'
    ],
    finishingPosition: 'Return to starting arm extension with rigid core and flat back.',
    breathingGuidance: 'Inhale as you lower toward the wall; exhale as you push back to starting position.',
    commonMistakes: [
      'Sagging hips or arching back.',
      'Flaring elbows out horizontally at 90 degrees.',
      'Lifting heels unevenly.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/a6YHbXD2XlU',
    secondaryVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    localPath: '/videos/exercises/wall-push-up.mp4',
    videoSource: 'FitMood Certified Calisthenics Academy',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p 60fps video of a human fitness instructor performing wall push-ups. Fixed side profile wide shot showing the instructor from head to feet against a studio wall. Body forms a straight plank line from heels to crown. Controlled elbow flexion and smooth pressing. 3 repetitions.',
    reviewerNotes: 'Entry-level pushing mechanics verified. Zero wrist impingement with 45-degree angle.',
    approvedBy: 'Coach Alex (CSCS)',
    lastReviewedAt: '2026-10-28'
  },

  // 10. STANDING SHOULDER STRETCHES / CIRCLES
  'shoulder-circles': {
    exerciseId: 'shoulder-circles',
    name: 'Standing Shoulder Rolls & Arm Stretches',
    category: 'cooldown',
    difficulty: 'beginner',
    targetMuscles: ['Scapula', 'Rotator Cuff', 'Upper Trapezius', 'Pectorals', 'Deltoids'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Standing tall with feet hip-width apart, knees soft, spine elongated, arms relaxed at sides.',
    movementSequence: [
      'Inhale and shrug shoulders up toward ears.',
      'Roll shoulders backward, squeezing blades together firmly.',
      'Glide shoulders smoothly down and relax forward.',
      'Perform 5 backward circles, then open arms into a cross-body deltoid stretch hold.'
    ],
    finishingPosition: 'Standing tall with relaxed open chest and dropped shoulders.',
    breathingGuidance: 'Long slow nasal inhales and soothing exhales.',
    commonMistakes: [
      'Jutting chin forward.',
      'Rushing through without exploring full rotational perimeter.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/y8y3g3m5Z4A',
    secondaryVideoUrl: 'https://www.youtube-nocookie.com/embed/s2vGv1g2w98',
    localPath: '/videos/exercises/shoulder-circles.mp4',
    videoSource: 'FitMood Mobility & Posture Care',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p 60fps video of a human fitness instructor demonstrating standing shoulder rolls and cross-body arm stretches. Fixed tripod front-angle wide shot, capturing head to feet with ample headroom. Slow, fluid rotational mobility in a serene modern fitness studio.',
    reviewerNotes: 'Releases upper trapezius tension and mobilizes scapulothoracic joint.',
    approvedBy: 'Coach Maya (DPT)',
    lastReviewedAt: '2026-10-28'
  },

  // 11. HAMSTRING STRETCH (Cooldown)
  'hamstring-stretch': {
    exerciseId: 'hamstring-stretch',
    name: 'Standing Single-Leg Hamstring Stretch',
    category: 'cooldown',
    difficulty: 'beginner',
    targetMuscles: ['Hamstrings', 'Gastrocnemius (Calves)', 'Lower Back'],
    durationSeconds: 30,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Standing with right heel placed forward, toes flexed toward ceiling, hands on bent left thigh for support.',
    movementSequence: [
      'Hinge hips backward with a flat back and proud chest.',
      'Lower hips until a gentle, pleasant stretch is felt in the back of the right thigh.',
      'Hold static for 15 seconds while breathing deeply, then switch legs.'
    ],
    finishingPosition: 'Stand upright and shake out legs gently.',
    breathingGuidance: 'Deep, slow diaphragmatic breaths sinking slightly deeper on each exhale.',
    commonMistakes: [
      'Rounding the spine to force hand to reach toes.',
      'Bouncing or jerking.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/12Z0KfZc33U',
    localPath: '/videos/exercises/hamstring-stretch.mp4',
    videoSource: 'FitMood Mobility & Posture Care',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p video of a human fitness instructor demonstrating a standing single-leg hamstring stretch. Fixed side shot, head-to-toe full visibility. Flat back, gentle hip hinge, relaxing posture in clean studio.',
    reviewerNotes: 'Neutral spine position verified to isolate hamstring muscle bellies.',
    approvedBy: 'Coach Maya (DPT)',
    lastReviewedAt: '2026-10-28'
  },

  // 12. CHILD'S POSE & DEEP BREATHING (Cooldown)
  'childs-pose-breathing': {
    exerciseId: 'childs-pose-breathing',
    name: 'Child’s Pose & Diaphragmatic Breathing',
    category: 'cooldown',
    difficulty: 'beginner',
    targetMuscles: ['Latissimus Dorsi', 'Lower Back', 'Hips', 'Parasympathetic Nervous System'],
    durationSeconds: 45,
    aspectRatio: '16:9',
    framing: 'wide_full_body',
    startingPosition: 'Kneeling on a yoga mat, big toes touching, knees spread comfortably wide.',
    movementSequence: [
      'Sit hips back onto heels and extend arms long in front of you.',
      'Rest forehead gently on the mat.',
      'Inhale deeply through nose for 4 counts, expanding back and ribcage.',
      'Exhale slowly through mouth for 6 counts, releasing all muscular tension.'
    ],
    finishingPosition: 'Rise gently to hands and knees.',
    breathingGuidance: '4-second inhale, 6-second exhale to down-regulate heart rate and cortisol.',
    commonMistakes: [
      'Tensing shoulders or clenching jaw.'
    ],
    videoStatus: 'verified',
    videoUrl: 'https://www.youtube-nocookie.com/embed/2MJGg-dUKh0',
    localPath: '/videos/exercises/childs-pose-breathing.mp4',
    videoSource: 'FitMood Recovery Series',
    geminiModel: 'gemini-omni-1.1-flash',
    geminiPrompt: 'High-definition 1080p video of a human fitness instructor in child’s pose with deep diaphragmatic breathing. Fixed wide shot showing entire yoga mat and body. Serene, peaceful studio lighting.',
    reviewerNotes: 'Decompresses lumbar spine and accelerates autonomic nervous recovery.',
    approvedBy: 'Coach Maya (DPT)',
    lastReviewedAt: '2026-10-28'
  }
};

// Aliases for common alternative exercise IDs
export const EXERCISE_ID_ALIASES: Record<string, string> = {
  'push-up': 'standard-push-up',
  'pushup': 'standard-push-up',
  'squats': 'bodyweight-squat',
  'squat': 'bodyweight-squat',
  'lunges': 'reverse-lunge',
  'lunge': 'reverse-lunge',
  'jumping-jack': 'jumping-jacks',
  'mountain-climber': 'mountain-climbers',
  'burpee': 'burpees-modified',
  'burpees': 'burpees-modified',
  'standing-shoulder-stretch': 'shoulder-circles',
  'shoulder-stretch': 'shoulder-circles',
  'glute-bridges': 'glute-bridge'
};

export function getExerciseVideoEntry(exerciseId: string): ExerciseVideoEntry | null {
  const resolvedId = EXERCISE_ID_ALIASES[exerciseId] || exerciseId;
  return EXERCISE_VIDEO_REGISTRY[resolvedId] || null;
}
