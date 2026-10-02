import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Search,
  Menu,
} from 'lucide-react';
import useThemeStore from '../../store/themeStore.js';

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

  return (
    <header className="sticky top-3 z-30 mx-3 md:mx-8 mb-2 h-14 md:h-16 rounded-2xl md:rounded-[22px] bg-white/80 dark:bg-[#101a12]/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 px-3 md:px-6 flex items-center justify-between transition-all shadow-[0_12px_28px_-6px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.4)]">
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
          <p className="text-[10px] md:text-[11px] text-slate-400 font-semibold tracking-wide truncate">
            Admin / <span className="capitalize text-slate-500 dark:text-slate-400">{location.pathname.replace('/admin/', '').replace('/', ' > ') || 'Dashboard'}</span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Command Palette Button — hidden on mobile */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-[#edf2ed] dark:bg-[#0c160e] hover:bg-[#e4ece4] dark:hover:bg-[#121f15] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/5 rounded-full transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>Search or jump to...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10 rounded-md shadow-xs font-mono">
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

        {/* Theme Toggle — Single Key */}
        <button
          type="button"
          onClick={() => {
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            setTheme(isDark ? 'light' : 'dark');
          }}
          className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center bg-[#edf2ed] dark:bg-[#0c160e] hover:bg-amber-50 dark:hover:bg-indigo-950/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-90 hover:scale-110 overflow-hidden group"
          title={theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          <div className="relative w-4.5 h-4.5 md:w-5 md:h-5 flex items-center justify-center">
            <Sun
              className={`w-4.5 h-4.5 md:w-5 md:h-5 text-amber-500 absolute inset-0 transition-all duration-500 ${
                theme === 'dark'
                  ? 'rotate-90 scale-0 opacity-0'
                  : 'rotate-0 scale-100 opacity-100 group-hover:rotate-45 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
              }`}
            />
            <Moon
              className={`w-4.5 h-4.5 md:w-5 md:h-5 text-indigo-300 absolute inset-0 transition-all duration-500 ${
                theme === 'dark'
                  ? 'rotate-0 scale-100 opacity-100 group-hover:-rotate-12 drop-shadow-[0_0_6px_rgba(165,180,252,0.6)]'
                  : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  );
}
