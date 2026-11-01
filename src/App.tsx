import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, testConnection } from './lib/firebase';
import { storageService } from './lib/storage';
import {
  UserProfile,
  WorkoutLog,
  MoodCheckIn,
  FoodLog,
  BodyMeasurement,
  Badge,
  DailyChallenge,
  WorkoutPlan,
  Exercise,
  BadgeToastItem
} from './types';
import { Header } from './components/Header';
import { Sidebar, NavPageId } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { WorkoutPlayerModal } from './components/WorkoutPlayerModal';
import { WarmupModal } from './components/WarmupModal';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { AiCoachDrawer } from './components/AiCoachDrawer';
import { VoiceCoachModal } from './components/VoiceCoachModal';
import { BadgeToast, triggerCelebrationAudio, fireBadgeConfetti } from './components/BadgeToast';
import { Bot } from 'lucide-react';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { AiWorkoutGeneratorPage } from './pages/AiWorkoutGeneratorPage';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { CoachPage } from './pages/CoachPage';
import { MoodCheckInPage } from './pages/MoodCheckInPage';
import { CalorieCalculatorPage } from './pages/CalorieCalculatorPage';
import { NutritionPlannerPage } from './pages/NutritionPlannerPage';
import { FoodLogPage } from './pages/FoodLogPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { getStoredTheme, applyTheme, AppThemeId, AppThemeMode } from './utils/themeManager';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPageId>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [moodCheckIns, setMoodCheckIns] = useState<MoodCheckIn[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);

  // Theme & Appearance UI state
  const initialTheme = getStoredTheme();
  const [currentTheme, setCurrentTheme] = useState<AppThemeId>(initialTheme.themeId);
  const [currentMode, setCurrentMode] = useState<AppThemeMode>(initialTheme.mode);
  const isDarkMode = currentMode === 'dark';
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAiCoach, setShowAiCoach] = useState<boolean>(false);
  const [showVoiceCoach, setShowVoiceCoach] = useState<boolean>(false);
  const [pendingWarmupPlan, setPendingWarmupPlan] = useState<WorkoutPlan | null>(null);
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [badgeToasts, setBadgeToasts] = useState<BadgeToastItem[]>([]);

  // Trigger celebratory toast notification for earned badge
  const triggerBadgeToast = (badge: Badge, bonusXp = 25) => {
    const toastId = `toast_${Date.now()}_${badge.id}`;
    const newToast: BadgeToastItem = {
      id: toastId,
      badge: { ...badge, isUnlocked: true },
      unlockedAt: new Date().toISOString(),
      bonusXp
    };

    setBadgeToasts((prev) => [...prev.filter((t) => t.badge.id !== badge.id), newToast]);
    triggerCelebrationAudio();
    fireBadgeConfetti();

    const uid = userProfile?.id || 'guest';
    setBadges((prev) => {
      const updated = prev.map((b) =>
        b.id === badge.id ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() } : b
      );
      storageService.saveBadges(uid, updated);
      return updated;
    });

    if (userProfile && bonusXp > 0) {
      storageService.addXP(bonusXp, userProfile).then(({ updatedProfile }) => {
        setUserProfile(updatedProfile);
      });
    }

    setTimeout(() => {
      setBadgeToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 6000);
  };

  const handleDismissBadgeToast = (id: string) => {
    setBadgeToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Apply active theme tokens immediately on mount and upon state changes
  useEffect(() => {
    applyTheme(currentTheme, currentMode);
  }, [currentTheme, currentMode]);

  const handleChangeTheme = (themeId: AppThemeId, mode?: AppThemeMode) => {
    const effectiveMode = mode || currentMode;
    setCurrentTheme(themeId);
    setCurrentMode(effectiveMode);
    applyTheme(themeId, effectiveMode);

    if (userProfile) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        theme: themeId,
        themeMode: effectiveMode,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      storageService.saveProfile(updatedProfile);
    }
  };

  const handleToggleThemeMode = () => {
    const nextMode: AppThemeMode = currentMode === 'dark' ? 'light' : 'dark';
    setCurrentMode(nextMode);
    applyTheme(currentTheme, nextMode);

    if (userProfile) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        theme: currentTheme,
        themeMode: nextMode,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      storageService.saveProfile(updatedProfile);
    }
  };

  // Boot: Test Firestore connection and load data
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const uid = currentUser?.uid || 'guest';
      try {
        const profile = await storageService.getProfile(currentUser?.uid);
        if (profile) {
          setUserProfile(profile);
          if (profile.theme) {
            setCurrentTheme(profile.theme);
            const m = profile.themeMode || currentMode;
            setCurrentMode(m);
            applyTheme(profile.theme, m);
          }
        } else {
          // If first-time user without profile, trigger onboarding
          setShowOnboarding(true);
        }

        const [wLogs, mLogs, fLogs, meas] = await Promise.all([
          storageService.getWorkoutLogs(uid),
          storageService.getMoodCheckIns(uid),
          storageService.getFoodLogs(uid),
          storageService.getMeasurements(uid)
        ]);

        setWorkoutLogs(wLogs);
        setMoodCheckIns(mLogs);
        setFoodLogs(fLogs);
        setMeasurements(meas);
        setBadges(storageService.getBadges(uid));
        setDailyChallenges(storageService.getDailyChallenges(uid));
      } catch (err) {
        console.error('Error loading initial app data:', err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save updated profile
  const handleSaveProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
    await storageService.saveProfile(profile);
  };

  // Workout finished
  const handleFinishWorkout = async (log: WorkoutLog, xpEarned: number) => {
    setActiveWorkoutPlan(null);
    await storageService.logWorkout(log);
    setWorkoutLogs((prev) => [log, ...prev]);

    // Add XP to profile
    if (userProfile) {
      const { updatedProfile } = await storageService.addXP(xpEarned, userProfile);
      setUserProfile(updatedProfile);
    }

    // Mark daily workout quest complete if not yet
    const uid = userProfile?.id || 'guest';
    const updatedQuests = dailyChallenges.map((c) => (c.id === 'dc-2' ? { ...c, isCompleted: true } : c));
    setDailyChallenges(updatedQuests);
    storageService.saveDailyChallenges(uid, updatedQuests);
  };

  // Mood check-in saved
  const handleSaveMoodCheckIn = async (checkIn: MoodCheckIn, recommendedPlan: WorkoutPlan | null) => {
    await storageService.saveMoodCheckIn(checkIn);
    setMoodCheckIns((prev) => [checkIn, ...prev.filter((i) => i.id !== checkIn.id)]);

    if (userProfile) {
      const { updatedProfile } = await storageService.addXP(25, userProfile);
      setUserProfile(updatedProfile);
    }

    // Mark daily mood quest complete
    const uid = userProfile?.id || 'guest';
    const updatedQuests = dailyChallenges.map((c) => (c.id === 'dc-1' ? { ...c, isCompleted: true } : c));
    setDailyChallenges(updatedQuests);
    storageService.saveDailyChallenges(uid, updatedQuests);
  };

  // Food log add & delete
  const handleAddFoodLog = async (food: FoodLog) => {
    await storageService.saveFoodLog(food);
    setFoodLogs((prev) => [food, ...prev]);

    if (userProfile) {
      const { updatedProfile } = await storageService.addXP(15, userProfile);
      setUserProfile(updatedProfile);
    }

    const uid = userProfile?.id || 'guest';
    const updatedQuests = dailyChallenges.map((c) => (c.id === 'dc-3' ? { ...c, isCompleted: true } : c));
    setDailyChallenges(updatedQuests);
    storageService.saveDailyChallenges(uid, updatedQuests);
  };

  const handleDeleteFoodLog = async (id: string) => {
    setFoodLogs((prev) => prev.filter((i) => i.id !== id));
    const uid = userProfile?.id || 'guest';
    const filtered = foodLogs.filter((i) => i.id !== id);
    localStorage.setItem(`fitmood_food_logs_${uid}`, JSON.stringify(filtered));
  };

  // Body measurement add
  const handleAddMeasurement = async (item: BodyMeasurement) => {
    await storageService.saveMeasurement(item);
    setMeasurements((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);

    if (userProfile) {
      const { updatedProfile } = await storageService.addXP(20, userProfile);
      setUserProfile(updatedProfile);
    }
  };

  // Toggle challenge
  const handleToggleChallenge = (challengeId: string) => {
    const uid = userProfile?.id || 'guest';
    const target = dailyChallenges.find((c) => c.id === challengeId);
    if (!target) return;

    const nextState = !target.isCompleted;
    const updated = dailyChallenges.map((c) => (c.id === challengeId ? { ...c, isCompleted: nextState } : c));
    setDailyChallenges(updated);
    storageService.saveDailyChallenges(uid, updated);

    if (nextState && userProfile) {
      storageService.addXP(target.xpReward, userProfile).then(({ updatedProfile }) => {
        setUserProfile(updatedProfile);
      });
    }
  };

  // Clear local data reset
  const handleClearLocalData = () => {
    const uid = userProfile?.id || 'guest';
    localStorage.removeItem(`fitmood_user_profile_${uid}`);
    localStorage.removeItem('fitmood_user_profile');
    localStorage.removeItem(`fitmood_mood_checkins_${uid}`);
    localStorage.removeItem(`fitmood_workout_logs_${uid}`);
    localStorage.removeItem(`fitmood_food_logs_${uid}`);
    localStorage.removeItem(`fitmood_measurements_${uid}`);
    setUserProfile(null);
    setWorkoutLogs([]);
    setMoodCheckIns([]);
    setFoodLogs([]);
    setMeasurements([]);
    setShowOnboarding(true);
    setCurrentPage('dashboard');
  };

  // Determine today's mood
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayMoodItem = moodCheckIns.find((m) => m.date === todayDateStr);
  const todayMood = todayMoodItem ? todayMoodItem.mood : null;

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)'
      }}
    >
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        userProfile={userProfile}
        onOpenAiCoachDrawer={() => setShowAiCoach(true)}
        onOpenVoiceCoach={() => setShowVoiceCoach(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          userProfile={userProfile}
          onOpenProfile={() => setCurrentPage('profile')}
          onOpenAiCoach={() => setShowAiCoach(true)}
          onOpenVoiceCoach={() => setShowVoiceCoach(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleThemeMode}
          onProfileUpdated={() => {
            const uid = auth.currentUser?.uid;
            if (uid) {
              storageService.getProfile(uid).then((p) => {
                if (p) setUserProfile(p);
              });
            }
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {currentPage === 'dashboard' && (
            <DashboardPage
              userProfile={userProfile}
              onNavigate={setCurrentPage}
              onStartWorkout={(plan) => setPendingWarmupPlan(plan)}
              workoutLogs={workoutLogs}
              todayMood={todayMood}
              dailyChallenges={dailyChallenges}
              onToggleChallenge={handleToggleChallenge}
              onOpenOnboarding={() => setShowOnboarding(true)}
              onOpenAiCoach={() => setShowAiCoach(true)}
              onOpenVoiceCoach={() => setShowVoiceCoach(true)}
              onUpdateProfile={(updated) => {
                const current = userProfile || {
                  id: auth.currentUser?.uid || 'guest',
                  name: 'FitMood Athlete',
                  email: auth.currentUser?.email || '',
                  xp: 0,
                  level: 1,
                  streakDays: 1,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                const merged: UserProfile = {
                  ...current,
                  ...updated,
                  updatedAt: new Date().toISOString()
                };
                handleSaveProfile(merged);
              }}
              onSaveMoodCheckIn={handleSaveMoodCheckIn}
            />
          )}

          {currentPage === 'workouts' && (
            <WorkoutsPage
              userProfile={userProfile}
              onStartWorkout={(plan) => setPendingWarmupPlan(plan)}
              onNavigateToGenerator={() => setCurrentPage('generator')}
              onNavigateToProfile={() => setCurrentPage('profile')}
            />
          )}

          {currentPage === 'generator' && (
            <AiWorkoutGeneratorPage
              userProfile={userProfile}
              onStartWorkout={(plan) => setPendingWarmupPlan(plan)}
              onNavigateToExercises={() => setCurrentPage('exercises')}
            />
          )}

          {currentPage === 'exercises' && (
            <ExerciseLibraryPage
              onSelectExercise={(exercise) => setSelectedExerciseForModal(exercise)}
            />
          )}

          {currentPage === 'coach' && (
            <CoachPage
              userProfile={userProfile}
            />
          )}

          {currentPage === 'mood' && (
            <MoodCheckInPage
              userProfile={userProfile}
              onSaveMoodCheckIn={handleSaveMoodCheckIn}
              onStartWorkout={(plan) => setPendingWarmupPlan(plan)}
            />
          )}

          {currentPage === 'calculator' && (
            <CalorieCalculatorPage
              userProfile={userProfile}
              onUpdateProfile={(updated) => {
                const current = userProfile || {
                  id: auth.currentUser?.uid || 'guest',
                  name: 'FitMood Athlete',
                  email: auth.currentUser?.email || '',
                  xp: 0,
                  level: 1,
                  streakDays: 1,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                const merged: UserProfile = {
                  ...current,
                  ...updated,
                  updatedAt: new Date().toISOString()
                };
                handleSaveProfile(merged);
              }}
            />
          )}

          {currentPage === 'nutrition' && (
            <NutritionPlannerPage
              onQuickLogFood={handleAddFoodLog}
              userDietaryPreference={userProfile?.dietaryPreference}
            />
          )}

          {currentPage === 'foodlog' && (
            <FoodLogPage
              userProfile={userProfile}
              foodLogs={foodLogs}
              onAddFoodLog={handleAddFoodLog}
              onDeleteFoodLog={handleDeleteFoodLog}
            />
          )}

          {currentPage === 'progress' && (
            <ProgressPage
              userProfile={userProfile}
              workoutLogs={workoutLogs}
              moodCheckIns={moodCheckIns}
              measurements={measurements}
              badges={badges}
              onAddMeasurement={handleAddMeasurement}
              onTriggerBadgeToast={triggerBadgeToast}
            />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              userProfile={userProfile}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              userProfile={userProfile}
              currentTheme={currentTheme}
              currentMode={currentMode}
              onChangeTheme={handleChangeTheme}
              onToggleMode={handleToggleThemeMode}
              onClearLocalData={handleClearLocalData}
              onProfileUpdated={() => {
                const uid = auth.currentUser?.uid;
                if (uid) {
                  storageService.getProfile(uid).then((p) => {
                    if (p) setUserProfile(p);
                  });
                }
              }}
            />
          )}
        </main>

        {/* Mobile Persistent Bottom Navigation */}
        <BottomNav
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          onOpenAiCoach={() => setShowAiCoach(true)}
          onOpenVoiceCoach={() => setShowVoiceCoach(true)}
        />
      </div>

      {/* Onboarding / Profile Setup Modal */}
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={handleSaveProfile}
          onClose={userProfile?.name ? () => setShowOnboarding(false) : undefined}
          existingProfile={userProfile}
        />
      )}

      {/* Pre-Workout Warm-Up Routine Modal */}
      {pendingWarmupPlan && (
        <WarmupModal
          plan={pendingWarmupPlan}
          isOpen={Boolean(pendingWarmupPlan)}
          onClose={() => setPendingWarmupPlan(null)}
          onFinishWarmup={async (routine, bonusXp) => {
            const planToStart = pendingWarmupPlan;
            setPendingWarmupPlan(null);
            if (userProfile) {
              const { updatedProfile } = await storageService.addXP(bonusXp, userProfile);
              setUserProfile(updatedProfile);
            }
            setActiveWorkoutPlan(planToStart);
          }}
          onSkipToWorkout={() => {
            const planToStart = pendingWarmupPlan;
            setPendingWarmupPlan(null);
            setActiveWorkoutPlan(planToStart);
          }}
        />
      )}

      {/* Active Workout Player Modal */}
      {activeWorkoutPlan && (
        <WorkoutPlayerModal
          plan={activeWorkoutPlan}
          userId={userProfile?.id || 'guest'}
          userProfile={userProfile}
          onClose={() => setActiveWorkoutPlan(null)}
          onFinishWorkout={handleFinishWorkout}
          onOpenAiCoach={() => setShowAiCoach(true)}
          onTriggerBadgeToast={triggerBadgeToast}
        />
      )}

      {/* Exercise Detail Modal */}
      {selectedExerciseForModal && (
        <ExerciseDetailModal
          exercise={selectedExerciseForModal}
          onClose={() => setSelectedExerciseForModal(null)}
        />
      )}

      {/* Slide-over FitMood AI Coach Chat Drawer */}
      <AiCoachDrawer
        isOpen={showAiCoach}
        onClose={() => setShowAiCoach(false)}
        userProfile={userProfile}
        onOpenVoiceCoach={() => setShowVoiceCoach(true)}
      />

      {/* Interactive Gemini Live Voice Conversation Coach Modal */}
      <VoiceCoachModal
        isOpen={showVoiceCoach}
        onClose={() => setShowVoiceCoach(false)}
        userProfile={userProfile}
      />

      {/* Celebratory Badge Unlock Toast Notification System */}
      <BadgeToast
        toasts={badgeToasts}
        onDismiss={handleDismissBadgeToast}
      />
    </div>
  );
}
