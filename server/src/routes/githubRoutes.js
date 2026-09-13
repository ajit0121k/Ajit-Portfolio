import { Router } from 'express';
import * as githubController from '../controllers/githubController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/profile', githubController.getGitHubProfile);
router.get('/stats', githubController.getGitHubStats);
router.get('/repos', authenticate, githubController.getGitHubRepos);
router.post('/import', authenticate, githubController.importFromGitHub);

export default router;
