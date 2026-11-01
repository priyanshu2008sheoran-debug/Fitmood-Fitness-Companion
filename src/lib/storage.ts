import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import {
  UserProfile,
  MoodCheckIn,
  WorkoutLog,
  FoodLog,
  BodyMeasurement,
  Badge,
  DailyChallenge,
  LeaderboardEntry,
  ChatMessage,
  HabitItem
} from '../types';
import { ALL_BADGES, INITIAL_DAILY_CHALLENGES, calculateLevelFromXP, getPlantStage } from '../data/badgesData';
import { DEFAULT_PRESET_HABITS } from '../data/habitsData';
import confetti from 'canvas-confetti';

const LOCAL_PROFILE_KEY = 'fitmood_user_profile';
const LOCAL_MOOD_KEY = 'fitmood_mood_checkins';
const LOCAL_WORKOUTS_KEY = 'fitmood_workout_logs';
const LOCAL_FOODS_KEY = 'fitmood_food_logs';
const LOCAL_MEASUREMENTS_KEY = 'fitmood_measurements';
const LOCAL_BADGES_KEY = 'fitmood_badges';
const LOCAL_CHALLENGES_KEY = 'fitmood_challenges';
const LOCAL_CHAT_KEY = 'fitmood_chat_messages';
const LOCAL_HABITS_KEY = 'fitmood_habits';
const LOCAL_HABIT_LOGS_KEY = 'fitmood_habit_logs';
const LOCAL_WATER_KEY = 'fitmood_water_intake';

export const storageService = {
  // --- Profile Management ---
  async getProfile(userId?: string): Promise<UserProfile | null> {
    const currentUid = userId || auth.currentUser?.uid;

    if (currentUid && auth.currentUser) {
      try {
        const userRef = doc(db, 'users', currentUid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const profile = snapshot.data() as UserProfile;
          localStorage.setItem(`${LOCAL_PROFILE_KEY}_${currentUid}`, JSON.stringify(profile));
          return profile;
        }
      } catch (error) {
        console.warn('Firestore fetch failed, checking local cache:', error);
      }
    }

    // Fallback to local storage
    const cached = localStorage.getItem(currentUid ? `${LOCAL_PROFILE_KEY}_${currentUid}` : LOCAL_PROFILE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    const currentUid = auth.currentUser?.uid || profile.id;
    const sanitizedProfile: UserProfile = {
      ...profile,
      id: currentUid,
      updatedAt: new Date().toISOString()
    };

    // Save to local storage cache immediately
    localStorage.setItem(currentUid ? `${LOCAL_PROFILE_KEY}_${currentUid}` : LOCAL_PROFILE_KEY, JSON.stringify(sanitizedProfile));

    // Save to Firestore if authenticated
    if (auth.currentUser && auth.currentUser.uid === currentUid) {
      const path = `users/${currentUid}`;
      try {
        await setDoc(doc(db, 'users', currentUid), sanitizedProfile);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  // --- XP & Level Up ---
  async addXP(amount: number, currentProfile: UserProfile): Promise<{ updatedProfile: UserProfile; leveledUp: boolean }> {
    const oldLevel = currentProfile.level;
    const newXP = (currentProfile.xp || 0) + amount;
    const { level: newLevel } = calculateLevelFromXP(newXP);
    const leveledUp = newLevel > oldLevel;

    const updatedProfile: UserProfile = {
      ...currentProfile,
      xp: newXP,
      level: newLevel,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };

    await this.saveProfile(updatedProfile);
    this.syncUserToLeaderboard(updatedProfile).catch(() => {});

    // Trigger celebratory confetti on big milestones or workouts
    try {
      confetti({
        particleCount: leveledUp ? 120 : 60,
        spread: leveledUp ? 100 : 70,
        origin: { y: 0.7 }
      });
    } catch {
      // Confetti fallback
    }

    return { updatedProfile, leveledUp };
  },

  // --- Mood Check-ins ---
  async getMoodCheckIns(userId: string): Promise<MoodCheckIn[]> {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const q = query(collection(db, 'users', userId, 'mood_checkins'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const list: MoodCheckIn[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as MoodCheckIn);
        });
        localStorage.setItem(`${LOCAL_MOOD_KEY}_${userId}`, JSON.stringify(list));
        return list;
      } catch (error) {
        console.warn('Error fetching mood checkins from Firestore:', error);
      }
    }

    const local = localStorage.getItem(`${LOCAL_MOOD_KEY}_${userId}`);
    return local ? JSON.parse(local) : [];
  },

  async saveMoodCheckIn(checkIn: MoodCheckIn): Promise<void> {
    const userId = checkIn.userId;
    // Update local cache
    const existing = await this.getMoodCheckIns(userId);
    const updated = [checkIn, ...existing.filter(i => i.id !== checkIn.id)];
    localStorage.setItem(`${LOCAL_MOOD_KEY}_${userId}`, JSON.stringify(updated));

    if (auth.currentUser && auth.currentUser.uid === userId) {
      const path = `users/${userId}/mood_checkins/${checkIn.id}`;
      try {
        await setDoc(doc(db, 'users', userId, 'mood_checkins', checkIn.id), checkIn);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  // --- Workout Logs ---
  async getWorkoutLogs(userId: string): Promise<WorkoutLog[]> {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const q = query(collection(db, 'users', userId, 'workout_logs'), orderBy('completedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const list: WorkoutLog[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as WorkoutLog);
        });
        localStorage.setItem(`${LOCAL_WORKOUTS_KEY}_${userId}`, JSON.stringify(list));
        return list;
      } catch (error) {
        console.warn('Error fetching workout logs from Firestore:', error);
      }
    }

    const local = localStorage.getItem(`${LOCAL_WORKOUTS_KEY}_${userId}`);
    return local ? JSON.parse(local) : [];
  },

  async logWorkout(log: WorkoutLog): Promise<void> {
    const userId = log.userId;
    const existing = await this.getWorkoutLogs(userId);
    const updated = [log, ...existing];
    localStorage.setItem(`${LOCAL_WORKOUTS_KEY}_${userId}`, JSON.stringify(updated));

    if (auth.currentUser && auth.currentUser.uid === userId) {
      const path = `users/${userId}/workout_logs/${log.id}`;
      try {
        await setDoc(doc(db, 'users', userId, 'workout_logs', log.id), log);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  // --- Food Logs ---
  async getFoodLogs(userId: string): Promise<FoodLog[]> {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const q = query(collection(db, 'users', userId, 'food_logs'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const list: FoodLog[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as FoodLog);
        });
        localStorage.setItem(`${LOCAL_FOODS_KEY}_${userId}`, JSON.stringify(list));
        return list;
      } catch (error) {
        console.warn('Error fetching food logs from Firestore:', error);
      }
    }

    const local = localStorage.getItem(`${LOCAL_FOODS_KEY}_${userId}`);
    return local ? JSON.parse(local) : [];
  },

  async saveFoodLog(food: FoodLog): Promise<void> {
    const userId = food.userId;
    const existing = await this.getFoodLogs(userId);
    const updated = [food, ...existing];
    localStorage.setItem(`${LOCAL_FOODS_KEY}_${userId}`, JSON.stringify(updated));

    if (auth.currentUser && auth.currentUser.uid === userId) {
      const path = `users/${userId}/food_logs/${food.id}`;
      try {
        await setDoc(doc(db, 'users', userId, 'food_logs', food.id), food);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  // --- Body Measurements ---
  async getMeasurements(userId: string): Promise<BodyMeasurement[]> {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const q = query(collection(db, 'users', userId, 'measurements'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const list: BodyMeasurement[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as BodyMeasurement);
        });
        localStorage.setItem(`${LOCAL_MEASUREMENTS_KEY}_${userId}`, JSON.stringify(list));
        return list;
      } catch (error) {
        console.warn('Error fetching measurements from Firestore:', error);
      }
    }

    const local = localStorage.getItem(`${LOCAL_MEASUREMENTS_KEY}_${userId}`);
    return local ? JSON.parse(local) : [];
  },

  async saveMeasurement(item: BodyMeasurement): Promise<void> {
    const userId = item.userId;
    const existing = await this.getMeasurements(userId);
    const updated = [item, ...existing.filter(i => i.id !== item.id)];
    localStorage.setItem(`${LOCAL_MEASUREMENTS_KEY}_${userId}`, JSON.stringify(updated));

    if (auth.currentUser && auth.currentUser.uid === userId) {
      const path = `users/${userId}/measurements/${item.id}`;
      try {
        await setDoc(doc(db, 'users', userId, 'measurements', item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  // --- Badges & Challenges ---
  getBadges(userId: string): Badge[] {
    const key = `${LOCAL_BADGES_KEY}_${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      return ALL_BADGES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return ALL_BADGES;
    }
  },

  saveBadges(userId: string, badges: Badge[]): void {
    localStorage.setItem(`${LOCAL_BADGES_KEY}_${userId}`, JSON.stringify(badges));
  },

  getDailyChallenges(userId: string): DailyChallenge[] {
    const key = `${LOCAL_CHALLENGES_KEY}_${userId}_${new Date().toISOString().split('T')[0]}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      return INITIAL_DAILY_CHALLENGES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DAILY_CHALLENGES;
    }
  },

  saveDailyChallenges(userId: string, challenges: DailyChallenge[]): void {
    const key = `${LOCAL_CHALLENGES_KEY}_${userId}_${new Date().toISOString().split('T')[0]}`;
    localStorage.setItem(key, JSON.stringify(challenges));
  },

  // --- Water Intake Logging ---
  async getWaterIntake(userId: string, dateStr?: string): Promise<number> {
    const dateKey = dateStr || new Date().toISOString().split('T')[0];
    const key = `${LOCAL_WATER_KEY}_${userId}_${dateKey}`;

    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const docRef = doc(db, 'users', userId, 'water_logs', dateKey);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          const count = typeof data?.glasses === 'number' ? data.glasses : 0;
          localStorage.setItem(key, String(count));
          return count;
        }
      } catch (err) {
        console.warn('Error fetching water intake from cloud, fallback to local:', err);
      }
    }

    const local = localStorage.getItem(key);
    return local ? parseInt(local, 10) || 0 : 0;
  },

  async saveWaterIntake(userId: string, glasses: number, dateStr?: string): Promise<number> {
    const dateKey = dateStr || new Date().toISOString().split('T')[0];
    const key = `${LOCAL_WATER_KEY}_${userId}_${dateKey}`;
    const sanitized = Math.max(0, Math.floor(glasses));
    localStorage.setItem(key, String(sanitized));

    if (auth.currentUser && auth.currentUser.uid === userId) {
      const path = `users/${userId}/water_logs/${dateKey}`;
      try {
        await setDoc(doc(db, 'users', userId, 'water_logs', dateKey), {
          userId,
          date: dateKey,
          glasses: sanitized,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }

    return sanitized;
  },

  async incrementWaterIntake(userId: string, delta = 1, dateStr?: string): Promise<number> {
    const current = await this.getWaterIntake(userId, dateStr);
    const updated = Math.max(0, current + delta);
    return await this.saveWaterIntake(userId, updated, dateStr);
  },

  // --- Social Leaderboard ---
  // --- Social Leaderboard (Real Registered Users Only) ---
  async syncUserToLeaderboard(profile: UserProfile): Promise<void> {
    const currentUid = auth.currentUser?.uid || profile.id;
    if (!currentUid) return;

    const { stageName, emoji } = getPlantStage(profile.xp || 0);

    // Fetch user's workout count to compute verified score
    let workoutCount = 0;
    try {
      const logs = await this.getWorkoutLogs(currentUid);
      workoutCount = logs.length;
    } catch {
      workoutCount = 0;
    }

    const entry: LeaderboardEntry = {
      id: currentUid,
      userId: currentUid,
      name: profile.name && profile.name.trim() ? profile.name : 'FitMood Athlete',
      xp: profile.xp || 0,
      level: profile.level || 1,
      streakDays: profile.streakDays || 1,
      plantStageEmoji: emoji,
      plantStageName: stageName,
      lastActive: new Date().toISOString()
    };

    localStorage.setItem(`fitmood_my_leaderboard_entry_${currentUid}`, JSON.stringify(entry));

    // Keep an index of local registered profiles
    try {
      const existing = localStorage.getItem('fitmood_real_registered_athletes');
      const list: LeaderboardEntry[] = existing ? JSON.parse(existing) : [];
      const updatedList = [entry, ...list.filter((e) => e.userId !== currentUid)];
      localStorage.setItem('fitmood_real_registered_athletes', JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    if (auth.currentUser && auth.currentUser.uid === currentUid) {
      try {
        await setDoc(doc(db, 'leaderboard', currentUid), entry);
      } catch (err) {
        console.warn('Leaderboard cloud sync fallback:', err);
      }
    }
  },

  async getLeaderboard(currentUserProfile?: UserProfile | null): Promise<LeaderboardEntry[]> {
    const realUsersMap = new Map<string, LeaderboardEntry>();

    // 1. Fetch real registered users from Firestore leaderboard collection
    try {
      const q = query(collection(db, 'leaderboard'), orderBy('xp', 'desc'));
      const snapshot = await getDocs(q);
      snapshot.forEach((d) => {
        const item = d.data() as LeaderboardEntry;
        if (item && item.userId) {
          realUsersMap.set(item.userId, item);
        }
      });
    } catch {
      // Offline fallback
    }

    // 2. Fetch locally registered accounts (useful for multi-account testing & offline mode)
    try {
      const rawLocal = localStorage.getItem('fitmood_real_registered_athletes');
      if (rawLocal) {
        const localList: LeaderboardEntry[] = JSON.parse(rawLocal);
        localList.forEach((item) => {
          if (item && item.userId && !realUsersMap.has(item.userId)) {
            realUsersMap.set(item.userId, item);
          }
        });
      }
    } catch {
      // ignore
    }

    // 3. Current active user's verified stats
    if (currentUserProfile && currentUserProfile.id) {
      const { stageName, emoji } = getPlantStage(currentUserProfile.xp || 0);
      const userEntry: LeaderboardEntry = {
        id: currentUserProfile.id,
        userId: currentUserProfile.id,
        name: currentUserProfile.name || 'You',
        xp: currentUserProfile.xp || 0,
        level: currentUserProfile.level || 1,
        streakDays: currentUserProfile.streakDays || 1,
        plantStageEmoji: emoji,
        plantStageName: stageName,
        lastActive: 'Just now',
        isCurrentUser: true
      };
      realUsersMap.set(currentUserProfile.id, userEntry);
    }

    // 4. Sort strictly by fair verified score: XP descending, then streakDays, then level
    const sorted = Array.from(realUsersMap.values()).sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
      return (b.level || 1) - (a.level || 1);
    });

    // 5. Assign rankings with consistent tie handling
    let currentRank = 1;
    return sorted.map((entry, index) => {
      if (index > 0) {
        const prev = sorted[index - 1];
        if (entry.xp !== prev.xp || entry.streakDays !== prev.streakDays) {
          currentRank = index + 1;
        }
      }
      return {
        ...entry,
        rank: currentRank,
        isCurrentUser: currentUserProfile ? entry.userId === currentUserProfile.id : false
      };
    });
  },

  // --- AI Coach Chat Messages ---
  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const q = query(collection(db, 'users', userId, 'chat_messages'), orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(q);
        const list: ChatMessage[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as ChatMessage);
        });
        if (list.length > 0) {
          localStorage.setItem(`${LOCAL_CHAT_KEY}_${userId}`, JSON.stringify(list));
          return list;
        }
      } catch (err) {
        console.warn('Error reading chat messages from cloud:', err);
      }
    }

    const local = localStorage.getItem(`${LOCAL_CHAT_KEY}_${userId}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return [];
      }
    }
    return [];
  },

  async saveChatMessage(userId: string, message: ChatMessage): Promise<void> {
    const existing = await this.getChatMessages(userId);
    const updated = [...existing, message];
    localStorage.setItem(`${LOCAL_CHAT_KEY}_${userId}`, JSON.stringify(updated));

    if (auth.currentUser && auth.currentUser.uid === userId) {
      const path = `users/${userId}/chat_messages/${message.id}`;
      try {
        await setDoc(doc(db, 'users', userId, 'chat_messages', message.id), {
          ...message,
          userId,
          createdAt: message.createdAt || new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }
  },

  async clearChatMessages(userId: string): Promise<void> {
    localStorage.removeItem(`${LOCAL_CHAT_KEY}_${userId}`);
    // If authenticated, we clear local and leave cloud or remove
  }
};
