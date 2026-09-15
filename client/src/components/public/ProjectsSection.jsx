import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  ExternalLink,
  Github,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api.js';
import { usePortfolioSync } from '../../services/syncBus.js';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects/published');
      setProjects(data.data?.projects || data.projects || []);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  usePortfolioSync(['projects'], fetchProjects);

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="scroll-mt-24 py-16 px-4 sm:px-6 max-w-6xl mx-auto relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-[#3d4b3e] dark:text-[#a8bba9]" viewBox="0 0 100 100" fill="currentColor">
              {Array.from({ length: 16 }).map((_, i) => (
                <rect
                  key={i}
                  x="48"
                  y="10"
                  width="4"
                  height="26"
                  rx="2"
                  transform={`rotate(${i * 22.5} 50 50)`}
                />
              ))}
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#6b675d] dark:text-[#a8a397]">
              PRODUCTION CASE STUDIES
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight leading-tight">
            Featured <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">architectures</span>
          </h2>
        </div>

        <Link
          to="/projects"
          className="text-xs font-bold text-[#5c5950] dark:text-[#c4beb3] hover:text-[#1a241d] dark:hover:text-white flex items-center gap-1.5 group liquid-glass-pill px-4 py-2"
        >
          <span>VIEW ALL PROJECTS</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Numbered Exhibition Schedule List (Matching Template Exactly: 01, 02, 03, 04) */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-3xl bg-[#eae3d5]/50 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project, idx) => {
            const numStr = String(idx + 1).padStart(2, '0');
            return (
              <motion.div
                key={project.id || project._id || idx}
                initial={{ opacity: 0, y: 35, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.012 }}
                className="liquid-glass-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-shadow group border-[#dfd6c7]/80 hover:shadow-[0_20px_45px_-12px_rgba(68,62,51,0.15)] dark:hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.7)]"
              >
                {/* Number & Title */}
                <div className="flex items-center gap-6">
                  <span className="text-sm sm:text-base font-serif font-bold text-[#c66a3d]">
                    {numStr}
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#222723] dark:text-[#f3eee5] tracking-tight group-hover:text-[#c66a3d] dark:group-hover:text-[#e48358] transition-colors">
                      <Link to={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#6b675d] dark:text-[#a8a397] mt-1 line-clamp-1 max-w-lg font-sans">
                      {project.shortDescription || project.problem || 'Full-stack engineering implementation.'}
                    </p>
                  </div>
                </div>

                {/* Middle Tech & Scope Metadata */}
                <div className="hidden lg:block text-left font-sans">
                  <span className="text-xs font-semibold text-[#4a473f] dark:text-[#d3ded4] block">
                    {project.technologies?.slice(0, 3).join(' • ') || 'Full-Stack Architecture'}
                  </span>
                  <span className="text-[11px] text-[#8a8579] block mt-0.5">
                    {project.publishedAt ? new Date(project.publishedAt).toLocaleDateString() : 'Production System'}
                  </span>
                </div>

                {/* Right Action Button */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-full hover:bg-[#eae3d5] dark:hover:bg-white/10 text-[#5c5950] dark:text-[#c4beb3] transition-all"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}

                  <Link
                    to={`/projects/${project.slug}`}
                    className="liquid-glass-pill hover:bg-[#2d3a2e] hover:text-[#f5f0e8] dark:hover:bg-[#f3eee5] dark:hover:text-[#1a241d] text-xs font-bold transition-all flex items-center gap-1.5 px-4 py-2"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="liquid-glass-card p-16 text-center text-xs text-slate-400">
          No published projects yet. Create and publish projects in Admin CMS.
        </div>
      )}
    </section>
  );
}
