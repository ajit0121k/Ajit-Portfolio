import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Quote, Star } from 'lucide-react';
import api from '../../services/api.js';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/testimonials/visible');
        setTestimonials(data.data || data || []);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (!isLoading && testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d4b3e]/10 text-[#3d4b3e] dark:text-[#a8bba9] text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#c66a3d]" />
            <span>Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight">
            What Colleagues & <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">Clients Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.id || t._id || idx}
              className="liquid-glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-all border-[#dfd6c7]/80"
            >
              <div>
                <Quote className="w-6 h-6 text-[#c66a3d]/60 mb-3" />
                <p className="text-xs sm:text-sm text-[#5c5950] dark:text-[#b8b3a8] italic leading-relaxed mb-6 font-serif">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#dfd6c7]/60 dark:border-white/10">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#3d4b3e]/15 text-[#3d4b3e] dark:text-[#a8bba9] font-bold text-xs flex items-center justify-center border border-[#3d4b3e]/20 flex-shrink-0">
                  {t.avatar?.url ? (
                    <img src={t.avatar.url} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{t.name ? t.name[0] : 'U'}</span>
                  )}
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-bold text-[#222723] dark:text-[#f3eee5] truncate font-sans">
                    {t.name}
                  </h3>
                  <p className="text-[11px] text-[#8a8579] truncate font-sans">
                    {t.role} {t.company && `at ${t.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
