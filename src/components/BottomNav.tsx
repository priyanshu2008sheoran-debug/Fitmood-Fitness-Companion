import React, { useState } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Smile,
  Utensils,
  Menu,
  X,
  BookOpen,
  Calculator,
  BookHeart,
  TrendingUp,
  User,
  Settings,
  Bot,
  Mic
} from 'lucide-react';
import { NavPageId } from './Sidebar';

interface BottomNavProps {
  currentPage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
  onOpenAiCoach?: () => void;
  onOpenVoiceCoach?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  onSelectPage,
  onOpenAiCoach,
  onOpenVoiceCoach
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const primaryItems: { id: NavPageId; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'mood', label: 'Mood', icon: Smile },
    { id: 'nutrition', label: 'Meals', icon: Utensils }
  ];

  const secondaryItems: { id: NavPageId; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
    { id: 'generator', label: 'AI Workout Generator', icon: Dumbbell },
    { id: 'coach', label: 'FitMood AI Coach', icon: Bot },
    { id: 'coach', label: 'Coach Milo Live Voice', icon: Mic },
    { id: 'exercises', label: 'Calisthenics Library', icon: BookOpen },
    { id: 'calculator', label: 'Calorie Calculator', icon: Calculator },
    { id: 'foodlog', label: 'Daily Food Log', icon: BookHeart },
    { id: 'progress', label: 'Progress & Badges', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings & Themes', icon: Settings }
  ];

  const handleSelect = (id: NavPageId, label?: string) => {
    if (label === 'Coach Milo Live Voice' && onOpenVoiceCoach) {
      onOpenVoiceCoach();
      setShowMoreMenu(false);
      return;
    }
    if (id === 'coach' && onOpenAiCoach) {
      onOpenAiCoach();
      setShowMoreMenu(false);
      return;
    }
    onSelectPage(id);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Slide-up "More" sheet on mobile */}
      {showMoreMenu && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="border-t rounded-t-3xl p-5 pb-24 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--app-card)',
              borderColor: 'var(--app-card-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between border-b pb-3"
              style={{ borderColor: 'var(--app-card-border-subtle)' }}
            >
              <h3
                className="font-black text-base"
                style={{ color: 'var(--app-text-primary)' }}
              >
                More Features
              </h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-full border cursor-pointer"
                style={{
                  backgroundColor: 'var(--app-card-muted)',
                  borderColor: 'var(--app-card-border)',
                  color: 'var(--app-text-muted)'
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.id, item.label)}
                    style={
                      isActive
                        ? {
                            backgroundColor: 'var(--app-primary)',
                            color: 'var(--app-primary-foreground)'
                          }
                        : {
                            backgroundColor: 'var(--app-card-muted)',
                            color: 'var(--app-text-secondary)',
                            borderColor: 'var(--app-card-border-subtle)'
                          }
                    }
                    className="flex items-center gap-2.5 p-3 rounded-2xl text-left text-xs font-semibold border transition-all cursor-pointer"
                  >
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: isActive ? 'var(--app-primary-foreground)' : 'var(--app-primary)' }}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md border-t px-2 py-2"
        style={{
          backgroundColor: 'var(--app-header-bg)',
          borderColor: 'var(--app-card-border)'
        }}
      >
        <div className="flex items-center justify-around">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer"
                style={{
                  color: isActive ? 'var(--app-primary)' : 'var(--app-nav-inactive-text)'
                }}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] scale-105' : ''}`} />
                <span className={`text-[10px] mt-0.5 ${isActive ? 'font-black' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer"
            style={{
              color: secondaryItems.some((s) => s.id === currentPage)
                ? 'var(--app-primary)'
                : 'var(--app-nav-inactive-text)'
            }}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
