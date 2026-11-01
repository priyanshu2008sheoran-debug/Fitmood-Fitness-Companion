import React, { useState } from 'react';
import { FoodItem, MealComboPlan, DietaryPreference, FoodLog } from '../types';
import { INDIAN_FOODS_DATABASE, SAMPLE_INDIAN_MEAL_PLANS } from '../data/indianFoodsData';
import {
  Utensils,
  Plus,
  Sparkles,
  Filter,
  Check,
  Coins,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface NutritionPlannerPageProps {
  onQuickLogFood: (food: FoodLog) => void;
  userDietaryPreference?: DietaryPreference;
}

export const NutritionPlannerPage: React.FC<NutritionPlannerPageProps> = ({
  onQuickLogFood,
  userDietaryPreference = 'vegetarian'
}) => {
  const [dietFilter, setDietFilter] = useState<string>(userDietaryPreference);
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'meals' | 'foods'>('meals');
  const [allergenExclusion, setAllergenExclusion] = useState<string>('none');
  const [loggedNotification, setLoggedNotification] = useState<string | null>(null);

  // Filter combo meal plans
  const filteredMealPlans = SAMPLE_INDIAN_MEAL_PLANS.filter((plan) => {
    if (dietFilter !== 'all' && plan.dietaryType !== dietFilter) {
      return false;
    }
    return true;
  });

  // Filter individual food items
  const filteredFoods = INDIAN_FOODS_DATABASE.filter((food) => {
    if (dietFilter !== 'all' && food.dietaryType !== dietFilter) {
      // vegan fits vegetarian, eggetarian fits non-veg etc
      if (dietFilter === 'vegetarian' && food.dietaryType !== 'vegan' && food.dietaryType !== 'vegetarian') {
        return false;
      }
      if (dietFilter === 'vegan' && food.dietaryType !== 'vegan') {
        return false;
      }
      if (dietFilter === 'eggetarian' && food.dietaryType === 'non_vegetarian') {
        return false;
      }
    }

    if (selectedMealType !== 'all' && food.typicalMeal !== 'any' && food.typicalMeal !== selectedMealType) {
      return false;
    }

    if (allergenExclusion !== 'none') {
      if (food.allergens && food.allergens.includes(allergenExclusion)) {
        return false;
      }
    }

    return true;
  });

  const handleLogItem = (food: FoodItem) => {
    const meal = food.typicalMeal === 'any' ? 'lunch' : (food.typicalMeal as 'breakfast' | 'lunch' | 'dinner' | 'snack');
    const log: FoodLog = {
      id: `flog_${Date.now()}`,
      userId: 'current',
      mealType: meal,
      foodName: food.name,
      portion: food.portionDescription,
      calories: food.calories,
      proteinGrams: food.proteinGrams,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    onQuickLogFood(log);
    setLoggedNotification(`Added "${food.name}" to daily food log!`);
    setTimeout(() => setLoggedNotification(null), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Toast Notification */}
      {loggedNotification && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-lime-400 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{loggedNotification}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
          <span>Everyday Student & Budget Nutrition</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Affordable Indian Nutrition Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Build muscle and fuel stamina without expensive imported whey or boutique supplements. Common desi staples like soy chunks, dal, sattu, eggs, and curd provide premium protein at friendly student prices.
        </p>
      </div>

      {/* Budget Swaps Spotlight Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-lime-500/10 to-slate-900 border border-emerald-500/20 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">
              The Desi Budget Advantage: Protein Under ₹1 per Gram
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              100g of dry soy chunks costs ~₹25 and delivers <strong>52g of protein</strong>. 2 boiled eggs cost ~₹14 for <strong>12g protein</strong>. Roasted Chana Sattu costs ~₹10 for <strong>11g protein</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs & Dietary Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Main View Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTab('meals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'meals'
                  ? 'bg-lime-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Full Day Indian Meal Plans
            </button>
            <button
              onClick={() => setSelectedTab('foods')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTab === 'foods'
                  ? 'bg-lime-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Desi Foods & Protein Library
            </button>
          </div>

          {/* Allergy Exclusion */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">Exclude Allergy:</span>
            <select
              value={allergenExclusion}
              onChange={(e) => setAllergenExclusion(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-lime-400"
            >
              <option value="none">None</option>
              <option value="Dairy">Dairy (Milk, Curd, Paneer)</option>
              <option value="Peanuts">Peanuts</option>
              <option value="Gluten">Gluten (Wheat Roti, Dalia)</option>
              <option value="Soy">Soy</option>
              <option value="Eggs">Eggs</option>
              <option value="Fish">Fish</option>
            </select>
          </div>
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-slate-500 font-bold uppercase shrink-0">Diet:</span>
          {[
            { id: 'all', label: 'All Preferences' },
            { id: 'vegetarian', label: 'Vegetarian' },
            { id: 'vegan', label: 'Vegan' },
            { id: 'eggetarian', label: 'Eggetarian' },
            { id: 'non_vegetarian', label: 'Non-Veg' }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDietFilter(d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                dietFilter === d.id
                  ? 'bg-lime-400 text-slate-950 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content 1: Full Day Indian Meal Plans */}
      {selectedTab === 'meals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMealPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-lime-400/10 text-lime-400 text-[10px] font-extrabold uppercase">
                    {plan.dietaryType.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      🔥 ~{plan.totalCalories} kcal
                    </span>
                    <span className="text-xs font-bold text-lime-400">
                      💪 {plan.totalProteinGrams}g Protein
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {plan.description}
                </p>

                {/* Meals Breakdown */}
                <div className="space-y-2 mt-5">
                  {plan.meals.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-lime-400 capitalize text-[11px]">
                          {m.mealType}
                        </div>
                        <div className="text-slate-300 mt-0.5 font-medium">{m.items}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-white font-semibold">{m.calories} kcal</div>
                        <div className="text-lime-400 font-bold text-[11px]">{m.proteinGrams}g pro</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Approximate student-friendly portions</span>
                <span className="text-xs font-bold text-emerald-400">Budget Rating: ₹ Low Cost</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: Individual Indian Foods Library with Quick-Add */}
      {selectedTab === 'foods' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 text-[10px] font-bold uppercase">
                    {food.category}
                  </span>
                  <span className="text-xs font-bold text-lime-400">
                    {food.proteinGrams}g Protein
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base">
                  {food.name}
                </h3>
                {food.hindiName && (
                  <div className="text-xs text-lime-400/80 font-medium">{food.hindiName}</div>
                )}

                <div className="text-[11px] text-slate-400 mt-2 font-mono">
                  Portion: {food.portionDescription}
                </div>

                {/* Macros line */}
                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-center my-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Calories</span>
                    <span className="font-bold text-white">~{food.calories}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Carbs</span>
                    <span className="font-bold text-sky-400">{food.carbsGrams}g</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fats</span>
                    <span className="font-bold text-amber-400">{food.fatsGrams}g</span>
                  </div>
                </div>

                {/* Budget tip */}
                {food.budgetSubstituteTip && (
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    💡 {food.budgetSubstituteTip}
                  </p>
                )}
              </div>

              {/* Log Meal Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 capitalize">
                  {food.typicalMeal === 'any' ? 'Any meal' : food.typicalMeal}
                </span>

                <button
                  onClick={() => handleLogItem(food)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400/10 hover:bg-lime-400 text-lime-400 hover:text-slate-950 text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log to Food Tracker</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
