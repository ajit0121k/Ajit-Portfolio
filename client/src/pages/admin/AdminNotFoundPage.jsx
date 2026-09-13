import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function AdminNotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center animate-fade-in">
      <div className="liquid-glass-card p-10 max-w-md w-full">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">404</h1>
        <h2 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-2">Admin Page Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          The requested management section does not exist in the CMS router.
        </p>
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
