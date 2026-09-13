import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Star, Pin, Edit, Trash2, Github, 
  ExternalLink, Copy, ArrowUp, ArrowDown, FolderGit2 
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, draft, archived
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      const list = res.data?.data?.projects || res.data?.projects || (Array.isArray(res.data) ? res.data : []);
      // Sort by order ascending
      const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
      setProjects(sorted);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/projects/${deleteId}`);
      toast.success('Project deleted successfully');
      setProjects((prev) => prev.filter((p) => p._id !== deleteId && p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await api.patch(`/projects/${id}/status`, { status: newStatus });
      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? { ...p, status: newStatus } : p))
      );
      toast.success(`Project status changed to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update project status');
    }
  };

  const toggleFlag = async (id, flag, currentValue) => {
    try {
      await api.put(`/projects/${id}`, { [flag]: !currentValue });
      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? { ...p, [flag]: !currentValue } : p))
      );
      toast.success(`Project ${flag} updated`);
    } catch (err) {
      toast.error('Failed to update flag');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/projects/${id}/duplicate`);
      toast.success('Project duplicated as draft');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to duplicate project');
    }
  };

  const handleMove = async (index, direction) => {
    const newProjects = [...projects];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Update order property
    const reordered = newProjects.map((p, idx) => ({ ...p, order: idx }));
    setProjects(reordered);

    try {
      const items = reordered.map((p) => ({ id: p._id || p.id, order: p.order }));
      await api.patch('/projects/reorder', { items });
      toast.success('Projects reordered successfully');
    } catch (err) {
      toast.error('Failed to save project order');
      fetchProjects();
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
        <span className="text-xs text-slate-400 font-medium">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass-card p-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-amber-500" /> Projects Portfolio Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create case studies, upload galleries, manage publication status, and set display order.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="px-5 py-2.5 liquid-glass-amber-btn text-white rounded-2xl flex items-center gap-2 text-xs font-bold shadow-md cursor-pointer"
          >
            <Plus size={16} /> New Project
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass-card p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-1.5 p-1 rounded-full bg-white/5 border border-white/10">
          {['all', 'published', 'draft', 'archived'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition ${
                filter === f
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-amber-400 outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => {
          const imageUrl = typeof project.coverImage === 'string' ? project.coverImage : project.coverImage?.url;
          const techList = project.technologies || project.techStack?.main || [];

          return (
            <div
              key={project._id || project.id}
              className="liquid-glass-card overflow-hidden flex flex-col justify-between group hover:scale-[1.01] transition-all"
            >
              {/* Cover Image & Quick Action Badges */}
              <div className="h-48 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-slate-500 text-xs font-semibold flex items-center gap-1.5">
                    <FolderGit2 size={20} /> No Cover Image
                  </div>
                )}

                {/* Top Action Icons: Star, Pin, Reorder Up/Down */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up in Display Order"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === filteredProjects.length - 1}
                    className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down in Display Order"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFlag(project._id || project.id, 'featured', project.featured)}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition ${
                      project.featured ? 'bg-amber-500 text-white' : 'bg-black/60 text-white/70 hover:bg-black/80'
                    }`}
                    title="Toggle Featured"
                  >
                    <Star size={14} className={project.featured ? 'fill-current' : ''} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFlag(project._id || project.id, 'pinned', project.pinned)}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition ${
                      project.pinned ? 'bg-sky-500 text-white' : 'bg-black/60 text-white/70 hover:bg-black/80'
                    }`}
                    title="Toggle Pinned"
                  >
                    <Pin size={14} className={project.pinned ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* Category Badge */}
                {project.category && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    {project.category}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-base text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        project.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.shortDescription || 'No short description provided.'}
                  </p>

                  {/* Tech stack pills */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {techList.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {techList.length > 4 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-lg bg-white/5 text-slate-500">
                          +{techList.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleStatus(project._id || project.id, project.status)}
                    className="text-xs font-bold text-slate-400 hover:text-amber-400 transition"
                  >
                    {project.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(project._id || project.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                      title="Duplicate Project"
                    >
                      <Copy size={14} />
                    </button>
                    <Link
                      to={`/admin/projects/${project._id || project.id}/edit`}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-400 transition"
                      title="Edit Case Study"
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(project._id || project.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 liquid-glass-card border-dashed border-white/15">
          <FolderGit2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Projects Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'No projects match your search query.' : 'Click "New Project" to add your first case study.'}
          </p>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          isOpen={!!deleteId}
          title="Delete Project"
          message="Are you sure you want to permanently delete this project? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
