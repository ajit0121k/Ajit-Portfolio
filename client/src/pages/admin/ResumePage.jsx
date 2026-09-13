import React, { useState, useEffect } from 'react';
import { 
  FileText, UploadCloud, CheckCircle2, Trash2, 
  Download, Eye, Sparkles, AlertCircle, ExternalLink 
} from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { resolveAssetUrl } from '../../utils/assetUrl.js';

export default function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resume');
      let list = res.data?.data || res.data || [];
      if (!Array.isArray(list)) {
        list = list && list.url ? [list] : [];
      }

      // Check profile fallback if empty
      if (list.length === 0) {
        try {
          const profRes = await api.get('/profile');
          const prof = profRes.data?.data || profRes.data;
          if (prof?.resume?.url) {
            list = [{
              _id: 'res_primary',
              id: 'res_primary',
              originalName: prof.resume.originalName || 'Ajit_Kumar_Resume.pdf',
              filename: prof.resume.originalName || 'Ajit_Kumar_Resume.pdf',
              url: prof.resume.url,
              size: prof.resume.size || 7737,
              isActive: true,
              version: 1,
              createdAt: prof.resume.uploadedAt || new Date().toISOString()
            }];
          }
        } catch (e) {}
      }

      // Final default fallback to verified resume.pdf
      if (list.length === 0) {
        list = [{
          _id: 'res_default',
          id: 'res_default',
          originalName: 'Ajit_Kumar_Resume.pdf',
          filename: 'Ajit_Kumar_Resume.pdf',
          url: '/resume.pdf',
          size: 7737,
          isActive: true,
          version: 1,
          createdAt: new Date().toISOString()
        }];
      }

      setResumes(list);
      const active = list.find((r) => r.isActive) || list[0] || null;
      setActiveResume(active);
    } catch (err) {
      toast.error('Failed to load resume documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF documents are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume PDF uploaded and set as active!');
      await fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleActivate = async (id) => {
    try {
      await api.patch(`/resume/${id}/activate`);
      toast.success('Resume set as active on public portfolio');
      await fetchResumes();
    } catch (err) {
      toast.error('Failed to activate resume');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/resume/${deleteId}`);
      toast.success('Resume deleted successfully');
      setDeleteId(null);
      await fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
        <span className="text-xs text-slate-400 font-medium">Loading resume manager...</span>
      </div>
    );
  }

  const activeUrl = activeResume?.url ? resolveAssetUrl(activeResume.url) : resolveAssetUrl('/resume.pdf');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass-card p-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-500" /> Resume & CV Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload, replace, and activate your official PDF resume. The active resume is served directly to public visitors.
          </p>
        </div>

        <label className="px-5 py-3 rounded-full liquid-glass-amber-btn text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md">
          <UploadCloud size={16} />
          <span>{uploading ? 'Uploading...' : 'Upload New Resume PDF'}</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Active Resume Card */}
      {activeResume ? (
        <div className="liquid-glass-card p-6 border-amber-500/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Currently Active on Live Site
            </span>
            <span className="text-xs text-slate-400">
              Version {activeResume.version || 1}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center flex-shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {activeResume.originalName || 'Ajit_Kumar_Resume.pdf'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Uploaded on {new Date(activeResume.createdAt).toLocaleDateString()} ·{' '}
                  {activeResume.size ? `${(activeResume.size / 1024).toFixed(0)} KB` : 'PDF'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Eye size={14} /> Preview PDF
              </a>
              <a
                href={activeUrl}
                download={activeResume.originalName || "Ajit_Kumar_Resume.pdf"}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Download size={14} /> Download
              </a>
              <button
                type="button"
                onClick={() => setDeleteId(activeResume._id || activeResume.id)}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5 border border-rose-500/20 transition cursor-pointer"
                title="Delete this resume"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>

          {/* Embedded PDF Viewer */}
          <div className="mt-5 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
            <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Inline Document Preview</span>
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                Open in new tab <ExternalLink size={12} />
              </a>
            </div>
            <iframe
              src={activeUrl}
              title="Active Resume"
              className="w-full h-[550px] border-0"
            />
          </div>
        </div>
      ) : (
        <div className="liquid-glass-card p-12 text-center border-dashed border-white/15">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Resume Uploaded Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Upload your official PDF resume above. Visitors on your portfolio can preview and download it instantly.
          </p>
        </div>
      )}

      {/* Resume Version History */}
      {resumes.length > 0 && (
        <div className="liquid-glass-card p-6">
          <h2 className="text-sm font-bold text-white mb-4">
            Uploaded Resume Versions ({resumes.length})
          </h2>

          <div className="space-y-3">
            {resumes.map((r) => {
              const resumeId = r.id || r._id;
              return (
                <div
                  key={resumeId}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">{r.originalName}</p>
                        {r.isActive && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Version {r.version || 1} · {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!r.isActive && (
                      <button
                        type="button"
                        onClick={() => handleActivate(resumeId)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition cursor-pointer"
                      >
                        Set as Active
                      </button>
                    )}
                    <a
                      href={resolveAssetUrl(r.url || '/resume.pdf')}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition"
                      title="View PDF"
                    >
                      <Eye size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={() => setDeleteId(resumeId)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Resume"
        message="Are you sure you want to delete this resume version? If it is active, the most recent remaining version will become active."
        confirmText="Delete Resume"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
