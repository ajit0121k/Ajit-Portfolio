import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Shield, Palette, Eye, Mail, MessageSquare, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import useThemeStore from '../../store/themeStore.js';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { setPreset } = useThemeStore();
  const [formData, setFormData] = useState({
    siteName: 'My Portfolio',
    websiteLogo: '',
    websiteDescription: '',
    authorName: 'Ajit Kumar',
    defaultTheme: 'system',
    themePreset: 'default',
    accentColor: '#3b82f6',
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
      autoReplyMessage: 'Thank you for reaching out! I have received your inquiry and will get back to you within 24 hours.',
      notifyOnMessage: true,
    },
    maintenanceMode: false,
    maintenanceMessage: 'Portfolio is currently undergoing scheduled maintenance. Please check back shortly.',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        const s = data.data || data;
        setFormData((prev) => ({
          ...prev,
          ...s,
          sectionVisibility: { ...prev.sectionVisibility, ...(s.sectionVisibility || {}) },
          portfolio: { ...prev.portfolio, ...(s.portfolio || {}) },
          contactSettings: { ...prev.contactSettings, ...(s.contactSettings || {}) },
        }));
      } catch (e) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
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
      <div className="flex items-center justify-center p-16 text-xs text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500 mr-2" />
        <span>Loading system settings...</span>
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

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Site & CMS Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure global portfolio appearance, theme presets, section visibility, and system rules.
          </p>
        </div>
        <button
          type="submit"
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

      {/* General Information Card */}
      <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 space-y-5">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#153f31] dark:text-emerald-400" />
          <span>General Information</span>
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
              <option value="system">System Preference</option>
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Website Tagline / Short Description
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
            <span>Theme Accent Preset</span>
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

      {/* Section Visibility Card */}
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
      </div>

      {/* Portfolio Controls & Maintenance Mode */}
      <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          <span>Maintenance Mode & Portfolio Controls</span>
        </h2>

        <div className="space-y-3">
          {/* Maintenance Mode Toggle */}
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

          {/* Resume Download Button Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f4f7f4] dark:bg-[#0c160e]">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Public Resume Download Button</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Show or hide the "DOWNLOAD RESUME" action button on the public portfolio.
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

      {/* Contact & Auto-Reply Settings */}
      <div className="rounded-[30px] bg-white dark:bg-[#111c13] p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/80 dark:border-white/5 space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Contact Inquiries & Auto-Reply</span>
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f4f7f4] dark:bg-[#0c160e]">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Enable Public Contact Form</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Allow visitors to send inquiries directly through the website contact form.
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
                Receive an instant email when someone sends a message through the contact form.
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
        </div>
      </div>
    </form>
  );
}
