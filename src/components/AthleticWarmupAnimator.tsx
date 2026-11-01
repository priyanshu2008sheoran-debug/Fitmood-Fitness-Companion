import React, { useState, useEffect, useRef } from 'react';
import { WarmupExercise } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Info,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Activity
} from 'lucide-react';

interface AthleticWarmupAnimatorProps {
  exercise: WarmupExercise;
  currentStepIndex?: number;
  totalSteps?: number;
  isTimerRunning?: boolean;
  onToggleTimer?: () => void;
  className?: string;
}

export const AthleticWarmupAnimator: React.FC<AthleticWarmupAnimatorProps> = ({
  exercise,
  currentStepIndex = 1,
  totalSteps = 4,
  isTimerRunning = true,
  onToggleTimer,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(isTimerRunning);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.75, 1, 1.25
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [showFormChecklist, setShowFormChecklist] = useState<boolean>(true);
  const [showJointGuides, setShowJointGuides] = useState<boolean>(true);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastBeatRef = useRef<number>(-1);

  // Synchronize playing state with timer if controlled externally
  useEffect(() => {
    setIsPlaying(isTimerRunning);
  }, [isTimerRunning]);

  // Audio metronome / cadence click
  const playMetronomeTick = (isHighBeat = false) => {
    if (isAudioMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHighBeat ? 784 : 523, ctx.currentTime); // G5 or C5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio not permitted or blocked
    }
  };

  // Continuous animation ticker
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const duration = 2200 / playbackSpeed; // 2.2s per clean biomechanical repetition
    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) % duration;
      const progress = elapsed / duration; // 0 to 1
      
      // Trigger cadence sound at cycle quarter and half
      const currentBeat = Math.floor(progress * 2);
      if (currentBeat !== lastBeatRef.current) {
        lastBeatRef.current = currentBeat;
        playMetronomeTick(currentBeat === 0);
      }

      // Smooth cosine wave oscillating 0 -> 1 -> 0
      const wave = (1 - Math.cos(progress * 2 * Math.PI)) / 2;
      setAnimProgress(wave);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playbackSpeed, isAudioMuted]);

  const handleReplay = () => {
    startTimeRef.current = Date.now();
    setAnimProgress(0);
    setIsPlaying(true);
  };

  const p = animProgress; // 0 to 1
  const angleSin = Math.sin(p * Math.PI * 2);
  const angleCos = Math.cos(p * Math.PI * 2);

  // Exercise classification based on name & joints
  const exName = (exercise.name || '').toLowerCase();
  const isMarching = exName.includes('march') || exName.includes('knee') || exName.includes('glute') || exName.includes('step');
  const isArmSwings = exName.includes('arm') || exName.includes('circle') || exName.includes('swing') || exName.includes('chest hug');
  const isShoulderRolls = exName.includes('shoulder') || exName.includes('scap') || exName.includes('roll') || exName.includes('angel');
  const isTorsoTwist = exName.includes('twist') || exName.includes('reach') || exName.includes('rotation') || exName.includes('torso') || exName.includes('spine');
  const isLegSwing = exName.includes('swing') || exName.includes('lunge') || exName.includes('hip');
  const isSquat = exName.includes('squat') || exName.includes('pry') || exName.includes('sit');
  const isWrist = exName.includes('wrist') || exName.includes('hand') || exName.includes('palm');

  // Biomechanical coordinate calculations for proportional athletic figure (Center = 150)
  const baseHeadX = 150;
  let headY = 72;
  let neckY = 90;
  let chestX = 150;
  let chestY = 120;
  let pelvisX = 150;
  let pelvisY = 180;

  // Athletic shoulders (broad, clear biomechanic stance)
  let lShoulderX = 122;
  let lShoulderY = 104;
  let rShoulderX = 178;
  let rShoulderY = 104;

  // Elbows & Hands
  let lElbowX = 108;
  let lElbowY = 138;
  let rElbowX = 192;
  let rElbowY = 138;

  let lHandX = 102;
  let lHandY = 170;
  let rHandX = 198;
  let rHandY = 170;

  // Hips, Knees, Feet
  let lHipX = 138;
  let lHipY = 184;
  let rHipX = 162;
  let rHipY = 184;

  let lKneeX = 136;
  let lKneeY = 236;
  let rKneeX = 164;
  let rKneeY = 236;

  let lAnkleX = 136;
  let lAnkleY = 282;
  let rAnkleX = 164;
  let rAnkleY = 282;

  let lFootX = 128;
  let rFootX = 172;

  let torsoRotation = 0;
  let activeMuscleCue = 'Core Stabilizers & Shoulders';
  let primaryMovementCue = 'Stand tall with neutral posture and controlled breathing.';
  let commonMistakeToAvoid = 'Do not hold your breath or rush the movement tempo.';

  if (isMarching) {
    activeMuscleCue = 'Hip Flexors, Quadriceps & Standing Glute';
    primaryMovementCue = 'Drive knee up to hip level (90°). Keep opposite arm swinging smoothly and chest upright.';
    commonMistakeToAvoid = 'Avoid leaning your torso backward as the knee elevates.';
    
    // Knee drive with opposite arm flexion
    const kneeLift = p * 42;
    lKneeY = 236 - kneeLift;
    lKneeX = 136 - p * 4;
    lAnkleY = 282 - kneeLift * 0.9;
    lAnkleX = 136 + p * 6;
    lFootX = 128 + p * 8;

    // Right arm swings forward, left arm back
    rElbowY = 138 - p * 16;
    rElbowX = 192 - p * 12;
    rHandY = 170 - p * 34;
    rHandX = 198 - p * 16;

    lElbowY = 138 + p * 8;
    lHandY = 170 + p * 14;
    headY = 72 - p * 3;
    neckY = 90 - p * 3;
  } else if (isArmSwings) {
    activeMuscleCue = 'Rotator Cuffs, Pectoralis Major & Rhomboids';
    primaryMovementCue = 'Open arms wide to expand chest, then cross smoothly across torso in an athletic hug.';
    commonMistakeToAvoid = 'Do not hyper-extend lower back or hyperextend elbows aggressively.';

    const armSpread = (p - 0.5) * 55;
    lHandX = 95 - armSpread;
    rHandX = 205 + armSpread;
    lHandY = 130 + p * 15;
    rHandY = 130 + p * 15;
    lElbowX = 110 - armSpread * 0.5;
    rElbowX = 190 + armSpread * 0.5;
    lElbowY = 120 + p * 8;
    rElbowY = 120 + p * 8;
  } else if (isShoulderRolls) {
    activeMuscleCue = 'Scapular Elevators, Lower Trapezius & Upper Back';
    primaryMovementCue = 'Elevate shoulders toward ears, roll backward with scapular retraction, and lower down.';
    commonMistakeToAvoid = 'Avoid jutting your chin forward or stiffening your neck.';

    const rollY = angleSin * 10;
    const rollX = angleCos * 7;
    lShoulderY = 104 - rollY;
    rShoulderY = 104 - rollY;
    lShoulderX = 122 + rollX;
    rShoulderX = 178 - rollX;
    lElbowY = 138 - rollY * 0.7;
    rElbowY = 138 - rollY * 0.7;
  } else if (isTorsoTwist) {
    activeMuscleCue = 'Thoracic Spine, Internal & External Obliques';
    primaryMovementCue = 'Rotate upper torso smoothly from side to side. Keep hips forward and pivot back foot naturally.';
    commonMistakeToAvoid = 'Avoid twisting your knees or forcing rotational range past comfort.';

    torsoRotation = (p - 0.5) * 36;
    lShoulderX = 122 + torsoRotation * 0.7;
    rShoulderX = 178 + torsoRotation * 0.7;
    lHandX = 110 + torsoRotation * 1.2;
    rHandX = 190 + torsoRotation * 1.2;
    lHandY = 145 - Math.abs(torsoRotation) * 0.3;
    rHandY = 145 - Math.abs(torsoRotation) * 0.3;
  } else if (isSquat) {
    activeMuscleCue = 'Quadriceps, Gluteus Maximus & Adductors';
    primaryMovementCue = 'Hinge at hips, track knees over second toe, and keep chest upright with flat feet.';
    commonMistakeToAvoid = 'Do not let knees cave inward (valgus collapse) or heels lift off floor.';

    const squatDrop = p * 38;
    headY += squatDrop;
    neckY += squatDrop;
    chestY += squatDrop;
    pelvisY += squatDrop;
    lHipY += squatDrop;
    rHipY += squatDrop;

    lKneeX = 136 - p * 12;
    rKneeX = 164 + p * 12;
    lKneeY = 236 + squatDrop * 0.4;
    rKneeY = 236 + squatDrop * 0.4;

    // Hands forward for counterbalance
    lHandY = 145 + squatDrop * 0.6;
    rHandY = 145 + squatDrop * 0.6;
    lHandX = 120;
    rHandX = 180;
  } else if (isLegSwing) {
    activeMuscleCue = 'Hamstrings, Hip Flexors & Gluteals';
    primaryMovementCue = 'Swing leg forward with controlled momentum, then backward to open hip flexors.';
    commonMistakeToAvoid = 'Avoid excessive arching in lower back when leg travels backward.';

    const swing = (p - 0.5) * 44;
    rKneeX = 164 + swing * 0.7;
    rKneeY = 236 - Math.abs(swing) * 0.3;
    rAnkleX = 164 + swing * 1.2;
    rAnkleY = 282 - Math.abs(swing) * 0.5;
    rFootX = 172 + swing * 1.2;
  } else if (isWrist) {
    activeMuscleCue = 'Wrist Flexors, Extensors & Carpal Tunnel Decompression';
    primaryMovementCue = 'Roll wrists in fluid figure-eights, then gently flex palms forward to prepare for bodyweight pressure.';
    commonMistakeToAvoid = 'Never apply sudden jerking force to your fingers or wrists.';

    lHandY = 135 + angleSin * 8;
    rHandY = 135 - angleSin * 8;
    lHandX = 140 + angleCos * 10;
    rHandX = 160 - angleCos * 10;
    lElbowY = 140;
    rElbowY = 140;
  }

  return (
    <div className={`relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl ${className}`}>
      {/* Top Banner: Coach Identity & Exercise Step */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">Coach Alex</span>
              <span className="text-[10px] bg-lime-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-md">
                PRO TRAINER
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Biomechanical Motion Analysis • Warm-Up Step {currentStepIndex}/{totalSteps}
            </p>
          </div>
        </div>

        {/* View & Speed Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowJointGuides(!showJointGuides)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              showJointGuides
                ? 'bg-lime-400/15 text-lime-300 border-lime-400/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle Joint & Biomechanics Indicators"
          >
            Joint Guides
          </button>

          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 0.75 : playbackSpeed === 0.75 ? 1.25 : 1)}
            className="px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Adjust Animation Speed"
          >
            {playbackSpeed}x Speed
          </button>

          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isAudioMuted
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-lime-400/10 text-lime-400 border-lime-400/30'
            }`}
            title={isAudioMuted ? 'Turn on cadence sound' : 'Mute cadence sound'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Demonstration Area */}
      <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden select-none">
        {/* Subtle Background Gym Floor Grid & Plumbline */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gymGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gymGrid)" />
        </svg>

        {/* Vertical Postural Plumbline (Biomechanical Alignment Guide) */}
        {showJointGuides && (
          <div className="absolute top-8 bottom-10 left-1/2 -translate-x-1/2 w-0.5 border-l border-dashed border-lime-400/25 pointer-events-none flex flex-col justify-between items-center text-[9px] text-lime-400/60 font-mono">
            <span className="bg-slate-950/80 px-1 rounded">HEAD ALIGNED</span>
            <span className="bg-slate-950/80 px-1 rounded">NEUTRAL SPINE</span>
            <span className="bg-slate-950/80 px-1 rounded">BASE OF SUPPORT</span>
          </div>
        )}

        {/* Scalable Vector Athletic Coach SVG */}
        <svg
          viewBox="0 0 300 320"
          className="w-full h-full max-w-sm drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        >
          <defs>
            <linearGradient id="athleticSkin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f6d3b3" />
              <stop offset="100%" stopColor="#e2b08a" />
            </linearGradient>

            <linearGradient id="coachSuit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="limeStripe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>

            <radialGradient id="jointGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a3e635" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
            </radialGradient>

            {/* Kinetic Arrow Marker */}
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a3e635" />
            </marker>
          </defs>

          {/* Floor Shadow */}
          <ellipse cx="150" cy="295" rx={55 + p * 5} ry={12} fill="#000000" opacity="0.45" />

          {/* Kinetic Motion Path Indicators */}
          {showJointGuides && isArmSwings && (
            <path
              d="M 85 140 C 95 100, 205 100, 215 140 C 205 180, 95 180, 85 140"
              fill="none"
              stroke="#a3e635"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
              markerEnd="url(#arrow)"
            />
          )}

          {showJointGuides && isMarching && (
            <g opacity="0.8">
              <line x1="130" y1="260" x2="130" y2="200" stroke="#a3e635" strokeWidth="2.5" markerEnd="url(#arrow)" />
              <text x="80" y="225" fill="#a3e635" fontSize="10" fontWeight="bold">90° DRIVE</text>
            </g>
          )}

          {showJointGuides && isShoulderRolls && (
            <g opacity="0.8">
              <path d="M 112 110 A 10 10 0 1 1 125 98" fill="none" stroke="#a3e635" strokeWidth="2" markerEnd="url(#arrow)" />
              <path d="M 188 110 A 10 10 0 1 0 175 98" fill="none" stroke="#a3e635" strokeWidth="2" markerEnd="url(#arrow)" />
            </g>
          )}

          {showJointGuides && isTorsoTwist && (
            <path
              d="M 100 125 Q 150 145 200 125"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              opacity="0.8"
              markerEnd="url(#arrow)"
            />
          )}

          {/* --- LEGS & FEET (Clear Anatomical Structure) --- */}
          {/* Left Leg */}
          <path
            d={`M ${lHipX} ${lHipY} L ${lKneeX} ${lKneeY} L ${lAnkleX} ${lAnkleY}`}
            stroke="url(#coachSuit)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Leg */}
          <path
            d={`M ${rHipX} ${rHipY} L ${rKneeX} ${rKneeY} L ${rAnkleX} ${rAnkleY}`}
            stroke="url(#coachSuit)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Athletic Shoes with Grip */}
          <path
            d={`M ${lAnkleX - 4} ${lAnkleY} L ${lFootX - 10} ${lAnkleY + 6} L ${lAnkleX + 6} ${lAnkleY + 6} Z`}
            fill="#a3e635"
          />
          <path
            d={`M ${rAnkleX - 6} ${rAnkleY} L ${rFootX + 10} ${rAnkleY + 6} L ${rAnkleX + 4} ${rAnkleY + 6} Z`}
            fill="#a3e635"
          />

          {/* --- ATHLETIC TORSO & CORE --- */}
          {/* Pelvis / Athletic Shorts */}
          <path
            d="M 132 176 L 168 176 L 165 204 L 135 204 Z"
            fill="url(#coachSuit)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Athletic Core & Chest (V-Taper) */}
          <path
            d={`M ${lShoulderX} ${lShoulderY} L ${rShoulderX} ${rShoulderY} L ${pelvisX + 16} ${pelvisY} L ${pelvisX - 16} ${pelvisY} Z`}
            fill="url(#coachSuit)"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Neon Sport Stripes on Athletic Shirt */}
          <line
            x1={lShoulderX + 8}
            y1={lShoulderY + 4}
            x2={pelvisX - 8}
            y2={pelvisY - 4}
            stroke="url(#limeStripe)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1={rShoulderX - 8}
            y1={rShoulderY + 4}
            x2={pelvisX + 8}
            y2={pelvisY - 4}
            stroke="url(#limeStripe)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Muscle Engagement Highlight Glow on Active Torso/Pectorals */}
          <circle cx="150" cy="132" r="16" fill="url(#jointGlow)" opacity="0.4" />

          {/* --- ARMS (Upper Arm, Elbow, Forearm, Hand) --- */}
          {/* Left Arm */}
          <path
            d={`M ${lShoulderX} ${lShoulderY} L ${lElbowX} ${lElbowY} L ${lHandX} ${lHandY}`}
            stroke="url(#athleticSkin)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Sleeve */}
          <line
            x1={lShoulderX}
            y1={lShoulderY}
            x2={lShoulderX - 6}
            y2={lShoulderY + 16}
            stroke="url(#coachSuit)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Right Arm */}
          <path
            d={`M ${rShoulderX} ${rShoulderY} L ${rElbowX} ${rElbowY} L ${rHandX} ${rHandY}`}
            stroke="url(#athleticSkin)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Sleeve */}
          <line
            x1={rShoulderX}
            y1={rShoulderY}
            x2={rShoulderX + 6}
            y2={rShoulderY + 16}
            stroke="url(#coachSuit)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Athletic Trainer Head & Neck */}
          {/* Neck */}
          <line x1={baseHeadX} y1={headY + 12} x2={baseHeadX} y2={neckY + 6} stroke="url(#athleticSkin)" strokeWidth="12" strokeLinecap="round" />
          
          {/* Head & Athletic Hair */}
          <circle cx={baseHeadX} cy={headY} r="16" fill="url(#athleticSkin)" />
          {/* Modern Athletic Haircut & Sweatband */}
          <path d="M 134 68 C 134 50, 166 50, 166 68 Z" fill="#1e293b" />
          <path d="M 134 67 L 166 67" stroke="#a3e635" strokeWidth="4" strokeLinecap="round" />

          {/* Eye Direction / Focused Coach Gaze */}
          <circle cx={baseHeadX - 4} cy={headY + 2} r="2" fill="#0f172a" />
          <circle cx={baseHeadX + 4} cy={headY + 2} r="2" fill="#0f172a" />
          {/* Friendly encouragement smile */}
          <path d="M 146 78 Q 150 82 154 78" fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />

          {/* --- BIOMECHANICAL JOINT PIVOTS (Visual Clear Indicators) --- */}
          {showJointGuides && (
            <g className="joint-pivots">
              {/* Shoulders */}
              <circle cx={lShoulderX} cy={lShoulderY} r="5" fill="#a3e635" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx={rShoulderX} cy={rShoulderY} r="5" fill="#a3e635" stroke="#0f172a" strokeWidth="1.5" />

              {/* Elbows */}
              <circle cx={lElbowX} cy={lElbowY} r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx={rElbowX} cy={rElbowY} r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />

              {/* Wrists */}
              <circle cx={lHandX} cy={lHandY} r="3.5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx={rHandX} cy={rHandY} r="3.5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />

              {/* Hips */}
              <circle cx={lHipX} cy={lHipY} r="5" fill="#a3e635" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx={rHipX} cy={rHipY} r="5" fill="#a3e635" stroke="#0f172a" strokeWidth="1.5" />

              {/* Knees */}
              <circle cx={lKneeX} cy={lKneeY} r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx={rKneeX} cy={rKneeY} r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />

              {/* Ankles */}
              <circle cx={lAnkleX} cy={lAnkleY} r="4" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx={rAnkleX} cy={rAnkleY} r="4" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* Live Joint Guide Legend Overlay */}
        {showJointGuides && (
          <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-2.5 text-[10px] text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-lime-400"></span> Primary Pivot
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span> Joint Flexion
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Extremity Path
            </span>
          </div>
        )}

        {/* Replay Button overlay */}
        <button
          onClick={handleReplay}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 backdrop-blur-sm transition-colors"
          title="Restart movement demonstration"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Real-Time Form Instruction & Biomechanical Checklist Bar */}
      <div className="p-4 sm:p-5 space-y-3 bg-slate-900/90 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-black text-white">{exercise.name}</h4>
              <span className="text-[11px] font-bold text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-md border border-lime-400/20">
                {exercise.durationSeconds}s
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{exercise.instructions}</p>
          </div>

          <button
            onClick={() => setShowFormChecklist(!showFormChecklist)}
            className="self-start sm:self-auto text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showFormChecklist ? 'Hide Form Tips' : 'Show Form Tips'}</span>
          </button>
        </div>

        {/* Detailed Form Cues Box */}
        {showFormChecklist && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-xs">
            {/* Box 1: Movement execution */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Proper Execution</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{primaryMovementCue}</p>
            </div>

            {/* Box 2: Target Activation */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>Prime Muscles & Joints</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{activeMuscleCue}</p>
            </div>

            {/* Box 3: Avoid Mistake */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Error to Avoid</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{commonMistakeToAvoid}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
