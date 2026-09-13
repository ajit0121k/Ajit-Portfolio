import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  order: z.number().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const statusSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']),
});

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, 'ID is required'),
      order: z.number(),
    })
  ),
});
