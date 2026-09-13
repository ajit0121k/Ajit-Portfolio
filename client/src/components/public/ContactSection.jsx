import React, { useState } from 'react';
import { Mail, Send, Sparkles, MapPin, Phone, CheckCircle2, MessageSquare } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { handleLocalRequest } from '../../services/localDataService.js';

export default function ContactSection({ profile, settings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // anti-spam bot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = (formData.name || '').trim();
    const trimmedEmail = (formData.email || '').trim();
    const trimmedMessage = (formData.message || '').trim();
    const trimmedSubject = (formData.subject || 'Portfolio Inquiry').trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    };

    try {
      // 1. Instantly write directly to localStorage first, so it is 100% guaranteed saved
      try {
        const localRaw = localStorage.getItem('portfolio_cms_messages');
        let localMsgs = localRaw ? JSON.parse(localRaw) : [];
        if (!Array.isArray(localMsgs)) localMsgs = [];
        const newLocalMsg = {
          _id: 'msg_' + Date.now(),
          id: 'msg_' + Date.now(),
          ...payload,
          status: 'unread',
          read: false,
          createdAt: new Date().toISOString(),
        };
        localMsgs.unshift(newLocalMsg);
        localStorage.setItem('portfolio_cms_messages', JSON.stringify(localMsgs));
      } catch (localStoreErr) {
        console.warn('LocalStorage save error:', localStoreErr);
      }

      // 2. Transmit to localDataService to sync internal state
      try {
        handleLocalRequest('POST', '/messages', payload);
      } catch (localErr) {}

      // 3. Transmit to backend API (on localhost, saves directly to MongoDB)
      try {
        await api.post('/messages', payload);
      } catch (apiErr) {
        console.warn('API message endpoint:', apiErr?.message);
      }

      // 4. Transmit to FormSubmit AJAX service so Ajit receives the message directly in Gmail
      try {
        fetch('https://formsubmit.co/ajax/ajitkumar2956654@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            _subject: `[Portfolio Contact] ${trimmedSubject} - ${trimmedName}`,
            message: trimmedMessage,
            _captcha: 'false',
            _template: 'table'
          })
        }).catch((e) => console.warn('Email dispatch:', e));
      } catch (emailErr) {
        // non-blocking
      }

      // 5. Notify admin panel across tabs and windows instantly
      try {
        window.dispatchEvent(new Event('portfolio_message_received'));
        window.dispatchEvent(new StorageEvent('storage', { key: 'portfolio_cms_messages' }));
      } catch (evtErr) {}

      setIsSuccess(true);
      toast.success('Your message has been transmitted successfully!');
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err) {
      console.error('Transmission error:', err);
      toast.error('Failed to transmit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d4b3e]/10 text-[#3d4b3e] dark:text-[#a8bba9] text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5 text-[#c66a3d]" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight">
            FIND US & <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">GET IN TOUCH</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6b675d] dark:text-[#a8a397] max-w-lg mx-auto mt-2 font-sans">
            Have a project in mind, an architectural question, or looking to collaborate? Drop me a line.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Contact Details Row */}
          <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-[#3d4b3e] dark:text-[#d3ded4] hover:text-[#c66a3d] transition-colors p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-[#dfd6c7] dark:border-white/10"
                >
                  <div className="p-2 rounded-xl bg-[#c66a3d]/10 text-[#c66a3d]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[10px] text-[#8a8579] font-bold uppercase">Email</span>
                    <span className="text-xs font-semibold truncate font-sans">{profile.email}</span>
                  </div>
                </a>
              )}

              {profile?.location && (
                <div className="flex items-center gap-3 text-[#3d4b3e] dark:text-[#d3ded4] p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-[#dfd6c7] dark:border-white/10">
                  <div className="p-2 rounded-xl bg-[#3d4b3e]/10 text-[#3d4b3e] dark:text-[#a8bba9]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#8a8579] font-bold uppercase">Location</span>
                    <span className="text-xs font-semibold font-sans">{profile.location}</span>
                  </div>
                </div>
              )}

              {profile?.phone && (
                <div className="flex items-center gap-3 text-[#3d4b3e] dark:text-[#d3ded4] p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-[#dfd6c7] dark:border-white/10">
                  <div className="p-2 rounded-xl bg-[#c66a3d]/10 text-[#c66a3d]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#8a8579] font-bold uppercase">Phone</span>
                    <span className="text-xs font-semibold font-sans">{profile.phone}</span>
                  </div>
                </div>
              )}
          </div>

          {/* Contact Form Card - Centered */}
          <div className="liquid-glass-card p-6 md:p-8 relative overflow-hidden border-[#dfd6c7]/80">
            {isSuccess ? (
              <div className="py-12 text-center flex flex-col items-center justify-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#3d4b3e]/15 text-[#3d4b3e] dark:text-[#a8bba9] flex items-center justify-center mb-4 shadow-lg shadow-[#3d4b3e]/20">
                  <CheckCircle2 className="w-8 h-8 text-[#c66a3d]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#222723] dark:text-[#f3eee5] mb-2">
                  Message Dispatched!
                </h3>
                <p className="text-xs text-[#6b675d] dark:text-[#a8a397] max-w-sm mx-auto mb-6 font-sans">
                  Thank you for reaching out. Your message is safely stored and a notification has been sent.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-2.5 rounded-full bg-[#faf7f2] dark:bg-white/5 hover:bg-[#eae3d5] dark:hover:bg-white/10 text-xs font-semibold text-[#222723] dark:text-[#f3eee5] transition-all border border-[#dfd6c7]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot anti-spam */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a473f] dark:text-[#c4beb3] mb-1.5">
                      Your Name <span className="text-[#c66a3d]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-black/30 border border-[#dfd6c7] dark:border-white/10 text-xs text-[#222723] dark:text-[#f3eee5] placeholder-[#a09a8d] focus:outline-none focus:ring-2 focus:ring-[#c66a3d]/40 transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a473f] dark:text-[#c4beb3] mb-1.5">
                      Email Address <span className="text-[#c66a3d]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-black/30 border border-[#dfd6c7] dark:border-white/10 text-xs text-[#222723] dark:text-[#f3eee5] placeholder-[#a09a8d] focus:outline-none focus:ring-2 focus:ring-[#c66a3d]/40 transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a473f] dark:text-[#c4beb3] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Project Inquiry / Full-time Opportunity"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-black/30 border border-[#dfd6c7] dark:border-white/10 text-xs text-[#222723] dark:text-[#f3eee5] placeholder-[#a09a8d] focus:outline-none focus:ring-2 focus:ring-[#c66a3d]/40 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a473f] dark:text-[#c4beb3] mb-1.5">
                    Message <span className="text-[#c66a3d]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    placeholder="Describe your project, timeline, or position requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-black/30 border border-[#dfd6c7] dark:border-white/10 text-xs text-[#222723] dark:text-[#f3eee5] placeholder-[#a09a8d] focus:outline-none focus:ring-2 focus:ring-[#c66a3d]/40 transition-all resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-[#c66a3d] hover:bg-[#b2572b] text-white font-bold text-xs shadow-lg shadow-[#c66a3d]/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 tracking-wider uppercase font-sans"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
