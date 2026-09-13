import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, Sparkles, Building2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api.js';

export default function ExperienceTimeline() {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const { data } = await api.get('/experience/visible');
        setExperiences(data.data || data || []);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperience();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="scroll-mt-24 py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d4b3e]/10 text-[#3d4b3e] dark:text-[#a8bba9] text-xs font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5 text-[#c66a3d]" />
            <span>Career Path</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight">
            Work Experience & <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">Track Record</span>
          </h2>
        </div>

        {/* Timeline Layout */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-3xl bg-[#eae3d5]/50 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : experiences.length > 0 ? (
          <div className="relative border-l-2 border-[#dfd6c7] dark:border-white/10 ml-4 md:ml-8 pl-6 md:pl-8 space-y-8">
            {experiences.map((exp, idx) => {
              const startDate = formatDate(exp.startDate);
              const endDate = exp.current ? 'Present' : formatDate(exp.endDate);

              return (
                <div key={exp.id || exp._id || idx} className="relative group">
                  {/* Animated Timeline Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18, delay: idx * 0.1 }}
                    className={`absolute -left-[31px] md:-left-[39px] top-6 w-4 h-4 rounded-full border-2 border-white dark:border-[#141a16] shadow-md ${
                      exp.current
                        ? 'bg-[#3d4b3e] ring-4 ring-[#3d4b3e]/20 shadow-[0_0_10px_rgba(61,75,62,0.6)]'
                        : 'bg-[#c66a3d] ring-4 ring-[#c66a3d]/20 shadow-[0_0_10px_rgba(198,106,61,0.6)]'
                    }`}
                  />

                  {/* Animated Card Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 45 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="liquid-glass-card p-6 md:p-8 transition-shadow border-[#dfd6c7]/80 hover:shadow-[0_20px_45px_-12px_rgba(68,62,51,0.14)] dark:hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.7)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-serif font-bold text-[#222723] dark:text-[#f3eee5]">
                            {exp.role}
                          </h3>
                          {exp.current && (
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#3d4b3e]/15 text-[#3d4b3e] dark:text-[#a8bba9] border border-[#3d4b3e]/30">
                              Current Role
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-[#c66a3d] dark:text-[#e48358] mt-1 font-sans">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{exp.company}</span>
                          {exp.employmentType && (
                            <>
                              <span className="text-[#c5beaf]">&bull;</span>
                              <span className="text-[#6b675d] dark:text-[#a8a397] font-normal">{exp.employmentType}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Date & Location Pill */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b675d] dark:text-[#a8a397] font-medium font-sans">
                        <div className="flex items-center gap-1.5 liquid-glass-pill px-3 py-1 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#c66a3d]" />
                          <span>{startDate} &mdash; {endDate}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1.5 liquid-glass-pill px-3 py-1 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-[#3d4b3e] dark:text-[#a8bba9]" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <div
                        className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4 prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}

                    {/* Tech Badges */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-slate-200/60 dark:border-white/10">
                        {exp.technologies.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="liquid-glass-card p-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No experience records found. Add your career history from the Admin CMS.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
