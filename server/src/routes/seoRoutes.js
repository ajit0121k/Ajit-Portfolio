import { Router } from 'express';
import * as seoController from '../controllers/seoController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateSEOSchema } from '../validators/seoValidator.js';

const router = Router();

router.get('/sitemap.xml', seoController.getSitemap);
router.get('/robots.txt', seoController.getRobotsTxt);
router.get('/', authenticate, seoController.getSEO);
router.put('/', authenticate, validate(updateSEOSchema), seoController.updateSEO);

export default router;
