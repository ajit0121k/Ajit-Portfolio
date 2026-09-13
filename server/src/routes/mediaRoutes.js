import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { uploadMedia } from '../middleware/upload.js';

const router = Router();

router.get('/', authenticate, mediaController.getAllMedia);
router.post('/upload', authenticate, uploadLimiter, uploadMedia.single('file'), mediaController.uploadMedia);
router.get('/:id', authenticate, mediaController.getMediaById);
router.delete('/:id', authenticate, mediaController.deleteMedia);

export default router;
