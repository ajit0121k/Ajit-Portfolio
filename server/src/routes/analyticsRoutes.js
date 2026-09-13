import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/track', analyticsController.trackEvent);
router.get('/dashboard', authenticate, analyticsController.getDashboardStats);
router.get('/summary', authenticate, analyticsController.getDashboardSummary);
router.get('/projects', authenticate, analyticsController.getPopularProjects);

export default router;
