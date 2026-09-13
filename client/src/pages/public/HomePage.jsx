import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../../components/public/Hero.jsx';
import AboutSection from '../../components/public/AboutSection.jsx';
import SkillsSection from '../../components/public/SkillsSection.jsx';
import MarqueeRibbon from '../../components/public/MarqueeRibbon.jsx';
import ProjectsSection from '../../components/public/ProjectsSection.jsx';
import ExperienceTimeline from '../../components/public/ExperienceTimeline.jsx';
import EducationSection from '../../components/public/EducationSection.jsx';
import TestimonialsSection from '../../components/public/TestimonialsSection.jsx';
import ContactSection from '../../components/public/ContactSection.jsx';

const scrollAnimation = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function HomePage() {
  const { profile, settings } = useOutletContext();
  const visibility = settings?.sectionVisibility || {};

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Hero profile={profile} settings={settings} />
      </motion.div>

      {/* About Section / Balanced Architecture */}
      {visibility.about !== false && (
        <motion.div
          variants={scrollAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <AboutSection profile={profile} />
        </motion.div>
      )}

      {/* Skills Section / Domain Style Cards */}
      {visibility.skills !== false && (
        <motion.div
          variants={scrollAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <SkillsSection />
        </motion.div>
      )}

      {/* Infinite Marquee Ribbon Divider */}
      <motion.div
        variants={scrollAnimation}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <MarqueeRibbon />
      </motion.div>

      {/* Career Timeline (Experience) */}
      {visibility.experience !== false && (
        <motion.div
          variants={scrollAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <ExperienceTimeline />
        </motion.div>
      )}

      {/* Featured Projects */}
      {visibility.projects !== false && (
        <motion.div
          variants={scrollAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <ProjectsSection />
        </motion.div>
      )}

      {/* Education & Certifications */}
      {(visibility.education !== false || visibility.certifications !== false) && (
        <motion.div
          variants={scrollAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <EducationSection />
        </motion.div>
      )}

      {/* Testimonials */}
      {visibility.testimonials !== false && (
        <motion.div
          variants={scrollAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <TestimonialsSection />
        </motion.div>
      )}

      {/* Contact Section */}
      {visibility.contact !== false && (
        <motion.div
          variants={scrollAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <ContactSection profile={profile} settings={settings} />
        </motion.div>
      )}
    </div>
  );
}
