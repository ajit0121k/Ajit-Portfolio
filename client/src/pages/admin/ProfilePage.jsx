import React, { useState, useEffect } from 'react';
import { Save, User, Link as LinkIcon, FileText, RotateCcw, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUploadZone from '../../components/admin/ImageUploadZone';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completeness, setCompleteness] = useState(0);
  const [initialData, setInitialData] = useState(null);

  const defaultForm = {
    name: '',
    title: '',
    tagline: '',
    location: '',
    yearsOfExperience: 0,
    email: '',
    phone: '',
    bio: '',
    availabilityStatus: 'available',
    availabilityText: '',
    currentlyBuilding: { name: '', url: '' },
    avatar: '',
    resumeUrl: '',
    socialLinks: {
      github: '',
      linkedin: '',
      leetcode: '',
      twitter: '',
      website: '',
      youtube: '',
      dribbble: '',
      medium: '',
      devto: '',
    },
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profRes, compRes] = await Promise.allSettled([
        api.get('/profile'),
        api.get('/profile/completeness'),
      ]);

      if (profRes.status === 'fulfilled') {
        const p = profRes.value.data?.data || profRes.value.data || {};
        const mapped = {
          name: p.name || '',
          title: p.title || '',
          tagline: p.tagline || '',
          location: p.location || '',
          yearsOfExperience: p.yearsOfExperience || 0,
          email: p.email || '',
          phone: p.phone || '',
          bio: p.bio || '',
          availabilityStatus: p.availability || 'available',
          availabilityText: p.availabilityText || '',
          currentlyBuilding: {
            name: typeof p.currentlyBuilding === 'string' ? p.currentlyBuilding : p.currentlyBuilding?.name || '',
            url: p.currentlyBuildingUrl || p.currentlyBuilding?.url || '',
          },
          avatar: p.profileImage?.url || p.avatar || '',
          resumeUrl: p.resume?.url || p.resumeUrl || '',
          socialLinks: {
            github: p.socialLinks?.github || '',
            linkedin: p.socialLinks?.linkedin || '',
            leetcode: p.socialLinks?.leetcode || '',
            twitter: p.socialLinks?.twitter || '',
            website: p.socialLinks?.website || '',
            youtube: p.socialLinks?.youtube || '',
            dribbble: p.socialLinks?.dribbble || '',
            medium: p.socialLinks?.medium || '',
            devto: p.socialLinks?.devto || '',
          },
        };
        setFormData(mapped);
        setInitialData(mapped);
      }

      if (compRes.status === 'fulfilled') {
        const c = compRes.value.data?.data?.completeness ?? compRes.value.data?.completeness ?? 0;
        setCompleteness(c);
      }
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.split('_')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [platform]: value },
      }));
    } else if (name.startsWith('building_')) {
      const field = name.split('_')[1];
      setFormData((prev) => ({
        ...prev,
        currentlyBuilding: { ...prev.currentlyBuilding, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Full Name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        tagline: formData.tagline.trim(),
        location: formData.location.trim(),
        yearsOfExperience: Number(formData.yearsOfExperience) || 0,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio,
        availability: formData.availabilityStatus,
        availabilityText: formData.availabilityText,
        currentlyBuilding: formData.currentlyBuilding?.name || '',
        currentlyBuildingUrl: formData.currentlyBuilding?.url || '',
        socialLinks: formData.socialLinks,
      };

      if (formData.avatar) {
        payload.profileImage = { url: formData.avatar };
      }

      if (formData.resumeUrl) {
        payload.resume = { url: formData.resumeUrl, originalName: 'Ajit_Kumar_Resume.pdf' };
      }

      await api.put('/profile', payload);
      toast.success('Profile updated successfully! Live on public portfolio.');
      setInitialData(formData);

      const compRes = await api.get('/profile/completeness');
      const c = compRes.data?.data?.completeness ?? compRes.data?.completeness ?? completeness;
      setCompleteness(c);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
      toast('Changes reverted');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
        <span className="text-xs text-slate-400 font-medium">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass-card p-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
            <User className="w-6 h-6 text-amber-500" /> Profile & Identity Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal bio, contact channels, avatar, and social links visible across the public site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 liquid-glass-amber-btn text-white rounded-2xl transition flex items-center gap-2 text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Completeness Bar */}
      <div className="liquid-glass-card p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Profile Completeness
          </h2>
          <span className="text-xs font-black text-amber-500 font-mono">{completeness}%</span>
        </div>
        <div className="w-full bg-slate-200/80 dark:bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-700"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Info */}
        <div className="liquid-glass-card p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <User size={18} className="text-amber-500" /> Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                placeholder="Full Stack Developer & AI Engineer"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Tagline / Hero Hook
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                placeholder="Lucknow, India"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Long Bio */}
        <div className="liquid-glass-card p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-amber-500" /> Detailed Engineering Bio
          </h2>
          <RichTextEditor
            value={formData.bio}
            onChange={(val) => setFormData((prev) => ({ ...prev, bio: val }))}
          />
        </div>

        {/* Media & Docs Upload with MediaPicker */}
        <div className="liquid-glass-card p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">Profile Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadZone
              label="Profile Picture / Avatar"
              value={formData.avatar}
              onChange={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
              hint="Select from library or upload new PNG/JPG"
            />
            <ImageUploadZone
              label="Resume PDF"
              value={formData.resumeUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, resumeUrl: url }))}
              accept="application/pdf"
              hint="Official PDF resume for visitor downloads"
            />
          </div>
        </div>

        {/* Availability & Building */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="liquid-glass-card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Availability Status</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Status Flag
              </label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
              >
                <option value="available">Available for Roles & Freelance</option>
                <option value="limited">Limited Availability</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Status Badge Label
              </label>
              <input
                type="text"
                name="availabilityText"
                value={formData.availabilityText}
                onChange={handleChange}
                placeholder="Available for Full-Time Roles"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Currently Building
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  name="building_name"
                  value={formData.currentlyBuilding?.name || ''}
                  onChange={handleChange}
                  placeholder="Project Name (e.g. AI Startup Trend Analyzer)"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                />
                <input
                  type="url"
                  name="building_url"
                  value={formData.currentlyBuilding?.url || ''}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="liquid-glass-card p-6 space-y-3">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <LinkIcon size={18} className="text-amber-500" /> Social & Developer Profiles
            </h2>

            {Object.keys(formData.socialLinks || {}).map((platform) => (
              <div key={platform}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 capitalize">
                  {platform}
                </label>
                <input
                  type="text"
                  name={`social_${platform}`}
                  value={formData.socialLinks[platform]}
                  onChange={handleChange}
                  placeholder={`https://${platform}.com/...`}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full liquid-glass-amber-btn text-white text-xs font-bold uppercase tracking-wider transition shadow-lg cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
