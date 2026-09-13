import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, ArrowUp, ArrowDown, Eye, EyeOff, Search, MapPin, Calendar, Award } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploadZone from '../../components/admin/ImageUploadZone';

export default function EducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const initialForm = {
    degree: '',
    institution: '',
    university: '',
    fieldOfStudy: '',
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear(),
    location: '',
    grade: '',
    description: '',
    logo: '',
    visible: true,
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await api.get('/education');
      const list = res.data?.data || res.data || [];
      const safeList = Array.isArray(list) ? list : [];
      const sorted = [...safeList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setEducation(sorted);
    } catch (err) {
      toast.error('Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (edu = null) => {
    if (edu) {
      setFormData({
        degree: edu.degree || '',
        institution: edu.institution || '',
        university: edu.university || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        startYear: edu.startYear || new Date().getFullYear() - 4,
        endYear: edu.endYear || '',
        location: edu.location || '',
        grade: edu.grade || '',
        description: edu.description || '',
        logo: edu.logo?.url || edu.logo || '',
        visible: edu.visible !== false,
        order: edu.order || 0,
      });
      setEditId(edu._id || edu.id);
    } else {
      setFormData({
        ...initialForm,
        order: education.length,
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
    if (!formData.degree || !formData.institution || !formData.startYear) {
      toast.error('Degree, Institution, and Start Year are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        startYear: Number(formData.startYear),
        endYear: formData.endYear ? Number(formData.endYear) : null,
        logo: formData.logo ? (typeof formData.logo === 'string' ? { url: formData.logo } : formData.logo) : undefined,
      };

      if (editId) {
        const res = await api.put(`/education/${editId}`, payload);
        const updated = res.data?.data || res.data;
        setEducation((prev) => prev.map((item) => ((item._id || item.id) === editId ? { ...item, ...updated } : item)));
        toast.success('Education updated successfully');
      } else {
        const res = await api.post('/education', payload);
        const created = res.data?.data || res.data;
        setEducation((prev) => [...prev, created]);
        toast.success('Education added successfully');
      }
      closeModal();
      fetchEducation();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/education/${deleteId}`);
      setEducation((prev) => prev.filter((item) => (item._id || item.id) !== deleteId));
      toast.success('Education deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete education');
    }
  };

  const toggleVisibility = async (edu) => {
    const id = edu._id || edu.id;
    const newStatus = !(edu.visible !== false);
    try {
      await api.put(`/education/${id}`, { visible: newStatus });
      setEducation((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, visible: newStatus } : item))
      );
      toast.success(`Education ${newStatus ? 'shown' : 'hidden'} on portfolio`);
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;

    const updated = [...education];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const payloadItems = updated.map((edu, i) => ({
      id: edu._id || edu.id,
      order: i,
    }));

    setEducation(updated.map((item, i) => ({ ...item, order: i })));

    try {
      await api.patch('/education/reorder', { items: payloadItems });
      toast.success('Order saved');
    } catch (err) {
      toast.error('Failed to persist order');
      fetchEducation();
    }
  };

  const filtered = education.filter((edu) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const degree = (edu.degree || '').toLowerCase();
    const inst = (edu.institution || '').toLowerCase();
    const field = (edu.fieldOfStudy || '').toLowerCase();
    return degree.includes(q) || inst.includes(q) || field.includes(q);
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary-500" />
            <span>Education & Academics</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage degrees, colleges, universities, and academic milestones
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search degrees, schools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition flex items-center gap-1.5 text-xs font-semibold shadow-md whitespace-nowrap"
          >
            <Plus size={15} /> Add Education
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="liquid-glass-card p-12 text-center border-dashed border-slate-200 dark:border-white/10">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
            {search ? 'No matching education records found' : 'No education records added yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {search ? 'Try adjusting your search query.' : 'Add your university degree, diplomas, or coursework.'}
          </p>
          {!search && (
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold"
            >
              Add First Education
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((edu, index) => {
            const logoUrl = edu.logo?.url || (typeof edu.logo === 'string' ? edu.logo : '');
            const isVisible = edu.visible !== false;

            return (
              <div
                key={edu._id || edu.id || index}
                className={`liquid-glass-card p-5 rounded-2xl flex flex-col justify-between transition-all ${
                  !isVisible ? 'opacity-60 bg-slate-100/50 dark:bg-slate-900/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        {logoUrl ? (
                          <img src={logoUrl} alt={edu.institution} className="w-full h-full object-cover" />
                        ) : (
                          <GraduationCap className="w-6 h-6 text-primary-500/80" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {edu.degree}
                        </h3>
                        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                          {edu.institution}
                        </p>
                        {edu.fieldOfStudy && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Major: {edu.fieldOfStudy}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === education.length - 1}
                        title="Move Down"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        onClick={() => toggleVisibility(edu)}
                        title={isVisible ? 'Hide from public portfolio' : 'Show on public portfolio'}
                        className={`p-1 rounded-lg transition ${
                          isVisible ? 'text-emerald-500' : 'text-slate-400'
                        }`}
                      >
                        {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button
                        onClick={() => openModal(edu)}
                        title="Edit"
                        className="p-1 rounded-lg text-slate-400 hover:text-primary-600"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteId(edu._id || edu.id)}
                        title="Delete"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 my-3 bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200/50 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400 shrink-0" />
                      <span>{edu.startYear} — {edu.endYear || 'Present'}</span>
                    </div>
                    {edu.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{edu.location}</span>
                      </div>
                    )}
                    {edu.grade && (
                      <div className="flex items-center gap-1.5 col-span-2">
                        <Award size={12} className="text-amber-500 shrink-0" />
                        <span>Grade/GPA: {edu.grade}</span>
                      </div>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 dark:border-white/10">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary-500" />
                <span>{editId ? 'Edit Education Record' : 'Add New Education Record'}</span>
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 pt-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institution Logo
                </label>
                <ImageUploadZone
                  value={formData.logo}
                  onChange={(url) => setFormData({ ...formData, logo: url })}
                  label="School / University Logo"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree / Qualification *
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    required
                    placeholder="e.g. Bachelor of Technology in CS"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / College *
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    required
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    placeholder="e.g. Computer Science, AI"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. California, USA"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Year *
                  </label>
                  <input
                    type="number"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    required
                    min="1950"
                    max="2050"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Year
                  </label>
                  <input
                    type="number"
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    min="1950"
                    max="2050"
                    placeholder="Present"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grade / GPA
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g. 3.9/4.0 or First Class"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Honors / Activities
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Key accomplishments, thesis title, relevant courses..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Display on public portfolio</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-white/10 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editId ? 'Update Education' : 'Add Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Education"
        message="Are you sure you want to remove this academic credential? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
