import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';

export default function Footer({ profile, settings }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-8 px-4 sm:px-6 max-w-6xl mx-auto select-none mt-12 border-t border-[#dfd6c7]/80 dark:border-white/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a8579] dark:text-[#a8a397]">
        <div className="flex items-center gap-4">
          <span className="font-serif font-bold text-[#222723] dark:text-[#f3eee5]">
            © {new Date().getFullYear()} {profile?.name || 'Ajit Kumar'}
          </span>
          <span>&bull;</span>
          <span>Full-Stack & AI Systems</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/admin"
            className="p-2.5 rounded-full border border-[#dfd6c7] dark:border-white/20 hover:bg-[#2d3a2e] hover:text-[#f5f0e8] dark:hover:bg-[#f3eee5] dark:hover:text-[#1a241d] transition-all opacity-50 hover:opacity-100"
            title="Admin CMS Panel"
          >
            <Lock className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full border border-[#dfd6c7] dark:border-white/20 hover:bg-[#2d3a2e] hover:text-[#f5f0e8] dark:hover:bg-[#f3eee5] dark:hover:text-[#1a241d] transition-all"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
