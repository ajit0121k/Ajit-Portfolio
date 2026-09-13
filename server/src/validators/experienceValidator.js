import { z } from 'zod';

export const createExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  companyLogo: z.union([
    z.string(),
    z.object({
      url: z.string().optional(),
      publicId: z.string().optional()
    })
  ]).optional(),
  role: z.string().min(1, 'Role is required'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Other']).optional(),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  companyWebsite: z.string().optional().or(z.literal('')),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, 'ID is required'),
      order: z.number(),
    })
  ),
});
