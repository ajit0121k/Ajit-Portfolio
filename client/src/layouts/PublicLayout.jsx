import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/public/Navbar.jsx';
import Footer from '../components/public/Footer.jsx';
import PublicCommandPalette from '../components/public/PublicCommandPalette.jsx';
import MaintenanceScreen from '../components/public/MaintenanceScreen.jsx';
import api from '../services/api.js';
import { usePortfolioSync } from '../services/syncBus.js';

export default function PublicLayout() {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const location = useLocation();

  const fetchMeta = async () => {
    try {
      const [profRes, setRes] = await Promise.all([
        api.get('/profile'),
        api.get('/settings/public'),
      ]);
      setProfile(profRes.data.data || profRes.data);
      setSettings(setRes.data.data || setRes.data);
    } catch (e) {
      console.error('Failed to fetch public meta:', e);
    } finally {
      setLoadingMeta(false);
    }
  };

  // Keep profile and settings synchronized with Admin Panel changes in real time
  usePortfolioSync(['profile', 'settings'], fetchMeta);

  useEffect(() => {
    // Disable browser's automatic scroll restoration on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    fetchMeta();

    // Track initial page view event (privacy-conscious, no PII)
    try {
      api.post('/analytics/track', {
        type: 'page_view',
        path: window.location.pathname,
        referrer: document.referrer || '',
      });
    } catch (e) {}
  }, []);

  // Scroll to top on page load / route change (unless navigating to a hash anchor)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  // Global keyboard shortcut
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

  // If maintenance mode is active, render Maintenance Screen
  if (!loadingMeta && settings?.maintenanceMode) {
    return (
      <MaintenanceScreen 
        settings={settings} 
        profile={profile} 
        onCheckStatus={fetchMeta} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f0e8] dark:bg-[#141a16] text-[#2c2b29] dark:text-[#f3eee5] selection:bg-[#c66a3d] selection:text-white transition-colors duration-300 relative overflow-x-hidden font-sans">
      {/* Liquid Ambient Background Glows (Warm Terracotta & Sage Olive) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-glow-amber -top-24 left-[10%] w-[550px] h-[550px]" />
        <div className="ambient-glow-indigo top-[35%] -right-20 w-[650px] h-[650px]" />
        <div className="ambient-glow-amber bottom-[10%] left-[5%] w-[600px] h-[600px]" />
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        <main className="flex-1">
          <Outlet context={{ profile, settings }} />
        </main>

        <Footer profile={profile} settings={settings} />
      </div>

      <PublicCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}