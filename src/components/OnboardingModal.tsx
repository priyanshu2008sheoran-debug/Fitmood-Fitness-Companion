import React, { useState } from 'react';
import {
  UserProfile,
  FitnessGoal,
  ExperienceLevel,
  WorkoutLocation,
  EquipmentOption,
  DietaryPreference,
  ActivityLevel,
  Gender
} from '../types';
import { Sparkles, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import { EQUIPMENT_OPTIONS_LIST } from '../utils/equipmentFilter';
import { Button } from './Button';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
  onClose?: () => void;
  existingProfile?: UserProfile | null;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  existingProfile
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(existingProfile?.name || '');
  const [gender, setGender] = useState<Gender>(existingProfile?.gender || 'male');
  const [age, setAge] = useState<string>(existingProfile?.age ? String(existingProfile.age) : '');
  const [heightCm, setHeightCm] = useState<string>(existingProfile?.heightCm ? String(existingProfile.heightCm) : '');
  const [weightKg, setWeightKg] = useState<string>(existingProfile?.weightKg ? String(existingProfile.weightKg) : '');

  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(existingProfile?.fitnessGoal || 'general_fitness');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(existingProfile?.experienceLevel || 'beginner');
  const [workoutLocation, setWorkoutLocation] = useState<WorkoutLocation>(existingProfile?.workoutLocation || 'home');
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentOption[]>(() => {
    if (existingProfile?.availableEquipment && existingProfile.availableEquipment.length > 0) {
      return existingProfile.availableEquipment;
    }
    if (existingProfile?.equipment) {
      return [existingProfile.equipment as EquipmentOption];
    }
    return ['none'];
  });
  const [workoutDuration, setWorkoutDuration] = useState<number>(existingProfile?.workoutDurationMinutes || 20);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(existingProfile?.dietaryPreference || 'vegetarian');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(existingProfile?.activityLevel || 'moderate');
  const [allergies, setAllergies] = useState(existingProfile?.allergies || '');
  const [limitations, setLimitations] = useState(existingProfile?.limitations || '');
  const [isMedicalOrPregnant, setIsMedicalOrPregnant] = useState(existingProfile?.isPregnantOrMedicallyRestricted || false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  if (!isOpen) return null;

  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name or nickname.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name should be at least 2 characters.';
    }

    if (age) {
      const numAge = Number(age);
      if (isNaN(numAge) || !Number.isInteger(numAge) || numAge < 10 || numAge > 120) {
        newErrors.age = 'Please enter a valid age between 10 and 120.';
      }
    }

    if (heightCm) {
      const numHeight = Number(heightCm);
      if (isNaN(numHeight) || numHeight < 50 || numHeight > 260) {
        newErrors.heightCm = 'Please enter a realistic height between 50 and 260 cm.';
      }
    }

    if (weightKg) {
      const numWeight = Number(weightKg);
      if (isNaN(numWeight) || numWeight < 20 || numWeight > 350) {
        newErrors.weightKg = 'Please enter a realistic weight between 20 and 350 kg.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    if (!name.trim()) {
      setStep(1);
      setErrors({ name: 'Name is required to personalize your experience.' });
      return;
    }

    const created: UserProfile = {
      id: existingProfile?.id || `user_${Date.now()}`,
      name: name.trim(),
      gender,
      age: age ? Number(age) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
      fitnessGoal,
      experienceLevel,
      workoutLocation,
      equipment: availableEquipment[0] || 'none',
      availableEquipment: availableEquipment.length > 0 ? availableEquipment : ['none'],
      workoutDurationMinutes: workoutDuration,
      dietaryPreference,
      activityLevel,
      allergies: allergies.trim(),
      limitations: limitations.trim(),
      isPregnantOrMedicallyRestricted: isMedicalOrPregnant,
      xp: existingProfile?.xp || 50,
      level: existingProfile?.level || 1,
      streakDays: existingProfile?.streakDays || 1,
      theme: existingProfile?.theme || 'dark',
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onComplete(created);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl my-6 border transition-all"
        style={{
          backgroundColor: 'var(--app-card, #ffffff)',
          color: 'var(--app-text-primary, #0f172a)',
          borderColor: 'var(--app-card-border, #e2e8f0)'
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Banner */}
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 border"
            style={{
              backgroundColor: 'var(--app-accent-subtle)',
              color: 'var(--app-primary)',
              borderColor: 'var(--app-card-border)'
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to FitMood</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {existingProfile ? 'Update Your Fitness Profile' : 'Personalize Your Journey'}
          </h2>
          <p className="text-xs sm:text-sm mt-1 text-slate-600 dark:text-slate-400">
            No gym required. Tailored for your home, schedule, and Indian food preferences.
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step >= 1 ? 'opacity-100' : 'opacity-25'
              }`}
              style={{ backgroundColor: 'var(--app-primary)' }}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step >= 2 ? 'opacity-100' : 'opacity-25'
              }`}
              style={{ backgroundColor: 'var(--app-primary)' }}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step >= 3 ? 'opacity-100' : 'opacity-25'
              }`}
              style={{ backgroundColor: 'var(--app-primary)' }}
            />
          </div>
        </div>

        {/* Step 1: Basics & Body Metrics */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                Name or Nickname <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Aryan, Priya, Sam"
                className="w-full px-4 py-3 rounded-2xl border text-sm font-semibold focus:outline-2 transition-all"
                style={{
                  backgroundColor: 'var(--app-input-bg)',
                  borderColor: 'var(--app-input-border)',
                  color: 'var(--app-input-text)'
                }}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                Sex (Used for Mifflin-St Jeor metabolic formula)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as Gender[]).map((g) => {
                  const isSelected = gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected ? 'btn-primary' : 'btn-secondary'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{g}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  placeholder="e.g. 21"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm font-semibold focus:outline-2"
                  style={{
                    backgroundColor: 'var(--app-input-bg)',
                    borderColor: 'var(--app-input-border)',
                    color: 'var(--app-input-text)'
                  }}
                />
                {errors.age && <p className="text-[11px] text-rose-500 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="50"
                  max="260"
                  value={heightCm}
                  onChange={(e) => {
                    setHeightCm(e.target.value);
                    if (errors.heightCm) setErrors({ ...errors, heightCm: '' });
                  }}
                  placeholder="e.g. 172"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm font-semibold focus:outline-2"
                  style={{
                    backgroundColor: 'var(--app-input-bg)',
                    borderColor: 'var(--app-input-border)',
                    color: 'var(--app-input-text)'
                  }}
                />
                {errors.heightCm && <p className="text-[11px] text-rose-500 mt-1">{errors.heightCm}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="20"
                  max="350"
                  value={weightKg}
                  onChange={(e) => {
                    setWeightKg(e.target.value);
                    if (errors.weightKg) setErrors({ ...errors, weightKg: '' });
                  }}
                  placeholder="e.g. 68"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm font-semibold focus:outline-2"
                  style={{
                    backgroundColor: 'var(--app-input-bg)',
                    borderColor: 'var(--app-input-border)',
                    color: 'var(--app-input-text)'
                  }}
                />
                {errors.weightKg && <p className="text-[11px] text-rose-500 mt-1">{errors.weightKg}</p>}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Optional metric inputs can be skipped or updated anytime in Profile.
            </p>
          </div>
        )}

        {/* Step 2: Fitness Goals & Workout Setup */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                Primary Fitness Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'build_muscle', label: 'Build Muscle', desc: 'Hypertrophy & bodyweight strength' },
                  { id: 'lose_fat', label: 'Lose Body Fat', desc: 'Sustainable caloric deficit & tone' },
                  { id: 'strength', label: 'Improve Strength', desc: 'Progressive calisthenics skills' },
                  { id: 'general_fitness', label: 'General Fitness', desc: 'Energy, heart health & stamina' },
                  { id: 'maintain', label: 'Maintain Weight', desc: 'Consistent movement habits' }
                ].map((item) => {
                  const isSelected = fitnessGoal === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFitnessGoal(item.id as FitnessGoal)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'btn-selected ring-2 ring-[var(--app-primary)]'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" style={{ color: 'var(--app-primary)' }} />}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Beginner', desc: 'Zero gym required' },
                  { id: 'intermediate', label: 'Intermediate', desc: 'Active foundation' },
                  { id: 'advanced', label: 'Advanced', desc: 'High intensity & skills' }
                ].map((item) => {
                  const isSelected = experienceLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExperienceLevel(item.id as ExperienceLevel)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'btn-primary'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Equipment Selection (Multi-select) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Available Equipment <span className="normal-case opacity-80">(Select multiple)</span>
                </label>
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md font-bold"
                  style={{
                    backgroundColor: 'var(--app-accent-subtle)',
                    color: 'var(--app-primary)'
                  }}
                >
                  {availableEquipment.length} selected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                Workouts will only recommend exercises matching your owned gear. Bodyweight alternatives are always provided.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {EQUIPMENT_OPTIONS_LIST.map((eq) => {
                  const isSelected = availableEquipment.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => handleToggleEquipment(eq.id)}
                      className={`p-2.5 rounded-2xl text-left border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-[var(--app-primary)] bg-[var(--app-accent-subtle)] text-[var(--app-text-primary)] font-black'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>{eq.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {eq.description}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected
                            ? 'btn-primary'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                Typical Workout Duration
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 20, 30, 45].map((mins) => {
                  const isSelected = workoutDuration === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setWorkoutDuration(mins)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected ? 'btn-primary' : 'btn-secondary'
                      }`}
                    >
                      {mins}m
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Diet & Safety Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'vegan', label: 'Vegan' },
                  { id: 'eggetarian', label: 'Eggetarian' },
                  { id: 'non_vegetarian', label: 'Non-Veg' }
                ].map((item) => {
                  const isSelected = dietaryPreference === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDietaryPreference(item.id as DietaryPreference)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected ? 'btn-primary' : 'btn-secondary'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-2"
                style={{
                  backgroundColor: 'var(--app-input-bg)',
                  borderColor: 'var(--app-input-border)',
                  color: 'var(--app-input-text)'
                }}
              >
                <option value="sedentary">Sedentary (Desk job, minimal walking)</option>
                <option value="light">Lightly Active (1-3 days casual walking)</option>
                <option value="moderate">Moderately Active (3-5 workouts/week)</option>
                <option value="active">Very Active (6-7 intense days/week)</option>
                <option value="very_active">Extra Active (Physical labor or high athlete)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                  Food Allergies (Optional)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Peanuts, Dairy, Gluten"
                  className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-2"
                  style={{
                    backgroundColor: 'var(--app-input-bg)',
                    borderColor: 'var(--app-input-border)',
                    color: 'var(--app-input-text)'
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                  Exercise Limitations (Optional)
                </label>
                <input
                  type="text"
                  value={limitations}
                  onChange={(e) => setLimitations(e.target.value)}
                  placeholder="e.g. Knee pain, wrist strain"
                  className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-2"
                  style={{
                    backgroundColor: 'var(--app-input-bg)',
                    borderColor: 'var(--app-input-border)',
                    color: 'var(--app-input-text)'
                  }}
                />
              </div>
            </div>

            {/* Health Guard Checkbox */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2.5">
              <input
                type="checkbox"
                id="med-check"
                checked={isMedicalOrPregnant}
                onChange={(e) => setIsMedicalOrPregnant(e.target.checked)}
                className="mt-0.5 rounded text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="med-check" className="text-xs text-amber-700 dark:text-amber-300 leading-snug font-medium">
                I am pregnant, nursing, recovering from an eating disorder, or managing a physician-monitored medical condition (Disables automated caloric deficit formulas for clinical safety).
              </label>
            </div>
          </div>
        )}

        {/* Footer Buttons with Guaranteed High Contrast in All Themes */}
        <div className="flex items-center justify-between gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          {step > 1 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step === 1 && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  if (validateStep1()) {
                    finishOnboarding();
                  }
                }}
              >
                Skip optional & start
              </Button>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {step === 3 ? 'Save & Start FitMood' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
