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

        {/* Theme Switcher */}
        <div className="flex items-center p-1 bg-[#edf2ed] dark:bg-[#0c160e] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/5 rounded-full">
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-full text-xs transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white text-amber-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Light Theme"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-full text-xs transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#153f31] text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Dark Theme"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded-full text-xs transition-all cursor-pointer ${
              theme === 'system'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="System Theme"
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
