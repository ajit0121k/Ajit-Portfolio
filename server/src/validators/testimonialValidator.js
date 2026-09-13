import { z } from 'zod';

export const createTestimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional().or(z.literal('')),
  designation: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  avatar: z.union([
    z.string(),
    z.object({
      url: z.string().optional(),
      publicId: z.string().optional()
    })
  ]).optional(),
  rating: z.number().min(1).max(5).optional(),
  website: z.string().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, 'ID is required'),
      order: z.number(),
    })
  ),
});
