import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar.jsx';
import TopBar from '../components/admin/TopBar.jsx';
import AdminCommandPalette from '../components/admin/AdminCommandPalette.jsx';
import api from '../services/api.js';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/messages/unread-count');
        setUnreadCount(data.data?.count || data.count || 0);
      } catch (err) {
        // silent fail on unread count poll
      }
    };
    fetchUnread();
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
          unreadCount={unreadCount}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            collapsed ? 'pl-24' : 'pl-72'
          }`}
        >
          <TopBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

          <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Command Palette Modal */}
      <AdminCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}