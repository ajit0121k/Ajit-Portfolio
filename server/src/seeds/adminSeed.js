import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import config from '../config/env.js';
import logger from '../utils/logger.js';
import Admin from '../models/Admin.js';
import SiteSettings from '../models/SiteSettings.js';
import Profile from '../models/Profile.js';

/**
 * Seed the database with initial admin account and default settings.
 * Reads admin credentials from environment variables.
 * Idempotent - will not create duplicates.
 */
const seed = async () => {
  try {
    await connectDB();
    logger.info('Starting database seed...');

    // 1. Create Admin if not exists
    const existingAdmin = await Admin.findOne({ email: config.admin.email });

    if (existingAdmin) {
      logger.info(`Admin already exists with email: ${config.admin.email}`);
    } else {
      const admin = await Admin.create({
        username: config.admin.email.split('@')[0],
        email: config.admin.email,
        passwordHash: config.admin.password, // pre-save hook will hash this
        role: 'superadmin',
        isActive: true,
      });
      logger.info(`Admin created successfully: ${admin.email}`);
    }

    // 2. Create default SiteSettings if not exists
    const existingSettings = await SiteSettings.findOne();

    if (existingSettings) {
      logger.info('Site settings already exist');
    } else {
      await SiteSettings.create({
        siteName: 'My Portfolio',
        defaultTheme: 'system',
        themePreset: 'default',
        accentColor: '#3b82f6',
        sectionVisibility: {
          about: true,
          skills: true,
          experience: true,
          projects: true,
          education: true,
          certifications: true,
          testimonials: true,
          blog: true,
          contact: true,
          github: true,
          currentlyBuilding: true,
        },
        seo: {
          title: 'Developer Portfolio',
          description: 'Full Stack Developer Portfolio',
          robots: 'index, follow',
        },
        contactSettings: {
          enableContactForm: true,
          enableAutoReply: false,
          notifyOnMessage: true,
        },
        maintenanceMode: false,
      });
      logger.info('Default site settings created');
    }

    // 3. Create empty Profile if not exists
    const existingProfile = await Profile.findOne();

    if (existingProfile) {
      logger.info('Profile already exists');
    } else {
      await Profile.create({
        name: 'Ajit Kumar',
        title: 'Senior Full Stack Engineer & System Architect',
        tagline: 'Engineering high-performance web systems and intelligent data-driven applications',
        bio: 'Specialized in building end-to-end web applications with clean architecture, resilient backend systems, responsive modern interfaces, and automated CI/CD pipelines.',
        profileImage: {
          url: '/profile.jpg',
          publicId: 'local_profile_pic',
        },
        availability: 'available',
        email: config.admin.email,
        socialLinks: {},
        seo: {},
      });
      logger.info('Default profile created');
    }

    logger.info('Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Seed failed: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
};

seed();
