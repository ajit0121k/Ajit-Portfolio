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
      type="button"
      onClick={toggle}
      className={`relative h-7 sm:h-8 w-13 sm:w-16 px-0.5 sm:px-1 py-0.5 rounded-full flex items-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group select-none flex-shrink-0 ${
        isDark
          ? 'bg-gradient-to-r from-[#0a150c] via-[#0f2416] to-[#0a150c] border border-emerald-400/30 shadow-[inset_0_2px_5px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.3)]'
          : 'bg-gradient-to-r from-amber-100/90 via-[#f5edd9] to-emerald-50/80 border border-amber-300/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(217,119,6,0.12)]'
      } ${className}`}
      title={isDark ? 'Switch to Day (Light Mode)' : 'Switch to Night (Dark Mode)'}
      aria-label="Toggle theme"
    >
      {/* Subtle Ambient Track Glow */}
      <span
        className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-emerald-500/10 opacity-100' : 'bg-amber-400/15 opacity-100'
        }`}
      />

      {/* Background Day Sun Icon */}
      <span className="absolute left-1.5 sm:left-2 flex items-center justify-center pointer-events-none transition-opacity duration-300">
        <Sun className={`w-3 h-3 ${isDark ? 'text-emerald-500/30' : 'text-amber-500/30'}`} />
      </span>

      {/* Background Night Moon Icon */}
      <span className="absolute right-1.5 sm:right-2 flex items-center justify-center pointer-events-none transition-opacity duration-300">
        <Moon className={`w-3 h-3 ${isDark ? 'text-indigo-400/30' : 'text-slate-400/35'}`} />
      </span>

      {/* 3D Liquid Glass Gliding Lens / Thumb */}
      <div
        className={`relative z-10 w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
          isDark
            ? 'translate-x-[22px] sm:translate-x-[28px] bg-gradient-to-b from-[#1f3826] to-[#122317] border border-emerald-300/40 shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_10px_rgba(52,211,153,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.3)]'
            : 'translate-x-0 bg-gradient-to-b from-white to-[#faf6ef] border border-white shadow-[0_4px_12px_rgba(245,158,11,0.28),0_2px_6px_rgba(0,0,0,0.08),inset_0_1.5px_2px_rgba(255,255,255,1)]'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)] transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)] transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>
    </button>
  );
}
