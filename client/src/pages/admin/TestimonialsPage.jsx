import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Quote, User, ArrowUp, ArrowDown, Eye, EyeOff, Search, Star, Globe } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploadZone from '../../components/admin/ImageUploadZone';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const initialForm = {
    quote: '',
    name: '',
    role: '',
    designation: '',
    company: '',
    avatar: '',
    rating: 5,
    website: '',
    featured: false,
    visible: true,
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/testimonials');
      const list = res.data?.data || res.data || [];
      const safeList = Array.isArray(list) ? list : [];
      const sorted = [...safeList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setTestimonials(sorted);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (test = null) => {
    if (test) {
      setFormData({
        quote: test.quote || '',
        name: test.name || test.clientName || '',
        role: test.role || test.designation || '',
        designation: test.designation || test.role || '',
        company: test.company || '',
        avatar: test.avatar?.url || (typeof test.avatar === 'string' ? test.avatar : ''),
        rating: test.rating ?? 5,
        website: test.website || '',
        featured: !!test.featured,
        visible: test.visible !== false,
        order: test.order || 0,
      });
      setEditId(test._id || test.id);
    } else {
      setFormData({
        ...initialForm,
        order: testimonials.length,
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
    if (!formData.quote || !formData.name) {
      toast.error('Quote and Client Name are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        avatar: formData.avatar ? (typeof formData.avatar === 'string' ? { url: formData.avatar } : formData.avatar) : undefined,
        rating: Number(formData.rating) || 5,
      };

      if (editId) {
        const res = await api.put(`/testimonials/${editId}`, payload);
        const updated = res.data?.data || res.data;
        setTestimonials((prev) => prev.map((item) => ((item._id || item.id) === editId ? { ...item, ...updated } : item)));
        toast.success('Testimonial updated successfully');
      } else {
        const res = await api.post('/testimonials', payload);
        const created = res.data?.data || res.data;
        setTestimonials((prev) => [...prev, created]);
        toast.success('Testimonial added successfully');
      }
      closeModal();
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/testimonials/${deleteId}`);
      setTestimonials((prev) => prev.filter((item) => (item._id || item.id) !== deleteId));
      toast.success('Testimonial deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete testimonial');
    }
  };

  const toggleVisibility = async (test) => {
    const id = test._id || test.id;
    const newStatus = !(test.visible !== false);
    try {
      await api.put(`/testimonials/${id}`, { visible: newStatus });
      setTestimonials((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, visible: newStatus } : item))
      );
      toast.success(`Testimonial ${newStatus ? 'shown' : 'hidden'} on portfolio`);
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const toggleFeatured = async (test) => {
    const id = test._id || test.id;
    const newStatus = !test.featured;
    try {
      await api.put(`/testimonials/${id}`, { featured: newStatus });
      setTestimonials((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, featured: newStatus } : item))
      );
      toast.success(`Testimonial ${newStatus ? 'marked as featured' : 'unfeatured'}`);
    } catch (err) {
      toast.error('Failed to update featured status');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const updated = [...testimonials];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const payloadItems = updated.map((item, i) => ({
      id: item._id || item.id,
      order: i,
    }));

    setTestimonials(updated.map((item, i) => ({ ...item, order: i })));

    try {
      await api.patch('/testimonials/reorder', { items: payloadItems });
      toast.success('Order saved');
    } catch (err) {
      toast.error('Failed to persist order');
      fetchTestimonials();
    }
  };

  const filtered = testimonials.filter((test) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = (test.name || test.clientName || '').toLowerCase();
    const role = (test.role || test.designation || '').toLowerCase();
    const company = (test.company || '').toLowerCase();
    const quote = (test.quote || '').toLowerCase();
    return name.includes(q) || role.includes(q) || company.includes(q) || quote.includes(q);
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary-500" />
            <span>Testimonials & Endorsements</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recommendations, client quotes, and colleague peer reviews
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search recommendations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition flex items-center gap-1.5 text-xs font-semibold shadow-md whitespace-nowrap"
          >
            <Plus size={15} /> Add Testimonial
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
          <Quote className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
            {search ? 'No matching recommendations found' : 'No testimonials added yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {search ? 'Try adjusting your search query.' : 'Add quotes from colleagues, tech leads, or clients.'}
          </p>
          {!search && (
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold"
            >
              Add First Testimonial
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((test, index) => {
            const avatarUrl = test.avatar?.url || (typeof test.avatar === 'string' ? test.avatar : '');
            const isVisible = test.visible !== false;
            const name = test.name || test.clientName;
            const role = test.role || test.designation;

            return (
              <div
                key={test._id || test.id || index}
                className={`liquid-glass-card p-5 rounded-2xl flex flex-col justify-between transition-all ${
                  !isVisible ? 'opacity-60 bg-slate-100/50 dark:bg-slate-900/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          size={13}
                          className={starIndex < (test.rating ?? 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}
                        />
                      ))}
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
                        disabled={index === testimonials.length - 1}
                        title="Move Down"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        onClick={() => toggleFeatured(test)}
                        title={test.featured ? 'Unfeature' : 'Feature on homepage'}
                        className={`p-1 rounded-lg transition ${test.featured ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                      >
                        ★
                      </button>
                      <button
                        onClick={() => toggleVisibility(test)}
                        title={isVisible ? 'Hide' : 'Show'}
                        className={`p-1 rounded-lg transition ${isVisible ? 'text-emerald-500' : 'text-slate-400'}`}
                      >
                        {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button
                        onClick={() => openModal(test)}
                        title="Edit"
                        className="p-1 rounded-lg text-slate-400 hover:text-primary-600"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteId(test._id || test.id)}
                        title="Delete"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 italic mb-4 line-clamp-4 leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60 dark:border-white/10 mt-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-2 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {role}{test.company && ` • ${test.company}`}
                    </p>
                  </div>
                  {test.website && (
                    <a
                      href={test.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-primary-500 transition p-1"
                      title="Client Website / LinkedIn"
                    >
                      <Globe size={13} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 dark:border-white/10">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Quote className="w-4 h-4 text-primary-500" />
                <span>{editId ? 'Edit Testimonial' : 'Add New Testimonial'}</span>
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 pt-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  required
                  rows={4}
                  placeholder="Paste what the colleague or client wrote about you..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Client / Recommender Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value, designation: e.target.value })}
                    placeholder="e.g. Engineering Manager, CTO"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website / Profile Link
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Star Rating (1 to 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Avatar Image
                  </label>
                  <ImageUploadZone
                    value={formData.avatar}
                    onChange={(url) => setFormData({ ...formData, avatar: url })}
                    label="Recommender Avatar"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Feature on public hero</span>
                </label>

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
                  {saving ? 'Saving...' : editId ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Testimonial"
        message="Are you sure you want to remove this recommendation? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
