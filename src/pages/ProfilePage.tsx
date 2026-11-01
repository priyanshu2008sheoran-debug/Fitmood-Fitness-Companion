import React, { useState } from 'react';
import {
  UserProfile,
  Gender,
  FitnessGoal,
  ExperienceLevel,
  EquipmentOption,
  DietaryPreference,
  ActivityLevel
} from '../types';
import { User, Check, Sparkles, Shield, AlertCircle, Dumbbell, Flame } from 'lucide-react';
import { EQUIPMENT_OPTIONS_LIST } from '../utils/equipmentFilter';
import { HabitsTracker } from '../components/HabitsTracker';

interface ProfilePageProps {
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  onSaveProfile
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'habits'>('profile');
  const [name, setName] = useState(userProfile?.name || '');
  const [gender, setGender] = useState<Gender>(userProfile?.gender || 'male');
  const [age, setAge] = useState<string>(userProfile?.age ? String(userProfile.age) : '');
  const [heightCm, setHeightCm] = useState<string>(userProfile?.heightCm ? String(userProfile.heightCm) : '');
  const [weightKg, setWeightKg] = useState<string>(userProfile?.weightKg ? String(userProfile.weightKg) : '');

  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(userProfile?.fitnessGoal || 'general_fitness');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(userProfile?.experienceLevel || 'beginner');
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentOption[]>(() => {
    if (userProfile?.availableEquipment && userProfile.availableEquipment.length > 0) {
      return userProfile.availableEquipment;
    }
    if (userProfile?.equipment) {
      return [userProfile.equipment as EquipmentOption];
    }
    return ['none'];
  });
  const [workoutDuration, setWorkoutDuration] = useState<number>(userProfile?.workoutDurationMinutes || 20);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(userProfile?.dietaryPreference || 'vegetarian');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(userProfile?.activityLevel || 'moderate');
  const [allergies, setAllergies] = useState(userProfile?.allergies || '');
  const [limitations, setLimitations] = useState(userProfile?.limitations || '');
  const [isMedicalOrPregnant, setIsMedicalOrPregnant] = useState(
    userProfile?.isPregnantOrMedicallyRestricted || false
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successNotice, setSuccessNotice] = useState(false);

  const handleToggleEquipment = (eqId: EquipmentOption) => {
    setAvailableEquipment((prev) => {
      if (eqId === 'none') {
        return ['none'];
      }
      const exists = prev.includes(eqId);
      let updated: EquipmentOption[];
      if (exists) {
        updated = prev.filter((id) => id !== eqId);
        if (updated.length === 0) updated = ['none'];
      } else {
        updated = [...prev.filter((id) => id !== 'none'), eqId];
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide your name or nickname.';
    }

    if (age) {
      const a = Number(age);
      if (isNaN(a) || a < 10 || a > 120) {
        newErrors.age = 'Age must be between 10 and 120.';
      }
    }

    if (heightCm) {
      const h = Number(heightCm);
      if (isNaN(h) || h < 50 || h > 260) {
        newErrors.heightCm = 'Height must be between 50 and 260 cm.';
      }
    }

    if (weightKg) {
      const w = Number(weightKg);
      if (isNaN(w) || w < 20 || w > 350) {
        newErrors.weightKg = 'Weight must be between 20 and 350 kg.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updated: UserProfile = {
      id: userProfile?.id || `user_${Date.now()}`,
      name: name.trim(),
      gender,
      age: age ? Number(age) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
      fitnessGoal,
      experienceLevel,
      workoutLocation: 'home',
      equipment: availableEquipment[0] || 'none',
      availableEquipment: availableEquipment.length > 0 ? availableEquipment : ['none'],
      workoutDurationMinutes: workoutDuration,
      dietaryPreference,
      activityLevel,
      allergies: allergies.trim(),
      limitations: limitations.trim(),
      isPregnantOrMedicallyRestricted: isMedicalOrPregnant,
      xp: userProfile?.xp || 50,
      level: userProfile?.level || 1,
      streakDays: userProfile?.streakDays || 1,
      theme: userProfile?.theme || 'dark',
      createdAt: userProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveProfile(updated);
    setSuccessNotice(true);
    setErrors({});
    setTimeout(() => setSuccessNotice(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto pb-12">
      {/* Toast */}
      {successNotice && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-lime-400 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Profile updated & saved!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
          <span>Personal Account & Disciplines</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          My Profile & Habits
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your fitness biometrics, training equipment, and track non-workout daily habits and streaks.
        </p>
      </div>

      {/* Profile & Habits Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Biometrics</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('habits')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'habits'
              ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span>Daily Habits</span>
          {userProfile?.streakDays ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950 text-orange-400 font-mono font-bold">
              {userProfile.streakDays}d streak
            </span>
          ) : null}
        </button>
      </div>

      {activeTab === 'habits' ? (
        <HabitsTracker
          userProfile={userProfile}
          onUpdateProfile={(updated) => {
            onSaveProfile(updated);
            setSuccessNotice(true);
            setTimeout(() => setSuccessNotice(false), 2500);
          }}
        />
      ) : (
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Name and Sex */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Name or Nickname <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priyanshu"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Sex (Metabolic Formula Reference)
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Neutral Average</option>
            </select>
          </div>
        </div>

        {/* Age, Height, Weight */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Age
            </label>
            <input
              type="number"
              min="10"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 21"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            />
            {errors.age && <p className="text-[10px] text-rose-400 mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              min="50"
              max="260"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 175"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            />
            {errors.heightCm && <p className="text-[10px] text-rose-400 mt-1">{errors.heightCm}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              min="20"
              max="350"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 70"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            />
            {errors.weightKg && <p className="text-[10px] text-rose-400 mt-1">{errors.weightKg}</p>}
          </div>
        </div>

        {/* Goals & Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Fitness Goal
            </label>
            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value as FitnessGoal)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            >
              <option value="general_fitness">General Fitness & Longevity</option>
              <option value="build_muscle">Build Muscle (Bodyweight Hypertrophy)</option>
              <option value="lose_fat">Lose Body Fat (Gentle Deficit)</option>
              <option value="strength">Improve Strength & Skill</option>
              <option value="maintain">Maintain Current Weight</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Dietary Preference
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            >
              <option value="vegetarian">Vegetarian (Dairy & Pulses)</option>
              <option value="vegan">Vegan (100% Plant-Based)</option>
              <option value="eggetarian">Eggetarian (Eggs + Dairy + Pulses)</option>
              <option value="non_vegetarian">Non-Vegetarian (Chicken, Fish, Eggs)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            >
              <option value="beginner">Beginner (Zero gym required)</option>
              <option value="intermediate">Intermediate (Solid foundation)</option>
              <option value="advanced">Advanced (High intensity calisthenics)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Typical Session Duration
            </label>
            <select
              value={workoutDuration}
              onChange={(e) => setWorkoutDuration(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-lime-400"
            >
              <option value={5}>5 minutes (Micro spark)</option>
              <option value={10}>10 minutes (Quick blast)</option>
              <option value={20}>20 minutes (Standard circuit)</option>
              <option value={30}>30 minutes (Deep stimulus)</option>
              <option value={45}>45 minutes (Full masterclass)</option>
            </select>
          </div>
        </div>

        {/* Multi-Select Available Equipment */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-lime-400" />
                <span>Available Equipment & Workout Gear</span>
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Select everything you have at home or wherever you train. FitMood filters exercises and workouts so you only see routines you can actually perform.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-lime-400 bg-lime-400/10 border border-lime-400/30 px-2.5 py-1 rounded-lg shrink-0">
              {availableEquipment.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 max-h-60 overflow-y-auto pr-1">
            {EQUIPMENT_OPTIONS_LIST.map((eq) => {
              const isSelected = availableEquipment.includes(eq.id);
              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => handleToggleEquipment(eq.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-lime-400 bg-lime-400/15 text-slate-900 dark:text-white shadow-sm shadow-lime-400/10'
                      : 'border-slate-800 bg-slate-950/70 text-slate-700 dark:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-bold text-xs flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <span>{eq.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {eq.description}
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? 'bg-lime-400 border-lime-400 text-slate-950'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Food allergies and physical limitations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Food Allergies (Optional)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Peanuts, Dairy, Gluten"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Exercise Limitations (Optional)
            </label>
            <input
              type="text"
              value={limitations}
              onChange={(e) => setLimitations(e.target.value)}
              placeholder="e.g. Lower back stiffness, knee pain"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* Health Guard Checkbox */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5">
          <input
            type="checkbox"
            id="profile-med-check"
            checked={isMedicalOrPregnant}
            onChange={(e) => setIsMedicalOrPregnant(e.target.checked)}
            className="mt-0.5 rounded text-lime-400 focus:ring-lime-400 border-slate-600 bg-slate-900"
          />
          <label htmlFor="profile-med-check" className="text-xs text-amber-300 leading-snug">
            Pregnant, nursing, eating disorder history, or under physician care (Disables automated caloric deficit formulas for clinical safety).
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-md shadow-lime-400/20 transition-all hover:scale-102"
        >
          Save Profile Changes
        </button>
      </form>
      )}
    </div>
  );
};
