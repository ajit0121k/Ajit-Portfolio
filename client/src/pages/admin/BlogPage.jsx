import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Search, Edit3, Trash2, Calendar, Clock, Eye, Sparkles } from 'lucide-react';
import api from '../../services/api.js';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import toast from 'react-hot-toast';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/blog');
      setPosts(data.data?.posts || data.posts || []);
    } catch (e) {
      toast.error('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/blog/${deleteId}`);
      toast.success('Post deleted successfully');
      setPosts((prev) => prev.filter((p) => (p.id || p._id) !== deleteId));
    } catch (e) {
      toast.error('Failed to delete post');
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Blog & Articles</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage technical writings, guides, and drafts</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs shadow-md shadow-primary-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((post) => (
            <div
              key={post.id || post._id}
              className="liquid-glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 truncate">
                {post.coverImage?.url ? (
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                )}

                <div className="truncate">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        post.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {post.status || 'draft'}
                    </span>
                    {post.category && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        &bull; {post.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    {post.publishedAt && (
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    )}
                    {post.readingTime && <span>{post.readingTime} min read</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {post.status === 'published' && (
                  <Link
                    to={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl text-slate-500 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-white/5"
                    title="View public post"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  to={`/admin/blog/${post.id || post._id}/edit`}
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-white/5"
                  title="Edit post"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDeleteId(post.id || post._id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="liquid-glass-card p-12 text-center text-xs text-slate-400">
          No articles created yet. Click &ldquo;Write New Article&rdquo; to begin.
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Blog Post"
        message="Are you sure you want to permanently delete this article?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
