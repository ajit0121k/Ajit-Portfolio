import { z } from 'zod';

export const createEducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  university: z.string().optional().or(z.literal('')),
  fieldOfStudy: z.string().optional().or(z.literal('')),
  startYear: z.number().min(1900).max(2100),
  endYear: z.number().min(1900).max(2100).optional().nullable(),
  location: z.string().optional().or(z.literal('')),
  grade: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  logo: z.union([
    z.string(),
    z.object({
      url: z.string().optional(),
      publicId: z.string().optional()
    })
  ]).optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

export const updateEducationSchema = createEducationSchema.partial();

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, 'ID is required'),
      order: z.number(),
    })
  ),
});
