import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Database,
  Cloud,
  Terminal,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Code2,
  Sparkles,
  Server,
  GitBranch,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api.js';

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await api.get('/skills/visible');
        setSkills(data.data || data || []);
      } catch (e) {
        console.error('Failed to fetch skills:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Icon helper based on skill category or name
  const getSkillIcon = (skill) => {
    const cat = (skill.category || '').toLowerCase();
    const name = (skill.name || '').toLowerCase();

    if (name.includes('git')) return GitBranch;
    if (name.includes('ai') || name.includes('llm') || name.includes('data struct')) return Cpu;
    if (name.includes('auth') || name.includes('security') || name.includes('jwt')) return ShieldCheck;
    if (cat === 'frontend') return Layers;
    if (cat === 'backend') return Terminal;
    if (cat === 'database') return Database;
    if (cat === 'devops') return Cloud;
    return Wrench;
  };

  const getCategoryColor = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat === 'frontend') return 'text-[#c66a3d] bg-[#c66a3d]/10 border-[#c66a3d]/25';
    if (cat === 'backend') return 'text-[#3d4b3e] bg-[#3d4b3e]/10 border-[#3d4b3e]/25 dark:text-[#a8bba9] dark:bg-[#3d4b3e]/20';
    if (cat === 'database') return 'text-[#b2572b] bg-[#b2572b]/10 border-[#b2572b]/25';
    if (cat === 'devops') return 'text-[#49654d] bg-[#49654d]/10 border-[#49654d]/25 dark:text-[#bad0bc]';
    return 'text-[#8c5033] bg-[#8c5033]/10 border-[#8c5033]/25';
  };

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="skills" className="scroll-mt-24 py-16 px-4 sm:px-6 max-w-6xl mx-auto relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-[#3d4b3e] dark:text-[#a8bba9] flex-shrink-0 animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100" fill="currentColor">
              {Array.from({ length: 16 }).map((_, i) => (
                <rect
                  key={i}
                  x="48"
                  y="10"
                  width="4"
                  height="26"
                  rx="2"
                  transform={`rotate(${i * 22.5} 50 50)`}
                />
              ))}
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#6b675d] dark:text-[#a8a397]">
              TECHNICAL EXPERTISE
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight leading-tight">
            Core Skills & <br />
            <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">production stack</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-[#5c5950] dark:text-[#b8b3a8] max-w-xs md:text-right leading-relaxed font-sans">
          Real technologies mastered across frontend, distributed backend APIs, database design, and AI pipelines.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#2d3a2e] text-[#f5f0e8] dark:bg-[#f3eee5] dark:text-[#1a241d] shadow-md scale-105'
                  : 'liquid-glass-pill text-[#5c5950] dark:text-[#c4beb3] hover:text-[#1a241d] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Real Skills Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-[#eae3d5]/50 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {filteredSkills.map((skill, idx) => {
            const Icon = getSkillIcon(skill);
            const colorClass = getCategoryColor(skill.category);
            const proficiency = skill.proficiency || 85;

            return (
              <motion.div
                key={skill.id || skill._id || idx}
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: (idx % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.025 }}
                className="liquid-glass-card p-6 flex flex-col justify-between relative overflow-hidden group transition-shadow hover:shadow-[0_20px_40px_-10px_rgba(68,62,51,0.12)] dark:hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]"
              >
                {/* Background Category Watermark */}
                <div className="absolute right-3 -bottom-2 pointer-events-none select-none opacity-[0.05] dark:opacity-[0.03] font-black text-6xl tracking-widest text-[#2d3a2e] dark:text-white uppercase font-mono">
                  {skill.category || 'CODE'}
                </div>

                {/* Top Row: Icon + Category Badge */}
                <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-white/5 border border-[#dfd6c7] dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${colorClass}`}>
                    {skill.category}
                  </span>
                </div>

                {/* Middle Row: Skill Name & Details */}
                <div className="relative z-10 mb-4">
                  <h3 className="text-base font-bold text-[#222723] dark:text-[#f3eee5] tracking-tight">
                    {skill.name}
                  </h3>
                  <p className="text-[11px] text-[#6b675d] dark:text-[#a8a397] mt-0.5 font-medium">
                    {skill.years ? `${skill.years}+ Years Hands-on` : 'Production Tested'}
                  </p>
                </div>

                {/* Bottom Row: Animated Proficiency Bar */}
                <div className="relative z-10 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#5c5950] dark:text-[#c4beb3] mb-1.5">
                    <span>Proficiency</span>
                    <span className="text-[#c66a3d] font-mono">{proficiency}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#dfd6c7]/70 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.15 + (idx % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-[#c66a3d] via-[#f59e0b] to-[#b2572b]"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="liquid-glass-card p-12 text-center text-xs text-slate-400 mb-10">
          No skills found in this category. Add or update skills in the Admin CMS.
        </div>
      )}

      {/* Bottom CTA to Projects */}
      <div className="text-center pt-2">
        <a
          href="#projects"
          className="liquid-glass-amber-btn inline-flex items-center gap-2 px-7 py-3 text-xs tracking-wider uppercase"
        >
          <span>Projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
