import React, { useState } from 'react';
import { FoodLog, UserProfile } from '../types';
import { INDIAN_FOODS_DATABASE } from '../data/indianFoodsData';
import { calculateCalories } from '../utils/calorieCalculator';
import { Plus, Trash2, BookHeart, Utensils, Sparkles, Check, ChevronDown, Search, X } from 'lucide-react';

interface FoodLogPageProps {
  userProfile: UserProfile | null;
  foodLogs: FoodLog[];
  onAddFoodLog: (food: FoodLog) => void;
  onDeleteFoodLog: (id: string) => void;
}

export const FoodLogPage: React.FC<FoodLogPageProps> = ({
  userProfile,
  foodLogs,
  onAddFoodLog,
  onDeleteFoodLog
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding Food
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [usePreset, setUsePreset] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState(INDIAN_FOODS_DATABASE[0]?.id || '');
  const [customFoodName, setCustomFoodName] = useState('');
  const [customPortion, setCustomPortion] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');

  // Food Search State & Synonyms
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const FOOD_SYNONYMS: Record<string, string[]> = {
    roti: ['chapati', 'chapatis', 'phulka', 'fulka', 'flatbread', 'atta'],
    chapati: ['roti', 'rotis', 'phulka', 'fulka', 'flatbread'],
    chapatis: ['roti', 'chapati', 'phulka'],
    phulka: ['roti', 'chapati'],
    curd: ['dahi', 'yogurt', 'yoghurt', 'curds'],
    dahi: ['curd', 'yogurt', 'yoghurt'],
    paneer: ['cottage cheese', 'panir'],
    rice: ['chawal', 'bhat', 'brown rice', 'white rice', 'khichdi', 'pulao'],
    chawal: ['rice', 'bhat'],
    dal: ['daal', 'dhal', 'lentils', 'pulse', 'moong', 'toor', 'arhar', 'chana dal'],
    daal: ['dal', 'lentils', 'pulse'],
    lentil: ['dal', 'daal'],
    lentils: ['dal', 'daal'],
    egg: ['eggs', 'anda', 'ande', 'boiled egg', 'omelette', 'bhurji'],
    eggs: ['egg', 'anda', 'ande'],
    anda: ['egg', 'eggs'],
    ande: ['egg', 'eggs'],
    soy: ['soya', 'nutrela', 'chunks'],
    soya: ['soy', 'nutrela', 'chunks'],
    nutrela: ['soy', 'soya', 'chunks'],
    chana: ['chickpeas', 'chickpea', 'chole', 'kala chana', 'black chana', 'gram'],
    chole: ['chana', 'chickpeas', 'chana masala'],
    chickpeas: ['chana', 'chole'],
    chickpea: ['chana', 'chole'],
    sattu: ['roasted chana', 'roasted gram', 'sattu drink', 'sattu powder'],
    rajma: ['kidney beans', 'beans'],
    kidney: ['rajma', 'kidney beans'],
    sprouts: ['ankurit', 'sprouted moong', 'sprouted chana'],
    peanut: ['peanuts', 'moongfali', 'groundnut', 'singdana'],
    peanuts: ['peanut', 'moongfali', 'groundnut'],
    moongfali: ['peanut', 'peanuts'],
    poha: ['flattened rice', 'chivda', 'pohe'],
    dosa: ['dosai'],
    idli: ['idly'],
    oats: ['oatmeal']
  };

  const filteredIndianFoods = React.useMemo(() => {
    const q = foodSearchQuery.trim().toLowerCase();
    if (!q) return INDIAN_FOODS_DATABASE;

    const queryTokens = q.split(/\s+/).filter(Boolean);

    return INDIAN_FOODS_DATABASE.filter((food) => {
      const foodName = food.name.toLowerCase();
      const hindiName = (food.hindiName || '').toLowerCase();
      const portion = (food.portionDescription || '').toLowerCase();
      const category = (food.category || '').toLowerCase();

      return queryTokens.every((token) => {
        // Direct partial string matching
        if (foodName.includes(token) || hindiName.includes(token) || portion.includes(token) || category.includes(token)) {
          return true;
        }

        // Check if token has registered synonyms
        const tokenSynonyms = FOOD_SYNONYMS[token] || [];
        for (const syn of tokenSynonyms) {
          if (foodName.includes(syn) || hindiName.includes(syn) || portion.includes(syn)) {
            return true;
          }
        }

        // Check if any word in food name has synonyms that match the token
        for (const [key, synList] of Object.entries(FOOD_SYNONYMS)) {
          if (synList.includes(token) && (foodName.includes(key) || hindiName.includes(key))) {
            return true;
          }
        }

        return false;
      });
    });
  }, [foodSearchQuery]);

  // Daily target calculation
  const calorieResult = userProfile
    ? calculateCalories({
        age: userProfile.age,
        heightCm: userProfile.heightCm,
        weightKg: userProfile.weightKg,
        gender: userProfile.gender,
        activityLevel: userProfile.activityLevel,
        fitnessGoal: userProfile.fitnessGoal,
        isPregnantOrMedicallyRestricted: userProfile.isPregnantOrMedicallyRestricted
      })
    : null;

  const targetCalories = calorieResult && !calorieResult.isSafetyRestricted ? calorieResult.targetCalories : 2000;
  const targetProtein = calorieResult && !calorieResult.isSafetyRestricted ? calorieResult.proteinGramsTarget : 75;

  // Filter logs for selected date
  const todaysLogs = foodLogs.filter((log) => log.date === selectedDate);

  const totalCaloriesLogged = todaysLogs.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProteinLogged = todaysLogs.reduce((sum, item) => sum + (item.proteinGrams || 0), 0);

  const calProgress = Math.min(100, Math.round((totalCaloriesLogged / targetCalories) * 100));
  const proteinProgress = Math.min(100, Math.round((totalProteinLogged / targetProtein) * 100));

  const mealSections: { type: 'breakfast' | 'lunch' | 'dinner' | 'snack'; label: string; icon: string }[] = [
    { type: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { type: 'lunch', label: 'Lunch', icon: '☀️' },
    { type: 'snack', label: 'Snacks & Sattu', icon: '🥜' },
    { type: 'dinner', label: 'Dinner', icon: '🌙' }
  ];

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();

    let foodName = customFoodName;
    let portion = customPortion || '1 serving';
    let calories = Number(customCalories) || 0;
    let protein = Number(customProtein) || 0;

    if (usePreset) {
      const preset = INDIAN_FOODS_DATABASE.find((f) => f.id === selectedPresetId);
      if (preset) {
        foodName = preset.name;
        portion = preset.portionDescription;
        calories = preset.calories;
        protein = preset.proteinGrams;
      }
    }

    if (!foodName.trim()) return;

    const newLog: FoodLog = {
      id: `flog_${Date.now()}`,
      userId: userProfile?.id || 'guest',
      mealType: selectedMealType,
      foodName: foodName.trim(),
      portion,
      calories,
      proteinGrams: protein,
      date: selectedDate,
      createdAt: new Date().toISOString()
    };

    onAddFoodLog(newLog);
    setShowAddModal(false);
    setFoodSearchQuery('');
    setIsSearchDropdownOpen(false);
    setCustomFoodName('');
    setCustomPortion('');
    setCustomCalories('');
    setCustomProtein('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
            <span>Daily Intake & Macro Log</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Food Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track daily Indian whole meals, dal, curd, eggs, and protein totals.
          </p>
        </div>

        {/* Date Selector & Add Food Button */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-lime-400"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-lime-400/20 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Food</span>
          </button>
        </div>
      </div>

      {/* Daily Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Calories Progress Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Energy Intake
            </span>
            <span className="text-xs font-bold text-lime-400">
              {calProgress}% of ~{targetCalories} kcal
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalCaloriesLogged}{' '}
            <span className="text-xs font-normal text-slate-400">/ ~{targetCalories} kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-lime-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${calProgress}%` }}
            />
          </div>
        </div>

        {/* Protein Progress Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Daily Protein Target
            </span>
            <span className="text-xs font-bold text-emerald-400">
              {proteinProgress}% of ~{targetProtein}g
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalProteinLogged}g{' '}
            <span className="text-xs font-normal text-slate-400">/ ~{targetProtein}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${proteinProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Meals by Sections */}
      <div className="space-y-6">
        {mealSections.map((section) => {
          const sectionLogs = todaysLogs.filter((l) => l.mealType === section.type);
          const sectionCals = sectionLogs.reduce((sum, i) => sum + i.calories, 0);
          const sectionPro = sectionLogs.reduce((sum, i) => sum + i.proteinGrams, 0);

          return (
            <div
              key={section.type}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="font-extrabold text-white text-base">{section.label}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-300 font-bold">{sectionCals} kcal</span>
                  <span className="text-lime-400 font-bold">{sectionPro}g pro</span>
                </div>
              </div>

              {sectionLogs.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500">
                  Nothing logged for {section.label.toLowerCase()} yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {sectionLogs.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{item.foodName}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{item.portion}</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-white font-bold">{item.calories} kcal</div>
                          <div className="text-lime-400 text-[11px] font-semibold">
                            {item.proteinGrams}g pro
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteFoodLog(item.id)}
                          aria-label="Delete entry"
                          className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-slate-100">
            <h3 className="text-xl font-black text-white">Log Food or Indian Staple</h3>

            <form onSubmit={handleSaveFood} className="space-y-4">
              {/* Meal Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Meal
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMealType(m)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        selectedMealType === m
                          ? 'bg-lime-400 text-slate-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Preset vs Custom */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setUsePreset(true)}
                  className={`text-xs font-bold pb-1 ${
                    usePreset ? 'text-lime-400 border-b-2 border-lime-400' : 'text-slate-500'
                  }`}
                >
                  From Indian Database
                </button>
                <button
                  type="button"
                  onClick={() => setUsePreset(false)}
                  className={`text-xs font-bold pb-1 ${
                    !usePreset ? 'text-lime-400 border-b-2 border-lime-400' : 'text-slate-500'
                  }`}
                >
                  Custom Food Entry
                </button>
              </div>

              {usePreset ? (
                <div className="space-y-3">
                  {/* Real-time Food Search Bar */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Search Indian Food Database</span>
                      {foodSearchQuery.trim() && (
                        <span className="text-[10px] text-lime-400 font-normal">
                          {filteredIndianFoods.length} match{filteredIndianFoods.length === 1 ? '' : 'es'}
                        </span>
                      )}
                    </label>

                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={foodSearchQuery}
                        onFocus={() => setIsSearchDropdownOpen(true)}
                        onBlur={() => setIsSearchDropdownOpen(false)}
                        onChange={(e) => {
                          setFoodSearchQuery(e.target.value);
                          setIsSearchDropdownOpen(true);
                          setHighlightedIndex(0);
                        }}
                        onKeyDown={(e) => {
                          if (!isSearchDropdownOpen && e.key === 'ArrowDown') {
                            setIsSearchDropdownOpen(true);
                            return;
                          }
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setHighlightedIndex((prev) =>
                              prev < filteredIndianFoods.length - 1 ? prev + 1 : 0
                            );
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setHighlightedIndex((prev) =>
                              prev > 0 ? prev - 1 : filteredIndianFoods.length - 1
                            );
                          } else if (e.key === 'Enter') {
                            if (isSearchDropdownOpen && filteredIndianFoods[highlightedIndex]) {
                              e.preventDefault();
                              const selected = filteredIndianFoods[highlightedIndex];
                              setSelectedPresetId(selected.id);
                              setFoodSearchQuery(selected.name);
                              setIsSearchDropdownOpen(false);
                            }
                          } else if (e.key === 'Escape') {
                            setIsSearchDropdownOpen(false);
                          }
                        }}
                        placeholder="Search food, e.g. paneer, roti, dal, rice…"
                        className="w-full pl-9 pr-9 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-lime-400 transition-colors"
                      />
                      {foodSearchQuery.trim() ? (
                        <button
                          type="button"
                          onClick={() => {
                            setFoodSearchQuery('');
                            setIsSearchDropdownOpen(false);
                          }}
                          aria-label="Clear search"
                          className="absolute right-2.5 p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>

                    {/* Scrollable Matching Foods Dropdown Results */}
                    {isSearchDropdownOpen && (
                      <div className="absolute left-0 right-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-xl bg-slate-900 border border-slate-750 shadow-2xl p-1 divide-y divide-slate-800/60">
                        {filteredIndianFoods.length === 0 ? (
                          <div className="py-4 px-3 text-center text-xs text-slate-400">
                            No matching foods found
                          </div>
                        ) : (
                          filteredIndianFoods.map((f, idx) => {
                            const isSelected = selectedPresetId === f.id;
                            const isHighlighted = highlightedIndex === idx;
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onMouseDown={(e) => {
                                  // Prevent input blur before click registers
                                  e.preventDefault();
                                  setSelectedPresetId(f.id);
                                  setFoodSearchQuery(f.name);
                                  setIsSearchDropdownOpen(false);
                                }}
                                onClick={() => {
                                  setSelectedPresetId(f.id);
                                  setFoodSearchQuery(f.name);
                                  setIsSearchDropdownOpen(false);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedPresetId(f.id);
                                    setFoodSearchQuery(f.name);
                                    setIsSearchDropdownOpen(false);
                                  }
                                }}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                                  isHighlighted
                                    ? 'bg-slate-800 text-white'
                                    : isSelected
                                    ? 'bg-lime-400/10 text-lime-300'
                                    : 'text-slate-200 hover:bg-slate-800/70'
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold truncate flex items-center gap-1.5">
                                    <span>{f.name}</span>
                                    {f.hindiName && (
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        ({f.hindiName})
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                    {f.portionDescription}
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="font-mono font-bold text-white text-[11px]">
                                    {f.calories} kcal
                                  </div>
                                  <div className="text-lime-400 text-[10px] font-semibold">
                                    {f.proteinGrams}g pro
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Existing Food Selection Dropdown (Maintained & Connected) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Selected Food Item
                    </label>
                    <select
                      value={selectedPresetId}
                      onChange={(e) => {
                        setSelectedPresetId(e.target.value);
                        const match = INDIAN_FOODS_DATABASE.find((f) => f.id === e.target.value);
                        if (match) setFoodSearchQuery(match.name);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                    >
                      {filteredIndianFoods.length === 0 ? (
                        <option disabled value="">No matching foods found</option>
                      ) : (
                        filteredIndianFoods.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.portionDescription}) — {f.calories} kcal, {f.proteinGrams}g pro
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Food Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customFoodName}
                      onChange={(e) => setCustomFoodName(e.target.value)}
                      placeholder="e.g. Besan Chilla with Curd"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Portion Size
                    </label>
                    <input
                      type="text"
                      value={customPortion}
                      onChange={(e) => setCustomPortion(e.target.value)}
                      placeholder="e.g. 2 medium chillas"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Calories (kcal)
                      </label>
                      <input
                        type="number"
                        required
                        value={customCalories}
                        onChange={(e) => setCustomCalories(e.target.value)}
                        placeholder="e.g. 250"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        required
                        value={customProtein}
                        onChange={(e) => setCustomProtein(e.target.value)}
                        placeholder="e.g. 14"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setIsSearchDropdownOpen(false);
                    setFoodSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs shadow-md shadow-lime-400/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
