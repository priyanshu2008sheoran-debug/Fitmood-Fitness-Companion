import React, { useState } from 'react';
import { UserProfile, AppThemeId } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { APP_THEMES, AppThemeMode } from '../utils/themeManager';
import {
  Settings,
  Moon,
  Sun,
  ShieldCheck,
  Download,
  Trash2,
  Database,
  Lock,
  LogOut,
  LogIn,
  Palette,
  Check,
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';

interface SettingsPageProps {
  userProfile: UserProfile | null;
  currentTheme: AppThemeId;
  currentMode: AppThemeMode;
  onChangeTheme: (themeId: AppThemeId, mode?: AppThemeMode) => void;
  onToggleMode: () => void;
  onClearLocalData: () => void;
  onProfileUpdated?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userProfile,
  currentTheme,
  currentMode,
  onChangeTheme,
  onToggleMode,
  onClearLocalData,
  onProfileUpdated
}) => {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportData = () => {
    const data = {
      profile: userProfile,
      theme: { themeId: currentTheme, mode: currentMode },
      exportedAt: new Date().toISOString(),
      app: 'FitMood Web'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitmood_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold mb-2">
          <Palette className="w-3.5 h-3.5" />
          <span>App Appearance & Settings</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings & Theme Personalization
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Customize your visual atmosphere, real-time database synchronization, and your private calisthenics records.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* ========================================================
            THEME PICKER: All 6 Coordinated Themes + Mode Switch
            ======================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-slate-900 dark:text-white text-lg">
                  Theme Palette Selector
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Select your preferred visual aesthetic. Color tokens instantly adapt across charts, exercises, cards, and navigation.
              </p>
            </div>

            {/* Light / Dark Mode Toggle Switch */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  if (currentMode !== 'light') onToggleMode();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentMode === 'light'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentMode !== 'dark') onToggleMode();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentMode === 'dark'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* 6 Theme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {APP_THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;

              // Theme-specific button preview styles
              const buttonPreviews: Record<AppThemeId, { primaryBg: string; primaryText: string; secBg: string; secText: string; secBorder: string }> = {
                sunset_orange: { primaryBg: '#c2410c', primaryText: '#ffffff', secBg: '#1c1917', secText: '#ffffff', secBorder: '#44403c' },
                light: { primaryBg: '#4d7c0f', primaryText: '#ffffff', secBg: '#0f172a', secText: '#ffffff', secBorder: '#334155' },
                dark: { primaryBg: '#a3e635', primaryText: '#020617', secBg: '#1e293b', secText: '#f8fafc', secBorder: '#475569' },
                ocean_blue: { primaryBg: '#0369a1', primaryText: '#ffffff', secBg: '#0c4a6e', secText: '#ffffff', secBorder: '#0284c7' },
                forest_green: { primaryBg: '#15803d', primaryText: '#ffffff', secBg: '#14532d', secText: '#ffffff', secBorder: '#15803d' },
                lavender: { primaryBg: '#9333ea', primaryText: '#ffffff', secBg: '#3b0764', secText: '#ffffff', secBorder: '#581c87' }
              };

              const btnStyle = buttonPreviews[theme.id];

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onChangeTheme(theme.id)}
                  style={
                    isSelected
                      ? {
                          borderColor: 'var(--app-primary)',
                          boxShadow: '0 0 0 2.5px var(--app-primary)',
                          backgroundColor: 'var(--app-accent-subtle)'
                        }
                      : {}
                  }
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3.5 relative cursor-pointer group ${
                    isSelected
                      ? 'shadow-lg'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white/80 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  {/* Top Header: Badge, Name, Selection Checkmark */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {theme.name}
                        </span>
                        {theme.isSignature && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs">
                            Signature
                          </span>
                        )}
                      </div>

                      {/* Selection Indicator (Radio / Checkmark) */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'text-white'
                            : 'border-2 border-slate-300 dark:border-slate-700 group-hover:border-slate-500'
                        }`}
                        style={isSelected ? { backgroundColor: 'var(--app-primary)' } : {}}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div
                      className="text-xs font-bold mb-1 tracking-tight"
                      style={{ color: 'var(--app-primary-text)' }}
                    >
                      {theme.tagline}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* Live Button Preview inside theme card */}
                  <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>Button Contrast Preview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Primary Button Preview */}
                      <div
                        className="flex-1 py-1 px-2.5 rounded-lg text-center text-[11px] font-black shadow-xs pointer-events-none truncate"
                        style={{
                          backgroundColor: btnStyle.primaryBg,
                          color: btnStyle.primaryText
                        }}
                      >
                        Primary
                      </div>
                      {/* Secondary Button Preview */}
                      <div
                        className="flex-1 py-1 px-2.5 rounded-lg text-center text-[11px] font-bold shadow-xs pointer-events-none border truncate"
                        style={{
                          backgroundColor: btnStyle.secBg,
                          color: btnStyle.secText,
                          borderColor: btnStyle.secBorder
                        }}
                      >
                        Secondary
                      </div>
                    </div>
                  </div>

                  {/* Coordinated Color Swatches */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Swatches:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300/80 shadow-xs"
                        style={{ backgroundColor: theme.preview.bg }}
                        title="Canvas Background"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300/80 shadow-xs"
                        style={{ backgroundColor: theme.preview.card }}
                        title="Card Surface"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300/80 shadow-xs"
                        style={{ backgroundColor: theme.preview.primary }}
                        title="Primary Color"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300/80 shadow-xs"
                        style={{ backgroundColor: theme.preview.accent }}
                        title="Accent Color"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300/80 shadow-xs"
                        style={{ backgroundColor: theme.preview.text }}
                        title="Typography"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
            <span>
              Theme selection is saved to your browser and syncs automatically across workouts, AI Coach, and food logging without any page reload.
            </span>
          </div>
        </div>

        {/* Cloud Sync & Account */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Cloud Sync & Authentication</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Secured by Google Cloud Firestore with Attribute-Based Access Control (ABAC).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                {auth.currentUser ? 'Account Connected' : 'Guest / Local Mode'}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {auth.currentUser
                  ? `Signed in as ${auth.currentUser.email || auth.currentUser.displayName}`
                  : 'Data saved locally on this browser. Sign in with Google to sync across phones and laptops.'}
              </span>
            </div>

            {auth.currentUser ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black transition-all flex items-center gap-2 self-start sm:self-auto shadow-md shadow-orange-500/20 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{authLoading ? 'Signing in...' : 'Sign In with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Privacy & Zero-Spam Promise */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Privacy & Zero-Spam Promise</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Your health data is completely yours.</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 leading-relaxed">
            <p>
              • <strong>Strict User Isolation:</strong> In accordance with Firestore ABAC rules, your workouts, mood check-ins, food logs, and body metrics can only be accessed by you.
            </p>
            <p>
              • <strong>No Gym Fees & No Paywalls:</strong> FitMood is built to empower students, beginners, and anyone without expensive gym equipment or subscriptions.
            </p>
            <p>
              • <strong>No Shaming:</strong> Rest days, recovery sessions, and gentle habits are rewarded equally with intense workouts.
            </p>
          </div>
        </div>

        {/* Data Export & Reset */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Data Management</h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-500" />
              <span>Export All Records (JSON)</span>
            </button>

            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-500 font-bold">Are you sure?</span>
                <button
                  onClick={() => {
                    onClearLocalData();
                    setResetConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Local Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
