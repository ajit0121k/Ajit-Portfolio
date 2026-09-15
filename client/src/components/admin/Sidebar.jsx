import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
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
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  FileText,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import { ADMIN_ROUTES } from '../../constants/routes.js';

export default function Sidebar({ collapsed, setCollapsed, unreadCount = 0 }) {
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ADMIN_ROUTES.LOGIN);
    } catch (err) {
      console.error(err);
    }
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Portfolio Content',
      items: [
        { label: 'Profile & Bio', path: '/admin/profile', icon: User },
        { label: 'Resume / CV', path: '/admin/resume', icon: FileText },
        { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
        { label: 'Skills', path: '/admin/skills', icon: Cpu },
        { label: 'Experience', path: '/admin/experience', icon: Briefcase },
        { label: 'Education', path: '/admin/education', icon: GraduationCap },
        { label: 'Certifications', path: '/admin/certifications', icon: Award },
        { label: 'Articles & Blog', path: '/admin/blog', icon: BookOpen },
      ],
    },
    {
      group: 'Communication & Media',
      items: [
        {
          label: 'Messages',
          path: '/admin/messages',
          icon: Mail,
          badge: unreadCount > 0 ? unreadCount : null,
        },
        { label: 'Media Library', path: '/admin/media', icon: Image },
      ],
    },
    {
      group: 'System & Config',
      items: [
        { label: 'Visitor Analytics', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Settings & SEO', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-3 left-3 z-40 h-[calc(100vh-1.5rem)] transition-all duration-300 ease-in-out rounded-[28px] bg-white/95 dark:bg-[#101b13]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] flex flex-col justify-between overflow-hidden ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between h-16 px-4 border-b border-black/[0.04] dark:border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1b4d3e] via-[#123e2f] to-[#0a261c] flex items-center justify-center text-white shadow-md shadow-[#123e2f]/25 border border-emerald-400/20 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-black text-sm tracking-tight text-[#153f31] dark:text-emerald-400 block truncate">
                  Portfolio CMS
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Admin Panel
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Link to Public Site */}
        <div className="px-3 pt-2.5 pb-1 flex-shrink-0">
          <a
            href={
              typeof window !== 'undefined' && window.location.hostname.includes('github.io')
                ? 'https://ajit0121k.github.io/Ajit-Portfolio/'
                : '/'
            }
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#153f31] dark:text-emerald-300 bg-[#e7efe8] dark:bg-emerald-950/40 hover:bg-[#dce8dd] dark:hover:bg-emerald-900/40 shadow-xs transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
            title="View Live Portfolio"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>View Live Site</span>}
          </a>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-3.5 overflow-y-auto scrollbar-none">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pt-1 pb-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 select-none">
                  {group.group}
                </div>
              )}
              {collapsed && gIdx > 0 && (
                <div className="my-1.5 border-t border-black/[0.04] dark:border-white/[0.06] mx-2" />
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all group ${
                        isActive
                          ? 'bg-[#153f31] text-white shadow-[0_8px_20px_-4px_rgba(21,63,49,0.45)]'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#153f31] dark:hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-black/[0.04] dark:border-white/[0.06] bg-[#f7f9f7] dark:bg-[#0c160e] flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="truncate">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {admin?.username || 'Admin'}
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                {admin?.email || 'admin@portfolio.dev'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
