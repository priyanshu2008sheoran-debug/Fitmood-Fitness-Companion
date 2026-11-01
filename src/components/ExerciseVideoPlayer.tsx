// ExerciseVideoPlayer Component
// Displays verified exercise demonstrations, supports direct HTML5 video and responsive embeds,
// with true Fullscreen API integration, 0.5x/1x/1.5x speeds, full playback controls,
// and guaranteed head-to-toe visibility (object-fit: contain) across mobile landscape and desktop.

import React, { useState, useRef, useEffect } from 'react';
import { Exercise } from '../types';
import { getExerciseVideoEntry, ExerciseVideoEntry } from '../data/exerciseVideoRegistry';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Video,
  RefreshCw,
  Eye,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Flame,
  Award
} from 'lucide-react';

interface ExerciseVideoPlayerProps {
  exercise: Exercise;
  compact?: boolean;
  className?: string;
  currentSet?: number;
  totalSets?: number;
  repsOrTarget?: string;
  workoutPhase?: 'warmup' | 'workout' | 'cooldown';
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onOpenReviewStudio?: (entry: ExerciseVideoEntry) => void;
}

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/|watch\?v=|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export const ExerciseVideoPlayer: React.FC<ExerciseVideoPlayerProps> = ({
  exercise,
  compact = false,
  className = '',
  currentSet = 1,
  totalSets = 3,
  repsOrTarget,
  workoutPhase,
  onFullscreenChange,
  onOpenReviewStudio
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [useSecondaryVideo, setUseSecondaryVideo] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'video' | 'visual_guide'>('video');
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5x, 1x, 1.5x
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Retrieve registry metadata for this exercise
  const registryEntry = getExerciseVideoEntry(exercise.id);

  // Reset states when exercise changes
  useEffect(() => {
    setIsPlaying(true);
    setHasError(false);
    setUseSecondaryVideo(false);
    setViewMode('video');
    setReloadKey((prev) => prev + 1);
  }, [exercise.id]);

  // Synchronize playback speed with HTML5 video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync fullscreen state with native browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFs = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement
      );
      if (!isCurrentlyFs && isFullscreen) {
        setIsFullscreen(false);
        onFullscreenChange?.(false);
        setFullscreenError(null);
      } else if (isCurrentlyFs && !isFullscreen) {
        setIsFullscreen(true);
        onFullscreenChange?.(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    const handlePopState = () => {
      if (isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isFullscreen, onFullscreenChange]);

  // Determine active video URL and ID
  const activeUrl = useSecondaryVideo
    ? (registryEntry?.secondaryVideoUrl || exercise.secondaryVideoUrl || exercise.videoUrl)
    : (registryEntry?.videoUrl || exercise.videoUrl);

  const activeSource = useSecondaryVideo
    ? (exercise.secondaryVideoSource || 'Verified Calisthenics Channel')
    : (registryEntry?.videoSource || exercise.videoSource || 'FitMood Verified Academy');

  const ytId = extractYouTubeId(activeUrl) || exercise.youtubeId || null;
  const isEmbed = Boolean(ytId) || exercise.videoType === 'embed' || (!exercise.videoType && activeUrl?.includes('youtube'));

  // Build clean YouTube embed URL
  const computedEmbedUrl = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`
    : activeUrl;

  // Direct Watch on YouTube link
  const directWatchUrl = ytId
    ? `https://www.youtube.com/watch?v=${ytId}`
    : exercise.fallbackUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' proper form demonstration calisthenics')}`;

  const handleTogglePlay = () => {
    if (!isEmbed && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else if (iframeRef.current) {
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = () => {
    if (!isEmbed && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      setReloadKey((k) => k + 1);
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!isEmbed && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else if (iframeRef.current) {
      const command = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  // True Browser Fullscreen API implementation
  const enterFullscreen = async () => {
    setFullscreenError(null);
    const container = containerRef.current;
    if (!container) return;

    try {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        await (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        await (container as any).mozRequestFullScreen();
      }
    } catch (err) {
      console.warn('Browser prevented native fullscreen:', err);
      setFullscreenError(
        'Browser permissions or iframe restrictions prevented native fullscreen. Activated full-viewport player.'
      );
    }

    setIsFullscreen(true);
    onFullscreenChange?.(true);
    try {
      window.history.pushState({ isFsVideoPlayer: true }, '');
    } catch {
      // ignore
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Error exiting fullscreen:', err);
    } finally {
      setIsFullscreen(false);
      onFullscreenChange?.(false);
      setFullscreenError(null);
    }
  };

  const handleSwitchAlternateVideo = () => {
    setUseSecondaryVideo(!useSecondaryVideo);
    setHasError(false);
    setReloadKey((k) => k + 1);
  };

  const displayCategory = workoutPhase || registryEntry?.category || (exercise.category === 'mobility' ? 'warmup' : 'workout');

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group flex flex-col transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-[100dvh] rounded-none border-0 m-0 p-0 flex flex-col justify-between overflow-hidden'
          : className
      }`}
    >
      {/* Fullscreen Blocked Notice Banner */}
      {fullscreenError && (
        <div className="absolute top-12 left-4 right-4 z-50 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{fullscreenError}</span>
          </div>
          <button
            type="button"
            onClick={() => setFullscreenError(null)}
            className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Bar: Title, Phase Pill, Set/Rep Counter, and TOP-RIGHT FULLSCREEN BUTTON (⛶) */}
      <div
        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-900/95 border-b border-slate-800 text-xs shrink-0 z-20 ${
          isFullscreen ? 'px-6 py-3.5 bg-slate-900/95' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Phase Pill: Warm-Up, Workout, or Cooldown */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              displayCategory === 'warmup'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : displayCategory === 'cooldown'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                : 'bg-lime-400/15 text-lime-400 border border-lime-400/30'
            }`}
          >
            {displayCategory === 'warmup' ? '🔥 Warm-Up' : displayCategory === 'cooldown' ? '🧘 Cool-Down' : '⚡ Workout'}
          </span>

          <span className="font-extrabold text-white text-xs truncate max-w-[140px] sm:max-w-xs">
            {exercise.name}
          </span>

          {/* Set & Rep Counter */}
          <span className="text-[11px] text-slate-300 font-semibold hidden md:inline">
            Set {currentSet} of {totalSets} • {repsOrTarget || exercise.defaultRepsOrSeconds}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Visual Blueprint Switcher */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'video' ? 'visual_guide' : 'video')}
            title={viewMode === 'video' ? 'Switch to Step-by-Step Blueprint' : 'Return to Video Demo'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
          >
            {viewMode === 'video' ? <Eye className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5 text-lime-400" />}
          </button>

          {/* Alternate Angle Switcher */}
          {(exercise.secondaryVideoUrl || registryEntry?.secondaryVideoUrl) && (
            <button
              type="button"
              onClick={handleSwitchAlternateVideo}
              title="Switch video demonstration angle"
              className={`p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer ${
                useSecondaryVideo ? 'text-lime-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* TOP-RIGHT FULLSCREEN BUTTON (⛶) */}
          <button
            type="button"
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand to Fullscreen (⛶)'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-md shadow-lime-400/20'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750 hover:text-white'
            }`}
          >
            {isFullscreen ? (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <Minimize2 className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </span>
            ) : (
              <Maximize2 className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Main Video Viewport (Responsive & Fully Framed: Head-to-Toe Guaranteed with object-fit: contain) */}
      <div
        className={`relative w-full bg-black overflow-hidden flex items-center justify-center ${
          isFullscreen
            ? 'flex-1 min-h-0 w-full p-2 sm:p-4'
            : compact
            ? 'aspect-video max-h-56'
            : 'aspect-video min-h-[220px] max-h-[380px]'
        }`}
      >
        {viewMode === 'visual_guide' ? (
          /* Visual Posture & Movement Execution Blueprint */
          <div className="absolute inset-0 bg-slate-950 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between text-slate-100">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-[11px] font-bold text-lime-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                  <span>Coach Form Blueprint</span>
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('video')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-lime-400 font-bold transition-colors cursor-pointer"
                >
                  Return to Video
                </button>
              </div>

              <h4 className="text-base sm:text-lg font-black text-white">{exercise.name} Technique</h4>
              <p className="text-xs text-slate-400 mt-0.5">Target: {exercise.targetMuscles.join(', ')}</p>

              {/* Starting Position Cue */}
              {registryEntry?.startingPosition && (
                <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-sky-400">Starting Alignment:</div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{registryEntry.startingPosition}</p>
                </div>
              )}

              {/* Step-by-Step Execution Sequence */}
              <div className="space-y-2 mt-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Movement Sequence:</div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {(registryEntry?.movementSequence || exercise.instructions).map((inst, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
                <div className="mt-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs">
                  <div className="text-[10px] uppercase font-bold text-rose-300">Common Mistakes to Avoid:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 mt-1">
                    {exercise.commonMistakes.slice(0, 2).map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition-colors shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch on YouTube</span>
              </a>
              <span className="text-[11px] text-slate-400">Rest: {exercise.restIntervalSeconds}s</span>
            </div>
          </div>
        ) : !activeUrl || hasError ? (
          /* Error Fallback: pristine movement blueprint rather than broken video */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">{exercise.name} Demonstration</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Video clip undergoing fitness coach review or restricted by browser settings. You can view the full movement blueprint or open the direct stream.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setViewMode('visual_guide')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-lime-400 border border-slate-700 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Movement Blueprint</span>
              </button>

              <a
                href={directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 hover:bg-lime-300 transition-colors"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : isEmbed ? (
          /* Embed Player with contain object-fit */
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src={computedEmbedUrl}
            title={`${exercise.name} form demonstration video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setHasError(true)}
            className="w-full h-full border-0 absolute inset-0 object-contain"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          /* Direct HTML5 Video Player with head-to-toe contain */
          <video
            ref={videoRef}
            key={reloadKey}
            src={activeUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={() => {
              if (videoRef.current && videoRef.current.duration) {
                setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
              }
            }}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain max-h-full"
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>

      {/* Bottom Controls Bar: Play/Pause, Restart, Speed (0.5x, 1x, 1.5x), Mute, Progress, Instructions */}
      {viewMode === 'video' && !hasError && (
        <div
          className={`px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 z-20 shrink-0 ${
            isFullscreen ? 'px-6 py-3.5' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-sm shadow-lime-400/25"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Restart */}
            <button
              type="button"
              onClick={handleReplay}
              title="Restart demonstration from beginning"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed Selector (0.5x, 1x, 1.5x) */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px]">
              {[0.5, 1.0, 1.5].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  title={spd === 0.5 ? 'Slow-motion breakdown (0.5x)' : spd === 1.5 ? 'Brisk cadence (1.5x)' : 'Normal speed (1x)'}
                  className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-lime-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Mute / Volume */}
            <button
              type="button"
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-lime-400" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Smooth Progress Bar */}
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span className="hidden sm:inline font-mono">Progress:</span>
              <div className="w-20 sm:w-28 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/60">
                <div
                  className="bg-lime-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(videoProgress || 45)}%` }}
                />
              </div>
            </div>

            {/* Instructions Accordion Button */}
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-lime-400" />
              <span>Guide</span>
              {showInstructions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      )}

      {/* Instructions Accordion */}
      {showInstructions && (
        <div
          className={`p-4 bg-slate-900 border-t border-slate-800 text-xs space-y-2 animate-in slide-in-from-top-2 duration-200 ${
            isFullscreen
              ? 'absolute bottom-16 left-3 right-3 sm:left-6 sm:right-6 max-h-[50vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl z-30 bg-slate-900/98 backdrop-blur-md'
              : 'overflow-y-auto'
          }`}
        >
          <div className="text-white font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Coach Milo Execution Pointers</span>
            </div>
            {registryEntry && (
              <span className="text-[10px] text-lime-400 font-mono bg-lime-400/10 px-2 py-0.5 rounded-md">
                Verified: {registryEntry.approvedBy || 'FitMood Exercise Science'}
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-slate-300">
            {exercise.instructions.slice(0, 3).map((inst, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
