import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, UserProfile } from '../types';
import { storageService } from '../lib/storage';
import {
  Trophy,
  Flame,
  Sparkles,
  RefreshCw,
  Medal,
  Award,
  Crown,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface SocialLeaderboardProps {
  userProfile: UserProfile | null;
  className?: string;
  onOpenWorkouts?: () => void;
}

export const SocialLeaderboard: React.FC<SocialLeaderboardProps> = ({
  userProfile,
  className = '',
  onOpenWorkouts
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filterMode, setFilterMode] = useState<'xp' | 'streak'>('xp');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchLeaderboard = async () => {
    try {
      setIsRefreshing(true);
      const data = await storageService.getLeaderboard(userProfile);
      setEntries(data);
    } catch (err) {
      console.warn('Failed to fetch leaderboard:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [userProfile?.xp, userProfile?.level, userProfile?.streakDays]);

  // Sort based on selected tab
  const displayedEntries = [...entries].sort((a, b) => {
    if (filterMode === 'streak') {
      return b.streakDays - a.streakDays;
    }
    return b.xp - a.xp;
  }).map((item, idx) => ({ ...item, displayRank: idx + 1 }));

  // Find user's current rank
  const currentUserEntry = displayedEntries.find(
    (e) => e.userId === userProfile?.id || e.isCurrentUser
  );
  const userRank = currentUserEntry?.displayRank || (displayedEntries.length + 1);

  // Top 3 entries
  const topThree = displayedEntries.slice(0, 3);
  const restEntries = displayedEntries.slice(3, 8);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-amber-500/30">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-slate-300/30">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 text-white font-black flex items-center justify-center text-xs shadow-md shadow-amber-700/30">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-xl ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-lime-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-base sm:text-lg">
                Community Leaderboard
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/30 text-[10px] font-extrabold uppercase">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Friendly competition among home calisthenics athletes.
            </p>
          </div>
        </div>

        {/* Filter Switcher & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilterMode('xp')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterMode === 'xp' ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              XP Rank
            </button>
            <button
              onClick={() => setFilterMode('streak')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                filterMode === 'streak' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 fill-current" />
              <span>Streak</span>
            </button>
          </div>

          <button
            onClick={fetchLeaderboard}
            disabled={isRefreshing}
            aria-label="Refresh Leaderboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-lime-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* User's Current Standing Banner */}
      {userProfile && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-lime-500/15 via-slate-950/80 to-slate-950 border border-lime-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm shadow-lime-400/30">
              #{userRank}
            </div>
            <div>
              <div className="font-extrabold text-white flex items-center gap-1.5">
                <span>Your Standing: #{userRank} in FitMood</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-400/20 text-lime-400 font-bold">
                  You
                </span>
              </div>
              <div className="text-slate-300 text-[11px] mt-0.5">
                {userRank === 1
                  ? '🎉 You are leading the community! Keep up the momentum!'
                  : userRank <= 3
                  ? 'Podium position! Great habit consistency this week.'
                  : 'Complete today’s workout to earn +100 XP and climb higher!'}
              </div>
            </div>
          </div>

          {onOpenWorkouts && (
            <button
              onClick={onOpenWorkouts}
              className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-transform hover:scale-102 self-start sm:self-auto shrink-0 shadow-xs"
            >
              Climb Ranks →
            </button>
          )}
        </div>
      )}

      {/* Honest Empty State if no real users registered yet */}
      {displayedEntries.length === 0 ? (
        <div className="py-10 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/80 p-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto text-xl">
            🏆
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">No Community Athletes Recorded Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the inaugural athlete! Complete a workout session or log your daily activities to claim Rank #1 on the verified community leaderboard.
            </p>
          </div>
          {onOpenWorkouts && (
            <button
              onClick={onOpenWorkouts}
              className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-transform hover:scale-102"
            >
              Start First Workout
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {topThree.map((athlete) => {
              const isUser = athlete.isCurrentUser || athlete.userId === userProfile?.id;
              const isFirst = athlete.displayRank === 1;

              return (
                <div
                  key={athlete.id}
                  className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isFirst
                      ? 'bg-gradient-to-b from-amber-500/15 via-slate-950/90 to-slate-950 border-amber-400/40 shadow-lg shadow-amber-500/5'
                      : isUser
                      ? 'bg-lime-400/10 border-lime-400/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  {isFirst && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Crown className="w-3 h-3 fill-slate-950" />
                      <span>Rank 1</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getRankBadge(athlete.displayRank || 1)}
                    <span className="text-xl" role="img" aria-label="Habit Plant">
                      {athlete.plantStageEmoji}
                    </span>
                  </div>

                  <div>
                    <div className="font-black text-white text-sm truncate flex items-center gap-1">
                      <span>{athlete.name}</span>
                      {isUser && (
                        <span className="text-[10px] text-lime-400 font-bold bg-lime-400/15 px-1.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Lv. {athlete.level}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        {athlete.streakDays}d streak
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                    <span className="text-sm font-black text-lime-400 font-mono">
                      {athlete.xp} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Ranks 4 to 8 List View */}
      {restEntries.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Top Runners-Up:
          </div>
          <div className="space-y-1.5">
            {restEntries.map((athlete) => {
              const isUser = athlete.isCurrentUser || athlete.userId === userProfile?.id;

              return (
                <div
                  key={athlete.id}
                  className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                    isUser
                      ? 'bg-lime-400/10 border-lime-400/40 text-white font-bold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-400 w-5 text-center">
                      #{athlete.displayRank}
                    </span>
                    <span className="text-lg">{athlete.plantStageEmoji}</span>
                    <div>
                      <div className="font-extrabold text-white flex items-center gap-1.5">
                        <span>{athlete.name}</span>
                        {isUser && (
                          <span className="text-[10px] text-lime-400 bg-lime-400/20 px-1.5 rounded font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Level {athlete.level} Athlete
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="flex items-center gap-1 text-amber-400 text-[11px] font-semibold hidden sm:flex">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{athlete.streakDays}d</span>
                    </div>

                    <div className="font-mono font-black text-lime-400 text-sm">
                      {athlete.xp} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
