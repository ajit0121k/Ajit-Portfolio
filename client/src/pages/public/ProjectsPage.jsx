import React, { useState, useEffect } from 'react';
import { resolveAssetUrl } from '../../utils/assetUrl.js';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Search,
  ExternalLink,
  Github,
  ArrowUpRight,
  Sparkles,
  Tag,
} from 'lucide-react';
import api from '../../services/api.js';
import { usePortfolioSync } from '../../services/syncBus.js';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
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

  // Collect all unique technologies
  const allTechnologies = [
    'All',
    ...Array.from(new Set(projects.flatMap((p) => p.technologies || []))),
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase())) ||
      (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesTech =
      selectedTech === 'All' || (p.technologies && p.technologies.includes(selectedTech));

    return matchesSearch && matchesTech;
  });

  return (
    <div className="pt-28 pb-20 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-3">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Case Studies & Projects</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Featured <span className="italic font-light text-primary-500">Engineering Work</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
          Comprehensive deep-dives into full-stack architecture, problem-solving methodologies, and live implementations.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full liquid-glass border border-white/60 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </div>

        {/* Tech Badges Carousel/Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {allTechnologies.slice(0, 8).map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedTech === tech
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white liquid-glass hover:bg-white/70 dark:hover:bg-white/10'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id || project._id || idx}
              className="liquid-glass-card overflow-hidden group flex flex-col justify-between hover:scale-[1.01] transition-all"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-900/10 dark:bg-black/30">
                  {project.coverImage?.url ? (
                    <img
                      src={resolveAssetUrl(project.coverImage.url)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-primary-900/30 to-indigo-900/30 text-primary-400 font-bold text-base">
                      {project.title}
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-black/60 hover:bg-black text-white backdrop-blur-md transition-all shadow-md"
                        title="GitHub Repo"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white backdrop-blur-md transition-all shadow-md"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-primary-500 transition-colors">
                    <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {project.shortDescription || project.problem || 'In-depth engineering breakdown.'}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6">
                <Link
                  to={`/projects/${project.slug}`}
                  className="w-full py-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="liquid-glass-card p-16 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No projects matched your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
