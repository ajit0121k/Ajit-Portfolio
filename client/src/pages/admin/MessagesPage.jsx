import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Archive, CheckCircle, Search, Reply, X, RefreshCw, Clock, User, Send } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read, archived
  const [search, setSearch] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get(`/messages${query}`);
      const list = res.data?.data?.messages || res.data?.messages || res.data || [];
      setMessages(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      if (status === 'read') {
        await api.patch(`/messages/${id}/read`);
      } else if (status === 'unread') {
        await api.patch(`/messages/${id}/unread`);
      } else if (status === 'archived') {
        await api.patch(`/messages/${id}/archive`);
      }
      setMessages(prev => prev.map(m => (m._id === id || m.id === id) ? { ...m, status } : m));
      if (selectedMsg && (selectedMsg._id === id || selectedMsg.id === id)) {
        setSelectedMsg(prev => ({ ...prev, status }));
      }
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      const id = deleteId;
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => (m._id !== id && m.id !== id)));
      if (selectedMsg && (selectedMsg._id === id || selectedMsg.id === id)) {
        setSelectedMsg(null);
      }
      toast.success('Message deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const id = selectedMsg._id || selectedMsg.id;
      await api.post(`/messages/${id}/reply`, { replyMessage: replyText });
      toast.success('Reply sent successfully');
      setReplyText('');
      const updatedMsg = { ...selectedMsg, status: 'read', replied: true, replyMessage: replyText, repliedAt: new Date() };
      setSelectedMsg(updatedMsg);
      setMessages(prev => prev.map(m => (m._id === id || m.id === id) ? updatedMsg : m));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const viewMessage = (msg) => {
    setSelectedMsg(msg);
    if (msg.status === 'unread') {
      handleStatusChange(msg._id || msg.id, 'read');
    }
  };

  const filteredMessages = messages.filter(m => {
    const sender = (m.name || m.senderName || '').toLowerCase();
    const email = (m.email || m.senderEmail || '').toLowerCase();
    const subject = (m.subject || '').toLowerCase();
    const content = (m.message || '').toLowerCase();
    const q = search.toLowerCase();
    if (search && !sender.includes(q) && !email.includes(q) && !subject.includes(q) && !content.includes(q)) {
      return false;
    }
    return true;
  });

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Mail size={24} className="text-indigo-500" /> Inbox & Inquiries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Messages sent from your public portfolio contact form
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMessages}
            className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="Refresh inbox"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="flex space-x-1 bg-white/70 dark:bg-slate-800/70 p-1 rounded-lg backdrop-blur-md border border-slate-200 dark:border-white/10">
            {['all', 'unread', 'read', 'archived'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${
                  filter === f
                    ? 'bg-indigo-600 shadow-sm text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Message List */}
        <div className={`w-full ${selectedMsg ? 'hidden md:flex md:w-1/3 lg:w-2/5' : 'flex'} flex-col bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden`}>
          <div className="p-4 border-b border-slate-200 dark:border-white/10">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search sender, email, or message..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900/50 border-none rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="text-xs">Loading messages...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                <Mail size={32} className="opacity-30" />
                <span className="text-xs">No messages found.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-white/5">
                {filteredMessages.map(msg => {
                  const id = msg._id || msg.id;
                  const isSelected = selectedMsg && (selectedMsg._id === id || selectedMsg.id === id);
                  const senderName = msg.name || msg.senderName || 'Anonymous Visitor';

                  return (
                    <button
                      key={id}
                      onClick={() => viewMessage(msg)}
                      className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${
                        isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2 truncate">
                          {msg.status === 'unread' && (
                            <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                          )}
                          <span className={`font-semibold text-sm truncate ${
                            msg.status === 'unread' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {senderName}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm mb-1 truncate ${
                        msg.status === 'unread' ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {msg.subject || '(No Subject)'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{msg.message}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        {selectedMsg ? (
          <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMsg(null)}
                  className="md:hidden p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X size={18} />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedMsg._id || selectedMsg.id, selectedMsg.status === 'read' ? 'unread' : 'read')}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                    title={selectedMsg.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedMsg._id || selectedMsg.id, selectedMsg.status === 'archived' ? 'read' : 'archived')}
                    className="p-2 text-slate-500 hover:text-amber-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                    title="Archive"
                  >
                    <Archive size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(selectedMsg._id || selectedMsg.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs rounded-full font-semibold uppercase tracking-wider ${
                selectedMsg.status === 'unread'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : selectedMsg.status === 'archived'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              }`}>
                {selectedMsg.status}
              </span>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {selectedMsg.subject || '(No Subject)'}
                </h2>
                <div className="flex flex-wrap justify-between items-center gap-2 mt-3 pb-4 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      {(selectedMsg.name || selectedMsg.senderName || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">
                        {selectedMsg.name || selectedMsg.senderName}
                      </p>
                      <a href={`mailto:${selectedMsg.email}`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                        {selectedMsg.email}
                      </a>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p className="flex items-center gap-1"><Clock size={12} /> {new Date(selectedMsg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/50 dark:border-white/5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Content</h3>
                <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedMsg.message}
                </div>
              </div>

              {selectedMsg.replyMessage && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-200/50 dark:border-emerald-500/20">
                  <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Reply size={14} /> Replied Content ({selectedMsg.repliedAt ? new Date(selectedMsg.repliedAt).toLocaleDateString() : 'Sent'})
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {selectedMsg.replyMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
              <form onSubmit={handleReply}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
                  <Reply size={14} /> Send Quick Reply to {selectedMsg.email}
                </label>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={3}
                  placeholder={`Write your response to ${selectedMsg.name || selectedMsg.email}...`}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm mb-2 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex w-full md:w-2/3 lg:w-3/5 flex-col items-center justify-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm border-dashed p-8 text-center">
            <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-500 mb-3">
              <Mail size={36} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Select a message</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Choose any inquiry from the left to read full details, mark status, or send a quick reply.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default MessagesPage;
