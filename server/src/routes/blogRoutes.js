import { Router } from 'express';
import * as blogController from '../controllers/blogController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBlogPostSchema, updateBlogPostSchema } from '../validators/blogValidator.js';

const router = Router();

router.get('/published', blogController.getPublishedPosts);
router.get('/slug/:slug', blogController.getPostBySlug);
router.get('/tags', blogController.getTags);

router.get('/', authenticate, blogController.getAllPosts);
router.get('/:id', authenticate, blogController.getPostById);
router.post('/', authenticate, validate(createBlogPostSchema), blogController.createPost);
router.put('/:id', authenticate, validate(updateBlogPostSchema), blogController.updatePost);
router.delete('/:id', authenticate, blogController.deletePost);
router.patch('/:id/status', authenticate, blogController.updatePostStatus);

export default router;
