import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar.jsx';
import TopBar from '../components/admin/TopBar.jsx';
import AdminCommandPalette from '../components/admin/AdminCommandPalette.jsx';
import api from '../services/api.js';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        let count = 0;
        try {
          const { data } = await api.get('/messages/unread-count');
          count = data.data?.count ?? data.count ?? 0;
        } catch (e) {}

        const localRaw = localStorage.getItem('portfolio_cms_messages');
        if (localRaw) {
          const localList = JSON.parse(localRaw);
          if (Array.isArray(localList)) {
            const unreadLocal = localList.filter(m => !m.read && m.status !== 'read').length;
            count = Math.max(count, unreadLocal);
          }
        }
        setUnreadCount(count);
      } catch (err) {
        // silent fail on unread count poll
      }
    };
    fetchUnread();

    const onUpdate = () => fetchUnread();
    window.addEventListener('storage', onUpdate);
    window.addEventListener('portfolio_message_received', onUpdate);
    return () => {
      window.removeEventListener('storage', onUpdate);
      window.removeEventListener('portfolio_message_received', onUpdate);
    };
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#eaefe9] dark:bg-[#0a120c] text-slate-800 dark:text-slate-100 flex flex-col antialiased relative overflow-x-hidden transition-colors duration-300">
      {/* Studio 3D Ambient Background Lighting & Warm Disc */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Warm Pastel Gold/Peach Disc (matching reference image top-left) */}
        <div className="absolute -top-36 -left-36 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/40 via-orange-100/25 to-transparent filter blur-[60px] dark:from-emerald-950/20 dark:via-transparent" />
        {/* Soft Sage Depth Orb */}
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-emerald-100/50 via-teal-50/30 to-transparent filter blur-[80px] dark:from-emerald-950/30 dark:via-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          unreadCount={unreadCount}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pl-0 ${
            collapsed ? 'md:pl-24' : 'md:pl-72'
          }`}
        >
          <TopBar
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
          />

          <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modern Frosted Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-[#101b13]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 px-3 py-2 flex items-center justify-around shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
        <Link
          to="/admin/dashboard"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            location.pathname.includes('/dashboard')
              ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
          </svg>
          <span className="text-[11px] font-bold">Dashboard</span>
        </Link>

        <Link
          to="/admin/projects"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            location.pathname.includes('/projects')
              ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="text-[11px] font-bold">Projects</span>
        </Link>

        <Link
          to="/admin/messages"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all relative ${
            location.pathname.includes('/messages')
              ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-1 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-xs" />
          )}
          <span className="text-[11px] font-bold">Messages</span>
        </Link>

        <Link
          to="/admin/profile"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            location.pathname.includes('/profile')
              ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[11px] font-bold">Profile</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-700 cursor-pointer active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[11px] font-bold">More</span>
        </button>
      </nav>

      {/* Command Palette Modal */}
      <AdminCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}