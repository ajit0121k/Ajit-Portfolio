import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Menu,
  X,
  FileDown,
  Search,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import api from '../../services/api.js';

export default function Navbar({ onOpenCommandPalette }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          api.get('/settings/public'),
          api.get('/profile'),
        ]);
        setSettings(settingsRes.data.data || settingsRes.data);
        setProfile(profileRes.data.data || profileRes.data);
      } catch (e) {}
    };
    fetchPublicData();
  }, []);

  // Scroll listener for sticky glass navbar and scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Scroll Spy for Home Page sections
      if (location.pathname === '/') {
        const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { label: 'About', href: '#about', id: 'about', show: settings?.sectionVisibility?.about !== false },
    { label: 'Skills', href: '#skills', id: 'skills', show: settings?.sectionVisibility?.skills !== false },
    { label: 'Experience', href: '#experience', id: 'experience', show: settings?.sectionVisibility?.experience !== false },
    { label: 'Projects', href: '#projects', id: 'projects', show: settings?.sectionVisibility?.projects !== false },

    { label: 'Contact', href: '#contact', id: 'contact', show: settings?.sectionVisibility?.contact !== false },
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    if (link.isRoute) {
      navigate(link.to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (location.pathname !== '/') {
        navigate(`/${link.href}`);
      } else {
        const element = document.getElementById(link.id) || document.querySelector(link.href);
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-300 rounded-full px-5 py-2.5 flex items-center justify-between gap-4 sm:gap-6 max-w-5xl w-full ${
          isScrolled
            ? 'liquid-glass-container shadow-2xl py-2 px-6'
            : 'backdrop-blur-xl bg-[#f5f0e8]/85 dark:bg-[#1b251e]/85 border border-[#dfd6c7] dark:border-white/10 shadow-lg'
        }`}
      >
        {/* Brand / Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-[#2c2b29] dark:text-[#f3eee5] group"
        >
          <div className="w-8 h-8 rounded-full bg-[#2d3a2e] text-[#f5f0e8] dark:bg-[#f5f0e8] dark:text-[#2d3a2e] p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center font-serif font-black text-xs">
            AK
          </div>
          <span className="font-serif font-bold text-[#2c2b29] dark:text-[#f3eee5] text-sm sm:text-base tracking-normal">
            {profile?.name || settings?.siteName || 'Ajit Kumar'}
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#eae3d5]/70 dark:bg-white/5 p-1 rounded-full border border-[#dcd2c0]/60 dark:border-white/10 backdrop-blur-md">
          {navLinks
            .filter((link) => link.show)
            .map((link, idx) => {
              const isActive =
                link.isRoute
                  ? location.pathname === link.to
                  : activeSection === link.id && location.pathname === '/';

              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2d3a2e] text-[#f5f0e8] dark:bg-[#f3eee5] dark:text-[#1a241d] shadow-sm'
                      : 'text-[#5a574f] dark:text-[#c4beb3] hover:text-[#1a241d] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
        </div>

        {/* Right Actions: Search Pill & Day/Night Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Search Button (Circular Icon Button) */}
          <button
            onClick={onOpenCommandPalette}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#5a574f] dark:text-[#c4beb3] bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-[#dfd6c7] dark:border-white/15 shadow-sm transition-all duration-300 active:scale-90 group"
            title="Search projects, skills & pages (Ctrl+K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-[#5a574f] dark:text-[#c4beb3] group-hover:text-[#c66a3d] group-hover:scale-110 transition-all" />
          </button>

          {/* Day / Night Theme Toggle Switch */}
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed inset-x-4 top-20 specular-glass-container rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-2xl animate-slide-down md:hidden z-50">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/10 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 mb-2"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-primary-500" />
                <span>Search Anything...</span>
              </span>
              <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">⌘K</kbd>
            </button>

            {navLinks
              .filter((l) => l.show)
              .map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link)}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all"
                >
                  {link.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
