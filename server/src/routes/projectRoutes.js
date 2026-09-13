import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema, statusSchema, reorderSchema } from '../validators/projectValidator.js';

const router = Router();

router.get('/published', projectController.getPublishedProjects);
router.get('/slug/:slug', projectController.getProjectBySlug);
router.get('/slug/:slug/related', projectController.getRelatedProjects);

router.get('/', authenticate, projectController.getAllProjects);
router.get('/:id', authenticate, projectController.getProjectById);
router.post('/', authenticate, validate(createProjectSchema), projectController.createProject);
router.put('/:id', authenticate, validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', authenticate, projectController.deleteProject);
router.patch('/:id/status', authenticate, validate(statusSchema), projectController.updateProjectStatus);
router.post('/:id/duplicate', authenticate, projectController.duplicateProject);
router.patch('/reorder', authenticate, validate(reorderSchema), projectController.reorderProjects);

export default router;
