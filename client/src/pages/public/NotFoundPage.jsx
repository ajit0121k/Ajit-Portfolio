import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      <div className="liquid-glass-card p-10 sm:p-14 max-w-lg w-full relative overflow-hidden animate-slide-up">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-primary-500 to-rose-500 flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
          <Sparkles className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2 block">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Page Not <span className="italic font-light text-primary-500">Found</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          The route you are navigating to does not exist or has been relocated within the data-driven architecture.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
