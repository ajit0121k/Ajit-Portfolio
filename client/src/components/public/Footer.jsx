import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ profile, settings }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-6 px-4 sm:px-6 max-w-5xl mx-auto select-none mt-16 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs">
        {/* Copyright & Tagline Box */}
        <div className="liquid-glass-card relative glossy-glare-edge rounded-2xl sm:rounded-full px-5 sm:px-6 py-3 sm:py-3.5 shadow-md border border-white/70 dark:border-white/10 flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5 flex-wrap w-full md:w-auto text-[#8a8579] dark:text-[#a8a397]">
          <span className="font-serif font-bold text-[#222723] dark:text-[#f3eee5]">
            © {new Date().getFullYear()} {profile?.name || 'Ajit Kumar'}
          </span>
          <span className="hidden xs:inline opacity-40">&bull;</span>
          <span className="text-[11px] font-medium tracking-tight">Production MERN & AI Architecture</span>
        </div>

        {/* Fully Expanded "Back to Top" Box */}
        <div className="w-full md:w-auto flex-1 md:flex-initial flex items-center justify-center md:justify-end">
          <button
            type="button"
            onClick={scrollToTop}
            className="w-full md:w-auto liquid-glass-card relative glossy-glare-edge px-6 sm:px-8 py-3 rounded-2xl sm:rounded-full flex items-center justify-center gap-2.5 border border-white/70 dark:border-white/10 text-xs sm:text-sm font-bold text-[#4a473f] dark:text-[#d3ded4] hover:bg-[#2d3a2e] hover:text-[#f5f0e8] dark:hover:bg-[#f3eee5] dark:hover:text-[#1a241d] shadow-md transition-all duration-300 active:scale-[0.98] group hover:scale-[1.01] cursor-pointer select-none"
            title="Scroll back to top"
          >
            <span className="tracking-wide font-semibold">Back to Top</span>
            <ArrowUp className="w-4 h-4 text-[#c66a3d] dark:text-[#e48358] group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
}
