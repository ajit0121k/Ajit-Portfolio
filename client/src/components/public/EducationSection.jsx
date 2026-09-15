import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, ExternalLink, Sparkles, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api.js';
import { usePortfolioSync } from '../../services/syncBus.js';

export default function EducationSection() {
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEduAndCerts = async () => {
    try {
      const [eduRes, certRes] = await Promise.all([
        api.get('/education/visible'),
        api.get('/certifications/visible'),
      ]);
      setEducation(eduRes.data.data || eduRes.data || []);
      setCertifications(certRes.data.data || certRes.data || []);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  usePortfolioSync(['education', 'certifications'], fetchEduAndCerts);

  useEffect(() => {
    fetchEduAndCerts();
  }, []);

  return (
    <section id="education" className="scroll-mt-24 py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Column */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d4b3e]/10 text-[#3d4b3e] dark:text-[#a8bba9] text-xs font-bold uppercase tracking-wider mb-3">
                <GraduationCap className="w-3.5 h-3.5 text-[#c66a3d]" />
                <span>Academia</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight">
                Education & <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">Qualifications</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-3xl bg-[#eae3d5]/50 dark:bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : education.length > 0 ? (
              <div className="space-y-4">
                {education.map((item, idx) => (
                  <motion.div
                    key={item.id || item._id || idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="liquid-glass-card p-6 transition-shadow border-[#dfd6c7]/80 hover:shadow-[0_16px_36px_-10px_rgba(68,62,51,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-base font-serif font-bold text-[#222723] dark:text-[#f3eee5]">
                          {item.degree}
                        </h3>
                        <p className="text-xs font-semibold text-[#c66a3d] dark:text-[#e48358] mt-0.5 font-sans">
                          {item.institution}
                        </p>
                      </div>
                      <span className="liquid-glass-pill px-2.5 py-1 text-[10px] font-semibold text-[#6b675d] dark:text-[#a8a397] flex items-center gap-1 flex-shrink-0">
                        <Calendar className="w-3 h-3 text-[#c66a3d]" />
                        <span>{item.startYear} &mdash; {item.endYear || 'Present'}</span>
                      </span>
                    </div>

                    {item.location && (
                      <p className="text-[11px] text-[#8a8579] flex items-center gap-1.5 mb-2 font-sans">
                        <MapPin className="w-3 h-3 text-[#3d4b3e]" />
                        <span>{item.location}</span>
                        {item.grade && <span>&bull; GPA / Grade: {item.grade}</span>}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-xs text-[#5c5950] dark:text-[#b8b3a8] leading-relaxed mt-2 font-sans">
                        {item.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="liquid-glass-card p-8 text-center text-xs text-[#8a8579]">
                Education records configured in Admin CMS.
              </div>
            )}
          </div>

          {/* Certifications Column */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d4b3e]/10 text-[#3d4b3e] dark:text-[#a8bba9] text-xs font-bold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5 text-[#c66a3d]" />
                <span>Credentials</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight">
                Licenses & <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">Certifications</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-3xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : certifications.length > 0 ? (
              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <motion.div
                    key={cert.id || cert._id || idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="liquid-glass-card p-6 transition-shadow hover:shadow-[0_16px_36px_-10px_rgba(68,62,51,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {cert.name}
                        </h3>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {cert.issuingOrganization}
                        </p>
                      </div>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-indigo-500 hover:text-white text-slate-600 dark:text-slate-300 transition-all shadow-xs"
                          title="Verify Credential"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {cert.credentialId && (
                      <p className="text-[11px] font-mono text-slate-400 mt-2">
                        Credential ID: <span className="text-slate-600 dark:text-slate-300">{cert.credentialId}</span>
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="liquid-glass-card p-8 text-center text-xs text-slate-400">
                Certifications configured in Admin CMS.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
