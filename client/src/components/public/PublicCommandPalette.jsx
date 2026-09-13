import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  User,
  Cpu,
  Briefcase,
  FolderGit2,
  BookOpen,
  Mail,
  FileDown,
  Moon,
  Sun,
  X,
  Sparkles,
  Code2,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import useThemeStore from '../../store/themeStore.js';
import api from '../../services/api.js';

export default function PublicCommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liveProjects, setLiveProjects] = useState([]);
  const [liveSkills, setLiveSkills] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      // Fetch live projects and skills
      const fetchSearchData = async () => {
        try {
          const [projRes, skillRes] = await Promise.allSettled([
            api.get('/projects/published'),
            api.get('/skills/visible'),
          ]);
          
          if (projRes.status === 'fulfilled' && projRes.value?.data) {
            const rawProjs = projRes.value.data.data?.projects || projRes.value.data.projects || projRes.value.data.data || [];
            setLiveProjects(Array.isArray(rawProjs) ? rawProjs : []);
          }
          
          if (skillRes.status === 'fulfilled' && skillRes.value?.data) {
            const rawSkills = skillRes.value.data.data || skillRes.value.data || [];
            setLiveSkills(Array.isArray(rawSkills) ? rawSkills : []);
          }
        } catch (e) {
          // Graceful fallback to static commands
        }
      };
      fetchSearchData();
    }
  }, [isOpen]);

  const scrollTo = (id) => {
    onClose();
    if (window.location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Base navigation and section commands
  const defaultCommands = [
    { title: 'Home / Hero', category: 'Navigation', icon: Home, action: () => scrollTo('hero') },
    { title: 'About Ajit Kumar', category: 'Sections', icon: User, action: () => scrollTo('about') },
    { title: 'Technical Arsenal (Skills)', category: 'Sections', icon: Cpu, action: () => scrollTo('skills') },
    { title: 'Career Experience & Timeline', category: 'Sections', icon: Briefcase, action: () => scrollTo('experience') },
    { title: 'Featured Projects (01–04)', category: 'Sections', icon: FolderGit2, action: () => scrollTo('projects') },
    { title: 'Academia & Certifications', category: 'Sections', icon: GraduationCap, action: () => scrollTo('education') },
    { title: 'Direct Contact Form', category: 'Sections', icon: Mail, action: () => scrollTo('contact') },
    { title: 'Browse All Projects', category: 'Pages', icon: FolderGit2, action: () => { onClose(); navigate('/projects'); } },
    { title: 'Technical Journal & Articles', category: 'Pages', icon: BookOpen, action: () => { onClose(); navigate('/blog'); } },
    { title: 'Download Official Resume (PDF)', category: 'Pages', icon: FileDown, action: () => { onClose(); window.open('/resume.pdf', '_blank'); } },
    { title: 'Toggle Light / Dark Mode', category: 'Preferences', icon: theme === 'dark' ? Sun : Moon, action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
  ];

  // Dynamic project commands from MongoDB
  const projectCommands = Array.isArray(liveProjects)
    ? liveProjects.map((p) => ({
        title: p.title || 'Untitled Project',
        subtitle: p.shortDescription || (Array.isArray(p.technologies) ? p.technologies.slice(0, 3).join(', ') : ''),
        category: 'Projects',
        icon: Code2,
        action: () => {
          onClose();
          navigate(`/projects/${p.slug || p._id}`);
        },
      }))
    : [];

  // Dynamic skill commands from MongoDB
  const skillCommands = Array.isArray(liveSkills)
    ? liveSkills.map((s) => ({
        title: `${s.name || 'Skill'} (${s.proficiency || 85}% Proficiency)`,
        subtitle: `${s.category || 'Tech'} • ${s.years || 2}+ Yrs`,
        category: 'Skills',
        icon: Cpu,
        action: () => scrollTo('skills'),
      }))
    : [];

  const allCommands = [...projectCommands, ...defaultCommands, ...skillCommands];

  const filtered = query.trim()
    ? allCommands.filter(
        (c) =>
          c.title?.toLowerCase().includes(query.toLowerCase()) ||
          c.category?.toLowerCase().includes(query.toLowerCase()) ||
          (c.subtitle && c.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
    : defaultCommands;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-xl specular-glass-container rounded-3xl shadow-2xl overflow-hidden animate-slide-down border border-white/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center gap-3 bg-white/60 dark:bg-white/5">
          <Search className="w-5 h-5 text-primary-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search projects, skills, case studies, or pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin space-y-1">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all group text-left ${
                    isSelected
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                        isSelected
                          ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="block truncate">{cmd.title}</span>
                      {cmd.subtitle && (
                        <span
                          className={`text-[10px] block truncate font-normal ${
                            isSelected
                              ? 'text-slate-300 dark:text-slate-600'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {cmd.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex-shrink-0 ml-2 ${
                      isSelected
                        ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cmd.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
