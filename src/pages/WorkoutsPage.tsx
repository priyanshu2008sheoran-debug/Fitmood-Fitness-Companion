import React, { useState, useMemo } from 'react';
import { WorkoutPlan, UserProfile, EquipmentOption } from '../types';
import { WORKOUT_PLANS } from '../data/workoutPlansData';
import {
  getUserAvailableEquipment,
  isPlanCompatible,
  getPlanEquipmentSummary,
  EQUIPMENT_LABELS
} from '../utils/equipmentFilter';
import {
  Play,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Dumbbell,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';

interface WorkoutsPageProps {
  onStartWorkout: (plan: WorkoutPlan) => void;
  onNavigateToGenerator?: () => void;
  userProfile?: UserProfile | null;
  onNavigateToProfile?: () => void;
}

const WORKOUT_IMAGES: Record<string, string> = {
  'full-body-beginner': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
  'quick-5min-spark': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  'stress-relief-mobility': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  'upper-body-power': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
  'lower-body-tone': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
  'core-fortress': 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
  'resistance-bands-fullbody': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80',
  'dumbbells-upper-strength': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'dumbbells-lower-rdl': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
  'pullup-bar-calisthenics': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
  'cardio-hiit-burn': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
  'rest-and-relaxation': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
};

export const WorkoutsPage: React.FC<WorkoutsPageProps> = ({
  onStartWorkout,
  onNavigateToGenerator,
  userProfile,
  onNavigateToProfile
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyCompatible, setOnlyCompatible] = useState<boolean>(true);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Normalize user's verified equipment
  const userEquipment = useMemo(() => {
    return getUserAvailableEquipment(userProfile);
  }, [userProfile]);

  const categories = [
    { id: 'all', label: 'All Routines' },
    { id: 'full_body', label: 'Full Body' },
    { id: 'upper', label: 'Upper Body' },
    { id: 'lower', label: 'Lower Body' },
    { id: 'core', label: 'Core Fortress' },
    { id: 'mobility', label: 'Mobility & Joints' },
    { id: 'recovery', label: 'Active Recovery' }
  ];

  // Filter plans based on category AND equipment compatibility
  const { filteredPlans, totalCompatibleCount } = useMemo(() => {
    let compatibleCount = 0;

    const filtered = WORKOUT_PLANS.filter((plan) => {
      const isCompat = isPlanCompatible(plan, userEquipment);
      if (isCompat) compatibleCount++;

      // Category filter
      if (selectedCategory !== 'all' && plan.category !== selectedCategory) {
        return false;
      }

      // Equipment compatibility filter
      if (onlyCompatible && !isCompat) {
        return false;
      }

      return true;
    });

    return { filteredPlans: filtered, totalCompatibleCount: compatibleCount };
  }, [selectedCategory, onlyCompatible, userEquipment]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Equipment-Personalized Routines</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Workout Library & Routines
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Routines automatically adapt to your selected equipment ({userEquipment.length} item{userEquipment.length > 1 ? 's' : ''} owned). Never see an exercise you can't perform at home.
          </p>
        </div>

        {onNavigateToGenerator && (
          <button
            onClick={onNavigateToGenerator}
            className="self-start lg:self-auto flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-lime-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>AI Custom Workout Generator</span>
          </button>
        )}
      </div>

      {/* Equipment Personalization Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
              <Dumbbell className="w-4 h-4 text-lime-400" />
              <span>Your Gear:</span>
            </span>
            {userEquipment.map((eq) => (
              <span
                key={eq}
                className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-lime-400" />
                {EQUIPMENT_LABELS[eq] || eq}
              </span>
            ))}
            {onNavigateToProfile && (
              <button
                onClick={onNavigateToProfile}
                className="text-xs font-bold text-lime-400 hover:text-lime-300 hover:underline px-2 py-1"
              >
                Update Gear in Profile
              </button>
            )}
          </div>

          {/* Toggle compatibility switch */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 select-none">
              <input
                type="checkbox"
                checked={onlyCompatible}
                onChange={(e) => setOnlyCompatible(e.target.checked)}
                className="w-4 h-4 rounded text-lime-400 focus:ring-lime-400 border-slate-700 bg-slate-950"
              />
              <span>Show only compatible with my gear ({totalCompatibleCount})</span>
            </label>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredPlans.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No workouts match this filter combination</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Try disabling "Show only compatible with my gear" to view all available routines or select "All Routines".
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setOnlyCompatible(false);
            }}
            className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 cursor-pointer transition-all hover:scale-102"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Workout Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const isExpanded = expandedPlanId === plan.id;
          const { summaryText, isFullyMatched, missingEquipment } = getPlanEquipmentSummary(plan, userEquipment);
          const coverImage = WORKOUT_IMAGES[plan.id] || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={plan.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-lime-400/5 group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={coverImage}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-lime-400/30 text-lime-400 text-[10px] font-bold uppercase tracking-wider">
                      {plan.category.replace('_', ' ')}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 text-[10px] font-bold capitalize">
                      {plan.difficulty}
                    </span>
                  </div>

                  {/* Duration and Exercises Pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/90 text-white text-xs font-bold backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-lime-400" />
                      {plan.durationMinutes} min
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950/90 text-slate-300 text-xs font-semibold backdrop-blur-md">
                      {plan.exercises.length} Exercises
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="text-lg font-black text-white group-hover:text-lime-300 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {plan.description}
                  </p>

                  {/* Equipment Verification Summary Badge */}
                  <div
                    className={`p-2.5 rounded-2xl border text-xs flex items-start gap-2 ${
                      isFullyMatched
                        ? 'bg-lime-400/10 border-lime-400/25 text-lime-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    {isFullyMatched ? (
                      <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="leading-snug">
                      <span className="font-bold">
                        {isFullyMatched ? '100% Compatible with Your Gear' : 'Additional Equipment Needed'}:
                      </span>{' '}
                      <span className="text-slate-300">{summaryText}</span>
                      {!isFullyMatched && missingEquipment.length > 0 && (
                        <div className="text-[11px] text-amber-400/90 mt-1 font-semibold">
                          Missing: {missingEquipment.map(m => EQUIPMENT_LABELS[m] || m).join(', ')} • Bodyweight alternatives available inside.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suited Moods */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Moods:</span>
                    {plan.suitedMoods.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300 capitalize"
                      >
                        {m.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Exercise Breakdown */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                      className="flex items-center justify-between w-full text-xs font-bold text-slate-300 hover:text-white py-1"
                    >
                      <span>Circuit Details ({plan.exercises.length} movements)</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs">
                        <div className="text-[10px] font-bold text-lime-400 uppercase tracking-wider mb-1">
                          Warm-Up Drills:
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 pb-2 border-b border-slate-800">
                          {plan.warmUp.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>

                        <div className="text-[10px] font-bold text-lime-400 uppercase tracking-wider pt-1 mb-1">
                          Main Circuit:
                        </div>
                        <div className="space-y-1.5">
                          {plan.exercises.map((ex, i) => (
                            <div key={i} className="flex justify-between items-center text-slate-300 text-[11px]">
                              <span className="font-semibold capitalize">{ex.exerciseId.replace(/-/g, ' ')}</span>
                              <span className="font-mono text-slate-400">{ex.sets} sets × {ex.repsOrSeconds}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Start Workout Action */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  onClick={() => onStartWorkout(plan)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-lime-400 hover:bg-lime-300 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-lime-400/20 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Workout Session</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
