import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  Gender,
  ActivityLevel,
  FitnessGoal,
  WorkoutLog,
  CalorieCalculationResult
} from '../types';
import {
  calculateCalories,
  estimateExerciseCaloriesBurned,
  validateCalorieInputs,
  ACTIVITY_MULTIPLIERS,
  EXERCISE_MET_RATES
} from '../utils/calorieCalculator';
import {
  Flame,
  Zap,
  Activity,
  Calculator,
  ShieldAlert,
  Info,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Dumbbell,
  AlertCircle
} from 'lucide-react';

interface CalorieMeterProps {
  userProfile: UserProfile | null;
  workoutLogs?: WorkoutLog[];
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  compact?: boolean;
  className?: string;
}

export const CalorieMeter: React.FC<CalorieMeterProps> = ({
  userProfile,
  workoutLogs = [],
  onUpdateProfile,
  compact = false,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'daily_target' | 'exercise_burn'>('daily_target');

  // Input states initialized from userProfile or sensible defaults
  const [age, setAge] = useState<string>(userProfile?.age ? String(userProfile.age) : '24');
  const [heightCm, setHeightCm] = useState<string>(userProfile?.heightCm ? String(userProfile.heightCm) : '172');
  const [weightKg, setWeightKg] = useState<string>(userProfile?.weightKg ? String(userProfile.weightKg) : '68');
  const [gender, setGender] = useState<Gender>(userProfile?.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(userProfile?.activityLevel || 'moderate');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(userProfile?.fitnessGoal || 'general_fitness');
  const [isMedicalRestricted, setIsMedicalRestricted] = useState<boolean>(
    userProfile?.isPregnantOrMedicallyRestricted || false
  );

  // Exercise Calorie Burn interactive calculator states
  const [selectedExerciseType, setSelectedExerciseType] = useState<string>('calisthenics_moderate');
  const [exerciseDurationMinutes, setExerciseDurationMinutes] = useState<number>(30);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Synchronize when userProfile prop updates
  useEffect(() => {
    if (userProfile) {
      if (userProfile.age) setAge(String(userProfile.age));
      if (userProfile.heightCm) setHeightCm(String(userProfile.heightCm));
      if (userProfile.weightKg) setWeightKg(String(userProfile.weightKg));
      if (userProfile.gender) setGender(userProfile.gender);
      if (userProfile.activityLevel) setActivityLevel(userProfile.activityLevel);
      if (userProfile.fitnessGoal) setFitnessGoal(userProfile.fitnessGoal);
      if (typeof userProfile.isPregnantOrMedicallyRestricted === 'boolean') {
        setIsMedicalRestricted(userProfile.isPregnantOrMedicallyRestricted);
      }
    }
  }, [userProfile]);

  // Validation
  const validation = useMemo(() => {
    return validateCalorieInputs({ age, heightCm, weightKg });
  }, [age, heightCm, weightKg]);

  const numAge = Number(age);
  const numHeight = Number(heightCm);
  const numWeight = Number(weightKg);

  // Calculate Daily Calorie Needs
  const dailyResult: CalorieCalculationResult | null = useMemo(() => {
    if (!validation.isValid) return null;
    return calculateCalories({
      age: numAge,
      heightCm: numHeight,
      weightKg: numWeight,
      gender,
      activityLevel,
      fitnessGoal,
      isPregnantOrMedicallyRestricted: isMedicalRestricted
    });
  }, [validation.isValid, numAge, numHeight, numWeight, gender, activityLevel, fitnessGoal, isMedicalRestricted]);

  // Calculate Active Exercise Burn Estimation
  const activeExerciseBurn = useMemo(() => {
    const userWeight = !isNaN(numWeight) && numWeight >= 25 ? numWeight : 68;
    return estimateExerciseCaloriesBurned({
      exerciseTypeId: selectedExerciseType,
      durationMinutes: exerciseDurationMinutes,
      weightKg: userWeight
    });
  }, [selectedExerciseType, exerciseDurationMinutes, numWeight]);

  // Calculate actual calories burned from real completed workout logs
  const workoutBurnHistory = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const userWeight = !isNaN(numWeight) && numWeight >= 25 ? numWeight : 68;

    let burnedToday = 0;
    let burnedPastWeek = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    workoutLogs.forEach((log) => {
      const dur = log.durationMinutes || 25;
      const burn = estimateExerciseCaloriesBurned({
        exerciseTypeId: 'calisthenics_moderate',
        durationMinutes: dur,
        weightKg: userWeight
      }).caloriesBurned;

      if (log.date === todayStr) {
        burnedToday += burn;
      }
      if (new Date(log.completedAt) >= oneWeekAgo) {
        burnedPastWeek += burn;
      }
    });

    return { burnedToday, burnedPastWeek };
  }, [workoutLogs, numWeight]);

  const handleSyncProfile = () => {
    if (!validation.isValid || !onUpdateProfile) return;
    onUpdateProfile({
      age: numAge,
      heightCm: numHeight,
      weightKg: numWeight,
      gender,
      activityLevel,
      fitnessGoal,
      isPregnantOrMedicallyRestricted: isMedicalRestricted
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Visual Gauge calculations
  // Gauge range: 1000 to 3500 kcal
  const gaugePercent = useMemo(() => {
    if (!dailyResult || dailyResult.isSafetyRestricted) return 0;
    const min = 1000;
    const max = 3500;
    const target = dailyResult.targetCalories;
    return Math.min(100, Math.max(0, ((target - min) / (max - min)) * 100));
  }, [dailyResult]);

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 shadow-xl space-y-6 ${className}`}>
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] uppercase tracking-wider font-extrabold mb-1">
            <Flame className="w-3 h-3 text-lime-400" />
            <span>Interactive Calorie & Energy Meter</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            Metabolic Energy & Calorie Burn Hub
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('daily_target')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'daily_target'
                ? 'bg-lime-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Needs Target
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exercise_burn')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'exercise_burn'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Exercise Burn</span>
          </button>
        </div>
      </div>

      {/* Distinction Banner: Clearly explains difference */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          {activeTab === 'daily_target' ? (
            <>
              <strong className="text-white">Daily Calorie Target (TDEE):</strong> The total energy your body requires each day for baseline living (BMR) plus daily activity. Used to guide balanced Indian nutrition without starvation.
            </>
          ) : (
            <>
              <strong className="text-white">Active Exercise Burn:</strong> Specific kinetic energy expended strictly during physical training sessions, calculated with ACSM Compendium of Physical Activities MET coefficients.
            </>
          )}
        </p>
      </div>

      {activeTab === 'daily_target' ? (
        /* ================= TAB 1: DAILY CALORIE NEEDS METER ================= */
        <div className="space-y-6">
          {/* Visual Gauge Meter */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Dial Meter Graphic */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-44 h-24 flex items-end justify-center">
                  <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 90">
                    {/* Background Arc */}
                    <path
                      d="M 15 80 A 65 65 0 0 1 145 80"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    {/* Value Arc */}
                    <path
                      d="M 15 80 A 65 65 0 0 1 145 80"
                      fill="none"
                      stroke="url(#calorieGradient)"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="204.2"
                      strokeDashoffset={`${204.2 - (204.2 * gaugePercent) / 100}`}
                      className="transition-all duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#a3e635" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Centered Target Number */}
                  <div className="absolute bottom-0 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">
                      {dailyResult && !dailyResult.isSafetyRestricted ? dailyResult.targetCalories : '—'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 mt-1">
                      kcal / day
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-2">
                  <span className="text-sky-700 dark:text-sky-400 font-extrabold">Deficit</span>
                  <span>•</span>
                  <span className="text-lime-700 dark:text-lime-400 font-extrabold">Maintenance</span>
                  <span>•</span>
                  <span className="text-amber-700 dark:text-amber-400 font-extrabold">Surplus</span>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="flex-1 w-full grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">BMR (At Rest)</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    {dailyResult && !dailyResult.isSafetyRestricted ? `~${dailyResult.bmr} kcal` : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Basal metabolic rate</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Maintenance (TDEE)</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    {dailyResult && !dailyResult.isSafetyRestricted ? `~${dailyResult.maintenanceCalories} kcal` : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Mifflin–St Jeor × Activity</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-lime-400/10 border border-lime-400/20 col-span-2 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-lime-400 font-bold uppercase">Daily Goal Target</div>
                    <div className="text-base font-black text-white">
                      {dailyResult && !dailyResult.isSafetyRestricted ? `~${dailyResult.targetCalories} kcal / day` : '—'}
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-xl bg-lime-400 text-slate-950 font-bold capitalize">
                    {fitnessGoal.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Restriction Alert */}
            {dailyResult?.isSafetyRestricted && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">Clinical Safety Override</div>
                  <p className="mt-0.5">{dailyResult.safetyReason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Metric Controls */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-lime-400" />
                <span>Adjust Personal Metrics (Real-Time Recalculation)</span>
              </h4>
              <button
                type="button"
                onClick={handleSyncProfile}
                disabled={!validation.isValid}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Sync to Profile</span>
                )}
              </button>
            </div>

            {/* Sex / Gender buttons */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Biological Sex (Mifflin–St Jeor)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                      gender === g
                        ? 'bg-lime-400 text-slate-950 shadow-xs'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Age, Height, Weight Inputs with live error indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="10"
                  max="115"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-white text-xs sm:text-sm focus:outline-none ${
                    validation.errors.age ? 'border-rose-500' : 'border-slate-800 focus:border-lime-400'
                  }`}
                />
                {validation.errors.age && (
                  <p className="text-[10px] text-rose-400 mt-1">{validation.errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="60"
                  max="260"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-white text-xs sm:text-sm focus:outline-none ${
                    validation.errors.height ? 'border-rose-500' : 'border-slate-800 focus:border-lime-400'
                  }`}
                />
                {validation.errors.height && (
                  <p className="text-[10px] text-rose-400 mt-1">{validation.errors.height}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="25"
                  max="350"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-white text-xs sm:text-sm focus:outline-none ${
                    validation.errors.weight ? 'border-rose-500' : 'border-slate-800 focus:border-lime-400'
                  }`}
                />
                {validation.errors.weight && (
                  <p className="text-[10px] text-rose-400 mt-1">{validation.errors.weight}</p>
                )}
              </div>
            </div>

            {/* Activity Level & Target Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Weekly Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                >
                  {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label} (×{item.multiplier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Fitness Objective
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value as FitnessGoal)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                >
                  <option value="general_fitness">General Fitness (Energy Balance)</option>
                  <option value="build_muscle">Build Muscle (+250 kcal clean surplus)</option>
                  <option value="lose_fat">Fat Loss (-350 kcal sustainable deficit)</option>
                  <option value="strength">Strength & Power (+200 kcal)</option>
                  <option value="maintain">Maintain Current Weight</option>
                </select>
              </div>
            </div>
          </div>

          {/* Macro breakdown */}
          {dailyResult && !dailyResult.isSafetyRestricted && (
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-lime-400 uppercase">Protein Goal</div>
                <div className="text-lg font-black text-white mt-0.5">~{dailyResult.proteinGramsTarget}g</div>
                <div className="text-[10px] text-slate-500">~{dailyResult.proteinGramsTarget * 4} kcal</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-sky-400 uppercase">Carbohydrates</div>
                <div className="text-lg font-black text-white mt-0.5">~{dailyResult.carbsGramsTarget}g</div>
                <div className="text-[10px] text-slate-500">~{dailyResult.carbsGramsTarget * 4} kcal</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-amber-400 uppercase">Healthy Fats</div>
                <div className="text-lg font-black text-white mt-0.5">~{dailyResult.fatsGramsTarget}g</div>
                <div className="text-[10px] text-slate-500">~{dailyResult.fatsGramsTarget * 9} kcal</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= TAB 2: EXERCISE CALORIE BURN METER ================= */
        <div className="space-y-6">
          {/* Active Workout Calorie Meter Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Estimated Session Caloric Burn</span>
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                  ~{activeExerciseBurn.caloriesBurned}{' '}
                  <span className="text-sm font-semibold text-slate-400">kcal burned</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Formula: {activeExerciseBurn.formula}
                </div>
              </div>

              {/* History Burn Stats */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Burned Today</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5">
                    {workoutBurnHistory.burnedToday} kcal
                  </div>
                  <div className="text-[10px] text-slate-500">from workout logs</div>
                </div>

                <div className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Past 7 Days</div>
                  <div className="text-lg font-black text-lime-400 mt-0.5">
                    {workoutBurnHistory.burnedPastWeek} kcal
                  </div>
                  <div className="text-[10px] text-slate-500">cumulative active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Inputs */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span>Exercise Type & Duration Simulator</span>
            </h4>

            {/* Exercise Type Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Select Exercise Modality
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(EXERCISE_MET_RATES).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedExerciseType(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      selectedExerciseType === item.id
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{item.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-mono">
                        {item.met} MET
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider & Number */}
            <div>
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mb-1.5">
                <span className="uppercase tracking-wider">Exercise Duration:</span>
                <span className="text-amber-400 font-mono text-sm">{exerciseDurationMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={exerciseDurationMinutes}
                onChange={(e) => setExerciseDurationMinutes(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>5 min (Warm-up)</span>
                <span>30 min (Standard)</span>
                <span>60 min (Full Session)</span>
                <span>120 min (Endurance)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
