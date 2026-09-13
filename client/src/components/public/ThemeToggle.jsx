import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useThemeStore from '../../store/themeStore.js';

export default function ThemeToggle({ className = '' }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggle}
      className={`relative w-8 h-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-300/80 dark:border-white/15 shadow-sm text-slate-700 dark:text-amber-400 transition-all duration-300 active:scale-90 overflow-hidden group ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Sun Icon (shown in light mode) */}
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-500 absolute inset-0 ${
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100 group-hover:rotate-45'
          }`}
        />
        {/* Moon Icon (shown in dark mode) */}
        <Moon
          className={`w-4 h-4 text-amber-300 transition-all duration-500 absolute inset-0 ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 group-hover:-rotate-12'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
}
