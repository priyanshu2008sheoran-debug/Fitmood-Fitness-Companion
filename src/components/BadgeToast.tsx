import React, { useEffect, useState } from 'react';
import { Badge, BadgeToastItem } from '../types';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  Sparkles,
  Footprints,
  Dumbbell,
  HeartHandshake,
  UtensilsCrossed,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BadgeToastProps {
  toasts: BadgeToastItem[];
  onDismiss: (id: string) => void;
}

export const BadgeToast: React.FC<BadgeToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return Footprints;
      case 'Dumbbell':
        return Dumbbell;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Flame':
        return Flame;
      case 'UtensilsCrossed':
        return UtensilsCrossed;
      case 'Sparkles':
        return Sparkles;
      case 'Trophy':
        return Trophy;
      case 'CheckCircle2':
        return CheckCircle2;
      default:
        return Award;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        const Icon = getBadgeIcon(toast.badge.iconName);
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border-2 border-lime-400 text-slate-100 rounded-2xl p-4 shadow-2xl shadow-lime-400/20 animate-in slide-in-from-top-4 fade-in duration-300 relative overflow-hidden flex items-start gap-3.5"
          >
            {/* Top gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-amber-300 animate-pulse" />

            {/* Badge Icon avatar with glow */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-lime-400/30">
              <Icon className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Toast Content */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase text-lime-400">
                <Sparkles className="w-3 h-3 text-lime-400" />
                <span>Achievement Unlocked!</span>
              </div>
              <h4 className="text-sm font-black text-white truncate mt-0.5">
                {toast.badge.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                {toast.badge.description}
              </p>

              {toast.bonusXp && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/30 text-[10px] font-black text-lime-300">
                  <span>+{toast.bonusXp} XP Awarded</span>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Audio & Confetti trigger utility
export function triggerCelebrationAudio() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0.08, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur);
    };

    // Upbeat pleasant major triad chime
    playTone(523.25, 0, 0.15); // C5
    playTone(659.25, 0.1, 0.2); // E5
    playTone(783.99, 0.2, 0.35); // G5
    playTone(1046.5, 0.3, 0.5); // C6
  } catch {
    // Audio context may be restricted before user gesture
  }
}

export function fireBadgeConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.3, x: 0.85 }
    });
  } catch {
    // ignore
  }
}
