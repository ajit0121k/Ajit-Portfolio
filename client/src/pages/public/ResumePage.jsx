import React, { useState, useEffect } from 'react';
import { resolveAssetUrl } from '../../utils/assetUrl.js';
import { FileDown, Sparkles, ExternalLink, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../../services/api.js';
import { Link } from 'react-router-dom';
import { usePortfolioSync } from '../../services/syncBus.js';

export default function ResumePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile(data.data || data);

      // Track resume download intent
      try {
        api.post('/analytics/track', { type: 'resume_download', path: '/resume' });
      } catch (e) {}
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  usePortfolioSync(['profile', 'resume'], fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="pt-28 pb-20 px-4 max-w-3xl mx-auto text-center">
      <div className="mb-6 text-left">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="liquid-glass-container relative glossy-glare-edge p-8 sm:p-12 text-center rounded-3xl shadow-2xl border border-white/80 dark:border-white/10 overflow-hidden">
        <div className="w-16 h-16 rounded-3xl liquid-glass-pill flex items-center justify-center text-[#c66a3d] mx-auto mb-6 shadow-md border border-white/80 dark:border-white/15">
          <FileDown className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight mb-3">
          Curriculum Vitae & <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">Resume</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#5c5950] dark:text-[#b8b3a8] max-w-md mx-auto mb-8 leading-relaxed font-sans">
          Complete verified overview of professional experience, core technologies, software architecture accomplishments, and education.
        </p>

        {(() => {
          const resumeUrl = resolveAssetUrl(profile?.resume?.url || '/resume.pdf');
          const resumeName = profile?.resume?.originalName || 'Ajit_Kumar_Resume.pdf';
          return (
            <div className="space-y-4 max-w-sm mx-auto">
              <a
                href={resumeUrl}
                download={resumeName}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-full liquid-glass-amber-btn text-white font-bold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>Download Official Resume (PDF)</span>
              </a>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full liquid-glass-pill text-xs font-semibold text-[#222723] dark:text-[#f3eee5] flex items-center justify-center gap-2 hover:scale-[1.02] transition-all cursor-pointer border border-white/60 dark:border-white/10 shadow-xs"
              >
                <ExternalLink className="w-4 h-4 text-[#c66a3d]" />
                <span>Open in New Browser Tab</span>
              </a>
            </div>
          );
        })()}

        <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-slate-200/60 dark:border-white/10 text-left text-xs">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{profile?.yearsOfExperience || 5}+ Years</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Focus</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Full-Stack / MERN</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
            <span className="font-semibold text-emerald-500">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
