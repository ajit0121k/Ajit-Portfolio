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
  X,
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import { ADMIN_ROUTES } from '../../constants/routes.js';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, unreadCount = 0 }) {
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

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
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
        { label: 'Currently Building', path: '/admin/profile#building', icon: Sparkles },
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

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between h-16 px-4 border-b border-black/[0.04] dark:border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1b4d3e] via-[#123e2f] to-[#0a261c] flex items-center justify-center text-white shadow-md shadow-[#123e2f]/25 border border-emerald-400/20 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            {(!collapsed || mobileOpen) && (
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
          {/* Close button on mobile, collapse toggle on desktop */}
          <button
            onClick={() => {
              if (mobileOpen) {
                closeMobile();
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            title={mobileOpen ? 'Close menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
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
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#153f31] dark:text-emerald-300 super-glossy-btn shadow-xs transition-all ${
              collapsed && !mobileOpen ? 'justify-center' : ''
            }`}
            title="View Live Portfolio"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>View Live Site</span>}
          </a>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-3.5 overflow-y-auto scrollbar-none">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {(!collapsed || mobileOpen) && (
                <div className="px-3 pt-1.5 pb-0.5 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-emerald-400/80 select-none">
                  {group.group}
                </div>
              )}
              {collapsed && !mobileOpen && gIdx > 0 && (
                <div className="my-1.5 border-t border-black/[0.08] dark:border-white/10 mx-2" />
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 md:py-2 rounded-2xl text-sm md:text-xs font-bold transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#153f31] to-[#1c5442] text-white shadow-[0_8px_20px_-4px_rgba(21,63,49,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.35)] border border-emerald-400/30'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#153f31] dark:hover:text-emerald-300'
                      } ${collapsed && !mobileOpen ? 'justify-center' : ''}`
                    }
                    title={collapsed && !mobileOpen ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0 text-slate-700 dark:text-slate-300 group-hover:scale-110 group-hover:text-[#153f31] dark:group-hover:text-white transition-all" />
                      {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                    </div>
                    {(!collapsed || mobileOpen) && item.badge && (
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
      <div className="p-3 border-t border-black/[0.04] dark:border-white/[0.06] bg-black/[0.02] dark:bg-black/20 flex-shrink-0">
        {(!collapsed || mobileOpen) ? (
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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar — hidden on mobile */}
      <aside
        className={`hidden md:flex fixed top-3 left-3 z-40 h-[calc(100vh-1.5rem)] transition-all duration-300 ease-in-out rounded-[28px] super-glossy-glass glossy-glare-edge flex-col justify-between overflow-hidden ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 transition-transform duration-300 ease-in-out super-glossy-glass border-r border-white/80 dark:border-white/10 shadow-[20px_0_45px_-10px_rgba(0,0,0,0.15)] flex flex-col justify-between overflow-hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
