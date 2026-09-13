import { Router } from 'express';
import * as messageController from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { createMessageSchema, replySchema } from '../validators/messageValidator.js';

const router = Router();

router.post('/', contactLimiter, validate(createMessageSchema), messageController.createMessage);
router.get('/', authenticate, messageController.getAllMessages);
router.get('/unread-count', authenticate, messageController.getUnreadCount);
router.get('/:id', authenticate, messageController.getMessageById);
router.patch('/:id/read', authenticate, messageController.markAsRead);
router.patch('/:id/unread', authenticate, messageController.markAsUnread);
router.patch('/:id/archive', authenticate, messageController.archiveMessage);
router.post('/:id/reply', authenticate, validate(replySchema), messageController.replyToMessage);
router.delete('/:id', authenticate, messageController.deleteMessage);

export default router;
