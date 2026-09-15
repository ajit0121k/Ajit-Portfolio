import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, Eye, ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUploadZone from '../../components/admin/ImageUploadZone';

export default function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const defaultForm = {
    title: '',
    slug: '',
    shortDescription: '',
    category: 'Full-Stack Web App',
    status: 'draft',
    startDate: '',
    endDate: '',
    problem: '',
    solution: '',
    architecture: '',
    challenges: '',
    lessonsLearned: '',
    features: [],
    technologies: [],
    coverImage: '',
    gallery: [],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    pinned: false,
    order: 0,
  };

  const [formData, setFormData] = useState(defaultForm);
  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id, isEdit]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      const p = res.data?.data || res.data;
      if (p) {
        setFormData({
          title: p.title || '',
          slug: p.slug || '',
          shortDescription: p.shortDescription || '',
          category: p.category || 'Full-Stack Web App',
          status: p.status || 'draft',
          startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
          endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
          problem: p.problem || '',
          solution: p.solution || '',
          architecture: p.architecture || '',
          challenges: p.challenges || '',
          lessonsLearned: p.lessonsLearned || '',
          features: Array.isArray(p.features) ? p.features : [],
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
          coverImage: typeof p.coverImage === 'string' ? p.coverImage : p.coverImage?.url || '',
          gallery: Array.isArray(p.gallery) ? p.gallery.map(g => typeof g === 'string' ? g : g.url) : [],
          githubUrl: p.githubUrl || '',
          liveUrl: p.liveUrl || '',
          featured: !!p.featured,
          pinned: !!p.pinned,
          order: p.order || 0,
        });
      }
    } catch (err) {
      toast.error('Failed to load project details');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }));
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleAddGalleryImage = (url) => {
    if (url && !formData.gallery.includes(url)) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, url],
      }));
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Project Title is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug?.trim() || undefined,
        shortDescription: formData.shortDescription?.trim(),
        category: formData.category,
        status: formData.status,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        problem: formData.problem,
        solution: formData.solution,
        architecture: formData.architecture,
        challenges: formData.challenges,
        lessonsLearned: formData.lessonsLearned,
        features: formData.features,
        technologies: formData.technologies,
        coverImage: formData.coverImage ? { url: formData.coverImage } : undefined,
        gallery: formData.gallery.map((url) => ({ url })),
        githubUrl: formData.githubUrl?.trim(),
        liveUrl: formData.liveUrl?.trim(),
        featured: formData.featured,
        pinned: formData.pinned,
        order: formData.order,
      };

      if (isEdit) {
        await api.put(`/projects/${id}`, payload);
        toast.success('Project updated successfully! Synced to public site.');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created successfully!');
      }

      navigate('/admin/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
        <span className="text-xs text-slate-400 font-medium">Loading project case study...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass-card p-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {isEdit ? 'Edit Case Study' : 'Create New Project'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEdit ? `Updating ${formData.title}` : 'Fill in project technical details and rich media'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {formData.slug && (
            <a
              href={`/projects/${formData.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Eye size={14} /> Preview Live
            </a>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 liquid-glass-amber-btn text-white rounded-2xl transition flex items-center gap-2 text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Case Study'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-white/10 pb-2">
        {[
          { key: 'basic', label: '1. Basic Info' },
          { key: 'case-study', label: '2. Case Study Content' },
          { key: 'tech', label: '3. Stack & Features' },
          { key: 'media', label: '4. Images & Gallery' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              activeTab === t.key
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Basic Info */}
        {activeTab === 'basic' && (
          <div className="liquid-glass-card p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overview & Metadata
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. AI Startup Trend Analyzer"
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Slug (Auto-generated if blank)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. startup-trend-analyzer"
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Web App, Cloud / DevOps, GenAI"
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Publication Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Live on portfolio)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2 text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  End Date / Launch Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2 text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Short Description (Cards & Previews, max 300 chars)
              </label>
              <textarea
                name="shortDescription"
                rows={3}
                maxLength={300}
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="High-level overview of the application and its purpose..."
                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-3 border-t border-slate-200 dark:border-white/10">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded border-slate-300 dark:border-white/20 text-amber-500 focus:ring-amber-400"
                />
                <span>Featured Project (Highlighted on Home Page)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="pinned"
                  checked={formData.pinned}
                  onChange={handleChange}
                  className="rounded border-slate-300 dark:border-white/20 text-sky-500 focus:ring-sky-400"
                />
                <span>Pinned to Top</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: Case Study Content (Rich Text) */}
        {activeTab === 'case-study' && (
          <div className="space-y-6">
            <div className="liquid-glass-card p-6 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Problem Statement
              </h2>
              <RichTextEditor
                value={formData.problem}
                onChange={(val) => setFormData((prev) => ({ ...prev, problem: val }))}
              />
            </div>

            <div className="liquid-glass-card p-6 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Engineered Solution
              </h2>
              <RichTextEditor
                value={formData.solution}
                onChange={(val) => setFormData((prev) => ({ ...prev, solution: val }))}
              />
            </div>

            <div className="liquid-glass-card p-6 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                System Architecture & Technical Design
              </h2>
              <RichTextEditor
                value={formData.architecture}
                onChange={(val) => setFormData((prev) => ({ ...prev, architecture: val }))}
              />
            </div>

            <div className="liquid-glass-card p-6 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Engineering Challenges & Trade-offs
              </h2>
              <RichTextEditor
                value={formData.challenges}
                onChange={(val) => setFormData((prev) => ({ ...prev, challenges: val }))}
              />
            </div>

            <div className="liquid-glass-card p-6 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Lessons Learned & Outcomes
              </h2>
              <RichTextEditor
                value={formData.lessonsLearned}
                onChange={(val) => setFormData((prev) => ({ ...prev, lessonsLearned: val }))}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Tech Stack & Features */}
        {activeTab === 'tech' && (
          <div className="space-y-6">
            {/* Tech stack tags */}
            <div className="liquid-glass-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Technologies & Tools
              </h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, MongoDB, FastAPI, Docker"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 rounded-2xl liquid-glass-amber-btn text-white text-xs font-bold"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(t)}
                      className="hover:text-rose-500 dark:hover:text-rose-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features List */}
            <div className="liquid-glass-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Key Highlights & Features
              </h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Real-time data pipeline with 10ms latency streaming"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 rounded-2xl liquid-glass-amber-btn text-white text-xs font-bold"
                >
                  Add Feature
                </button>
              </div>

              <ul className="space-y-2 pt-2">
                {formData.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Media & Gallery */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Cover Image with MediaPicker */}
            <div className="liquid-glass-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Cover Image (Primary Card Thumbnail)
              </h2>
              <ImageUploadZone
                label="Cover Image"
                value={formData.coverImage}
                onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                hint="High-resolution banner or mock-up (16:9 ratio recommended)"
              />
            </div>

            {/* Gallery Images with MediaPicker */}
            <div className="liquid-glass-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Project Gallery & Screenshots
              </h2>

              <ImageUploadZone
                label="Add Screenshot to Gallery"
                value=""
                onChange={(url) => handleAddGalleryImage(url)}
                hint="Upload or pick screenshots to include in project carousel"
              />

              {formData.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                  {formData.gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group h-32 bg-slate-950"
                    >
                      <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500 text-white shadow-md hover:bg-rose-600 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Bottom Action Bar */}
        <div className="sticky bottom-4 z-20 liquid-glass-card p-4 flex items-center justify-between shadow-2xl">
          <Link
            to="/admin/projects"
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            &larr; Cancel and return to projects
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-full liquid-glass-amber-btn text-white text-xs font-bold uppercase tracking-wider transition shadow-lg cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Case Study'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
