import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  Mail, 
  RefreshCw, 
  Github, 
  Linkedin, 
  Clock 
} from 'lucide-react';

export default function MaintenanceScreen({ settings, profile, onCheckStatus }) {
  const [checking, setChecking] = useState(false);

  const handleRefresh = async () => {
    setChecking(true);
    if (onCheckStatus) {
      await onCheckStatus();
    } else {
      window.location.reload();
    }
    setTimeout(() => setChecking(false), 800);
  };

  const authorName = profile?.name || settings?.authorName || 'Ajit Kumar';
  const authorTitle = profile?.title || 'Full Stack Software Engineer';
  const authorEmail = profile?.email || 'ajitkumar2956654@gmail.com';
  const message = settings?.maintenanceMessage || 
    'Portfolio is currently undergoing scheduled maintenance & system upgrades. Please check back shortly.';

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-[#141a16] text-[#f3eee5] px-4 py-8 relative overflow-hidden font-sans selection:bg-[#c66a3d] selection:text-white">
      {/* Liquid Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-glow-amber -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] opacity-30" />
        <div className="ambient-glow-indigo bottom-0 right-10 w-[500px] h-[500px] opacity-20" />
      </div>

      {/* Top Header / Branding */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white block">
              {settings?.siteName || 'Portfolio Studio'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80 block">
              System Maintenance
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Hero */}
      <main className="relative z-10 my-auto w-full max-w-xl text-center space-y-6">
        {/* Animated Tool Badge */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-amber-500/20 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1c251f] to-[#141a16] border border-amber-500/40 shadow-2xl flex items-center justify-center text-amber-400">
            <Wrench className="w-9 h-9 animate-bounce duration-1000" />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold shadow-inner">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Scheduled Maintenance in Progress</span>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            We'll Be Back Shortly
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>

        {/* Author Contact Card */}
        <div className="liquid-glass-card p-5 rounded-3xl border border-white/10 bg-[#1c251f]/80 backdrop-blur-xl text-left space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            {profile?.profileImage?.url ? (
              <img
                src={profile.profileImage.url}
                alt={authorName}
                className="w-12 h-12 rounded-2xl object-cover border border-white/10"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center text-lg border border-amber-500/30">
                {authorName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-white">{authorName}</h3>
              <p className="text-xs text-slate-400">{authorTitle}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Need urgent assistance or want to discuss an immediate project opportunity while the site is updating?
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={`mailto:${authorEmail}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact via Email</span>
            </a>

            {profile?.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {profile?.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={checking}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin text-amber-400' : ''}`} />
            <span>{checking ? 'Checking Status...' : 'Check If Site is Live'}</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl text-center py-4 border-t border-white/5 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} {authorName}. All rights reserved.</p>
        <p className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Expected uptime shortly</span>
        </p>
      </footer>
    </div>
  );
}
