import { z } from 'zod';

export const createCertificationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuingOrganization: z.string().min(1, 'Issuing Organization is required'),
  credentialId: z.string().optional().or(z.literal('')),
  issueDate: z.string().or(z.date()).optional().nullable(),
  expiryDate: z.string().or(z.date()).optional().nullable(),
  neverExpires: z.boolean().optional(),
  credentialUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  verificationUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  badgeImage: z.union([
    z.string(),
    z.object({
      url: z.string().optional(),
      publicId: z.string().optional()
    })
  ]).optional(),
  certificatePdf: z.union([
    z.string(),
    z.object({
      url: z.string().optional(),
      publicId: z.string().optional()
    })
  ]).optional(),
  description: z.string().optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

export const updateCertificationSchema = createCertificationSchema.partial();

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, 'ID is required'),
      order: z.number(),
    })
  ),
});
