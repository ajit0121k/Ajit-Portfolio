import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import api from '../../services/api.js';
import { usePortfolioSync } from '../../services/syncBus.js';

export default function Navbar({ onOpenCommandPalette }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  usePortfolioSync(['profile', 'settings'], fetchPublicData);

  useEffect(() => {
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
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-300 rounded-full flex items-center justify-between gap-2 sm:gap-6 max-w-5xl w-full relative glossy-glare-edge liquid-glass-container ${
          isScrolled
            ? 'shadow-2xl py-1.5 sm:py-2 px-3.5 sm:px-6 scale-[0.99]'
            : 'shadow-xl py-2 sm:py-2.5 px-3.5 sm:px-6'
        }`}
      >
        {/* Brand / Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#2c2b29] dark:text-[#f3eee5] group shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2d3a2e] text-[#f5f0e8] dark:bg-[#f5f0e8] dark:text-[#2d3a2e] p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center font-serif font-black text-xs shrink-0 border border-white/30">
            AK
          </div>
          <span className="font-serif font-bold text-[#2c2b29] dark:text-[#f3eee5] text-xs sm:text-base tracking-tight whitespace-nowrap">
            {profile?.name || settings?.siteName || 'Ajit Kumar'}
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 liquid-glass-pill p-1 shadow-xs border border-white/60 dark:border-white/10">
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
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#2d3a2e] text-[#f5f0e8] dark:bg-[#f3eee5] dark:text-[#1a241d] shadow-sm'
                      : 'text-[#2b2924] dark:text-[#f0ece1] hover:text-[#1a241d] dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
        </div>

        {/* Right Actions: Search Pill & Day/Night Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Search Button (Circular Icon Button) */}
          <button
            onClick={onOpenCommandPalette}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#5a574f] dark:text-[#c4beb3] liquid-glass-pill hover:bg-white dark:hover:bg-white/15 border border-white/70 dark:border-white/15 shadow-sm transition-all duration-300 active:scale-90 group cursor-pointer shrink-0"
            title="Search projects, skills & pages (Ctrl+K)"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5a574f] dark:text-[#c4beb3] group-hover:text-[#c66a3d] group-hover:scale-110 transition-all" />
          </button>

          {/* Day / Night Theme Toggle Switch */}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
