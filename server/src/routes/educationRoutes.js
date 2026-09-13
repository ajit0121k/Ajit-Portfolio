import { Router } from 'express';
import * as educationController from '../controllers/educationController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEducationSchema, updateEducationSchema, reorderSchema } from '../validators/educationValidator.js';

const router = Router();

router.get('/visible', educationController.getVisibleEducation);
router.get('/', authenticate, educationController.getAllEducation);
router.post('/', authenticate, validate(createEducationSchema), educationController.createEducation);
router.put('/:id', authenticate, validate(updateEducationSchema), educationController.updateEducation);
router.delete('/:id', authenticate, educationController.deleteEducation);
router.patch('/reorder', authenticate, validate(reorderSchema), educationController.reorderEducation);

export default router;
