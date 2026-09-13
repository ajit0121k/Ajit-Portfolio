import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, Building, ArrowUp, ArrowDown, Eye, EyeOff, Globe, Search } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUploadZone from '../../components/admin/ImageUploadZone';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const initialForm = {
    company: '',
    companyLogo: '',
    role: '',
    employmentType: 'Full-time',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [],
    technologies: [],
    companyWebsite: '',
    visible: true,
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [newTech, setNewTech] = useState('');
  const [newResp, setNewResp] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.get('/experience');
      const list = res.data?.data || res.data || [];
      const safeList = Array.isArray(list) ? list : [];
      const sorted = [...safeList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setExperiences(sorted);
    } catch (err) {
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (exp = null) => {
    if (exp) {
      setFormData({
        company: exp.company || '',
        companyLogo: exp.companyLogo?.url || exp.companyLogo || '',
        role: exp.role || '',
        employmentType: exp.employmentType || 'Full-time',
        location: exp.location || '',
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
        current: !!exp.current,
        description: exp.description || '',
        responsibilities: Array.isArray(exp.responsibilities) ? [...exp.responsibilities] : [],
        technologies: Array.isArray(exp.technologies) ? [...exp.technologies] : [],
        companyWebsite: exp.companyWebsite || '',
        visible: exp.visible !== false,
        order: exp.order || 0,
      });
      setEditId(exp._id || exp.id);
    } else {
      setFormData({
        ...initialForm,
        order: experiences.length,
      });
      setEditId(null);
    }
    setNewTech('');
    setNewResp('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
    setEditId(null);
  };

  const handleTechAdd = (e) => {
    if (e) e.preventDefault();
    const trimmed = newTech.trim();
    if (trimmed && !formData.technologies.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, technologies: [...prev.technologies, trimmed] }));
      setNewTech('');
    }
  };

  const handleRespAdd = (e) => {
    if (e) e.preventDefault();
    const trimmed = newResp.trim();
    if (trimmed && !formData.responsibilities.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, responsibilities: [...prev.responsibilities, trimmed] }));
      setNewResp('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.startDate) {
      toast.error('Please fill in Company, Role and Start Date');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        companyLogo: formData.companyLogo ? (typeof formData.companyLogo === 'string' ? { url: formData.companyLogo } : formData.companyLogo) : undefined,
        endDate: formData.current ? null : (formData.endDate || null),
      };

      if (editId) {
        const res = await api.put(`/experience/${editId}`, payload);
        const updated = res.data?.data || res.data;
        setExperiences((prev) => prev.map((exp) => ((exp._id || exp.id) === editId ? { ...exp, ...updated } : exp)));
        toast.success('Experience updated successfully');
      } else {
        const res = await api.post('/experience', payload);
        const created = res.data?.data || res.data;
        setExperiences((prev) => [...prev, created]);
        toast.success('Experience created successfully');
      }
      closeModal();
      fetchExperiences();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/experience/${deleteId}`);
      setExperiences((prev) => prev.filter((exp) => (exp._id || exp.id) !== deleteId));
      toast.success('Experience deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete experience');
    }
  };

  const toggleVisibility = async (exp) => {
    const id = exp._id || exp.id;
    const newStatus = !(exp.visible !== false);
    try {
      await api.put(`/experience/${id}`, { visible: newStatus });
      setExperiences((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, visible: newStatus } : item))
      );
      toast.success(`Experience ${newStatus ? 'shown' : 'hidden'} on portfolio`);
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const updated = [...experiences];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const payloadItems = updated.map((exp, i) => ({
      id: exp._id || exp.id,
      order: i,
    }));

    setExperiences(updated.map((item, i) => ({ ...item, order: i })));

    try {
      await api.patch('/experience/reorder', { items: payloadItems });
      toast.success('Order saved');
    } catch (err) {
      toast.error('Failed to persist order');
      fetchExperiences();
    }
  };

  const filtered = experiences.filter((exp) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const company = (exp.company || '').toLowerCase();
    const role = (exp.role || '').toLowerCase();
    const loc = (exp.location || '').toLowerCase();
    const techs = Array.isArray(exp.technologies) ? exp.technologies.join(' ').toLowerCase() : '';
    return company.includes(q) || role.includes(q) || loc.includes(q) || techs.includes(q);
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-primary-500" />
            <span>Work Experience</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your career trajectory, roles, responsibilities, and technologies
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition flex items-center gap-1.5 text-xs font-semibold shadow-md whitespace-nowrap"
          >
            <Plus size={15} /> Add Experience
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="liquid-glass-card p-12 text-center border-dashed border-slate-200 dark:border-white/10">
          <Building className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
            {search ? 'No matching experience entries found' : 'No work experience added yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {search ? 'Try adjusting your search query.' : 'Document your software engineering, leadership, and contract roles.'}
          </p>
          {!search && (
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold"
            >
              Add First Experience
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((exp, index) => {
            const logoUrl = exp.companyLogo?.url || (typeof exp.companyLogo === 'string' ? exp.companyLogo : '');
            const isVisible = exp.visible !== false;

            return (
              <div
                key={exp._id || exp.id || index}
                className={`liquid-glass-card p-5 rounded-2xl transition-all ${
                  !isVisible ? 'opacity-60 bg-slate-100/50 dark:bg-slate-900/30' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Logo + Main Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                      {logoUrl ? (
                        <img src={logoUrl} alt={exp.company} className="w-full h-full object-cover" />
                      ) : (
                        <Building className="w-6 h-6 text-primary-500/70" />
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {exp.role}
                        </h3>
                        <span className="text-xs text-slate-400">at</span>
                        <span className="font-semibold text-xs text-primary-600 dark:text-primary-400">
                          {exp.company}
                        </span>
                        {exp.companyWebsite && (
                          <a
                            href={exp.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-primary-500 transition"
                            title="Company Website"
                          >
                            <Globe size={13} />
                          </a>
                        )}
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                          {exp.employmentType || 'Full-time'}
                        </span>
                        {exp.current && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Current Role
                          </span>
                        )}
                      </div>

                      {/* Meta: Dates & Location */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}{' '}
                          — {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present')}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {exp.description && (
                        <div
                          className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 prose prose-xs dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: exp.description }}
                        />
                      )}

                      {/* Responsibilities bullet points */}
                      {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {exp.responsibilities.slice(0, 3).map((r, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="text-primary-500 mt-0.5 font-bold">•</span>
                              <span className="line-clamp-1">{r}</span>
                            </div>
                          ))}
                          {exp.responsibilities.length > 3 && (
                            <span className="text-[10px] text-primary-500 font-medium">
                              +{exp.responsibilities.length - 3} more key accomplishments
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions & Reorder */}
                  <div className="flex items-center md:flex-col justify-end gap-1.5 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/50 dark:border-white/5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === experiences.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleVisibility(exp)}
                        title={isVisible ? 'Hide from public portfolio' : 'Show on public portfolio'}
                        className={`p-1.5 rounded-lg transition ${
                          isVisible
                            ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => openModal(exp)}
                        title="Edit Experience"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(exp._id || exp.id)}
                        title="Delete Experience"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
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
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 dark:border-white/10">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-primary-500" />
                <span>{editId ? 'Edit Work Experience' : 'Add New Work Experience'}</span>
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 pt-4 flex-1">
              {/* Logo & Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Logo
                  </label>
                  <ImageUploadZone
                    value={formData.companyLogo}
                    onChange={(url) => setFormData({ ...formData, companyLogo: url })}
                    label="Company Logo"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        placeholder="e.g. Google, Stripe, Freelance"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Role / Title *
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                        placeholder="e.g. Senior Full Stack Engineer"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Employment Type
                      </label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company Website
                      </label>
                      <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                        placeholder="https://company.com"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA (Remote)"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={formData.current}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-40"
                  />
                  <label className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>I currently work here</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Overview & Role Description
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(val) => setFormData({ ...formData, description: val })}
                  placeholder="Describe your role, team context, and main focus..."
                />
              </div>

              {/* Responsibilities & Achievements */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Responsibilities & Bullet Points
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newResp}
                    onChange={(e) => setNewResp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleRespAdd())}
                    placeholder="e.g. Scaled PostgreSQL queries decreasing p99 latency by 45%"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRespAdd}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {formData.responsibilities.map((resp, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <span className="flex-1">• {resp}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            responsibilities: formData.responsibilities.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTechAdd())}
                    placeholder="e.g. TypeScript, React, Docker, Redis"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleTechAdd}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold"
                  >
                    Add Tech
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 border border-primary-500/20 text-xs font-medium"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            technologies: formData.technologies.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-primary-400 hover:text-primary-700 dark:hover:text-white ml-1 font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Visibility Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Display on public portfolio timeline</span>
                </label>
              </div>

              {/* Actions */}
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
                  {saving ? 'Saving...' : editId ? 'Update Experience' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Work Experience"
        message="Are you sure you want to delete this experience record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
