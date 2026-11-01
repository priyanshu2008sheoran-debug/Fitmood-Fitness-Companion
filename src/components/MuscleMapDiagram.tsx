import React, { useState } from 'react';
import { Exercise } from '../types';
import { Info, RotateCw, Sparkles } from 'lucide-react';

interface MuscleMapDiagramProps {
  exercise: Exercise;
  compact?: boolean;
  className?: string;
}

export type BodyRegionId =
  | 'chest'
  | 'shoulders'
  | 'back'
  | 'biceps_triceps'
  | 'core'
  | 'glutes'
  | 'quads_hamstrings'
  | 'calves'
  | 'full_body';

export const BODY_REGIONS_CONFIG: {
  id: BodyRegionId;
  label: string;
  defaultView: 'front' | 'back';
}[] = [
  { id: 'chest', label: 'Chest', defaultView: 'front' },
  { id: 'shoulders', label: 'Shoulders', defaultView: 'front' },
  { id: 'back', label: 'Back', defaultView: 'back' },
  { id: 'biceps_triceps', label: 'Biceps & Triceps', defaultView: 'front' },
  { id: 'core', label: 'Core & Abdominals', defaultView: 'front' },
  { id: 'glutes', label: 'Glutes', defaultView: 'back' },
  { id: 'quads_hamstrings', label: 'Quads & Hamstrings', defaultView: 'front' },
  { id: 'calves', label: 'Calves', defaultView: 'back' },
  { id: 'full_body', label: 'Full-Body Movement', defaultView: 'front' }
];

export const MuscleMapDiagram: React.FC<MuscleMapDiagramProps> = ({
  exercise,
  compact = false,
  className = ''
}) => {
  // Determine if primary target is mainly back-dominant
  const isBackDominant =
    exercise.bodyRegions?.includes('back') ||
    exercise.bodyRegions?.includes('glutes') ||
    exercise.id.includes('pull-up') ||
    exercise.id.includes('glute-bridge');

  const [activeView, setActiveView] = useState<'front' | 'back'>(
    isBackDominant ? 'back' : 'front'
  );

  const activeRegions = exercise.bodyRegions || ['full_body'];

  // Helper to determine highlight color
  const getRegionFill = (region: BodyRegionId, isBackView: boolean) => {
    const isPresent = activeRegions.includes(region) || activeRegions.includes('full_body');
    if (!isPresent) return '#334155'; // slate-700

    // Primary or secondary check
    const isPrimary = exercise.primaryMuscles?.some((m) =>
      m.toLowerCase().includes(region.replace('_', ' ')) ||
      (region === 'chest' && m.toLowerCase().includes('pectoral')) ||
      (region === 'back' && (m.toLowerCase().includes('lat') || m.toLowerCase().includes('spine') || m.toLowerCase().includes('erector'))) ||
      (region === 'glutes' && m.toLowerCase().includes('glute')) ||
      (region === 'quads_hamstrings' && (m.toLowerCase().includes('quad') || m.toLowerCase().includes('thigh'))) ||
      (region === 'calves' && (m.toLowerCase().includes('calf') || m.toLowerCase().includes('gastrocnemius'))) ||
      (region === 'core' && (m.toLowerCase().includes('ab') || m.toLowerCase().includes('core')))
    );

    return isPrimary ? '#a3e635' : '#f59e0b'; // lime-400 : amber-500
  };

  return (
    <div className={`bg-slate-950/70 border border-slate-800 rounded-3xl p-4 sm:p-5 text-slate-100 ${className}`}>
      {/* Header and View Toggle */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-lime-400" />
            <span>Target Muscles & Anatomy Map</span>
          </div>
          <h4 className="text-sm font-black text-white mt-0.5">
            Muscles Worked in {exercise.name}
          </h4>
        </div>

        {/* Front / Back Toggle Buttons */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-700/80 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveView('front')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeView === 'front'
                ? 'bg-lime-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setActiveView('back')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeView === 'back'
                ? 'bg-lime-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* Main Grid: Body Silhouette Diagram on Left, Details & Legend on Right */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Silhouette SVG Illustration */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute top-2 left-3">
            {activeView === 'front' ? 'Anterior (Front)' : 'Posterior (Back)'}
          </span>

          <svg
            viewBox="0 0 160 280"
            className="w-36 h-56 drop-shadow-md select-none"
            aria-label={`${exercise.name} ${activeView} muscle map`}
          >
            {/* Head & Neck */}
            <circle cx="80" cy="30" r="16" fill="#475569" />
            <rect x="74" y="44" width="12" height="12" rx="4" fill="#475569" />

            {/* Torso Base / Silhouette */}
            {activeView === 'front' ? (
              /* FRONT VIEW */
              <g id="front-muscles">
                {/* Shoulders / Deltoids */}
                <path
                  d="M 52 56 Q 44 64 42 80 Q 56 74 62 60 Z"
                  fill={getRegionFill('shoulders', false)}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 108 56 Q 116 64 118 80 Q 104 74 98 60 Z"
                  fill={getRegionFill('shoulders', false)}
                  className="transition-colors duration-300"
                />

                {/* Chest / Pectorals */}
                <path
                  d="M 60 58 Q 78 62 78 78 Q 60 84 54 74 Z"
                  fill={getRegionFill('chest', false)}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 100 58 Q 82 62 82 78 Q 100 84 106 74 Z"
                  fill={getRegionFill('chest', false)}
                  className="transition-colors duration-300"
                />

                {/* Biceps & Forearms */}
                <rect
                  x="38"
                  y="82"
                  width="10"
                  height="26"
                  rx="5"
                  fill={getRegionFill('biceps_triceps', false)}
                  className="transition-colors duration-300"
                />
                <rect
                  x="112"
                  y="82"
                  width="10"
                  height="26"
                  rx="5"
                  fill={getRegionFill('biceps_triceps', false)}
                  className="transition-colors duration-300"
                />
                <rect x="34" y="112" width="9" height="28" rx="4" fill="#475569" />
                <rect x="117" y="112" width="9" height="28" rx="4" fill="#475569" />

                {/* Core / Abdominals */}
                <rect
                  x="66"
                  y="82"
                  width="28"
                  height="44"
                  rx="6"
                  fill={getRegionFill('core', false)}
                  className="transition-colors duration-300"
                />
                {/* Abdominal 6-pack grid lines */}
                <line x1="80" y1="84" x2="80" y2="124" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="68" y1="96" x2="92" y2="96" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="68" y1="108" x2="92" y2="108" stroke="#1e293b" strokeWidth="1.5" />

                {/* Pelvis / Hips */}
                <path d="M 64 126 L 96 126 L 92 144 L 68 144 Z" fill="#334155" />

                {/* Quadriceps (Thighs) */}
                <path
                  d="M 64 146 Q 60 186 64 204 L 74 204 Q 78 178 76 146 Z"
                  fill={getRegionFill('quads_hamstrings', false)}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 96 146 Q 100 186 96 204 L 86 204 Q 82 178 84 146 Z"
                  fill={getRegionFill('quads_hamstrings', false)}
                  className="transition-colors duration-300"
                />

                {/* Knees */}
                <circle cx="69" cy="209" r="4.5" fill="#475569" />
                <circle cx="91" cy="209" r="4.5" fill="#475569" />

                {/* Calves & Shins */}
                <path
                  d="M 64 216 Q 60 240 65 264 L 72 264 Q 74 240 73 216 Z"
                  fill={getRegionFill('calves', false)}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 96 216 Q 100 240 95 264 L 88 264 Q 86 240 87 216 Z"
                  fill={getRegionFill('calves', false)}
                  className="transition-colors duration-300"
                />

                {/* Feet */}
                <ellipse cx="68" cy="269" rx="6" ry="3" fill="#334155" />
                <ellipse cx="92" cy="269" rx="6" ry="3" fill="#334155" />
              </g>
            ) : (
              /* BACK VIEW */
              <g id="back-muscles">
                {/* Upper Back / Traps & Shoulders */}
                <path
                  d="M 64 54 Q 80 62 96 54 L 108 68 Q 80 82 52 68 Z"
                  fill={getRegionFill('shoulders', true)}
                  className="transition-colors duration-300"
                />

                {/* Lats & Mid-Back */}
                <path
                  d="M 56 70 Q 80 84 104 70 L 98 116 Q 80 122 62 116 Z"
                  fill={getRegionFill('back', true)}
                  className="transition-colors duration-300"
                />
                <line x1="80" y1="56" x2="80" y2="124" stroke="#0f172a" strokeWidth="2" />

                {/* Triceps (Back of arms) */}
                <rect
                  x="38"
                  y="78"
                  width="10"
                  height="28"
                  rx="5"
                  fill={getRegionFill('biceps_triceps', true)}
                  className="transition-colors duration-300"
                />
                <rect
                  x="112"
                  y="78"
                  width="10"
                  height="28"
                  rx="5"
                  fill={getRegionFill('biceps_triceps', true)}
                  className="transition-colors duration-300"
                />
                <rect x="34" y="110" width="9" height="30" rx="4" fill="#475569" />
                <rect x="117" y="110" width="9" height="30" rx="4" fill="#475569" />

                {/* Gluteus Maximus (Glutes) */}
                <path
                  d="M 62 122 Q 62 152 79 152 Q 78 126 62 122 Z"
                  fill={getRegionFill('glutes', true)}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 98 122 Q 98 152 81 152 Q 82 126 98 122 Z"
                  fill={getRegionFill('glutes', true)}
                  className="transition-colors duration-300"
                />

                {/* Hamstrings (Back of Thighs) */}
                <path
                  d="M 63 154 Q 60 186 64 204 L 74 204 Q 78 180 77 154 Z"
                  fill={getRegionFill('quads_hamstrings', true)}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 97 154 Q 100 186 96 204 L 86 204 Q 82 180 83 154 Z"
                  fill={getRegionFill('quads_hamstrings', true)}
                  className="transition-colors duration-300"
                />

                {/* Calves (Gastrocnemius) */}
                <path
                  d="M 63 214 Q 58 238 65 264 L 72 264 Q 75 238 73 214 Z"
                  fill={getRegionFill('calves', true)}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 97 214 Q 102 238 95 264 L 88 264 Q 85 238 87 214 Z"
                  fill={getRegionFill('calves', true)}
                  className="transition-colors duration-300"
                />

                {/* Heels */}
                <ellipse cx="68" cy="269" rx="5" ry="3" fill="#334155" />
                <ellipse cx="92" cy="269" rx="5" ry="3" fill="#334155" />
              </g>
            )}
          </svg>

          {/* Color legend indicator */}
          <div className="flex items-center gap-3 mt-2 text-[10px]">
            <span className="flex items-center gap-1 font-semibold text-lime-400">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block" />
              Primary
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Secondary
            </span>
          </div>
        </div>

        {/* Anatomical Information Breakdown on Right */}
        <div className="sm:col-span-7 space-y-3">
          {/* Primary Muscles */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1">
              <span>Primary Targeted Muscles:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(exercise.primaryMuscles || exercise.targetMuscles.slice(0, 2)).map((m, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-lime-400/15 border border-lime-400/30 text-lime-300 text-xs font-bold"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Secondary Muscles */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <span>Secondary & Stabilizing Muscles:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(exercise.secondaryMuscles || exercise.targetMuscles.slice(2)).map((m, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-medium"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Anatomical Explanation */}
          {exercise.musclesExplanation && (
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-0.5">Biomechanical Activation:</span>
              {exercise.musclesExplanation}
            </div>
          )}

          {/* Scientific Note */}
          <div className="flex items-start gap-1.5 text-[10px] text-slate-400 italic">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>
              FitMood calisthenics activates coordinated muscle synergies across joint lines rather than isolated spots.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
