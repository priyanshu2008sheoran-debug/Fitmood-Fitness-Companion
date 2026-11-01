import React, { useState } from 'react';
import { Exercise } from '../types';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import { AiCartoonCoach } from './AiCartoonCoach';
import { MuscleMapDiagram } from './MuscleMapDiagram';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  Video,
  ChevronDown,
  ChevronUp,
  Activity,
  Sparkles
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'cartoon' | 'video' | 'anatomy'>('cartoon');
  const [showDemo, setShowDemo] = useState<boolean>(true);
  const [isDemoFullscreen, setIsDemoFullscreen] = useState<boolean>(false);

  if (!exercise) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all ${
        isDemoFullscreen
          ? 'p-0 m-0 overflow-hidden bg-slate-950'
          : 'p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto'
      }`}
    >
      <div
        className={`relative w-full bg-slate-900 border border-slate-800 text-slate-100 transition-all ${
          isDemoFullscreen
            ? 'w-screen h-[100dvh] max-w-none max-h-none rounded-none border-0 m-0 p-0 overflow-hidden flex flex-col'
            : 'max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto my-4 space-y-5'
        }`}
      >
        {!isDemoFullscreen && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        {!isDemoFullscreen && (
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold uppercase">
                {exercise.category} Calisthenics
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium capitalize">
                {exercise.difficulty}
              </span>
              {exercise.isPullUpOrNeedsBar && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  Requires Bar
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{exercise.name}</h2>
          </div>
        )}

        {/* Demonstration Section with Mode Toggle */}
        <div className={`space-y-2.5 ${isDemoFullscreen ? 'w-full h-full flex-1 min-h-0 flex flex-col !space-y-0' : ''}`}>
          {!isDemoFullscreen && (
            <div className="flex items-center justify-between">
              {/* Demonstration mode pills */}
              <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('cartoon');
                    setShowDemo(true);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'cartoon'
                      ? 'bg-lime-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⚡ 3D Coach Milo</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('video');
                    setShowDemo(true);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl font-bold transition-all ${
                    activeTab === 'video'
                      ? 'bg-lime-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Demo</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('anatomy');
                    setShowDemo(true);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl font-bold transition-all ${
                    activeTab === 'anatomy'
                      ? 'bg-lime-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Muscles Map</span>
                </button>
              </div>

              <button
                onClick={() => setShowDemo(!showDemo)}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
              >
                <span>{showDemo ? 'Hide' : 'Show'}</span>
                {showDemo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {showDemo && (
            <div className={isDemoFullscreen ? 'w-full h-full flex-1 min-h-0 flex flex-col' : 'mt-1'}>
              {activeTab === 'cartoon' && (
                <AiCartoonCoach
                  exercise={exercise}
                  totalSets={exercise.defaultSets}
                  repsOrTarget={exercise.defaultRepsOrSeconds}
                  onFullscreenChange={setIsDemoFullscreen}
                  className={isDemoFullscreen ? 'w-full h-full flex-1' : ''}
                />
              )}
              {activeTab === 'video' && (
                <ExerciseVideoPlayer
                  exercise={exercise}
                  totalSets={exercise.defaultSets}
                  repsOrTarget={exercise.defaultRepsOrSeconds}
                  onFullscreenChange={setIsDemoFullscreen}
                  className={isDemoFullscreen ? 'w-full h-full flex-1' : ''}
                />
              )}
              {activeTab === 'anatomy' && <MuscleMapDiagram exercise={exercise} />}
            </div>
          )}
        </div>

        {/* Quick parameters pill & detailed exercise instructions */}
        {!isDemoFullscreen && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Sets & Reps</div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {exercise.defaultSets} sets × {exercise.defaultRepsOrSeconds}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Rest Period</div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {exercise.restIntervalSeconds} seconds
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Equipment</div>
                <div className="text-xs font-bold text-white mt-0.5 capitalize">
                  {exercise.equipmentNeeded === 'none' ? 'Zero (Bodyweight)' : exercise.equipmentNeeded}
                </div>
              </div>
            </div>

            {/* Dedicated "Muscles Worked" Section with Anatomical Map */}
            {activeTab !== 'anatomy' && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Muscles Worked</span>
                </h4>
                <MuscleMapDiagram exercise={exercise} />
              </div>
            )}

            {/* Step-by-step instructions */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-300 mb-2">Step-by-Step Instructions:</h4>
              <ol className="space-y-2 list-decimal list-inside text-xs sm:text-sm text-slate-300 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                {exercise.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Common Mistakes */}
            <div>
              <h4 className="text-xs font-bold uppercase text-rose-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Mistakes to Avoid:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>

            {/* Safety Tips */}
            {exercise.safetyTips.length > 0 && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold block">Safety Guideline:</span>
                  <span>{exercise.safetyTips[0]}</span>
                </div>
              </div>
            )}

            {/* Regressions & Progressions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-bold text-lime-400 uppercase">Easier Alternative</span>
                <p className="text-xs text-slate-300 mt-1">{exercise.easierAlternative}</p>
              </div>
              {exercise.harderProgression && (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Harder Progression</span>
                  <p className="text-xs text-slate-300 mt-1">{exercise.harderProgression}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
