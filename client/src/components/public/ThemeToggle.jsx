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
      className={`relative w-10 h-10 rounded-2xl flex items-center justify-center bg-white/90 dark:bg-white/[0.06] hover:bg-amber-50 dark:hover:bg-white/10 border border-slate-300/70 dark:border-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-slate-700 dark:text-amber-400 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 hover:scale-110 overflow-hidden group ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon (shown in light mode) */}
        <Sun
          className={`w-5 h-5 text-amber-500 transition-all duration-500 absolute inset-0 ${
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100 group-hover:rotate-45 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]'
          }`}
        />
        {/* Moon Icon (shown in dark mode) */}
        <Moon
          className={`w-5 h-5 text-amber-300 transition-all duration-500 absolute inset-0 ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 group-hover:-rotate-12 drop-shadow-[0_0_4px_rgba(252,211,77,0.6)]'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      {/* Subtle pulse glow behind active icon */}
      <span className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-700 ${
        isDark
          ? 'bg-indigo-500/10 opacity-100 animate-pulse'
          : 'bg-amber-400/10 opacity-100 animate-pulse'
      }`} style={{ animationDuration: '3s' }} />
    </button>
  );
}
