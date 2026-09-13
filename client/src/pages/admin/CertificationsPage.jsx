import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, ExternalLink, ArrowUp, ArrowDown, Eye, EyeOff, Search, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploadZone from '../../components/admin/ImageUploadZone';

export default function CertificationsPage() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: '',
    issuingOrganization: '',
    credentialId: '',
    issueDate: '',
    expiryDate: '',
    neverExpires: false,
    credentialUrl: '',
    verificationUrl: '',
    badgeImage: '',
    description: '',
    featured: false,
    visible: true,
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/certifications');
      const list = res.data?.data || res.data || [];
      const safeList = Array.isArray(list) ? list : [];
      const sorted = [...safeList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setCerts(sorted);
    } catch (err) {
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cert = null) => {
    if (cert) {
      setFormData({
        name: cert.name || '',
        issuingOrganization: cert.issuingOrganization || cert.organization || '',
        credentialId: cert.credentialId || '',
        issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
        neverExpires: !!cert.neverExpires,
        credentialUrl: cert.credentialUrl || '',
        verificationUrl: cert.verificationUrl || '',
        badgeImage: cert.badgeImage?.url || cert.badgeImage || '',
        description: cert.description || '',
        featured: !!cert.featured,
        visible: cert.visible !== false,
        order: cert.order || 0,
      });
      setEditId(cert._id || cert.id);
    } else {
      setFormData({
        ...initialForm,
        order: certs.length,
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
    if (!formData.name || !formData.issuingOrganization) {
      toast.error('Certification Name and Issuing Organization are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        badgeImage: formData.badgeImage ? (typeof formData.badgeImage === 'string' ? { url: formData.badgeImage } : formData.badgeImage) : undefined,
        issueDate: formData.issueDate || null,
        expiryDate: formData.neverExpires ? null : (formData.expiryDate || null),
      };

      if (editId) {
        const res = await api.put(`/certifications/${editId}`, payload);
        const updated = res.data?.data || res.data;
        setCerts((prev) => prev.map((item) => ((item._id || item.id) === editId ? { ...item, ...updated } : item)));
        toast.success('Certification updated successfully');
      } else {
        const res = await api.post('/certifications', payload);
        const created = res.data?.data || res.data;
        setCerts((prev) => [...prev, created]);
        toast.success('Certification added successfully');
      }
      closeModal();
      fetchCerts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save certification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/certifications/${deleteId}`);
      setCerts((prev) => prev.filter((item) => (item._id || item.id) !== deleteId));
      toast.success('Certification deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete certification');
    }
  };

  const toggleVisibility = async (cert) => {
    const id = cert._id || cert.id;
    const newStatus = !(cert.visible !== false);
    try {
      await api.put(`/certifications/${id}`, { visible: newStatus });
      setCerts((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, visible: newStatus } : item))
      );
      toast.success(`Certification ${newStatus ? 'shown' : 'hidden'} on portfolio`);
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const toggleFeatured = async (cert) => {
    const id = cert._id || cert.id;
    const newStatus = !cert.featured;
    try {
      await api.put(`/certifications/${id}`, { featured: newStatus });
      setCerts((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, featured: newStatus } : item))
      );
      toast.success(`Certification ${newStatus ? 'marked as featured' : 'unfeatured'}`);
    } catch (err) {
      toast.error('Failed to update featured status');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certs.length) return;

    const updated = [...certs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const payloadItems = updated.map((item, i) => ({
      id: item._id || item.id,
      order: i,
    }));

    setCerts(updated.map((item, i) => ({ ...item, order: i })));

    try {
      await api.patch('/certifications/reorder', { items: payloadItems });
      toast.success('Order saved');
    } catch (err) {
      toast.error('Failed to persist order');
      fetchCerts();
    }
  };

  const filtered = certs.filter((cert) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = (cert.name || '').toLowerCase();
    const org = (cert.issuingOrganization || cert.organization || '').toLowerCase();
    const idStr = (cert.credentialId || '').toLowerCase();
    return name.includes(q) || org.includes(q) || idStr.includes(q);
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" />
            <span>Certifications & Badges</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase verified cloud, programming, and architecture accreditations
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search certifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition flex items-center gap-1.5 text-xs font-semibold shadow-md whitespace-nowrap"
          >
            <Plus size={15} /> Add Certification
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
          <Award className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
            {search ? 'No matching certifications found' : 'No certifications added yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {search ? 'Try adjusting your search query.' : 'Add AWS, Google Cloud, Meta, or HackerRank certifications.'}
          </p>
          {!search && (
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold"
            >
              Add First Certification
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cert, index) => {
            const badgeUrl = cert.badgeImage?.url || (typeof cert.badgeImage === 'string' ? cert.badgeImage : '');
            const isVisible = cert.visible !== false;
            const org = cert.issuingOrganization || cert.organization;

            return (
              <div
                key={cert._id || cert.id || index}
                className={`liquid-glass-card p-5 rounded-2xl flex flex-col justify-between transition-all ${
                  !isVisible ? 'opacity-60 bg-slate-100/50 dark:bg-slate-900/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-1">
                      {badgeUrl ? (
                        <img src={badgeUrl} alt={cert.name} className="w-full h-full object-contain" />
                      ) : (
                        <Award className="w-7 h-7 text-primary-500/80" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {cert.name}
                        </h3>
                        {cert.featured && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                            ★
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 truncate">
                        {org}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 my-3 bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200/50 dark:border-white/5">
                    {cert.issueDate && (
                      <p className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-slate-400 shrink-0" />
                        <span>Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <ShieldCheck size={11} className="text-slate-400 shrink-0" />
                      <span>{cert.neverExpires ? 'Does not expire' : cert.expiryDate ? `Expires: ${new Date(cert.expiryDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}` : 'Lifetime validity'}</span>
                    </p>
                    {cert.credentialId && (
                      <p className="text-[10px] text-slate-400 truncate font-mono">
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-500 transition"
                      >
                        <span>Verify</span>
                        <ExternalLink size={11} />
                      </a>
                    ) : cert.verificationUrl ? (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-500 transition"
                      >
                        <span>Verify</span>
                        <ExternalLink size={11} />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Verified</span>
                    )}
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
                      disabled={index === certs.length - 1}
                      title="Move Down"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => toggleFeatured(cert)}
                      title={cert.featured ? 'Unfeature' : 'Feature on homepage'}
                      className={`p-1 rounded-lg transition ${cert.featured ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                    >
                      ★
                    </button>
                    <button
                      onClick={() => toggleVisibility(cert)}
                      title={isVisible ? 'Hide' : 'Show'}
                      className={`p-1 rounded-lg transition ${isVisible ? 'text-emerald-500' : 'text-slate-400'}`}
                    >
                      {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button
                      onClick={() => openModal(cert)}
                      title="Edit"
                      className="p-1 rounded-lg text-slate-400 hover:text-primary-600"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteId(cert._id || cert.id)}
                      title="Delete"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 dark:border-white/10">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-primary-500" />
                <span>{editId ? 'Edit Certification' : 'Add New Certification'}</span>
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 pt-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Badge / Logo
                </label>
                <ImageUploadZone
                  value={formData.badgeImage}
                  onChange={(url) => setFormData({ ...formData, badgeImage: url })}
                  label="Certification Badge Image"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. AWS Solutions Architect Associate"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={formData.issuingOrganization}
                    onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                    required
                    placeholder="e.g. Amazon Web Services, Google"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    disabled={formData.neverExpires}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-40"
                  />
                  <label className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.neverExpires}
                      onChange={(e) => setFormData({ ...formData, neverExpires: e.target.checked })}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Never Expires</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="e.g. AWS-ASA-198472"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credential / Verification URL
                  </label>
                  <input
                    type="url"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    placeholder="https://credly.com/badges/..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Feature on public hero / highlights</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Visible on public portfolio</span>
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
                  {saving ? 'Saving...' : editId ? 'Update Certification' : 'Add Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Certification"
        message="Are you sure you want to remove this certification? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
