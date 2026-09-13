import { z } from 'zod';

export const createMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  subject: z.string().max(200, 'Subject must be at most 200 characters').optional(),
  message: z.string().min(1, 'Message is required').max(5000, 'Message must be at most 5000 characters'),
});

export const replySchema = z.object({
  replyMessage: z.string().min(1, 'Reply message is required').max(5000, 'Reply message must be at most 5000 characters'),
});
