import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Search,
  Menu,
  ExternalLink,
} from 'lucide-react';
import useThemeStore from '../../store/themeStore.js';
import { resolveAssetUrl } from '../../utils/assetUrl.js';

export default function TopBar({ onOpenCommandPalette, onToggleMobileMenu }) {
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();

  const getPageTitle = (pathname) => {
    const path = pathname.replace('/admin/', '').split('/')[0];
    const titles = {
      dashboard: 'Dashboard Overview',
      profile: 'Developer Profile & Bio',
      resume: 'Resume & CV Document',
      projects: 'Project Portfolio',
      skills: 'Skills & Proficiencies',
      experience: 'Career & Work Experience',
      education: 'Academic Background',
      certifications: 'Licenses & Certifications',
      blog: 'Technical Blog & Articles',
      testimonials: 'Client Testimonials & Reviews',
      messages: 'Contact Messages & Inquiries',
      media: 'Media & Uploads Library',
      analytics: 'Visitor & Traffic Analytics',
      activity: 'Security & Activity Audit',
      settings: 'Site Settings & SEO',
      seo: 'Search Engine Optimization (SEO)',
      preview: 'Live Portfolio Sandbox',
    };
    return titles[path] || 'Admin CMS';
  };

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <header className="sticky top-3 z-30 mx-3 md:mx-8 mb-2 h-14 md:h-16 rounded-2xl md:rounded-[24px] super-glossy-glass glossy-glare-edge px-3 md:px-6 flex items-center justify-between transition-all">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-2 md:gap-0 min-w-0">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm md:text-lg font-extrabold text-[#153f31] dark:text-emerald-300 flex items-center gap-2 tracking-tight truncate">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="text-[10px] md:text-[11px] text-slate-600 dark:text-slate-300 font-bold tracking-wide truncate">
            Admin / <span className="capitalize text-emerald-800 dark:text-emerald-300 font-extrabold">{location.pathname.replace('/admin/', '').replace('/', ' > ') || 'Dashboard'}</span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Command Palette Button — hidden on mobile */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 super-glossy-inset rounded-full hover:border-emerald-500/40 transition-all cursor-pointer active:scale-95"
        >
          <Search className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>Search or jump to...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 bg-white/90 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10 rounded-md shadow-xs font-mono font-bold">
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenCommandPalette}
          className="sm:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          aria-label="Search"
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        {/* View Live Portfolio Site */}
        <a
          href={resolveAssetUrl('/')}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 text-xs font-bold text-white super-glossy-btn-amber rounded-full transition-all cursor-pointer active:scale-95"
          title="Open live public portfolio in a new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Site</span>
        </a>

        {/* Super Glossy Capsule Day/Night Slider Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`relative h-9 md:h-10 px-1 py-1 rounded-full flex items-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group select-none ${
            isDark
              ? 'w-16 md:w-20 bg-gradient-to-r from-[#0a150c] via-[#0f2416] to-[#0a150c] border border-emerald-400/30 shadow-[inset_0_2px_5px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.3)]'
              : 'w-16 md:w-20 bg-gradient-to-r from-amber-100/90 via-[#f5edd9] to-emerald-50/80 border border-amber-300/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(217,119,6,0.12)]'
          }`}
          title={isDark ? 'Switch to Day (Light Mode)' : 'Switch to Night (Dark Mode)'}
          aria-label="Toggle theme"
        >
          {/* Subtle Ambient Track Glow */}
          <span
            className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500 ${
              isDark ? 'bg-emerald-500/10 opacity-100' : 'bg-amber-400/15 opacity-100'
            }`}
          />

          {/* Background Day Icon */}
          <span className="absolute left-2 flex items-center justify-center pointer-events-none transition-opacity duration-300">
            <Sun className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-500/40' : 'text-amber-500/30'}`} />
          </span>

          {/* Background Night Icon */}
          <span className="absolute right-2 flex items-center justify-center pointer-events-none transition-opacity duration-300">
            <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400/30' : 'text-slate-400/40'}`} />
          </span>

          {/* 3D Liquid Glass Gliding Lens / Thumb */}
          <div
            className={`relative z-10 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
              isDark
                ? 'translate-x-[26px] md:translate-x-[38px] bg-gradient-to-b from-[#1f3826] to-[#122317] border border-emerald-300/40 shadow-[0_4px_14px_rgba(0,0,0,0.6),0_0_12px_rgba(52,211,153,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.3)]'
                : 'translate-x-0 bg-gradient-to-b from-white to-[#faf6ef] border border-white shadow-[0_4px_14px_rgba(245,158,11,0.28),0_2px_6px_rgba(0,0,0,0.08),inset_0_1.5px_2px_rgba(255,255,255,1)]'
            }`}
          >
            {/* Active Sun Icon */}
            <Sun
              className={`w-4 h-4 md:w-4.5 md:h-4.5 text-amber-500 absolute transition-all duration-400 ${
                isDark
                  ? 'rotate-90 scale-0 opacity-0'
                  : 'rotate-0 scale-100 opacity-100 group-hover:rotate-45 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
              }`}
            />
            {/* Active Moon Icon */}
            <Moon
              className={`w-4 h-4 md:w-4.5 md:h-4.5 text-emerald-300 absolute transition-all duration-400 ${
                isDark
                  ? 'rotate-0 scale-100 opacity-100 group-hover:-rotate-12 drop-shadow-[0_0_8px_rgba(110,231,183,0.85)]'
                  : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  );
}
