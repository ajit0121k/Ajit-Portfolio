import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import config from '../config/env.js';
import Admin from '../models/Admin.js';
import Profile from '../models/Profile.js';
import SiteSettings from '../models/SiteSettings.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Testimonial from '../models/Testimonial.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function autoSeedIfEmpty() {
  try {
    const dumpPath = path.join(__dirname, 'initialDbDump.json');
    if (!fs.existsSync(dumpPath)) {
      logger.info('[autoSeed] No initialDbDump.json found, skipping auto-seed.');
      return;
    }

    const rawData = fs.readFileSync(dumpPath, 'utf8');
    const dump = JSON.parse(rawData);

    // 1. Ensure Admin account exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      logger.info('[autoSeed] Creating initial superadmin account...');
      await Admin.create({
        username: config.admin.email.split('@')[0] || 'ajitkumar',
        email: config.admin.email,
        passwordHash: config.admin.password, // Pre-save hook will bcrypt hash this
        role: 'superadmin',
        isActive: true,
      });
      logger.info(`[autoSeed] Admin created: ${config.admin.email}`);
    }

    // 2. Ensure Profile exists
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0 && dump.profiles?.length > 0) {
      logger.info('[autoSeed] Seeding initial Profile...');
      const p = dump.profiles[0];
      const cleanProfile = { ...p };
      delete cleanProfile._id;
      delete cleanProfile.id;
      await Profile.create(cleanProfile);
      logger.info('[autoSeed] Profile seeded successfully.');
    }

    // 3. Ensure SiteSettings exists
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0 && dump.sitesettings?.length > 0) {
      logger.info('[autoSeed] Seeding initial SiteSettings...');
      const s = dump.sitesettings[0];
      const cleanSettings = { ...s };
      delete cleanSettings._id;
      delete cleanSettings.id;
      await SiteSettings.create(cleanSettings);
      logger.info('[autoSeed] SiteSettings seeded successfully.');
    }

    // 4. Ensure Projects exist
    const projectCount = await Project.countDocuments();
    if (projectCount === 0 && Array.isArray(dump.projects) && dump.projects.length > 0) {
      logger.info(`[autoSeed] Seeding ${dump.projects.length} initial projects...`);
      const cleanProjects = dump.projects.map((item) => {
        const c = { ...item };
        delete c._id;
        delete c.id;
        return c;
      });
      await Project.insertMany(cleanProjects, { ordered: false });
      logger.info('[autoSeed] Projects seeded successfully.');
    }

    // 5. Ensure Skills exist
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0 && Array.isArray(dump.skills) && dump.skills.length > 0) {
      logger.info(`[autoSeed] Seeding ${dump.skills.length} initial skills...`);
      const cleanSkills = dump.skills.map((item) => {
        const c = { ...item };
        delete c._id;
        delete c.id;
        return c;
      });
      await Skill.insertMany(cleanSkills, { ordered: false });
      logger.info('[autoSeed] Skills seeded successfully.');
    }

    // 6. Ensure Experience exists
    const expCount = await Experience.countDocuments();
    if (expCount === 0 && Array.isArray(dump.experiences) && dump.experiences.length > 0) {
      logger.info(`[autoSeed] Seeding ${dump.experiences.length} initial experiences...`);
      const cleanExp = dump.experiences.map((item) => {
        const c = { ...item };
        delete c._id;
        delete c.id;
        return c;
      });
      await Experience.insertMany(cleanExp, { ordered: false });
      logger.info('[autoSeed] Experiences seeded successfully.');
    }

    // 7. Ensure Education exists
    const eduCount = await Education.countDocuments();
    if (eduCount === 0 && Array.isArray(dump.educations) && dump.educations.length > 0) {
      logger.info(`[autoSeed] Seeding ${dump.educations.length} initial educations...`);
      const cleanEdu = dump.educations.map((item) => {
        const c = { ...item };
        delete c._id;
        delete c.id;
        return c;
      });
      await Education.insertMany(cleanEdu, { ordered: false });
      logger.info('[autoSeed] Educations seeded successfully.');
    }

    // 8. Ensure Certifications exist
    const certCount = await Certification.countDocuments();
    if (certCount === 0 && Array.isArray(dump.certifications) && dump.certifications.length > 0) {
      logger.info(`[autoSeed] Seeding ${dump.certifications.length} initial certifications...`);
      const cleanCert = dump.certifications.map((item) => {
        const c = { ...item };
        delete c._id;
        delete c.id;
        return c;
      });
      await Certification.insertMany(cleanCert, { ordered: false });
      logger.info('[autoSeed] Certifications seeded successfully.');
    }

    // 9. Ensure Testimonials exist
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0 && Array.isArray(dump.testimonials) && dump.testimonials.length > 0) {
      logger.info(`[autoSeed] Seeding ${dump.testimonials.length} initial testimonials...`);
      const cleanTest = dump.testimonials.map((item) => {
        const c = { ...item };
        delete c._id;
        delete c.id;
        return c;
      });
      await Testimonial.insertMany(cleanTest, { ordered: false });
      logger.info('[autoSeed] Testimonials seeded successfully.');
    }

    logger.info('[autoSeed] Database check completed.');
  } catch (error) {
    logger.warn(`[autoSeed] Note during autoSeed (non-fatal): ${error.message}`);
  }
}
