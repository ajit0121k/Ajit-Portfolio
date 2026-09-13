import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Cpu, ArrowUp, ArrowDown, Eye, EyeOff, Search } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const initialForm = {
    name: '',
    category: 'Frontend',
    icon: '',
    proficiency: 85,
    level: 'Advanced',
    years: 1,
    visible: true,
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const categories = ['All', 'Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'Tools', 'Other'];
  const formCategories = ['Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'Tools', 'Other'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/skills');
      const list = res.data?.data || res.data || (Array.isArray(res.data) ? res.data : []);
      const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
      setSkills(sorted);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (skill = null) => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        category: skill.category || 'Frontend',
        icon: skill.icon || '',
        proficiency: skill.proficiency ?? 85,
        level: skill.level || 'Advanced',
        years: skill.years ?? 1,
        visible: skill.visible !== false,
        order: skill.order || 0,
      });
      setEditId(skill._id || skill.id);
    } else {
      setFormData({
        ...initialForm,
        order: skills.length,
      });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        icon: formData.icon?.trim(),
        proficiency: Number(formData.proficiency) || 80,
        level: formData.level,
        years: Number(formData.years) || 1,
        visible: formData.visible,
        order: formData.order,
      };

      if (editId) {
        await api.put(`/skills/${editId}`, payload);
        toast.success('Skill updated successfully');
      } else {
        await api.post('/skills', payload);
        toast.success('Skill added successfully');
      }

      closeModal();
      fetchSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save skill');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/skills/${deleteId}`);
      toast.success('Skill deleted');
      setSkills((prev) => prev.filter((s) => s._id !== deleteId && s.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const toggleVisibility = async (skill) => {
    const id = skill._id || skill.id;
    try {
      const updated = !skill.visible;
      await api.put(`/skills/${id}`, { visible: updated });
      setSkills((prev) =>
        prev.map((s) => (s._id === id || s.id === id ? { ...s, visible: updated } : s))
      );
      toast.success(`Skill ${updated ? 'enabled' : 'hidden'} on public portfolio`);
    } catch (err) {
      toast.error('Failed to update skill visibility');
    }
  };

  const handleMove = async (index, direction) => {
    const newSkills = [...skills];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSkills.length) return;

    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;

    const reordered = newSkills.map((s, idx) => ({ ...s, order: idx }));
    setSkills(reordered);

    try {
      const items = reordered.map((s) => ({ id: s._id || s.id, order: s.order }));
      await api.patch('/skills/reorder', { items });
      toast.success('Skills reordered');
    } catch (err) {
      toast.error('Failed to save skill order');
      fetchSkills();
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (activeCategory !== 'All' && s.category !== activeCategory) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
        <span className="text-xs text-slate-400 font-medium">Loading technical skills...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass-card p-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-amber-500" /> Technical Skills Stack
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your core technical proficiencies. All changes instantly reflect on the public skills section.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          className="px-5 py-2.5 liquid-glass-amber-btn text-white rounded-2xl flex items-center gap-2 text-xs font-bold shadow-md cursor-pointer"
        >
          <Plus size={16} /> Add New Skill
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass-card p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-1.5 w-full rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-amber-400 outline-none"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill, idx) => (
          <div
            key={skill._id || skill.id}
            className={`liquid-glass-card p-5 flex flex-col justify-between group hover:scale-[1.01] transition-all ${
              !skill.visible ? 'opacity-50' : ''
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-bold text-white">{skill.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {skill.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {skill.level || 'Advanced'}
                    </span>
                  </div>
                </div>

                {/* Move & Visibility Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === filteredSkills.length - 1}
                    className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVisibility(skill)}
                    className="p-1 rounded bg-white/5 text-slate-400 hover:text-amber-400"
                    title={skill.visible ? 'Hide from public portfolio' : 'Show on public portfolio'}
                  >
                    {skill.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1">
                  <span>Proficiency</span>
                  <span className="text-amber-400 font-mono">{skill.proficiency || 80}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full"
                    style={{ width: `${skill.proficiency || 80}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>{skill.years ? `${skill.years}+ Years Experience` : 'Production Ready'}</span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openModal(skill)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition"
                  title="Edit Skill"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(skill._id || skill.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                  title="Delete Skill"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-16 liquid-glass-card border-dashed border-white/15">
          <Cpu className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Skills in this Category</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Add New Skill" to add technologies to your stack.
          </p>
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md liquid-glass-container rounded-3xl p-6 border border-white/20 shadow-2xl bg-slate-900/95">
            <h2 className="text-lg font-bold text-white mb-4">
              {editId ? 'Edit Technical Skill' : 'Add New Technical Skill'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React.js, Python, MongoDB"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                  >
                    {formCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  <span>Proficiency Percentage</span>
                  <span className="text-amber-400 font-mono">{formData.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.years}
                  onChange={(e) => setFormData({ ...formData, years: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="rounded border-white/20 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Visible on Public Portfolio</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl liquid-glass-amber-btn text-white text-xs font-bold transition shadow-md"
                >
                  {editId ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          isOpen={!!deleteId}
          title="Delete Skill"
          message="Are you sure you want to delete this technical skill from your portfolio?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
