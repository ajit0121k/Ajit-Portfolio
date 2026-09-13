import React, { useState, useEffect } from 'react';
import { resolveAssetUrl } from '../../utils/assetUrl.js';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Image as ImageIcon,
  Share2,
  Calendar,
} from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/projects/slug/${slug}`);
        const projData = data.data || data;
        setProject(projData);

        // Fetch related projects
        if (projData?.id || projData?._id) {
          try {
            const relRes = await api.get(`/projects/slug/${slug}/related`);
            setRelated(relRes.data.data || relRes.data || []);
          } catch (e) {}
        }
      } catch (err) {
        toast.error('Project not found');
        navigate('/projects');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-40 rounded-full bg-slate-200/60 dark:bg-white/5 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200/60 dark:bg-white/5 animate-pulse" />
        <div className="h-40 rounded-3xl bg-slate-200/60 dark:bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="pt-28 pb-24 px-4 max-w-4xl mx-auto">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Case Study Hero */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="liquid-glass-pill px-3 py-1 text-[11px] font-bold text-primary-600 dark:text-primary-400">
            Case Study
          </span>
          {project.publishedAt && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(project.publishedAt).toLocaleDateString()}</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          {project.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          {project.shortDescription || project.problem}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Live App</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="liquid-glass-pill px-5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero Cover Image */}
      {project.coverImage?.url && (
        <div className="rounded-3xl overflow-hidden border border-white/60 dark:border-white/10 shadow-2xl mb-12 bg-slate-900/10 dark:bg-black/30">
          <img
            src={resolveAssetUrl(project.coverImage.url)}
            alt={project.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* Tech Stack Banner */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="liquid-glass-card p-6 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary-500" />
            <span>Technologies & Stack</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300 border border-primary-500/20"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Case Study Body Sections */}
      <div className="space-y-10">
        {/* Problem Statement */}
        {project.problem && (
          <div className="liquid-glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>The Engineering Problem</span>
            </h2>
            <div
              className="prose dark:prose-invert prose-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-none"
              dangerouslySetInnerHTML={{ __html: project.problem }}
            />
          </div>
        )}

        {/* The Solution */}
        {project.solution && (
          <div className="liquid-glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <Lightbulb className="w-5 h-5 text-primary-500" />
              <span>Architectural Solution</span>
            </h2>
            <div
              className="prose dark:prose-invert prose-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-none"
              dangerouslySetInnerHTML={{ __html: project.solution }}
            />
          </div>
        )}

        {/* System Architecture */}
        {project.architecture && (
          <div className="liquid-glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>System Design & Architecture</span>
            </h2>
            <div
              className="prose dark:prose-invert prose-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-none"
              dangerouslySetInnerHTML={{ __html: project.architecture }}
            />
          </div>
        )}

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <div className="liquid-glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Key Features & Capabilities</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {project.features.map((f, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges & Lessons Learned */}
        {(project.challenges || project.lessonsLearned) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.challenges && (
              <div className="liquid-glass-card p-6">
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Key Challenges Overcome</span>
                </h2>
                <div
                  className="prose dark:prose-invert prose-xs text-slate-600 dark:text-slate-300 max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.challenges }}
                />
              </div>
            )}
            {project.lessonsLearned && (
              <div className="liquid-glass-card p-6">
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Key Takeaways & Insights</span>
                </h2>
                <div
                  className="prose dark:prose-invert prose-xs text-slate-600 dark:text-slate-300 max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.lessonsLearned }}
                />
              </div>
            )}
          </div>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="liquid-glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <ImageIcon className="w-5 h-5 text-pink-500" />
              <span>Project Interface & Gallery</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(resolveAssetUrl(img.url))}
                  className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 cursor-pointer group relative bg-slate-900/20"
                >
                  <img
                    src={resolveAssetUrl(img.url)}
                    alt={img.caption || `Screenshot ${idx + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {img.caption && (
                    <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <img
            src={activeImage}
            alt="Zoomed view"
            className="max-w-4xl max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
