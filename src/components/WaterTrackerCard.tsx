import React, { useState, useEffect } from 'react';
import { Droplet, Plus, Minus, RotateCcw, Check, Sparkles, Award } from 'lucide-react';
import { storageService } from '../lib/storage';
import confetti from 'canvas-confetti';

interface WaterTrackerCardProps {
  userId?: string;
  onWaterLogged?: (glasses: number) => void;
  className?: string;
}

const TARGET_GLASSES = 8;
const ML_PER_GLASS = 250;

export const WaterTrackerCard: React.FC<WaterTrackerCardProps> = ({
  userId = 'guest',
  onWaterLogged,
  className = ''
}) => {
  const [glasses, setGlasses] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [justLogged, setJustLogged] = useState<boolean>(false);
  const [goalCelebrated, setGoalCelebrated] = useState<boolean>(false);

  // Load today's water intake from storage
  useEffect(() => {
    let isMounted = true;
    const loadWater = async () => {
      try {
        setIsLoading(true);
        const count = await storageService.getWaterIntake(userId);
        if (isMounted) {
          setGlasses(count);
          if (count >= TARGET_GLASSES) {
            setGoalCelebrated(true);
          }
        }
      } catch (err) {
        console.warn('Error loading water intake:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWater();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleUpdate = async (newCount: number) => {
    const sanitized = Math.max(0, Math.floor(newCount));
    setGlasses(sanitized);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 1200);

    // Fire celebration confetti if crossing target for the first time today
    if (sanitized >= TARGET_GLASSES && !goalCelebrated) {
      setGoalCelebrated(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0284c7', '#38bdf8', '#06b6d4', '#a3e635']
        });
      } catch {
        // Confetti fallback
      }
    }

    try {
      await storageService.saveWaterIntake(userId, sanitized);
      if (onWaterLogged) {
        onWaterLogged(sanitized);
      }
    } catch (err) {
      console.warn('Error saving water intake:', err);
    }
  };

  const handleIncrement = (amount = 1) => {
    handleUpdate(glasses + amount);
  };

  const handleDecrement = () => {
    if (glasses > 0) {
      handleUpdate(glasses - 1);
    }
  };

  const handleReset = () => {
    if (confirm("Reset today's water log to 0?")) {
      setGoalCelebrated(false);
      handleUpdate(0);
    }
  };

  const percent = Math.min(100, Math.round((glasses / TARGET_GLASSES) * 100));
  const currentMl = glasses * ML_PER_GLASS;
  const targetMl = TARGET_GLASSES * ML_PER_GLASS;

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 border shadow-xl transition-all ${className}`}
      style={{
        backgroundColor: 'var(--surface, var(--app-card))',
        borderColor: 'var(--border, var(--app-card-border))'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-500 flex items-center justify-center shrink-0">
            <Droplet className={`w-4 h-4 fill-sky-500 transition-transform ${justLogged ? 'scale-125' : ''}`} />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary, var(--app-text-primary))' }}>
              Daily Hydration
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-muted, var(--app-text-muted))' }}>
              Drink water to maintain stamina & muscle recovery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full border shadow-xs"
            style={{
              backgroundColor: glasses >= TARGET_GLASSES ? 'rgba(34, 197, 94, 0.15)' : 'rgba(2, 132, 199, 0.15)',
              borderColor: glasses >= TARGET_GLASSES ? 'rgba(34, 197, 94, 0.35)' : 'rgba(2, 132, 199, 0.35)',
              color: glasses >= TARGET_GLASSES ? 'var(--success, #16a34a)' : '#0284c7'
            }}
          >
            {glasses} / {TARGET_GLASSES} cups
          </span>
          {glasses > 0 && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset today's water counter"
              aria-label="Reset water counter"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Metric & Visual Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-extrabold text-base font-mono" style={{ color: 'var(--text-primary, var(--app-text-primary))' }}>
            {currentMl.toLocaleString()} <span className="text-xs font-normal opacity-75">/ {targetMl.toLocaleString()} ml</span>
          </span>
          <span className="font-bold text-xs" style={{ color: glasses >= TARGET_GLASSES ? 'var(--success, #16a34a)' : '#0284c7' }}>
            {percent}% completed
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full h-2.5 rounded-full overflow-hidden border"
          style={{
            backgroundColor: 'var(--app-card-muted, rgba(15, 23, 42, 0.1))',
            borderColor: 'var(--border, var(--app-card-border-subtle))'
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Interactive 8 Glasses Visual Representation */}
      <div className="grid grid-cols-8 gap-1.5 mb-4">
        {Array.from({ length: TARGET_GLASSES }, (_, i) => {
          const isFilled = i < glasses;
          const glassNumber = i + 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleUpdate(isFilled && glasses === glassNumber ? glassNumber - 1 : glassNumber)}
              title={`Cup ${glassNumber} (${glassNumber * ML_PER_GLASS}ml)`}
              aria-label={`Set water to ${glassNumber} cups`}
              className={`flex flex-col items-center justify-center p-1.5 py-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                isFilled
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-500 shadow-xs'
                  : 'border-dashed opacity-60 hover:opacity-100'
              }`}
              style={{
                borderColor: isFilled ? '#0284c7' : 'var(--border, var(--app-card-border))',
                backgroundColor: isFilled ? 'rgba(2, 132, 199, 0.18)' : 'transparent',
                color: isFilled ? '#0284c7' : 'var(--text-muted, var(--app-text-muted))'
              }}
            >
              <Droplet className={`w-3.5 h-3.5 ${isFilled ? 'fill-sky-500 text-sky-500' : 'text-slate-400'}`} />
              <span className="text-[9px] font-mono mt-0.5">{glassNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Motivational message or celebration banner */}
      {glasses >= TARGET_GLASSES ? (
        <div
          className="p-2.5 rounded-2xl mb-4 flex items-center gap-2 text-xs border"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            color: 'var(--success, #15803d)'
          }}
        >
          <Award className="w-4 h-4 shrink-0 text-emerald-500" />
          <span className="font-bold">
            Daily 2.0L hydration goal achieved! Keep your hydration rhythm going!
          </span>
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: 'var(--border, var(--app-card-border-subtle))' }}>
        <button
          type="button"
          onClick={() => handleIncrement(1)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl btn-primary text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+1 Glass (250ml)</span>
        </button>

        <button
          type="button"
          onClick={() => handleIncrement(2)}
          className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-2xl btn-secondary text-xs font-bold border transition-all active:scale-95 cursor-pointer"
          title="Log 500ml water bottle"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>+500ml Bottle</span>
        </button>

        <button
          type="button"
          onClick={handleDecrement}
          disabled={glasses <= 0}
          aria-label="Remove 1 glass"
          title="Remove 1 glass"
          className="p-2.5 rounded-2xl border transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--app-card-muted)',
            borderColor: 'var(--border, var(--app-card-border))',
            color: 'var(--text-secondary, var(--app-text-secondary))'
          }}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
