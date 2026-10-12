import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Settings, Save, Shield, Palette, Eye, Mail, 
  Globe, FileCode, ExternalLink, Loader2, Check, Sparkles,
  Database, Download, CheckCircle2, AlertCircle, RefreshCw, Server, Wifi, WifiOff
} from 'lucide-react';
import api, { getEffectiveApiUrl, setCustomApiUrl, isLiveBackendConfigured } from '../../services/api.js';
import useThemeStore from '../../store/themeStore.js';
import ImageUploadZone from '../../components/admin/ImageUploadZone.jsx';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { setPreset } = useThemeStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'general';

  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['general', 'visibility', 'seo', 'contact', 'maintenance', 'database'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const [formData, setFormData] = useState({
    siteName: 'Ajit Kumar | Portfolio',
    websiteLogo: '',
    websiteDescription: 'Full Stack Developer & AI Engineer specializing in MERN stack and Scalable Cloud Systems',
    authorName: 'Ajit Kumar',
    defaultTheme: 'system',
    themePreset: 'default',
    accentColor: '#10b981',
    sectionVisibility: {
      about: true,
      skills: true,
      experience: true,
      projects: true,
      education: true,
      certifications: true,
      testimonials: false,
      blog: true,
      contact: true,
      github: true,
      currentlyBuilding: true,
    },
    portfolio: {
      featuredProjectsLimit: 6,
      resumeDownloadButton: true,
      contactFormEnabled: true,
    },
    contactSettings: {
      enableContactForm: true,
      enableAutoReply: false,
      autoReplyMessage: 'Thank you for reaching out! I have received your message and will respond within 24 hours.',
      notifyOnMessage: true,
    },
    maintenanceMode: false,
    maintenanceMessage: 'Portfolio is currently undergoing scheduled maintenance. Please check back shortly.',
  });

  const [seoData, setSeoData] = useState({
    title: 'Ajit Kumar | Full Stack Developer & AI Engineer',
    description: 'Portfolio of Ajit Kumar - Full Stack Developer specializing in React, Node.js, Express, MongoDB, and Cloud Architecture.',
    keywords: 'full stack, react, nodejs, mongodb, express, web developer, software engineer, ajit kumar',
    ogImage: '',
    twitterHandle: '@ajitkumar',
    canonicalUrl: 'https://ajit0121k.github.io/Ajit-Portfolio/',
    robots: 'index, follow',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Cloud & Database Sync state
  const [customApiInput, setCustomApiInput] = useState(() => {
    const eff = getEffectiveApiUrl();
    return eff === '/api' ? '' : eff;
  });
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleTestApi = async () => {
    const targetUrl = customApiInput.trim().replace(/\/+$/, '');
    if (!targetUrl) {
      toast.error('Please enter a backend URL (e.g. https://your-app.onrender.com/api)');
      return;
    }
    setIsTestingApi(true);
    setApiTestResult(null);
    try {
      const pingUrl = targetUrl.endsWith('/api') ? `${targetUrl}/health` : `${targetUrl}/api/health`;
      const res = await fetch(pingUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      if (res.ok && data?.success) {
        setApiTestResult({
          success: true,
          message: `Backend is active! Telemetry: ${data.data?.env || 'production'} mode, ${data.data?.uptimeSeconds || 0}s uptime.`,
        });
        toast.success('Live API connected successfully!');
      } else {
        setApiTestResult({
          success: false,
          message: `Server reachable but returned status ${res.status}: ${data?.message || 'Check server logs'}`,
        });
      }
    } catch (err) {
      setApiTestResult({
        success: false,
        message: `Connection failed: ${err.message}. If deploying to Render, the server may take 30-60s to wake up from cold sleep.`,
      });
      toast.error('Could not reach backend URL');
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleSaveApi = () => {
    const val = customApiInput.trim();
    setCustomApiUrl(val);
    toast.success(val ? 'Connected to live cloud backend!' : 'Switched back to local storage mode');
  };

  const handleExportDump = () => {
    setIsExporting(true);
    try {
      const getStorage = (key, def) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : def;
        } catch {
          return def;
        }
      };
      const dump = {
        profiles: [getStorage('portfolio_cms_profile', {})],
        sitesettings: [getStorage('portfolio_cms_settings', {})],
        projects: getStorage('portfolio_cms_projects', []),
        skills: getStorage('portfolio_cms_skills', []),
        experiences: getStorage('portfolio_cms_experience', []),
        educations: getStorage('portfolio_cms_education', []),
        certifications: getStorage('portfolio_cms_certifications', []),
        testimonials: getStorage('portfolio_cms_testimonials', []),
        resumes: getStorage('portfolio_cms_resume', []),
        blogposts: getStorage('portfolio_cms_blog', []),
      };
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'initialDbDump.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded updated initialDbDump.json!');
    } catch (err) {
      toast.error('Failed to export database dump: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [settingsRes, seoRes] = await Promise.allSettled([
          api.get('/settings'),
          api.get('/seo'),
        ]);

        if (settingsRes.status === 'fulfilled') {
          const s = settingsRes.value.data?.data || settingsRes.value.data || {};
          setFormData((prev) => ({
            ...prev,
            ...s,
            sectionVisibility: { ...prev.sectionVisibility, ...(s.sectionVisibility || {}) },
            portfolio: { ...prev.portfolio, ...(s.portfolio || {}) },
            contactSettings: { ...prev.contactSettings, ...(s.contactSettings || {}) },
          }));
        }

        if (seoRes.status === 'fulfilled') {
          const s = seoRes.value.data?.data || seoRes.value.data || {};
          setSeoData({
            title: s.title || '',
            description: s.description || '',
            keywords: Array.isArray(s.keywords) ? s.keywords.join(', ') : (s.keywords || ''),
            ogImage: s.ogImage || '',
            twitterHandle: s.twitterHandle || '',
            canonicalUrl: s.canonicalUrl || '',
            robots: s.robots || 'index, follow',
          });
        }
      } catch (e) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === 'seo') {
        const payload = {
          ...seoData,
          keywords: seoData.keywords
            ? seoData.keywords.split(',').map((k) => k.trim()).filter(Boolean)
            : [],
        };
        await api.put('/seo', payload);
        toast.success('SEO and Meta tags saved successfully');
      } else {
        const payload = {
          siteName: formData.siteName,
          websiteLogo: formData.websiteLogo,
          websiteDescription: formData.websiteDescription,
          authorName: formData.authorName,
          defaultTheme: formData.defaultTheme,
          themePreset: formData.themePreset,
          accentColor: formData.accentColor,
          sectionVisibility: formData.sectionVisibility,
          portfolio: formData.portfolio,
          contactSettings: formData.contactSettings,
          maintenanceMode: formData.maintenanceMode,
          maintenanceMessage: formData.maintenanceMessage,
        };

        const { data } = await api.put('/settings', payload);
        const updated = data.data || data;
        setFormData((prev) => ({
          ...prev,
          ...updated,
          sectionVisibility: { ...prev.sectionVisibility, ...(updated.sectionVisibility || {}) },
          portfolio: { ...prev.portfolio, ...(updated.portfolio || {}) },
          contactSettings: { ...prev.contactSettings, ...(updated.contactSettings || {}) },
        }));

        if (formData.themePreset) {
          setPreset(formData.themePreset);
        }
        toast.success('Site settings saved successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (key) => {
    setFormData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [key]: !prev.sectionVisibility[key],
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-xs text-slate-400 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="font-semibold">Loading unified settings & SEO center...</span>
      </div>
    );
  }

  const presets = [
    { id: 'default', name: 'Default Blue', color: '#3b82f6' },
    { id: 'midnight', name: 'Midnight Violet', color: '#6366f1' },
    { id: 'ocean', name: 'Ocean Cyan', color: '#0ea5e9' },
    { id: 'emerald', name: 'Emerald Forest', color: '#10b981' },
    { id: 'monochrome', name: 'Sleek Monochrome', color: '#64748b' },
  ];

  const tabs = [
    { id: 'general', label: 'General & Theme', icon: Settings },
    { id: 'visibility', label: 'Section Visibility', icon: Eye },
    { id: 'seo', label: 'SEO & Meta Tags', icon: Globe },
    { id: 'contact', label: 'Inquiries & Auto-Reply', icon: Mail },
    { id: 'maintenance', label: 'System & Maintenance', icon: Shield },
    { id: 'database', label: 'Cloud Database & Live Sync', icon: Database },
  ];

  return (
    <div className="space-y-6 w-full pb-16 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#153f31] dark:text-emerald-400" />
            <span>Settings &amp; SEO Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unified management for branding, theme presets, public visibility, search meta, and inquiry automation.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] hover:opacity-95 text-white font-bold text-xs shadow-[0_8px_16px_rgba(5,150,105,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Modern Tabs Pill Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/80 dark:bg-[#111c13]/80 backdrop-blur-xl border border-white/80 dark:border-white/5 shadow-xs overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#153f31] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General & Theme */}
      {activeTab === 'general' && (
        <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 space-y-5">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#153f31] dark:text-emerald-400" />
            <span>Branding &amp; General Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Website Brand Name
              </label>
              <input
                type="text"
                value={formData.siteName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Author / Portfolio Owner Name
              </label>
              <input
                type="text"
                value={formData.authorName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Default Theme Mode
              </label>
              <select
                value={formData.defaultTheme || 'system'}
                onChange={(e) => setFormData((prev) => ({ ...prev, defaultTheme: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
              >
                <option value="system">System Preference (Auto)</option>
                <option value="dark">Dark Theme (Default)</option>
                <option value="light">Light Theme</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Website Tagline / Description
              </label>
              <input
                type="text"
                value={formData.websiteDescription || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, websiteDescription: e.target.value }))}
                placeholder="e.g. Full Stack Developer & AI Engineer"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
              />
            </div>
          </div>

          {/* Theme Preset Picker */}
          <div className="pt-4 border-t border-black/[0.04] dark:border-white/5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Theme Accent Preset Palette</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setFormData((prev) => ({ ...prev, themePreset: p.id }))}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.themePreset === p.id
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'border-black/5 dark:border-white/5 hover:bg-[#f4f7f4] dark:hover:bg-white/5'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mb-1.5 shadow-xs" style={{ backgroundColor: p.color }} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Section Visibility */}
      {activeTab === 'visibility' && (
        <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#153f31] dark:text-emerald-400" />
              <span>Public Section Visibility Controls</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Click to toggle Live state</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Show or hide individual sections on your public developer portfolio website. Changes apply immediately upon saving.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {Object.entries(formData.sectionVisibility).map(([key, isVisible]) => (
              <button
                type="button"
                key={key}
                onClick={() => toggleSection(key)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  isVisible
                    ? 'border-emerald-500/30 bg-[#edf5ed] dark:bg-emerald-950/20 text-slate-900 dark:text-white shadow-xs'
                    : 'border-black/5 dark:border-white/5 bg-[#f4f7f4]/60 dark:bg-white/5 opacity-50 text-slate-400'
                }`}
              >
                <span className="text-xs font-bold capitalize">{key}</span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all ${
                    isVisible ? 'bg-emerald-500 shadow-xs' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  {isVisible ? '✓' : '✕'}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-black/[0.04] dark:border-white/5">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f4f7f4] dark:bg-[#0c160e]">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Resume Download Action Button</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Controls the prominent "DOWNLOAD RESUME" button displayed on the public site.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    portfolio: {
                      ...prev.portfolio,
                      resumeDownloadButton: !(prev.portfolio?.resumeDownloadButton !== false),
                    },
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.portfolio?.resumeDownloadButton !== false ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    formData.portfolio?.resumeDownloadButton !== false ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SEO & Meta Tags */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#153f31] dark:text-emerald-400" />
                <span>Search Engine Optimization &amp; Social Previews</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Google, Bing &amp; Twitter Meta</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Meta Title (Browser Tab &amp; Google Result)
                </label>
                <input
                  type="text"
                  value={seoData.title || ''}
                  onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                  placeholder="Ajit Kumar | Full Stack Developer & AI Engineer"
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Meta Description (Google Snippet)
                </label>
                <textarea
                  rows="3"
                  value={seoData.description || ''}
                  onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                  placeholder="Engineering high-performance web systems and intelligent data-driven applications."
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={seoData.keywords || ''}
                    onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                    placeholder="react, fullstack, nodejs, mongodb, developer"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Robots Crawler Directive
                  </label>
                  <select
                    value={seoData.robots || 'index, follow'}
                    onChange={(e) => setSeoData({ ...seoData, robots: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                  >
                    <option value="index, follow">Index &amp; Follow (Recommended)</option>
                    <option value="noindex, follow">No Index, Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={seoData.canonicalUrl || ''}
                    onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                    placeholder="https://ajit0121k.github.io/Ajit-Portfolio/"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Twitter / X Handle
                  </label>
                  <input
                    type="text"
                    value={seoData.twitterHandle || ''}
                    onChange={(e) => setSeoData({ ...seoData, twitterHandle: e.target.value })}
                    placeholder="@ajitkumar"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#0c160e] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                  />
                </div>
              </div>

              <ImageUploadZone
                label="OpenGraph Social Banner (1200x630)"
                value={seoData.ogImage}
                onChange={(url) => setSeoData({ ...seoData, ogImage: url })}
              />
            </div>
          </div>

          {/* Dynamic Sitemap & Robots Card */}
          <div className="rounded-[28px] bg-white dark:bg-[#111c13] p-5 sm:p-6 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] border border-white/80 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileCode className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Dynamic Sitemap &amp; Robots</h3>
                <p className="text-[11px] text-slate-400">Generated dynamically based on published database entries</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/api/seo/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#f4f7f4] dark:hover:bg-white/5 flex items-center gap-1.5 transition"
              >
                <span>sitemap.xml</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/api/seo/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#f4f7f4] dark:hover:bg-white/5 flex items-center gap-1.5 transition"
              >
                <span>robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Contact & Auto-Reply */}
      {activeTab === 'contact' && (
        <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Contact Inquiries &amp; Auto-Reply Settings</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f4f7f4] dark:bg-[#0c160e]">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Enable Public Contact Form</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allow visitors to send messages directly through the portfolio contact form.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    contactSettings: {
                      ...prev.contactSettings,
                      enableContactForm: !(prev.contactSettings?.enableContactForm !== false),
                    },
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.contactSettings?.enableContactForm !== false ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    formData.contactSettings?.enableContactForm !== false ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f4f7f4] dark:bg-[#0c160e]">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Email Notification on Inquiries</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Receive an instant email whenever an inquiry is submitted.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    contactSettings: {
                      ...prev.contactSettings,
                      notifyOnMessage: !(prev.contactSettings?.notifyOnMessage !== false),
                    },
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.contactSettings?.notifyOnMessage !== false ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    formData.contactSettings?.notifyOnMessage !== false ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f4f7f4] dark:bg-[#0c160e]">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Automatic Email Auto-Reply</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Send an automatic confirmation email back to the sender.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    contactSettings: {
                      ...prev.contactSettings,
                      enableAutoReply: !prev.contactSettings?.enableAutoReply,
                    },
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.contactSettings?.enableAutoReply ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    formData.contactSettings?.enableAutoReply ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {formData.contactSettings?.enableAutoReply && (
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Auto-Reply Message Template
                </label>
                <textarea
                  rows="3"
                  value={formData.contactSettings?.autoReplyMessage || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactSettings: {
                        ...prev.contactSettings,
                        autoReplyMessage: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium resize-none"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Maintenance Mode */}
      {activeTab === 'maintenance' && (
        <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Maintenance Mode &amp; Safeguards</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f4f7f4] dark:bg-[#0c160e]">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Maintenance Mode</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  When enabled, visitors will see a maintenance notice instead of the portfolio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.maintenanceMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    formData.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {formData.maintenanceMode && (
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Maintenance Notice Message
                </label>
                <input
                  type="text"
                  value={formData.maintenanceMessage || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maintenanceMessage: e.target.value }))}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Cloud Database & Live Sync */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Connection Status Banner */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isLiveBackendConfigured()
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  isLiveBackendConfigured()
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}>
                  {isLiveBackendConfigured() ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-black flex items-center gap-2">
                    <span>{isLiveBackendConfigured() ? 'Live Cloud Database Connected' : 'Browser Storage Mode (Offline / Local)'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isLiveBackendConfigured()
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {isLiveBackendConfigured() ? 'Production API' : 'LocalStorage'}
                    </span>
                  </h3>
                  <p className="text-xs opacity-85 mt-0.5">
                    {isLiveBackendConfigured()
                      ? `Connected to: ${getEffectiveApiUrl()} — All changes instantly sync to MongoDB cloud database for all visitors and mobile devices.`
                      : 'Running on GitHub Pages without an external API. Edits are saved in this browser only. Connect a cloud backend below so edits appear globally on phones and for all visitors.'}
                  </p>
                </div>
              </div>

              {isLiveBackendConfigured() && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomApiUrl('');
                    setCustomApiInput('');
                    toast.success('Disconnected custom API. Using default mode.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition self-start sm:self-center cursor-pointer"
                >
                  Disconnect API
                </button>
              )}
            </div>
          </div>

          {/* Connect Live Backend API Card */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#111c13]/70 backdrop-blur-xl border border-white/80 dark:border-white/5 space-y-4 shadow-xs">
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#153f31] dark:text-emerald-400" />
                <span>Connect Live Backend API (Render.com / Railway)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter the hosted URL of your Node.js backend. Once connected, both the Admin CMS and Public Portfolio will use live MongoDB.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Backend API Base URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://ajit-portfolio-api.onrender.com/api"
                  value={customApiInput}
                  onChange={(e) => setCustomApiInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
                />
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={isTestingApi}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isTestingApi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Test Connection</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveApi}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Connect &amp; Save</span>
                </button>
              </div>

              {/* Test Connection Telemetry Result */}
              {apiTestResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                  apiTestResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/30 text-rose-800 dark:text-rose-300'
                }`}>
                  {apiTestResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{apiTestResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* One-Click Database Dump Export */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#111c13]/70 backdrop-blur-xl border border-white/80 dark:border-white/5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>One-Click Export Updated Database (Static Mode)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  Download the current state of your Profile, Projects, Skills, Experiences, and Settings as a fresh <code className="text-emerald-600 dark:text-emerald-400 font-mono">initialDbDump.json</code>. You can replace this in your repository to update the default portfolio for all visitors without needing a backend server!
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportDump}
                disabled={isExporting}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Download initialDbDump.json</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Render.com & MongoDB Atlas Deployment Guide */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#111c13]/70 backdrop-blur-xl border border-white/80 dark:border-white/5 space-y-4 shadow-xs">
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#153f31] dark:text-emerald-400" />
                <span>3-Minute Guide: Deploy Backend to Render + MongoDB Atlas (100% Free)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Follow these 3 simple steps to make your portfolio update in real time across all devices worldwide:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">1</div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">MongoDB Atlas (Free)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Go to <a href="https://mongodb.com/atlas" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-bold">mongodb.com/atlas</a>, create a free M0 cluster, create a database user, and copy the connection string: <code className="text-[10px] font-mono block mt-1 bg-black/5 dark:bg-white/5 p-1 rounded">mongodb+srv://user:pass@cluster.mongodb.net/portfolio</code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">2</div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Deploy on Render (Free)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Go to <a href="https://render.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-bold">render.com</a> &rarr; <strong>New Web Service</strong> &rarr; Connect repository <code className="text-[10px] font-mono font-bold">Ajit-Portfolio</code>. Set <strong>Root Directory:</strong> <code className="text-[10px] font-mono font-bold">server</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">3</div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Environment Variables</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Add <code className="text-[10px] font-mono">MONGODB_URI</code>, <code className="text-[10px] font-mono">JWT_ACCESS_SECRET</code>, <code className="text-[10px] font-mono">JWT_REFRESH_SECRET</code>, and <code className="text-[10px] font-mono">CLIENT_URL=https://ajit0121k.github.io</code>. Once deployed, paste your Render URL in the box above!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

