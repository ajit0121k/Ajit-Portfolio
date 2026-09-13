import React, { useState } from 'react';
import { Sparkles, MapPin, Briefcase, Calendar, Check, Layers, Cpu, Database, ShieldCheck, ArrowRight, FileDown, ExternalLink } from 'lucide-react';

export default function AboutSection({ profile }) {
  const [activeStackMode, setActiveStackMode] = useState('fullstack');

  const name = profile?.name || 'Ajit Kumar';
  const title = profile?.title || 'Full Stack Developer & AI Engineer';
  const location = profile?.location || 'Lucknow, India';
  const years = profile?.yearsOfExperience || 2;

  return (
    <section id="about" className="scroll-mt-24 py-16 px-4 sm:px-6 max-w-6xl mx-auto relative">
      {/* Top Heading + Sunburst Icon (Matching Template) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
        <div className="lg:col-span-6 space-y-5 text-left">
          {/* Section Sunburst Header */}
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[#3d4b3e] dark:text-[#a8bba9]" viewBox="0 0 100 100" fill="currentColor">
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
              CORE PHILOSOPHY
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#222723] dark:text-[#f3eee5] tracking-tight leading-tight">
            Fit your system with <br />
            <span className="font-serif italic font-normal text-[#c66a3d] dark:text-[#e48358]">balanced architecture</span>
          </h2>

          <p className="text-sm text-[#5c5950] dark:text-[#b8b3a8] leading-relaxed max-w-md font-sans">
            With patterns for every operational demand &mdash; including microservices, serverless compute, and event-driven messaging. Tailored to keep your application fast, secure, and maintainable.
          </p>

          {/* Toggle Stack Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setActiveStackMode('fullstack')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                activeStackMode === 'fullstack'
                  ? 'bg-[#2d3a2e] text-[#f5f0e8] dark:bg-[#f3eee5] dark:text-[#1a241d] shadow-md border-transparent'
                  : 'bg-[#faf7f2]/80 dark:bg-white/5 border-[#dfd6c7] dark:border-white/10 text-[#4a473f] dark:text-[#c4beb3]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Full-Stack MERN</span>
            </button>

            <button
              onClick={() => setActiveStackMode('cloud')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                activeStackMode === 'cloud'
                  ? 'bg-[#2d3a2e] text-[#f5f0e8] dark:bg-[#f3eee5] dark:text-[#1a241d] shadow-md border-transparent'
                  : 'bg-[#faf7f2]/80 dark:bg-white/5 border-[#dfd6c7] dark:border-white/10 text-[#4a473f] dark:text-[#c4beb3]'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Cloud & DevOps</span>
            </button>
          </div>

          {/* Resume Download (Warm Terracotta Pill Action) */}
          <div className="pt-2">
            <a
              href="/api/resume/download"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs font-bold tracking-wider text-white uppercase rounded-full bg-[#c66a3d] hover:bg-[#b2572b] shadow-[0_10px_25px_-5px_rgba(198,106,61,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(198,106,61,0.6)] border border-white/20 transition-all duration-300 active:scale-95 group"
              title="Download Official Resume PDF"
            >
              <FileDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
              <span>DOWNLOAD RESUME</span>
            </a>
          </div>

          {/* Designer / Engineer Signature */}
          <div className="pt-2">
            <p className="font-serif italic text-xl text-[#222723] dark:text-[#f3eee5]">
              {name}
            </p>
            <p className="text-[10px] uppercase font-bold text-[#6b675d] dark:text-[#a8a397] tracking-wider">
              {title}
            </p>
          </div>
        </div>

        {/* Right Showcase Card */}
        <div className="lg:col-span-6 relative">
          <div className="liquid-glass-container p-6 sm:p-8 relative min-h-[380px] flex flex-col justify-center overflow-hidden">

            {/* Profile Bio or Technical Overview */}
            <div className="space-y-4 relative z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Comprehensive Engineering Background
              </h3>

              {profile?.bio ? (
                <div
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: profile.bio }}
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Engineering complete end-to-end applications with deep attention to database indexing, zero-trust API security, responsive UI/UX, and automated delivery pipelines.
                </p>
              )}

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-500">
                {location && (
                  <span className="liquid-glass-pill flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-primary-500" />
                    <span>{location}</span>
                  </span>
                )}
                <span className="liquid-glass-pill flex items-center gap-1.5 text-[11px]">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{years}+ Years Experience</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
