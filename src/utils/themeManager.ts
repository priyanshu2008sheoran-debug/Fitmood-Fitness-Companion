export type AppThemeId =
  | 'sunset_orange'
  | 'light'
  | 'dark'
  | 'ocean_blue'
  | 'forest_green'
  | 'lavender';

export type AppThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  id: AppThemeId;
  name: string;
  tagline: string;
  description: string;
  defaultMode: AppThemeMode;
  isSignature?: boolean;
  preview: {
    bg: string;
    card: string;
    primary: string;
    accent: string;
    text: string;
  };
}

export const APP_THEMES: ThemeConfig[] = [
  {
    id: 'sunset_orange',
    name: 'Sunset Orange',
    tagline: 'Signature FitMood Identity',
    description: 'Warm cream base with energetic orange and vibrant coral accents for an active, motivating workout atmosphere.',
    defaultMode: 'light',
    isSignature: true,
    preview: {
      bg: '#fffbf5',
      card: '#ffffff',
      primary: '#c2410c',
      accent: '#f43f5e',
      text: '#1c1917'
    }
  },
  {
    id: 'light',
    name: 'Crisp Light',
    tagline: 'Clean & Ultra-Legible',
    description: 'Pure slate-50 canvas with crisp dark typography and high-contrast lime highlights for effortless daylight reading.',
    defaultMode: 'light',
    preview: {
      bg: '#f8fafc',
      card: '#ffffff',
      primary: '#4d7c0f',
      accent: '#059669',
      text: '#0f172a'
    }
  },
  {
    id: 'dark',
    name: 'Midnight Dark',
    tagline: 'Classic Focus Calisthenics',
    description: 'Deep midnight charcoal with electric lime glows and luminous typography for low-light evening training.',
    defaultMode: 'dark',
    preview: {
      bg: '#020617',
      card: '#0f172a',
      primary: '#a3e635',
      accent: '#34d399',
      text: '#f8fafc'
    }
  },
  {
    id: 'ocean_blue',
    name: 'Ocean Blue',
    tagline: 'Calm, Modern & Professional',
    description: 'Refreshing coastal blue-tinted white with rich nautical cyan and deep turquoise accents.',
    defaultMode: 'light',
    preview: {
      bg: '#f0f7ff',
      card: '#ffffff',
      primary: '#0369a1',
      accent: '#06b6d4',
      text: '#082f49'
    }
  },
  {
    id: 'forest_green',
    name: 'Forest Green',
    tagline: 'Natural, Healthy & Wellness',
    description: 'Harmonious botanical pale green background with deep pine primary tones and fresh energizing mint.',
    defaultMode: 'light',
    preview: {
      bg: '#f2f9f4',
      card: '#ffffff',
      primary: '#15803d',
      accent: '#10b981',
      text: '#052e16'
    }
  },
  {
    id: 'lavender',
    name: 'Soft Lavender',
    tagline: 'Clean, Relaxing & Contemporary',
    description: 'Gentle pastel lavender-white with royal purple primary structure and soothing violet accents.',
    defaultMode: 'light',
    preview: {
      bg: '#faf5ff',
      card: '#ffffff',
      primary: '#9333ea',
      accent: '#c084fc',
      text: '#3b0764'
    }
  }
];

export const STORAGE_THEME_KEY = 'fitmood_active_theme';
export const STORAGE_MODE_KEY = 'fitmood_active_mode';

/**
 * Retrieve saved theme or default to FitMood Signature Sunset Orange in Light mode.
 */
export function getStoredTheme(): { themeId: AppThemeId; mode: AppThemeMode } {
  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) as AppThemeId | null;
  const savedMode = localStorage.getItem(STORAGE_MODE_KEY) as AppThemeMode | null;

  if (savedTheme && APP_THEMES.some((t) => t.id === savedTheme)) {
    const config = APP_THEMES.find((t) => t.id === savedTheme)!;
    const mode = savedMode === 'light' || savedMode === 'dark' ? savedMode : config.defaultMode;
    return { themeId: savedTheme, mode };
  }

  // First-run default: FitMood Signature Sunset Orange in Light mode
  return { themeId: 'sunset_orange', mode: 'light' };
}

/**
 * Applies the theme attributes to <html> and persists to localStorage.
 */
export function applyTheme(themeId: AppThemeId, mode?: AppThemeMode) {
  const config = APP_THEMES.find((t) => t.id === themeId) || APP_THEMES[0];
  const effectiveMode = mode || config.defaultMode;

  const root = document.documentElement;

  // Set data attributes
  root.setAttribute('data-theme', themeId);
  root.setAttribute('data-mode', effectiveMode);

  // Manage dark class for Tailwind utility classes
  if (effectiveMode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Sync to local storage
  localStorage.setItem(STORAGE_THEME_KEY, themeId);
  localStorage.setItem(STORAGE_MODE_KEY, effectiveMode);
  // Also sync legacy key for backwards compatibility
  localStorage.setItem('fitmood_theme', effectiveMode === 'dark' ? 'dark' : 'light');

  return { themeId, mode: effectiveMode };
}
