import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ profile, settings }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-6 px-4 sm:px-6 max-w-5xl mx-auto select-none mt-16 mb-6">
      <div className="liquid-glass-container relative glossy-glare-edge rounded-full px-6 py-4 shadow-xl border border-white/70 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a8579] dark:text-[#a8a397]">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-start">
          <span className="font-serif font-bold text-[#222723] dark:text-[#f3eee5]">
            © {new Date().getFullYear()} {profile?.name || 'Ajit Kumar'}
          </span>
          <span className="hidden xs:inline">&bull;</span>
          <span className="text-[11px] font-medium">Production MERN & AI Architecture</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center border border-white/60 dark:border-white/10 hover:bg-[#2d3a2e] hover:text-[#f5f0e8] dark:hover:bg-[#f3eee5] dark:hover:text-[#1a241d] transition-all opacity-60 hover:opacity-100 shadow-xs"
            title="Admin CMS Panel"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center border border-white/60 dark:border-white/10 hover:bg-[#2d3a2e] hover:text-[#f5f0e8] dark:hover:bg-[#f3eee5] dark:hover:text-[#1a241d] transition-all shadow-xs cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
