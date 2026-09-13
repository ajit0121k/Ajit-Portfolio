import React, { useState, useEffect } from 'react';
import { Search, Save, ExternalLink, Globe, FileCode } from 'lucide-react';
import api from '../../services/api.js';
import ImageUploadZone from '../../components/admin/ImageUploadZone.jsx';
import toast from 'react-hot-toast';

export default function SEOPage() {
  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
    twitterHandle: '',
    canonicalUrl: '',
    robots: 'index, follow',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const { data } = await api.get('/seo');
        const s = data.data || data;
        setSeo({
          title: s.title || '',
          description: s.description || '',
          keywords: Array.isArray(s.keywords) ? s.keywords.join(', ') : (s.keywords || ''),
          ogImage: s.ogImage || '',
          twitterHandle: s.twitterHandle || '',
          canonicalUrl: s.canonicalUrl || '',
          robots: s.robots || 'index, follow',
        });
      } catch (e) {
        toast.error('Failed to load SEO settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSEO();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...seo,
        keywords: seo.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      };
      await api.put('/seo', payload);
      toast.success('SEO metadata updated successfully');
    } catch (err) {
      toast.error('Failed to update SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading SEO settings...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Search Engine Optimization (SEO)</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage Google meta tags, OpenGraph previews, and crawling directives</p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save SEO</span>
        </button>
      </div>

      {/* Meta tags card */}
      <div className="liquid-glass-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Meta Title
          </label>
          <input
            type="text"
            placeholder="Senior Full Stack Engineer & System Architect | Portfolio"
            value={seo.title}
            onChange={(e) => setSeo({ ...seo, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Meta Description
          </label>
          <textarea
            rows="3"
            placeholder="Engineering high-performance web systems and intelligent data-driven applications."
            value={seo.description}
            onChange={(e) => setSeo({ ...seo, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              placeholder="fullstack, react, nodejs, mongodb, developer"
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Robots Crawler Directive
            </label>
            <select
              value={seo.robots}
              onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white"
            >
              <option value="index, follow">Index & Follow (Recommended)</option>
              <option value="noindex, follow">No Index, Follow</option>
              <option value="noindex, nofollow">No Index, No Follow</option>
            </select>
          </div>
        </div>

        <ImageUploadZone
          label="OpenGraph Social Banner (1200x630)"
          value={seo.ogImage}
          onChange={(url) => setSeo({ ...seo, ogImage: url })}
        />
      </div>

      {/* Crawl Directives Links */}
      <div className="liquid-glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileCode className="w-6 h-6 text-primary-500" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Dynamic Sitemap & Robots</h3>
            <p className="text-[11px] text-slate-400">Generated dynamically based on published MongoDB entries</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/seo/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1.5"
          >
            <span>sitemap.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/api/seo/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1.5"
          >
            <span>robots.txt</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </form>
  );
}
