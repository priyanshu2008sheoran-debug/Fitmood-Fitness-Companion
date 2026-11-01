import React, { useState } from 'react';
import { Exercise, ExerciseCategory, ExperienceLevel } from '../types';
import { EXERCISES_DATABASE } from '../data/exercisesData';
import { Search, Filter, Dumbbell, ShieldAlert, ArrowRight, Video } from 'lucide-react';

interface ExerciseLibraryPageProps {
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExerciseLibraryPage: React.FC<ExerciseLibraryPageProps> = ({
  onSelectExercise
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredExercises = EXERCISES_DATABASE.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.targetMuscles.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || ex.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || ex.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
          <span>Complete Exercise Index</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Calisthenics Exercise Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Learn bodyweight movement mechanics, joint safety cues, regressions, and progressive overloads with zero expensive gym equipment.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises by name or muscle (e.g., chest, push-up, glutes, core)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-lime-400"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'upper', label: 'Upper' },
              { id: 'lower', label: 'Lower' },
              { id: 'core', label: 'Core' },
              { id: 'mobility', label: 'Mobility' },
              { id: 'recovery', label: 'Recovery' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-lime-400 text-slate-950'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficultyFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  difficultyFilter === lvl
                    ? 'bg-lime-400 text-slate-950 shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Exercises */}
      {filteredExercises.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <p className="text-sm text-slate-400">No exercises found matching your search or filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setDifficultyFilter('all');
            }}
            className="text-xs text-lime-400 font-bold hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className="bg-slate-900 border border-slate-800 hover:border-lime-400/50 rounded-3xl p-5 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-lime-400/10 text-lime-400 text-[10px] font-extrabold uppercase">
                    {exercise.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {exercise.isPullUpOrNeedsBar && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                        Bar
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium capitalize">
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-white text-base group-hover:text-lime-400 transition-colors">
                  {exercise.name}
                </h3>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {exercise.instructions[0]}
                </p>

                {/* Muscles Worked */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {exercise.targetMuscles.slice(0, 3).map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-400"
                    >
                      {m}
                    </span>
                  ))}
                  {exercise.targetMuscles.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                      +{exercise.targetMuscles.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[11px]">
                    {exercise.defaultSets} × {exercise.defaultRepsOrSeconds}
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-lime-400/10 text-lime-400 text-[10px] font-bold">
                    <span>🎨 Coach Milo</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400 text-[10px] font-bold">
                    <span>🗺️ Map</span>
                  </span>
                </div>

                <span className="flex items-center gap-1 text-lime-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
