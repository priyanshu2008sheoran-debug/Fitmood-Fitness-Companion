import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  Smile,
  Calculator,
  Utensils,
  BookHeart,
  TrendingUp,
  User,
  Settings,
  Sparkles,
  Bot,
  Mic
} from 'lucide-react';
import { calculateLevelFromXP, getPlantStage } from '../data/badgesData';
import { UserProfile } from '../types';

export type NavPageId =
  | 'dashboard'
  | 'workouts'
  | 'generator'
  | 'exercises'
  | 'coach'
  | 'mood'
  | 'calculator'
  | 'nutrition'
  | 'foodlog'
  | 'progress'
  | 'profile'
  | 'settings';

interface SidebarProps {
  currentPage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
  userProfile: UserProfile | null;
  onOpenAiCoachDrawer?: () => void;
  onOpenVoiceCoach?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  userProfile,
  onOpenAiCoachDrawer,
  onOpenVoiceCoach
}) => {
  const navItems: { id: NavPageId; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'My Workouts', icon: Dumbbell },
    { id: 'generator', label: 'AI Workout Generator', icon: Sparkles },
    { id: 'exercises', label: 'Calisthenics Library', icon: BookOpen },
    { id: 'coach', label: 'FitMood AI Coach', icon: Bot },
    { id: 'mood', label: 'Mood Check-in', icon: Smile },
    { id: 'calculator', label: 'Calorie Calculator', icon: Calculator },
    { id: 'nutrition', label: 'Indian Meals', icon: Utensils },
    { id: 'foodlog', label: 'Daily Food Log', icon: BookHeart },
    { id: 'progress', label: 'Progress & Badges', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings & Themes', icon: Settings }
  ];

  const xp = userProfile?.xp || 0;
  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevelFromXP(xp);
  const plant = getPlantStage(xp);

  return (
    <aside
      className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 border-r transition-colors shadow-xs"
      style={{
        backgroundColor: 'var(--app-sidebar-bg)',
        borderColor: 'var(--app-sidebar-border)'
      }}
    >
      {/* Brand & Tagline */}
      <div
        className="p-5 border-b"
        style={{ borderColor: 'var(--app-card-border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-md"
            style={{
              backgroundColor: 'var(--app-primary)',
              color: 'var(--app-primary-foreground)'
            }}
          >
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="font-extrabold text-xl tracking-tight"
                style={{ color: 'var(--app-text-primary)' }}
              >
                FitMood
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                style={{
                  backgroundColor: 'var(--app-accent-subtle)',
                  color: 'var(--app-accent-text)'
                }}
              >
                PRO
              </span>
            </div>
            <p className="text-[11px] leading-tight mt-0.5 line-clamp-1" style={{ color: 'var(--app-text-muted)' }}>
              Build body. Boost mood.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'coach' && onOpenAiCoachDrawer) {
                  onOpenAiCoachDrawer();
                }
                onSelectPage(item.id);
              }}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--app-primary)',
                      color: 'var(--app-primary-foreground)'
                    }
                  : {
                      color: 'var(--app-nav-inactive-text)'
                    }
              }
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'font-bold shadow-sm scale-[1.02]'
                  : 'hover:opacity-90'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'stroke-[2.5]' : ''
                }`}
                style={{ color: isActive ? 'var(--app-primary-foreground)' : 'inherit' }}
              />
              <span className="truncate">{item.label}</span>
              {item.id === 'mood' && !userProfile?.lastActiveDate && (
                <span
                  className="ml-auto w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: 'var(--app-accent)' }}
                />
              )}
            </button>
          );
        })}

        {onOpenVoiceCoach && (
          <button
            onClick={onOpenVoiceCoach}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer btn-primary shadow-sm mt-2"
          >
            <Mic className="w-4 h-4 animate-pulse shrink-0" />
            <span className="truncate">Coach Milo Live Voice</span>
          </button>
        )}
      </nav>

      {/* Gamification Plant & XP Card */}
      <div
        className="p-4 border-t"
        style={{
          borderColor: 'var(--app-card-border-subtle)',
          backgroundColor: 'var(--app-bg-subtle)'
        }}
      >
        <div
          className="border rounded-2xl p-3.5 shadow-xs"
          style={{
            backgroundColor: 'var(--app-card)',
            borderColor: 'var(--app-card-border)'
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Virtual habit plant">
                {plant.emoji}
              </span>
              <div>
                <div
                  className="text-xs font-bold"
                  style={{ color: 'var(--app-text-primary)' }}
                >
                  {plant.stageName}
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: 'var(--app-text-muted)' }}
                >
                  Level {level} Habit
                </div>
              </div>
            </div>
            <span
              className="text-xs font-black px-2 py-0.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--app-accent-subtle)',
                color: 'var(--app-accent-text)',
                borderColor: 'var(--app-card-border-subtle)'
              }}
            >
              {xp} XP
            </span>
          </div>

          {/* XP Progress Bar */}
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--app-card-muted)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'var(--app-primary)'
              }}
            />
          </div>
          <div
            className="flex justify-between items-center text-[10px] mt-1.5"
            style={{ color: 'var(--app-text-muted)' }}
          >
            <span>{currentLevelXp} / {nextLevelXp} XP</span>
            <span style={{ color: 'var(--app-primary)' }} className="font-bold">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
