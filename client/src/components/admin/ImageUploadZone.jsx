import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Copy, FolderOpen, FileText, ExternalLink, Download } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import MediaPickerModal from './MediaPickerModal.jsx';
import { resolveAssetUrl } from '../../utils/assetUrl.js';

export default function ImageUploadZone({
  value = '',
  onChange,
  label = 'Upload Image',
  hint = 'Supports PNG, JPG, WEBP, PDF up to 10MB',
  className = '',
  accept = 'image/*,application/pdf',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Normalize string vs object value
  const initialUrl = typeof value === 'string' ? value : value?.url || '';
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const nextUrl = typeof value === 'string' ? value : value?.url || '';
    setPreviewUrl(nextUrl);
  }, [value]);

  const handleUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only image and PDF files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const { data } = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = data.data?.url || data.url;
      const mediaObject = data.data || data;
      setPreviewUrl(uploadedUrl);
      if (onChange) onChange(uploadedUrl, mediaObject);
      toast.success('Asset uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload asset');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e?.stopPropagation();
    setPreviewUrl('');
    if (onChange) onChange('', null);
  };

  const handleCopyLink = (e) => {
    e?.stopPropagation();
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      toast.success('Asset link copied to clipboard');
    }
  };

  const handlePickerSelect = (selectedUrl, mediaObj) => {
    setPreviewUrl(selectedUrl);
    if (onChange) onChange(selectedUrl, mediaObj);
  };

  const resolvedUrl = resolveAssetUrl(previewUrl);
  const isPdf = previewUrl && (previewUrl.toLowerCase().includes('.pdf') || (accept && accept.includes('pdf') && !previewUrl.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)));

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Pick from Library action */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Choose from Library</span>
        </button>
      </div>

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group bg-slate-900/10 dark:bg-black/30 p-2">
          {isPdf ? (
            <div className="h-44 flex flex-col items-center justify-center p-4 text-center bg-slate-950/40 rounded-xl">
              <FileText className="w-10 h-10 text-amber-500 mb-2" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                PDF Document Attached
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-xs mt-1">
                {previewUrl}
              </span>
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <ExternalLink size={12} /> Preview
                </a>
                <a
                  href={resolvedUrl}
                  download="Ajit_Kumar_Resume.pdf"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Download size={12} /> Download
                </a>
              </div>
            </div>
          ) : (
            <img
              src={resolvedUrl}
              alt="Upload preview"
              className="w-full h-44 object-cover rounded-xl"
            />
          )}

          {/* Quick Overlay Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all shadow-md cursor-pointer"
              title="Copy URL"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-md cursor-pointer"
              title="Change Asset"
            >
              <FolderOpen className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-md cursor-pointer"
              title="Remove"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            isDragging
              ? 'border-amber-500 bg-amber-500/10 scale-[0.99]'
              : 'border-slate-300 dark:border-white/15 hover:border-amber-400 bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100/50 dark:hover:bg-white/10'
          } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center py-4">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Uploading to storage...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to upload <span className="font-normal text-slate-500">or drag & drop</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{hint}</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
          }
        }}
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handlePickerSelect}
      />
    </div>
  );
}
