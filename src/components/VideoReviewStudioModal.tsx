// VideoReviewStudioModal Component
// Fitness Director & Coach Studio to audit exercise demonstrations, view Google Gemini
// video generation prompts (gemini-omni-1.1-flash), inspect camera framing, and update review statuses.

import React, { useState } from 'react';
import {
  EXERCISE_VIDEO_REGISTRY,
  ExerciseVideoEntry,
  VideoReviewStatus
} from '../data/exerciseVideoRegistry';
import { geminiVideoService, VideoGenerationResponse } from '../services/geminiVideoService';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Video,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Cpu,
  Eye,
  Camera,
  Check,
  RefreshCw,
  Terminal
} from 'lucide-react';

interface VideoReviewStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExerciseId?: string;
}

export const VideoReviewStudioModal: React.FC<VideoReviewStudioModalProps> = ({
  isOpen,
  onClose,
  initialExerciseId
}) => {
  const entries = Object.values(EXERCISE_VIDEO_REGISTRY);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    initialExerciseId || entries[0]?.exerciseId || 'standard-push-up'
  );
  const [filterCategory, setFilterCategory] = useState<'all' | 'warmup' | 'workout' | 'cooldown'>('all');
  const [generationResult, setGenerationResult] = useState<VideoGenerationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reviewerNotesInput, setReviewerNotesInput] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeEntry = EXERCISE_VIDEO_REGISTRY[selectedExerciseId] || entries[0];

  const filteredEntries = entries.filter((e) => {
    if (filterCategory === 'all') return true;
    return e.category === filterCategory;
  });

  const handleTriggerGeneration = async () => {
    setIsGenerating(true);
    setGenerationResult(null);
    try {
      const res = await geminiVideoService.requestVideoGeneration(activeEntry.exerciseId);
      setGenerationResult(res);
    } catch {
      setGenerationResult({
        success: false,
        status: 'failed',
        exerciseId: activeEntry.exerciseId,
        model: 'gemini-omni-1.1-flash',
        message: 'Could not connect to generation endpoint.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateStatus = async (status: VideoReviewStatus) => {
    const success = await geminiVideoService.updateReviewStatus(
      activeEntry.exerciseId,
      status,
      reviewerNotesInput || activeEntry.reviewerNotes || 'Approved by fitness director',
      'Coach Alex (Lead Exercise Scientist)'
    );
    if (success) {
      activeEntry.videoStatus = status;
      if (reviewerNotesInput) activeEntry.reviewerNotes = reviewerNotesInput;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[11px] font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-lime-400" />
                <span>Google Gemini Video Lab</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Model: gemini-omni-1.1-flash
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Exercise Demonstration & Review Studio
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage realistic human fitness videos, verify biomechanical alignment, and audit generation prompts.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            {(['all', 'warmup', 'workout', 'cooldown'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-lime-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Movements' : cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {filteredEntries.length} Core Movements
          </span>
        </div>

        {/* Master-Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: List of Exercises */}
          <div className="md:col-span-5 space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {filteredEntries.map((item) => {
              const isSelected = item.exerciseId === selectedExerciseId;
              return (
                <button
                  key={item.exerciseId}
                  type="button"
                  onClick={() => {
                    setSelectedExerciseId(item.exerciseId);
                    setGenerationResult(null);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-lime-400/15 border-lime-400/50 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-black text-xs text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                      {item.category} • {item.difficulty}
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      item.videoStatus === 'verified'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : item.videoStatus === 'in_review'
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {item.videoStatus === 'verified'
                      ? '✓ Verified'
                      : item.videoStatus === 'in_review'
                      ? '⏳ In Review'
                      : 'Pending'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Exercise Details & Gemini Generation Console */}
          <div className="md:col-span-7 space-y-4 bg-slate-950 border border-slate-800 rounded-3xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-lime-400 tracking-wider">
                  Exercise Details
                </span>
                <h4 className="text-base font-black text-white">{activeEntry.name}</h4>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                  {activeEntry.durationSeconds}s • {activeEntry.aspectRatio}
                </span>
              </div>
            </div>

            {/* Video Framing Rule Badge */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
              <Camera className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Framing Standard: Head-to-Toe Wide View</strong>
                <span className="text-[11px] text-slate-400">
                  Fixed tripod wide-angle framing ensuring hands, feet, head, and full range of motion remain fully visible throughout all repetitions.
                </span>
              </div>
            </div>

            {/* Biomechanical Sequence Checkpoints */}
            <div className="space-y-1.5 text-xs bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400">Starting Position & Form Cues:</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{activeEntry.startingPosition}</p>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-2">Breathing Cues:</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{activeEntry.breathingGuidance}</p>
            </div>

            {/* Google Gemini Video Generation Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  <span>Google Gemini Prompt (gemini-omni-1.1-flash):</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/90 text-slate-300 font-mono text-[11px] leading-relaxed">
                "{activeEntry.geminiPrompt}"
              </div>
            </div>

            {/* Generation & Review Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerGeneration}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl btn-primary text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Contacting API...' : 'Test Gemini Video API'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('verified')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Verified</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus('in_review')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mark In Review</span>
                </button>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Status successfully updated for {activeEntry.name}!</span>
              </div>
            )}

            {/* Generation Response Console */}
            {generationResult && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-lime-400" />
                    <span>Gemini API Output:</span>
                  </span>
                  <span className="text-[10px] font-mono text-lime-400">
                    Status: {generationResult.status}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{generationResult.message}</p>
                {generationResult.instructions && (
                  <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 whitespace-pre-wrap font-mono">
                    {generationResult.instructions}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
