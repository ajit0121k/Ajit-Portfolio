import React from 'react';
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Code2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ profile, settings }) {
  const name = profile?.name || 'Ajit Kumar';
  const title = profile?.title || 'Full Stack Developer & AI Engineer';
  const tagline = profile?.tagline || 'Skilled in MERN Stack, Generative AI, JWT authentication, and Scalable Cloud Systems.';
  const years = profile?.yearsOfExperience || 2;
  const photoUrl = profile?.profileImage?.url || '/profile.jpg';

  // Typewriter effect phrases
  const phrases = [
    'Available for Full-Time Roles',
    'Available for Internships',
    'Available for Part-Time Roles',
    'Available for Freelance & Contracts',
  ];

  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timer;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 65);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <section id="hero" className="relative pt-24 pb-10 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Top Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 space-y-6 text-left"
        >
          {/* Typewriter Availability */}
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#3d4b3e] dark:text-[#a8bba9] animate-[spin_20s_linear_infinite] flex-shrink-0" viewBox="0 0 100 100" fill="currentColor">
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
            <div className="inline-flex items-center px-3.5 py-1 rounded-full liquid-glass-pill shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#49654d] animate-pulse mr-2 flex-shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3d4b3e] dark:text-[#d3ded4] min-h-[16px]">
                {displayText}
              </span>
              <span className="inline-block w-[2px] h-[13px] bg-[#c66a3d] ml-1 animate-pulse align-middle" />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-black tracking-tight text-[#222723] dark:text-[#f3eee5] leading-[1.12]">
            NOT JUST BUILDING APPS — <br />
            ARCHITECTING EXPERIENCES. <br />
            <span className="font-serif font-normal text-[#c66a3d] dark:text-[#e48358] text-[0.62em] sm:text-[0.68em] inline-block mt-2 tracking-normal">
              MERN Stack Developer — <span className="italic font-serif">{name ? name.split(' ')[0] : 'Ajit'}</span>
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#5c5950] dark:text-[#b8b3a8] max-w-lg leading-relaxed font-sans">
            {tagline}
          </p>

          {/* Quick Feature Pillars (Matching Template: Serene Rooms / Gourmet Dining etc) */}
          <div className="grid grid-cols-2 gap-3 py-1 text-xs text-[#4a473f] dark:text-[#c4beb3]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c66a3d]" />
              <span className="font-semibold">Production MERN Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#49654d]" />
              <span className="font-semibold">Generative AI Pipelines</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3d4b3e]" />
              <span className="font-semibold">Zero-Trust JWT Security</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c66a3d]" />
              <span className="font-semibold">Clean High-Speed Cloud APIs</span>
            </div>
          </div>

          {/* Action CTAs + Social Icons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              className="liquid-glass-amber-btn inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-wider uppercase group"
            >
              <span>EXPLORE CASE STUDIES</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>

            <div className="flex items-center gap-1.5 p-1 liquid-glass-pill">
              <a href={profile?.socialLinks?.github || 'https://github.com/ajit0121k'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center text-[#4a473f] dark:text-[#d3ded4] hover:bg-[#2d3a2e] hover:text-white dark:hover:bg-[#f5f0e8] dark:hover:text-[#1a241d] transition-all" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href={profile?.socialLinks?.linkedin || 'https://www.linkedin.com/in/ajit-kumar-a3a16b2b0/'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center text-[#4a473f] dark:text-[#d3ded4] hover:bg-[#c66a3d] hover:text-white transition-all" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={profile?.socialLinks?.leetcode || 'https://leetcode.com/u/02Ajit/'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center text-[#4a473f] dark:text-[#d3ded4] hover:bg-[#3d4b3e] hover:text-white transition-all" title="LeetCode">
                <Code2 className="w-4 h-4" />
              </a>
              <a href={`mailto:${profile?.email || 'ajitkumar2956654@gmail.com'}`} className="w-8 h-8 rounded-full flex items-center justify-center text-[#4a473f] dark:text-[#d3ded4] hover:bg-[#c66a3d] hover:text-white transition-all" title="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Career Stats */}
          <div className="grid grid-cols-2 gap-6 pt-5 border-t border-[#dfd6c7] dark:border-white/10 max-w-sm">
            <div>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#222723] dark:text-[#f3eee5] tracking-tight">
                {years}+
              </p>
              <p className="text-[11px] text-[#6b675d] dark:text-[#a8a397] font-medium mt-0.5">
                Years Full-Stack & AI Engineering
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#222723] dark:text-[#f3eee5] tracking-tight">
                4+
              </p>
              <p className="text-[11px] text-[#6b675d] dark:text-[#a8a397] font-medium mt-0.5">
                Production MERN & Cloud Apps
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Architectural Arched Photo Frame (Olive Sanctuary Style) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative flex items-center justify-center"
        >
          {/* Inner Relative Frame Container with Gentle Ambient Float */}
          <div className="relative animate-float">
            {/* Ambient Background Aura */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#c66a3d]/20 via-[#49654d]/20 to-transparent rounded-full blur-2xl -z-10 pointer-events-none" />

            {/* Arched Architectural Photo Frame (Seamlessly Masked Arch Window) */}
            <div className="relative w-[310px] sm:w-[375px] md:w-[400px] h-[450px] sm:h-[510px] rounded-t-[14rem] rounded-b-[2.5rem] bg-[#1a221c] border-4 border-[#faf7f2]/90 dark:border-white/15 shadow-2xl overflow-hidden group">
              {/* Profile Photo - Conforms completely to the arch shape */}
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover object-[center_18%] transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Subtle bottom vignette to ground the suit */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Circular Stamp Badge (Gracefully anchored to upper outer corner) */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-7 z-20 animate-[spin_25s_linear_infinite] hover:[animation-play-state:paused]">
              <a
                href="#contact"
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2d3a2e] text-[#f5f0e8] flex items-center justify-center shadow-xl border-2 border-[#f5f0e8] dark:border-white/20 group hover:scale-105 transition-transform"
                title="Get in touch"
              >
                <svg className="w-full h-full p-0.5" viewBox="0 0 100 100">
                  <path id="circlePath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
                  <text className="text-[7.2px] font-bold uppercase tracking-[0.16em] fill-[#f5f0e8]">
                    <textPath href="#circlePath" startOffset="0%">★ CRAFTED FOR IMPACT ★ FULL STACK ★</textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#c66a3d] text-white flex items-center justify-center shadow-inner">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 -rotate-45" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
