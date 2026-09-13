import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderGit2, Cpu, Briefcase, GraduationCap, Award, 
  MessageSquareQuote, Mail, Image, Sparkles, Plus, 
  ExternalLink, User, ArrowRight, CheckCircle2,
  FileText, Activity, ShieldCheck, Compass, Eye, Layers
} from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [data, setData] = useState({
    counts: {
      projects: 0,
      publishedProjects: 0,
      draftProjects: 0,
      skills: 0,
      experience: 0,
      education: 0,
      certifications: 0,
      testimonials: 0,
      messages: 0,
      unreadMessages: 0,
      media: 0,
    },
    recentProjects: [],
    recentMessages: [],
    recentActivity: [],
    profileCompleteness: 0,
    settings: {
      siteName: 'Portfolio',
      maintenanceMode: false,
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/summary');
      const payload = res.data?.data || res.data;
      if (payload) {
        setData(payload);
      }
    } catch (err) {
      toast.error('Failed to load dashboard summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-3 border-emerald-600 border-t-transparent"></div>
        <span className="text-xs text-slate-500 font-bold tracking-wide">Loading 3D Bento CMS...</span>
      </div>
    );
  }

  const { counts, recentProjects = [], recentMessages = [], recentActivity = [], profileCompleteness = 0 } = data;

  const kpiCards = [
    {
      title: 'Total Projects',
      count: counts.projects,
      sub: `${counts.publishedProjects} Published · ${counts.draftProjects} Draft`,
      icon: FolderGit2,
      link: '/admin/projects',
      accent: 'emerald',
    },
    {
      title: 'Active Skills',
      count: counts.skills,
      sub: 'Categorized technical stack',
      icon: Cpu,
      link: '/admin/skills',
      accent: 'amber',
    },
    {
      title: 'Experience Entries',
      count: counts.experience,
      sub: 'Roles & career history',
      icon: Briefcase,
      link: '/admin/experience',
      accent: 'teal',
    },
    {
      title: 'Education Entries',
      count: counts.education,
      sub: 'Degrees & academics',
      icon: GraduationCap,
      link: '/admin/education',
      accent: 'sky',
    },
    {
      title: 'Certifications',
      count: counts.certifications,
      sub: 'Verified credentials',
      icon: Award,
      link: '/admin/certifications',
      accent: 'indigo',
    },
    {
      title: 'Testimonials',
      count: counts.testimonials,
      sub: 'Client & peer reviews',
      icon: MessageSquareQuote,
      link: '/admin/testimonials',
      accent: 'rose',
    },
    {
      title: 'Contact Messages',
      count: counts.messages,
      sub: counts.unreadMessages > 0 ? `${counts.unreadMessages} New Unread` : 'Inbox up to date',
      badge: counts.unreadMessages > 0 ? `${counts.unreadMessages} Unread` : null,
      icon: Mail,
      link: '/admin/messages',
      accent: 'orange',
    },
    {
      title: 'Media Library',
      count: counts.media,
      sub: 'Images & PDF assets',
      icon: Image,
      link: '/admin/media',
      accent: 'emerald',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* ========================================================================= */}
      {/* 3D BENTO HERO COMPOSITION (Matching Reference Image)                     */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        
        {/* BENTO CARD 1: "Writll Vision" Style Editorial Clay Card (Left Top) */}
        <motion.div 
          whileHover={{ y: -8, scale: 1.008 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-5 rounded-[32px] bg-white dark:bg-[#111c13] p-7 sm:p-9 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-white/80 dark:border-white/5 flex flex-col justify-between relative overflow-hidden group"
        >
          {/* Subtle Decorative Backdrop Cutout */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#edf4ed] dark:bg-white/[0.02] rounded-bl-[40px] pointer-events-none -z-0" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#153f31] dark:text-emerald-400">
                System Active &bull; V3.0
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-3">
              Portfolio <br />
              <span className="font-serif italic font-normal text-[#153f31] dark:text-emerald-300">CMS Vision</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-6">
              Full control over showcase projects, professional credentials, verified skills, and incoming visitor inquiries.
            </p>

            {/* Profile Setup Progress Inset Well */}
            <div className="p-4 rounded-2xl bg-[#f2f6f2] dark:bg-[#0c160e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] border border-black/5 dark:border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Profile Completeness
                </span>
                <span className="text-[#f97316] font-mono font-black">{profileCompleteness}%</span>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#f97316] to-[#fb923c] h-2 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${Math.min(profileCompleteness, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 flex items-center gap-3">
            <Link
              to="/admin/projects/new"
              className="px-5 py-3 rounded-full bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c] hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_10px_22px_-4px_rgba(249,115,22,0.45),inset_0_1px_1px_rgba(255,255,255,0.5)] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </Link>
            <Link
              to="/admin/profile"
              className="px-4 py-3 rounded-full bg-[#edf2ed] dark:bg-white/5 hover:bg-[#e2eae2] dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* BENTO CARD 2: "Vision colors" Deep Glossy Emerald Bento Card (Center) */}
        <motion.div 
          whileHover={{ y: -8, scale: 1.008 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-4 rounded-[32px] bg-gradient-to-br from-[#144434] via-[#0d2e23] to-[#081f17] text-white p-7 sm:p-8 shadow-[0_25px_50px_-12px_rgba(11,41,31,0.45),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-emerald-400/25 relative overflow-hidden flex flex-col justify-between"
        >
          {/* Diagonal Glass Sheen Reflection */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-white/20 via-white/5 to-transparent rotate-45 pointer-events-none rounded-3xl" />

          {/* Top Label & Vertical Accent Line */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                Visions &bull; Metrics
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>

            <div className="my-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200/70">
                Portfolio Showcase
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {counts.projects}
                </span>
                <span className="text-xs font-semibold text-emerald-200/80">Active Projects</span>
              </div>
            </div>

            {/* Split counter list */}
            <div className="mt-6 pt-4 border-t border-emerald-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-100/90 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Published Live
                </span>
                <strong className="font-mono font-bold text-white text-sm">{counts.publishedProjects}</strong>
              </div>
              <div className="flex items-center justify-between text-emerald-100/70 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Drafts in Progress
                </span>
                <strong className="font-mono font-bold text-white text-sm">{counts.draftProjects}</strong>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/admin/projects"
              className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-100 flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Manage Projects Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* BENTO CARD 3: Warm Coral / Peach Slab with 3D Glossy Pebble Pills (Right) */}
        <motion.div 
          whileHover={{ y: -8, scale: 1.008 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-3 rounded-[32px] bg-gradient-to-br from-[#f98d54] via-[#f77d3e] to-[#ea6223] text-white p-6 sm:p-7 shadow-[0_24px_48px_-12px_rgba(244,115,51,0.4),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-white/20 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Subtle 3D Surface Glow */}
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white/15 rounded-full filter blur-[40px] pointer-events-none" />

          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-white/90 block mb-1">
              Quick Center
            </span>
            <h3 className="text-xl font-black text-white tracking-tight mb-4">
              Tactile Actions
            </h3>

            {/* 3D Glossy Pebble / Capsule Pills */}
            <div className="space-y-3">
              {/* Glossy Emerald Capsule */}
              <Link
                to="/admin/messages"
                className="w-full rounded-2xl bg-gradient-to-b from-[#10b981] via-[#059669] to-[#047857] text-white shadow-[0_8px_16px_rgba(5,150,105,0.35),inset_0_2px_2px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3)] border border-emerald-300/40 p-3 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black tracking-wide">Inquiries Inbox</span>
                </div>
                {counts.unreadMessages > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#047857] text-[10px] font-black shadow-xs">
                    {counts.unreadMessages} New
                  </span>
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-1 transition-transform" />
                )}
              </Link>

              {/* Glossy Ceramic White Capsule */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl bg-gradient-to-b from-white via-[#fbfdfb] to-[#e4eae4] text-[#123e2f] shadow-[0_8px_16px_rgba(0,0,0,0.1),inset_0_2px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.06)] border border-white p-3 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#123e2f]/10 flex items-center justify-center text-[#123e2f]">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black tracking-wide">View Live Site</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#123e2f]/60 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Glossy Emerald Capsule 2 */}
              <Link
                to="/admin/media"
                className="w-full rounded-2xl bg-gradient-to-b from-[#10b981] via-[#059669] to-[#047857] text-white shadow-[0_8px_16px_rgba(5,150,105,0.35),inset_0_2px_2px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3)] border border-emerald-300/40 p-3 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Image className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black tracking-wide">Media Library</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-100 font-bold">{counts.media} Assets</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 text-[10px] font-bold text-white/70 text-center tracking-wide">
            Portfolio CMS Protected Admin
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 8 REAL DATABASE KPI PEBBLE CARDS                                          */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Module Metrics
          </h2>
          <span className="text-xs font-bold text-slate-400">All data synced live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -7, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Link
                  to={card.link}
                  className="rounded-[24px] bg-white dark:bg-[#111c13] p-5 shadow-[0_15px_30px_-8px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 transition-all relative overflow-hidden flex flex-col justify-between group cursor-pointer h-full"
                >
                  <div className="flex justify-between items-start mb-3">
                    {/* Tactile Inset Icon Well */}
                    <div className="w-10 h-10 rounded-xl bg-[#edf3ed] dark:bg-[#0c160e] shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] border border-black/5 dark:border-white/5 flex items-center justify-center text-[#153f31] dark:text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    {card.badge && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-xs">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {card.title}
                    </p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      {card.count}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">
                      {card.sub}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-black/[0.04] dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-[#153f31] dark:text-emerald-400">
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SPLIT COLUMNS: RECENT PROJECTS & RECENT INQUIRIES                         */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        
        {/* Recent Projects Clay Card */}
        <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#153f31] dark:text-emerald-400" />
                <span>Recent Projects</span>
              </h2>
              <Link to="/admin/projects" className="text-xs font-bold text-[#153f31] dark:text-emerald-400 hover:underline">
                View All ({counts.projects})
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-[#fafbfa] dark:bg-white/[0.02]">
                No projects created yet. Click "Add Project" to showcase your work.
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <div
                    key={p._id}
                    className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#0c160e] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5 flex items-center justify-between gap-3 hover:bg-[#ebf1eb] dark:hover:bg-[#121f15] transition-colors"
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'Draft Mode'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        p.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {p.status}
                      </span>
                      <Link
                        to={`/admin/projects/${p._id}/edit`}
                        className="text-[11px] font-bold text-[#153f31] dark:text-emerald-400 hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-5 mt-5 border-t border-black/[0.04] dark:border-white/5">
            <Link
              to="/admin/projects/new"
              className="w-full py-2.5 rounded-xl bg-[#edf3ed] dark:bg-white/5 hover:bg-[#e2ebe2] dark:hover:bg-white/10 text-xs font-bold text-[#153f31] dark:text-emerald-300 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Another Project</span>
            </Link>
          </div>
        </div>

        {/* Recent Contact Messages Clay Card */}
        <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f97316]" />
                <span>Recent Contact Messages</span>
              </h2>
              <Link to="/admin/messages" className="text-xs font-bold text-[#f97316] hover:underline">
                View Inbox ({counts.messages})
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-[#fafbfa] dark:bg-white/[0.02]">
                No inquiries received yet. When visitors submit the contact form, they will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#0c160e] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5 flex items-center justify-between gap-3 hover:bg-[#ebf1eb] dark:hover:bg-[#121f15] transition-colors"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {msg.name}
                        </p>
                        {msg.status === 'unread' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {msg.subject || msg.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        to="/admin/messages"
                        className="text-[11px] font-bold text-[#153f31] dark:text-emerald-400 hover:underline"
                      >
                        Read
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-5 mt-5 border-t border-black/[0.04] dark:border-white/5">
            <Link
              to="/admin/messages"
              className="w-full py-2.5 rounded-xl bg-[#edf3ed] dark:bg-white/5 hover:bg-[#e2ebe2] dark:hover:bg-white/10 text-xs font-bold text-[#153f31] dark:text-emerald-300 flex items-center justify-center gap-2 transition"
            >
              <span>Open Full Messages Inbox &rarr;</span>
            </Link>
          </div>
        </div>

      </motion.div>

    </div>
  );
}
