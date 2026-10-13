import React, { useState, useEffect } from 'react';
import { Sparkles, Save, ArrowRight, ExternalLink, RefreshCw, Check, Link as LinkIcon, Eye, Info } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { getPublicSiteUrl } from '../../utils/assetUrl.js';
import { notifyDataChange } from '../../services/syncBus.js';

export default function BuildingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [isTextOnly, setIsTextOnly] = useState(true);

  // Suggested project badges for quick selection
  const suggestions = [
    'AI-Powered Resume Screener & ATS Parser',
    'Real-Time Collaborative Code Studio',
    'Distributed Microservices Architecture',
    'Enterprise Zero-Trust JWT Authentication',
    'Next-Gen High-Speed Cloud Engine',
  ];

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      const data = res.data.data || res.data || {};
      
      const currentName = typeof data.currentlyBuilding === 'object'
        ? (data.currentlyBuilding?.name || '')
        : (data.currentlyBuilding || '');
      const currentUrl = typeof data.currentlyBuilding === 'object'
        ? (data.currentlyBuilding?.url || '')
        : (data.currentlyBuildingUrl || '');

      setProjectName(currentName);
      setProjectUrl(currentUrl);
      setIsTextOnly(!currentUrl || currentUrl.trim() === '' || currentUrl.trim() === '#');
    } catch (err) {
      console.error('Failed to load profile building status:', err);
      toast.error('Failed to load current status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const finalUrl = isTextOnly ? '' : projectUrl.trim();
      
      const payload = {
        currentlyBuilding: {
          name: projectName.trim(),
          url: finalUrl,
        },
        currentlyBuildingUrl: finalUrl,
      };

      await api.put('/profile', payload);
      
      // Also update localStorage cache for seamless instant preview across tabs
      try {
        const rawLocal = localStorage.getItem('portfolio_cms_profile');
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          parsed.currentlyBuilding = projectName.trim();
          parsed.currentlyBuildingUrl = finalUrl;
          localStorage.setItem('portfolio_cms_profile', JSON.stringify(parsed));
        }
      } catch (e) {}

      // Broadcast sync event to public portfolio immediately
      notifyDataChange('profile');

      toast.success('Hero Pill Badge updated successfully!');
    } catch (err) {
      console.error('Failed to save building status:', err);
      toast.error('Failed to update hero pill badge');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full super-glossy-inset text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>Hero Section Feature</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Currently Building Badge
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage the spotlight capsule badge displayed prominently below your availability status in the public hero section.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getPublicSiteUrl()}
            target="_blank"
            rel="noreferrer"
            className="super-glossy-btn px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 text-slate-700 dark:text-slate-200"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>View on Site</span>
          </a>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="super-glossy-btn-emerald px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Live Visual Preview Card */}
      <div className="super-glossy-card relative glossy-glare-edge p-6 sm:p-8 space-y-4 border border-white/80 dark:border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live Public Hero Preview
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full super-glossy-inset font-bold text-emerald-700 dark:text-emerald-300">
            {isTextOnly || !projectUrl.trim() ? 'Text Only (Static Pill)' : 'Interactive Link Pill'}
          </span>
        </div>

        <div className="p-8 rounded-2xl bg-[#f5f0e8] dark:bg-[#141a16] border border-[#dfd6c7] dark:border-white/10 flex items-center justify-center min-h-[110px]">
          {projectName.trim() ? (
            !isTextOnly && projectUrl.trim() ? (
              <a
                href={projectUrl.startsWith('http') ? projectUrl : '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill border border-[#c66a3d]/35 text-[#c66a3d] dark:text-[#e48358] text-[11px] font-bold shadow-sm transition-all hover:scale-105 group"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#c66a3d]" />
                <span className="uppercase tracking-wider text-[10px] text-[#6b675d] dark:text-[#a8a397]">
                  Currently Building:
                </span>
                <span className="underline underline-offset-2">{projectName}</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 text-[#c66a3d]" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill border border-[#c66a3d]/35 text-[#c66a3d] dark:text-[#e48358] text-[11px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#c66a3d]" />
                <span className="uppercase tracking-wider text-[10px] text-[#6b675d] dark:text-[#a8a397]">
                  Currently Building:
                </span>
                <span>{projectName}</span>
              </div>
            )
          ) : (
            <span className="text-xs text-slate-400 italic">
              Badge is currently blank. Enter text below to activate.
            </span>
          )}
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="super-glossy-card p-6 sm:p-8 space-y-6 border border-white/80 dark:border-white/10 shadow-xl">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Badge Content & Behavior</span>
        </h3>

        {/* Project Name Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Project / Milestone Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. AI-Powered Resume Screener & ATS Parser"
            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            This text appears immediately after &quot;Currently Building:&quot; on your hero banner.
          </p>
        </div>

        {/* Badge Mode: Text-Only vs Clickable Link */}
        <div className="p-4 rounded-2xl super-glossy-inset space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Badge Mode
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Choose whether clicking the badge opens an external link or remains static text.
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setIsTextOnly(true);
                  setProjectUrl('');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isTextOnly
                    ? 'super-glossy-btn-emerald shadow-sm'
                    : 'super-glossy-btn text-slate-600 dark:text-slate-300'
                }`}
              >
                Text Only (No Link)
              </button>

              <button
                type="button"
                onClick={() => setIsTextOnly(false)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isTextOnly
                    ? 'super-glossy-btn-amber shadow-sm'
                    : 'super-glossy-btn text-slate-600 dark:text-slate-300'
                }`}
              >
                Clickable Link
              </button>
            </div>
          </div>

          {!isTextOnly && (
            <div className="pt-2 animate-fade-in">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Destination URL
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://github.com/ajit0121k/smart_resume_screener or https://myproject.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Quick Suggestion Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setProjectName(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold super-glossy-btn text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all cursor-pointer"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="super-glossy-btn-emerald px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Publishing Badge...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
