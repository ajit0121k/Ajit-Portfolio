import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export function applyThemeToDOM(theme, preset = 'default') {
  if (typeof window === 'undefined') return;
  
  let isDark = false;
  if (theme === 'dark') {
    isDark = true;
  } else if (theme === 'light') {
    isDark = false;
  } else {
    // system
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }

  if (preset) {
    document.documentElement.setAttribute('data-theme', preset);
  }
}

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system',
      themePreset: 'default',

      setTheme: (theme) => {
        set({ theme });
        applyThemeToDOM(theme, get().themePreset);
      },

      setPreset: (themePreset) => {
        set({ themePreset });
        applyThemeToDOM(get().theme, themePreset);
      },

      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
            ? 'dark'
            : 'light';
        }
        return theme;
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.theme, state.themePreset);
        }
      }
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem('theme-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.theme) {
        applyThemeToDOM(parsed.state.theme, parsed.state.themePreset || 'default');
      }
    } else {
      applyThemeToDOM('system', 'default');
    }
  } catch (e) {}

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const store = useThemeStore.getState();
    if (store.theme === 'system') {
      applyThemeToDOM('system', store.themePreset);
    }
  });
}

export default useThemeStore;