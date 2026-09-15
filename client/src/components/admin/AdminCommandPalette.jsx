import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Image,
  Settings,
  PlusCircle,
  ExternalLink,
  Moon,
  Sun,
  X,
  FileText,
  BookOpen,
  BarChart3,
  Globe,
  Activity,
  Eye,
} from 'lucide-react';
import useThemeStore from '../../store/themeStore.js';

export default function AdminCommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();

  const getPublicSiteUrl = () => {
    return typeof window !== 'undefined' && window.location.hostname.includes('github.io')
      ? 'https://ajit0121k.github.io/Ajit-Portfolio/'
      : '/';
  };

  const commands = [
    { title: 'Dashboard Overview', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/admin/dashboard') },
    { title: 'Profile & Developer Bio', category: 'Portfolio Edit', icon: User, action: () => navigate('/admin/profile') },
    { title: 'Resume & CV (Upload PDF)', category: 'Portfolio Edit', icon: FileText, action: () => navigate('/admin/resume') },
    { title: 'Projects (Manage Portfolio)', category: 'Portfolio Edit', icon: FolderGit2, action: () => navigate('/admin/projects') },
    { title: 'Add New Project', category: 'Quick Action', icon: PlusCircle, action: () => navigate('/admin/projects/new') },
    { title: 'Skills & Proficiencies', category: 'Portfolio Edit', icon: Cpu, action: () => navigate('/admin/skills') },
    { title: 'Career & Experience', category: 'Portfolio Edit', icon: Briefcase, action: () => navigate('/admin/experience') },
    { title: 'Education & Academics', category: 'Portfolio Edit', icon: GraduationCap, action: () => navigate('/admin/education') },
    { title: 'Licenses & Certifications', category: 'Portfolio Edit', icon: Award, action: () => navigate('/admin/certifications') },
    { title: 'Articles & Blog Posts', category: 'Portfolio Edit', icon: BookOpen, action: () => navigate('/admin/blog') },
    { title: 'Write New Blog Article', category: 'Quick Action', icon: PlusCircle, action: () => navigate('/admin/blog/new') },
    { title: 'Messages & Inquiries Inbox', category: 'Inbox', icon: Mail, action: () => navigate('/admin/messages') },
    { title: 'Media & Uploads Library', category: 'Assets', icon: Image, action: () => navigate('/admin/media') },
    { title: 'Visitor & Traffic Analytics', category: 'Metrics', icon: BarChart3, action: () => navigate('/admin/analytics') },
    { title: 'Site Settings & SEO', category: 'Settings', icon: Settings, action: () => navigate('/admin/settings') },
    { title: 'SEO & Meta Tags Settings', category: 'Settings', icon: Globe, action: () => navigate('/admin/settings?tab=seo') },
    { title: 'Security & Activity Audit', category: 'System', icon: Activity, action: () => navigate('/admin/activity') },
    { title: 'Live Responsive Sandbox Preview', category: 'Preview', icon: Eye, action: () => navigate('/admin/preview') },
    { title: 'View Live Public Site', category: 'Quick Action', icon: ExternalLink, action: () => window.open(getPublicSiteUrl(), '_blank') },
    { title: 'Toggle Dark / Light Mode', category: 'Theme', icon: Moon, action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-slide-down">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type to search or jump to section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary-500 transition-colors">
                      {cmd.title}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-slate-500">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching sections found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
