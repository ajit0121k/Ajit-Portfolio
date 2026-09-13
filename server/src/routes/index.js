import { Router } from 'express';

import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import projectRoutes from './projectRoutes.js';
import skillRoutes from './skillRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import educationRoutes from './educationRoutes.js';
import certificationRoutes from './certificationRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import messageRoutes from './messageRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import blogRoutes from './blogRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import seoRoutes from './seoRoutes.js';
import githubRoutes from './githubRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import activityRoutes from './activityRoutes.js';
import resumeRoutes from './resumeRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/certifications', certificationRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/messages', messageRoutes);
router.use('/media', mediaRoutes);
router.use('/blog', blogRoutes);
router.use('/settings', settingsRoutes);
router.use('/seo', seoRoutes);
router.use('/github', githubRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/activity', activityRoutes);
router.use('/resume', resumeRoutes);

export default router;
