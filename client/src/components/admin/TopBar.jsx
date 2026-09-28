import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Laptop,
  Search,
} from 'lucide-react';
import useThemeStore from '../../store/themeStore.js';

export default function TopBar({ onOpenCommandPalette }) {
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
    <header className="sticky top-3 z-30 mx-4 md:mx-8 mb-2 h-16 rounded-[22px] bg-white/80 dark:bg-[#101a12]/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 px-6 flex items-center justify-between transition-all shadow-[0_12px_28px_-6px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.4)]">
      {/* Title & Breadcrumb */}
      <div>
        <h1 className="text-base sm:text-lg font-extrabold text-[#153f31] dark:text-emerald-300 flex items-center gap-2 tracking-tight">
          {getPageTitle(location.pathname)}
        </h1>
        <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
          Admin / <span className="capitalize text-slate-500 dark:text-slate-400">{location.pathname.replace('/admin/', '').replace('/', ' > ') || 'Dashboard'}</span>
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Command Palette Button - Tactile Inset Pill */}
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

        {/* Theme Switcher — Prominent Animated Pill */}
        <div className="flex items-center p-1.5 bg-gradient-to-r from-[#e8efe9] to-[#dce5dd] dark:from-[#0a150c] dark:to-[#0f1d12] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-black/[0.06] dark:border-white/10 rounded-2xl gap-0.5 transition-all duration-500">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`relative p-2.5 rounded-xl text-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${
              theme === 'light'
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_4px_20px_rgba(245,158,11,0.5)] scale-110 ring-2 ring-amber-300/50'
                : 'text-slate-400 hover:text-amber-500 hover:bg-white/60 dark:hover:bg-white/5 hover:scale-105'
            }`}
            title="Light Mode"
          >
            <Sun className={`w-[18px] h-[18px] transition-transform duration-500 ${theme === 'light' ? 'rotate-180 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'rotate-0'}`} />
            {theme === 'light' && (
              <span className="absolute inset-0 rounded-xl animate-ping bg-amber-400/20 pointer-events-none" style={{ animationDuration: '2s' }} />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`relative p-2.5 rounded-xl text-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-[0_4px_20px_rgba(99,102,241,0.5)] scale-110 ring-2 ring-indigo-400/50'
                : 'text-slate-400 hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-white/5 hover:scale-105'
            }`}
            title="Dark Mode"
          >
            <Moon className={`w-[18px] h-[18px] transition-transform duration-500 ${theme === 'dark' ? '-rotate-[20deg] drop-shadow-[0_0_6px_rgba(199,210,254,0.8)]' : 'rotate-0'}`} />
            {theme === 'dark' && (
              <span className="absolute inset-0 rounded-xl animate-ping bg-indigo-500/20 pointer-events-none" style={{ animationDuration: '2.5s' }} />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`relative p-2.5 rounded-xl text-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${
              theme === 'system'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.5)] scale-110 ring-2 ring-emerald-400/50'
                : 'text-slate-400 hover:text-emerald-500 hover:bg-white/60 dark:hover:bg-white/5 hover:scale-105'
            }`}
            title="System Auto Mode"
          >
            <Laptop className={`w-[18px] h-[18px] transition-transform duration-500 ${theme === 'system' ? 'scale-110 drop-shadow-[0_0_6px_rgba(167,243,208,0.8)]' : 'scale-100'}`} />
            {theme === 'system' && (
              <span className="absolute inset-0 rounded-xl animate-ping bg-emerald-400/20 pointer-events-none" style={{ animationDuration: '2.5s' }} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
