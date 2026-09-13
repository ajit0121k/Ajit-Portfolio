import { z } from 'zod';

export const createSkillSchema = z.object({
  category: z.enum(['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  name: z.string().min(1, 'Name is required'),
  icon: z.string().optional(),
  proficiency: z.number().min(0).max(100).optional(),
  years: z.number().min(0).optional(),
  visible: z.boolean().optional(),
});

export const updateSkillSchema = createSkillSchema.partial();

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, 'ID is required'),
      order: z.number(),
    })
  ),
});
