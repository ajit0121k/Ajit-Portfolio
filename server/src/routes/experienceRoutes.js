import { Router } from 'express';
import * as experienceController from '../controllers/experienceController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createExperienceSchema, updateExperienceSchema, reorderSchema } from '../validators/experienceValidator.js';

const router = Router();

router.get('/visible', experienceController.getVisibleExperience);
router.get('/', authenticate, experienceController.getAllExperience);
router.post('/', authenticate, validate(createExperienceSchema), experienceController.createExperience);
router.put('/:id', authenticate, validate(updateExperienceSchema), experienceController.updateExperience);
router.delete('/:id', authenticate, experienceController.deleteExperience);
router.patch('/reorder', authenticate, validate(reorderSchema), experienceController.reorderExperience);

export default router;
