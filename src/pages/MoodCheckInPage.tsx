import React, { useState } from 'react';
import { MoodType, UserProfile, WorkoutPlan, MoodCheckIn } from '../types';
import { WORKOUT_PLANS } from '../data/workoutPlansData';
import { Sparkles, HeartHandshake, BedDouble, Play, CheckCircle, RefreshCcw } from 'lucide-react';

interface MoodCheckInPageProps {
  userProfile: UserProfile | null;
  onSaveMoodCheckIn: (checkIn: MoodCheckIn, recommendedPlan: WorkoutPlan | null) => void;
  onStartWorkout: (plan: WorkoutPlan) => void;
}

export const MoodCheckInPage: React.FC<MoodCheckInPageProps> = ({
  userProfile,
  onSaveMoodCheckIn,
  onStartWorkout
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [isComfortableExercising, setIsComfortableExercising] = useState<boolean>(true);
  const [isRestDayChosen, setIsRestDayChosen] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [matchedPlan, setMatchedPlan] = useState<WorkoutPlan | null>(null);

  const moods: { id: MoodType; emoji: string; title: string; desc: string }[] = [
    {
      id: 'energetic',
      emoji: '⚡',
      title: 'Energetic',
      desc: 'High stamina, rested, ready to push strength limits.'
    },
    {
      id: 'happy',
      emoji: '😊',
      title: 'Happy & Upbeat',
      desc: 'Positive headspace, looking forward to a solid routine.'
    },
    {
      id: 'normal',
      emoji: '😌',
      title: 'Balanced / Normal',
      desc: 'Steady baseline, ready for standard progressive workout.'
    },
    {
      id: 'tired',
      emoji: '🥱',
      title: 'Low Energy / Tired',
      desc: 'Drained from sleep or daily grind; needs gentle movement or recovery.'
    },
    {
      id: 'stressed',
      emoji: '😮‍💨',
      title: 'Stressed / Overwhelmed',
      desc: 'Mental pressure or tight muscles; needs mobility and nervous system reset.'
    },
    {
      id: 'low_motivation',
      emoji: '🛋️',
      title: 'Low Motivation',
      desc: 'Struggling to get started; needs a friction-free 5-minute micro spark.'
    }
  ];

  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    setIsRestDayChosen(false);
  };

  const handleCalculateRecommendation = () => {
    if (!selectedMood) return;

    let plan: WorkoutPlan | null = null;

    if (isRestDayChosen || !isComfortableExercising) {
      plan = null;
    } else {
      switch (selectedMood) {
        case 'energetic':
          plan =
            WORKOUT_PLANS.find((p) => p.id === 'upper-body-power') ||
            WORKOUT_PLANS.find((p) => p.id === 'full-body-beginner')!;
          break;
        case 'stressed':
          plan = WORKOUT_PLANS.find((p) => p.id === 'stress-relief-mobility')!;
          break;
        case 'tired':
          plan = WORKOUT_PLANS.find((p) => p.id === 'rest-and-relaxation')!;
          break;
        case 'low_motivation':
          plan = WORKOUT_PLANS.find((p) => p.id === 'quick-5min-spark')!;
          break;
        case 'happy':
        case 'normal':
        default:
          plan = WORKOUT_PLANS.find((p) => p.id === 'full-body-beginner')!;
          break;
      }
    }

    setMatchedPlan(plan);
    setSubmitted(true);

    const checkIn: MoodCheckIn = {
      id: `mood_${Date.now()}`,
      userId: userProfile?.id || 'guest',
      mood: selectedMood,
      note: note.trim(),
      workoutRecommendedId: plan?.id,
      isRestDay: isRestDayChosen || !isComfortableExercising,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    onSaveMoodCheckIn(checkIn, plan);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
          <span>Mind-Body Synchrony</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          How are you feeling today?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Your mood informs your workout, not your worth. We tailor today’s routine to meet your energy right where you are.
        </p>
      </div>

      {!submitted ? (
        <div className="space-y-6">
          {/* Mood selection grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {moods.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectMood(m.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-lime-400/10 border-lime-400 shadow-md shadow-lime-400/15 scale-[1.02]'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-3xl mb-3">{m.emoji}</div>
                  <h3 className={`font-black text-base ${isSelected ? 'text-lime-600 dark:text-lime-400' : 'text-slate-900 dark:text-white'}`}>
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Comfort and Rest Day Options */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Exercise Readiness & Rest Options
            </h4>

            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRestDayChosen}
                  onChange={(e) => setIsRestDayChosen(e.target.checked)}
                  className="rounded text-lime-400 focus:ring-lime-400 border-slate-700 bg-slate-900"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">Log a Mindful Rest / Recovery Day</span>
                  <span className="text-slate-400">Muscles grow during rest. No guilt, ever.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isComfortableExercising}
                  onChange={(e) => setIsComfortableExercising(e.target.checked)}
                  className="rounded text-lime-400 focus:ring-lime-400 border-slate-700 bg-slate-900"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">I feel physically comfortable to move</span>
                  <span className="text-slate-400">Uncheck if you have acute illness or extreme fatigue.</span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Optional Daily Reflection / Note:
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Slept late studying exams; tight shoulders from laptop..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            disabled={!selectedMood}
            onClick={handleCalculateRecommendation}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
              selectedMood
                ? 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lg shadow-lime-400/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Get My Mood-Matched Workout Recommendation →
          </button>
        </div>
      ) : (
        /* Results & Recommendation Card */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Mood Check-In Recorded (+25 XP)</span>
          </div>

          {isRestDayChosen || !isComfortableExercising ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-sky-400/10 border border-sky-400/30 text-sky-400 flex items-center justify-center mx-auto text-3xl">
                🛋️
              </div>
              <h3 className="text-2xl font-black text-white">Enjoy Your Rest & Recovery Day</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Consistency includes honoring your body’s need to repair. Drink fresh water, eat a balanced Indian meal with dal or eggs, and rest up.
              </p>
            </div>
          ) : matchedPlan ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Recommended For You Today:
                </h3>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {matchedPlan.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  {matchedPlan.description}
                </p>
              </div>

              {/* Transparent explanation */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <div className="font-bold text-lime-400 mb-0.5">Why this was chosen:</div>
                  Because you checked in feeling <strong className="text-white capitalize">{selectedMood?.replace('_', ' ')}</strong>, this session balances gentle stimulus and recovery without excessive fatigue. You always have full freedom to modify or switch routines.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSubmitted(false)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Change Mood Selection</span>
                </button>

                <button
                  onClick={() => onStartWorkout(matchedPlan)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-md shadow-lime-400/25 transition-all hover:scale-102"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start This Routine ({matchedPlan.durationMinutes} min)</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
