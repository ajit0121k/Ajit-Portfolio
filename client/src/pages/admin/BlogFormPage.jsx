import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Send } from 'lucide-react';
import api from '../../services/api.js';
import RichTextEditor from '../../components/admin/RichTextEditor.jsx';
import ImageUploadZone from '../../components/admin/ImageUploadZone.jsx';
import toast from 'react-hot-toast';

export default function BlogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: { url: '', publicId: '' },
    category: 'Engineering',
    tags: '',
    status: 'draft',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const { data } = await api.get(`/blog/${id}`);
          const p = data.data || data;
          setFormData({
            title: p.title || '',
            slug: p.slug || '',
            excerpt: p.excerpt || '',
            content: p.content || '',
            coverImage: p.coverImage || { url: '', publicId: '' },
            category: p.category || 'Engineering',
            tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
            status: p.status || 'draft',
          });
        } catch (e) {
          toast.error('Failed to load post data');
          navigate('/admin/blog');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (targetStatus) => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }
    if (!formData.content) {
      toast.error('Article content is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        status: targetStatus || formData.status,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await api.put(`/blog/${id}`, payload);
        toast.success('Article updated successfully');
      } else {
        await api.post('/blog', payload);
        toast.success('Article created successfully');
      }
      navigate('/admin/blog');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">Loading article editor...</div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit('published')}
            className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-primary-600/20 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      <div className="liquid-glass-card p-6 md:p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Article Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Architecting Scalable Full-Stack Systems with MERN"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <input
              type="text"
              placeholder="Engineering, Architecture, DevOps, etc."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="react, node, mongodb, performance"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Excerpt / Summary
          </label>
          <textarea
            rows="2"
            placeholder="Brief overview displayed on the blog directory..."
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white resize-none"
          />
        </div>

        {/* Cover Photo */}
        <ImageUploadZone
          label="Article Cover Image"
          value={formData.coverImage?.url || ''}
          onChange={(url) => setFormData({ ...formData, coverImage: { url, publicId: '' } })}
        />

        {/* Rich Text Editor */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Article Content (Rich Text / Markdown) *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Write your article body here..."
          />
        </div>
      </div>
    </div>
  );
}
