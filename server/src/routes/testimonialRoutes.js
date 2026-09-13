import { Router } from 'express';
import * as testimonialController from '../controllers/testimonialController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTestimonialSchema, updateTestimonialSchema, reorderSchema } from '../validators/testimonialValidator.js';

const router = Router();

router.get('/visible', testimonialController.getVisibleTestimonials);
router.get('/', authenticate, testimonialController.getAllTestimonials);
router.post('/', authenticate, validate(createTestimonialSchema), testimonialController.createTestimonial);
router.put('/:id', authenticate, validate(updateTestimonialSchema), testimonialController.updateTestimonial);
router.delete('/:id', authenticate, testimonialController.deleteTestimonial);
router.patch('/reorder', authenticate, validate(reorderSchema), testimonialController.reorderTestimonials);

export default router;
