import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { uploadImage, uploadDocument } from '../middleware/upload.js';
import { updateProfileSchema } from '../validators/profileValidator.js';

const router = Router();

router.get('/', profileController.getProfile);
router.put('/', authenticate, validate(updateProfileSchema), profileController.updateProfile);
router.put('/photo', authenticate, uploadLimiter, uploadImage.single('file'), profileController.updateProfilePhoto);
router.put('/resume', authenticate, uploadLimiter, uploadDocument.single('file'), profileController.updateResume);
router.get('/completeness', authenticate, profileController.getProfileCompleteness);

export default router;
