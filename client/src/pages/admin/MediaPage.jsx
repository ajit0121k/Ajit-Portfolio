import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  FileText, 
  Trash2, 
  Copy, 
  Check, 
  UploadCloud, 
  Search, 
  Sparkles, 
  ExternalLink,
  Eye,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploadZone from '../../components/admin/ImageUploadZone';
import { resolveAssetUrl } from '../../utils/assetUrl.js';

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState('all'); // all, image, document
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, [filter]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? `?type=${filter}` : '';
      const res = await api.get(`/media${query}`);
      const list = res.data?.data?.media || res.data?.media || res.data?.data || res.data || [];
      setMedia(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/media/${deleteId}`);
      setMedia(prev => prev.filter(m => (m.id || m._id) !== deleteId));
      toast.success('Media deleted successfully');
      if (previewMedia && ((previewMedia.id || previewMedia._id) === deleteId)) {
        setPreviewMedia(null);
      }
      setDeleteId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete media');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('URL copied to clipboard');
  };

  const handleUploadSuccess = () => {
    fetchMedia();
  };

  const filteredMedia = media.filter(m => {
    if (!search) return true;
    const name = (m.filename || m.originalName || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass-card p-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-emerald-500" /> Media & Asset Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload, preview, copy URLs, and manage image and document assets stored in your portfolio storage.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
          {[
            { key: 'all', label: 'All Files' },
            { key: 'image', label: 'Images' },
            { key: 'document', label: 'Documents' }
          ].map(f => (
            <button 
              key={f.key} 
              type="button"
              onClick={() => setFilter(f.key)} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === f.key 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div className="liquid-glass-card p-6 space-y-3">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-emerald-500" /> Upload New Asset
        </h2>
        <ImageUploadZone 
          label="" 
          hint="Drag & drop images (PNG, JPG, WEBP, SVG) or PDFs up to 10MB"
          onChange={handleUploadSuccess} 
        />
      </div>

      {/* Search Bar & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing <strong className="text-slate-900 dark:text-white">{filteredMedia.length}</strong> {filteredMedia.length === 1 ? 'file' : 'files'}
        </p>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search filenames..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-[#121c15]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
          <span className="text-xs text-slate-400 font-medium">Loading media assets...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-16 liquid-glass-card rounded-3xl border-dashed border-2 border-slate-300 dark:border-white/10 p-8 space-y-2">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No media assets found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {search ? 'Try clearing your search query' : 'Upload an image or document above to populate your library'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map(item => {
            const itemId = item.id || item._id;
            const isCopied = copiedId === itemId;

            return (
              <div 
                key={itemId} 
                onClick={() => setPreviewMedia(item)}
                className="group relative rounded-2xl overflow-hidden liquid-glass-card border border-black/5 dark:border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-slate-100 dark:bg-[#0c160e] flex items-center justify-center overflow-hidden relative">
                  {item.type === 'image' ? (
                    <img 
                      src={resolveAssetUrl(item.url)} 
                      alt={item.alt || item.filename} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-400">
                      <FileText size={36} className="text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">PDF / Doc</span>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewMedia(item);
                      }}
                      className="p-2 rounded-xl bg-white/90 text-slate-800 hover:bg-white transition-all shadow-md"
                      title="Preview Asset"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(item.url, itemId);
                      }} 
                      className="p-2 rounded-xl bg-white/90 text-slate-800 hover:bg-white transition-all shadow-md"
                      title="Copy URL"
                    >
                      {isCopied ? <Check size={14} className="text-emerald-600 font-bold" /> : <Copy size={14} />}
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(itemId);
                      }} 
                      className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-md cursor-pointer"
                      title="Delete Asset"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info Card Footer */}
                <div className="p-3 bg-white/40 dark:bg-white/[0.02]">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={item.filename || item.originalName}>
                    {item.filename || item.originalName}
                  </p>
                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400 font-medium">
                    <span>{formatBytes(item.size)}</span>
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Preview Modal */}
      {previewMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" 
          onClick={() => setPreviewMedia(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col bg-white dark:bg-[#141a16] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4" 
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-md">
                  {previewMedia.filename || previewMedia.originalName}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formatBytes(previewMedia.size)} • {previewMedia.type?.toUpperCase()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => handleCopyUrl(previewMedia.url, previewMedia.id || previewMedia._id)} 
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  {copiedId === (previewMedia.id || previewMedia._id) ? <Check size={14} className="text-emerald-500 font-bold" /> : <Copy size={14} />}
                  <span>Copy Link</span>
                </button>

                <a 
                  href={resolveAssetUrl(previewMedia.url)} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ExternalLink size={14} />
                  <span>Open Full</span>
                </a>

                <button 
                  type="button"
                  onClick={() => {
                    const idToDelete = previewMedia.id || previewMedia._id;
                    setDeleteId(idToDelete);
                  }} 
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white text-xs font-bold border border-rose-500/30 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Delete File</span>
                </button>
              </div>
            </div>

            {/* Modal Preview Body */}
            <div className="flex items-center justify-center min-h-[300px] max-h-[65vh] bg-slate-100 dark:bg-[#0c160e] rounded-2xl p-4 overflow-hidden border border-slate-200 dark:border-white/5">
              {previewMedia.type === 'image' ? (
                <img 
                  src={resolveAssetUrl(previewMedia.url)} 
                  alt={previewMedia.filename} 
                  className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg" 
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText size={64} className="text-emerald-500 mx-auto" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Document Preview</p>
                  <a 
                    href={resolveAssetUrl(previewMedia.url)} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition"
                  >
                    Download / View Document
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button 
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog 
        isOpen={!!deleteId} 
        title="Delete Media File" 
        message="Are you sure you want to permanently delete this media file? Any site sections or projects referencing this URL will no longer display the asset." 
        confirmText="Delete File"
        isLoading={isDeleting}
        onConfirm={handleDelete} 
        onCancel={() => setDeleteId(null)} 
      />
    </div>
  );
};

export default MediaPage;
