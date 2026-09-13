import { Router } from 'express';
import * as resumeController from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { uploadDocument } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/active', resumeController.getActiveResume);
router.get('/download', resumeController.downloadActiveResume);
router.get('/preview', resumeController.previewActiveResume);

// Admin protected routes
router.get('/', authenticate, resumeController.getAllResumes);
router.post('/', authenticate, uploadLimiter, uploadDocument.single('file'), resumeController.uploadResume);
router.patch('/:id/activate', authenticate, resumeController.activateResume);
router.delete('/:id', authenticate, resumeController.deleteResume);

export default router;
