import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Sparkles, User } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/blog/slug/${slug}`);
        setPost(data.data || data);
      } catch (err) {
        toast.error('Article not found');
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto space-y-6">
        <div className="h-6 w-32 rounded-full bg-slate-200/60 dark:bg-white/5 animate-pulse" />
        <div className="h-12 w-full rounded-2xl bg-slate-200/60 dark:bg-white/5 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200/60 dark:bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="pt-28 pb-24 px-4 max-w-3xl mx-auto">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </span>
          )}
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime} min read</span>
            </span>
          )}
          {post.category && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold text-[10px]">
              {post.category}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-primary-500 pl-4 my-4">
            {post.excerpt}
          </p>
        )}

        {/* Author & Share bar */}
        <div className="flex items-center justify-between py-4 border-y border-slate-200/80 dark:border-white/10 mt-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{post.author || 'Admin'}</p>
              <p className="text-[10px] text-slate-400">Author</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl liquid-glass-pill text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-all flex items-center gap-1.5 text-xs font-medium"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage?.url && (
        <div className="rounded-3xl overflow-hidden border border-white/60 dark:border-white/10 shadow-2xl mb-10 bg-slate-900/10">
          <img
            src={post.coverImage.url}
            alt={post.title}
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Content Body */}
      <div
        className="prose dark:prose-invert prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary-500 prose-img:rounded-2xl max-w-none leading-relaxed text-slate-700 dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Post Tags Footer */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Tags:</span>
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
