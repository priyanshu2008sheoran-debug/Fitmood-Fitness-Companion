import React, { useState } from 'react';
import { Flame, Sparkles, Moon, Sun, LogIn, LogOut, User as UserIcon, Bot, Mic } from 'lucide-react';
import { UserProfile } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

interface HeaderProps {
  userProfile: UserProfile | null;
  onOpenProfile: () => void;
  onOpenAiCoach?: () => void;
  onOpenVoiceCoach?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onProfileUpdated?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenProfile,
  onOpenAiCoach,
  onOpenVoiceCoach,
  isDarkMode,
  onToggleTheme,
  onProfileUpdated
}) => {
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err: any) {
      console.error('Sign-in error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const greeting = userProfile?.name
    ? `Hey ${userProfile.name}, let's get stronger today!`
    : "Hey, let's get stronger today!";

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-6 py-3 transition-colors shadow-xs"
      style={{
        backgroundColor: 'var(--app-header-bg)',
        borderColor: 'var(--app-card-border)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Title or Desktop Greeting */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg shadow-sm"
              style={{
                backgroundColor: 'var(--app-primary)',
                color: 'var(--app-primary-foreground)'
              }}
            >
              ⚡
            </span>
            <span
              className="font-extrabold text-lg tracking-tight"
              style={{ color: 'var(--app-text-primary)' }}
            >
              FitMood
            </span>
          </div>

          <div className="hidden md:block">
            <h1
              className="text-base lg:text-lg font-bold flex items-center gap-2"
              style={{ color: 'var(--app-text-primary)' }}
            >
              <span>{greeting}</span>
              <span className="inline-block animate-bounce text-sm">💪</span>
            </h1>
            <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
              No gym. No expensive equipment. Just your body & consistency.
            </p>
          </div>
        </div>

        {/* Right: Badges, Theme Switcher, and Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{userProfile?.streakDays || 0}d</span>
          </div>

          {/* Level / XP pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-xs"
            style={{
              backgroundColor: 'var(--app-accent-subtle)',
              color: 'var(--app-accent-text)',
              borderColor: 'var(--app-card-border-subtle)'
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--app-accent)' }} />
            <span>Lv. {userProfile?.level || 1}</span>
            <span className="text-[10px] opacity-80 hidden sm:inline">
              ({userProfile?.xp || 0} XP)
            </span>
          </div>

          {/* Voice Coach Button */}
          {onOpenVoiceCoach && (
            <button
              onClick={onOpenVoiceCoach}
              aria-label="Open Live Voice Coach"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-102 cursor-pointer btn-primary shadow-xs"
              title="Start Live Voice Conversation with Coach Milo"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Voice Coach</span>
            </button>
          )}

          {/* AI Coach Button */}
          {onOpenAiCoach && (
            <button
              onClick={onOpenAiCoach}
              aria-label="Open AI Coach"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all hover:scale-102 cursor-pointer"
              style={{
                backgroundColor: 'var(--app-card-muted)',
                borderColor: 'var(--app-card-border)',
                color: 'var(--app-primary)'
              }}
              title="Chat with FitMood AI Coach"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Coach</span>
            </button>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle light and dark mode"
            className="p-2 rounded-xl border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--app-card-muted)',
              borderColor: 'var(--app-card-border)',
              color: 'var(--app-text-primary)'
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-orange-500 dark:text-indigo-400" />
            )}
          </button>

          {/* Auth Button */}
          {auth.currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--app-card-muted)',
                  borderColor: 'var(--app-card-border)',
                  color: 'var(--app-text-primary)'
                }}
                title="View Profile"
              >
                {auth.currentUser.photoURL ? (
                  <img
                    src={auth.currentUser.photoURL}
                    alt="User"
                    className="w-6 h-6 rounded-full border"
                    style={{ borderColor: 'var(--app-primary)' }}
                  />
                ) : (
                  <span
                    className="w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: 'var(--app-primary)',
                      color: 'var(--app-primary-foreground)'
                    }}
                  >
                    {(userProfile?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden sm:inline font-semibold">
                  {userProfile?.name || auth.currentUser.displayName || 'Profile'}
                </span>
              </button>
              <button
                onClick={handleSignOut}
                aria-label="Sign Out"
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-transform hover:scale-102 shadow-xs cursor-pointer"
              style={{
                backgroundColor: 'var(--app-primary)',
                color: 'var(--app-primary-foreground)'
              }}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{authLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
