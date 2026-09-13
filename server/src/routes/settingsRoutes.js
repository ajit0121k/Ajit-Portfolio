import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateSettingsSchema } from '../validators/settingsValidator.js';

const router = Router();

router.get('/public', settingsController.getPublicSettings);
router.get('/', authenticate, settingsController.getSettings);
router.put('/', authenticate, validate(updateSettingsSchema), settingsController.updateSettings);

export default router;
