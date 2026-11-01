import React from 'react';
import { UserProfile } from '../types';
import { CalorieMeter } from '../components/CalorieMeter';
import { Calculator, ShieldAlert, Sparkles, Info, BookOpen, Utensils } from 'lucide-react';

interface CalorieCalculatorPageProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const CalorieCalculatorPage: React.FC<CalorieCalculatorPageProps> = ({
  userProfile,
  onUpdateProfile
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
          <span>Science-Based Metabolic & Calorie Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Calorie Meter & Energy Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Powered by the clinically validated <strong>Mifflin–St Jeor equation</strong> for daily energy expenditure and the <strong>ACSM Compendium of Physical Activities</strong> for active workout burn.
        </p>
      </div>

      {/* Main Interactive Calorie Meter Hub */}
      <CalorieMeter
        userProfile={userProfile}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Educational Guide: Distinction between Burn and Intake */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-lime-400 text-sm font-bold">
            <BookOpen className="w-4 h-4" />
            <span>How Daily Needs (TDEE) Are Calculated</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your <strong>Basal Metabolic Rate (BMR)</strong> is determined by weight, height, age, and sex. This is multiplied by your lifestyle activity factor to establish Total Daily Energy Expenditure (TDEE). FitMood never prescribes dangerous crash starvation diets below 1,250 kcal (female) or 1,500 kcal (male).
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <Utensils className="w-4 h-4" />
            <span>Active Workout Burn (METs)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Exercise calories are computed independently using <strong>Metabolic Equivalent of Task (MET)</strong> ratings. Moderate bodyweight calisthenics expends ~5.0 METs, while explosive circuits reach ~8.8 METs. This distinct metric tracks workout intensity without interfering with baseline dietary requirements.
          </p>
        </div>
      </div>
    </div>
  );
};
