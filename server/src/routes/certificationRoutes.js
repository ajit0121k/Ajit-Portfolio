import { Router } from 'express';
import * as certificationController from '../controllers/certificationController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCertificationSchema, updateCertificationSchema, reorderSchema } from '../validators/certificationValidator.js';

const router = Router();

router.get('/visible', certificationController.getVisibleCertifications);
router.get('/', authenticate, certificationController.getAllCertifications);
router.post('/', authenticate, validate(createCertificationSchema), certificationController.createCertification);
router.put('/:id', authenticate, validate(updateCertificationSchema), certificationController.updateCertification);
router.delete('/:id', authenticate, certificationController.deleteCertification);
router.patch('/reorder', authenticate, validate(reorderSchema), certificationController.reorderCertifications);

export default router;
