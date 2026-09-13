import { Router } from 'express';
import * as skillController from '../controllers/skillController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createSkillSchema, updateSkillSchema, reorderSchema } from '../validators/skillValidator.js';

const router = Router();

router.get('/visible', skillController.getVisibleSkills);
router.get('/', authenticate, skillController.getAllSkills);
router.post('/', authenticate, validate(createSkillSchema), skillController.createSkill);
router.put('/:id', authenticate, validate(updateSkillSchema), skillController.updateSkill);
router.delete('/:id', authenticate, skillController.deleteSkill);
router.patch('/reorder', authenticate, validate(reorderSchema), skillController.reorderSkills);

export default router;
