import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, FileText, UploadCloud, Check } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function MediaPickerModal({ isOpen, onClose, onSelect, filterType = 'all' }) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState(filterType);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, activeType]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const query = activeType !== 'all' ? `?type=${activeType}` : '';
      const res = await api.get(`/media${query}`);
      const list = res.data?.data?.media || res.data?.media || (Array.isArray(res.data) ? res.data : []);
      setMediaList(list);
    } catch (err) {
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newMedia = res.data?.data || res.data;
      toast.success('Asset uploaded successfully');
      setMediaList((prev) => [newMedia, ...prev]);
      if (onSelect) {
        onSelect(newMedia.url, newMedia);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload asset');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((m) => {
    if (!search) return true;
    const name = m.originalName || m.filename || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl max-h-[85vh] liquid-glass-container flex flex-col rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-slate-900/95">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Media Library Picker</h2>
              <p className="text-xs text-slate-400">Click any item to select it directly for this field</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
            {['all', 'image', 'document'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition ${
                  activeType === t
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search and Upload */}
          <div className="flex items-center gap-3 flex-1 max-w-sm justify-end">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <label className="px-3 py-1.5 rounded-xl liquid-glass-amber-btn text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Upload'}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
                accept="image/*,application/pdf"
              />
            </label>
          </div>
        </div>

        {/* Media Grid */}
        <div className="p-5 overflow-y-auto flex-1 max-h-[50vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400">Loading library...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-white/10 rounded-2xl">
              No media found. Upload an image or document above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredMedia.map((m) => {
                const isDoc = m.type === 'document' || m.mimeType?.includes('pdf') || m.url?.endsWith('.pdf');
                return (
                  <div
                    key={m.id || m._id}
                    onClick={() => {
                      if (onSelect) onSelect(m.url, m);
                      onClose();
                    }}
                    className="group relative rounded-2xl border border-white/10 hover:border-amber-400/60 bg-white/5 hover:bg-white/10 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col"
                  >
                    <div className="h-28 w-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
                      {isDoc ? (
                        <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
                          <FileText className="w-8 h-8 text-rose-400" />
                          <span className="text-[10px] uppercase font-bold text-slate-300">PDF Document</span>
                        </div>
                      ) : (
                        <img
                          src={m.url}
                          alt={m.alt || m.originalName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold tracking-wider uppercase">
                          Select
                        </span>
                      </div>
                    </div>

                    <div className="p-2 truncate">
                      <p className="text-[11px] font-semibold text-slate-200 truncate" title={m.originalName || m.filename}>
                        {m.originalName || m.filename}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        {m.size ? `${(m.size / 1024).toFixed(0)} KB` : 'Asset'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
