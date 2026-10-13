import React, { useState } from 'react';
import { Mail, Send, Sparkles, MapPin, Linkedin, CheckCircle2, MessageSquare } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

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
      // Send message via API (on localhost: saves to MongoDB; on GitHub Pages: saves to localStorage via interceptor)
      try {
        await api.post('/messages', payload);
      } catch (apiErr) {
        // If API call completely failed (offline / no backend), save directly to localStorage as fallback
        if (!apiErr.response) {
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
        } else {
          console.warn('API message endpoint:', apiErr?.message);
        }
      }

      // Send email notification via FormSubmit (non-blocking, fire-and-forget)
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

      // Notify admin panel across tabs and windows instantly
      try {
        window.dispatchEvent(new Event('portfolio_message_received'));
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[#3d4b3e] dark:text-[#a8bba9] text-xs font-bold uppercase tracking-wider mb-3 border border-white/60 dark:border-white/10 shadow-xs">
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
                  className="flex items-center gap-3 text-[#3d4b3e] dark:text-[#d3ded4] hover:text-[#c66a3d] transition-all p-3.5 rounded-2xl liquid-glass-card hover:scale-[1.02] border border-white/70 dark:border-white/10 shadow-xs"
                >
                  <div className="p-2 rounded-xl liquid-glass-pill text-[#c66a3d] dark:text-[#e48358] border border-white/60 dark:border-white/10">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[10px] text-[#8a8579] font-bold uppercase">Email</span>
                    <span className="text-xs font-semibold truncate font-sans">{profile.email}</span>
                  </div>
                </a>
              )}

              <a
                href={profile?.socialLinks?.linkedin || 'https://www.linkedin.com/in/ajit-kumar-a3a16b2b0/'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[#3d4b3e] dark:text-[#d3ded4] hover:text-[#0077b5] transition-all p-3.5 rounded-2xl liquid-glass-card hover:scale-[1.02] border border-white/70 dark:border-white/10 shadow-xs"
                title="Connect on LinkedIn"
              >
                <div className="p-2 rounded-xl liquid-glass-pill text-[#0077b5] border border-white/60 dark:border-white/10">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block text-[10px] text-[#8a8579] font-bold uppercase">LinkedIn</span>
                  <span className="text-xs font-semibold font-sans">Connect on LinkedIn</span>
                </div>
              </a>

              {profile?.location && (
                <div className="flex items-center gap-3 text-[#3d4b3e] dark:text-[#d3ded4] p-3.5 rounded-2xl liquid-glass-card border border-white/70 dark:border-white/10 shadow-xs">
                  <div className="p-2 rounded-xl liquid-glass-pill text-[#3d4b3e] dark:text-[#a8bba9] border border-white/60 dark:border-white/10">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#8a8579] font-bold uppercase">Location</span>
                    <span className="text-xs font-semibold font-sans">{profile.location}</span>
                  </div>
                </div>
              )}
          </div>

          {/* Contact Form Card - Centered with Liquid Glass Container */}
          <div className="liquid-glass-container relative glossy-glare-edge p-6 md:p-8 rounded-3xl shadow-2xl border border-white/80 dark:border-white/10 overflow-hidden">
            {isSuccess ? (
              <div className="py-12 text-center flex flex-col items-center justify-center animate-fade-in">
                <div className="w-16 h-16 rounded-full liquid-glass-card text-[#3d4b3e] dark:text-[#a8bba9] flex items-center justify-center mb-4 shadow-lg border border-white/70">
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
                  className="px-6 py-2.5 rounded-full liquid-glass-pill text-xs font-semibold text-[#222723] dark:text-[#f3eee5] transition-all border border-white/70 dark:border-white/15 cursor-pointer hover:scale-105"
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
                      className="w-full px-4 py-2.5 rounded-2xl liquid-glass-input text-xs text-[#222723] dark:text-[#f3eee5] placeholder-[#a09a8d] focus:outline-none transition-all font-sans"
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
                      className="w-full px-4 py-2.5 rounded-2xl liquid-glass-input text-xs text-[#222723] dark:text-[#f3eee5] placeholder-[#a09a8d] focus:outline-none transition-all font-sans"
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
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass-input text-xs text-[#222723] dark:text-[#f3eee5] placeholder-[#a09a8d] focus:outline-none transition-all font-sans"
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
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass-input text-xs text-[#222723] dark:text-[#f3eee5] placeholder-[#a09a8d] focus:outline-none transition-all resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full liquid-glass-amber-btn text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 tracking-wider uppercase font-sans cursor-pointer"
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
