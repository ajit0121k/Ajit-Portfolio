import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  tagline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  yearsOfExperience: z.number().min(0, 'Years of experience must be 0 or more').optional(),
  availability: z.enum(['available', 'limited', 'unavailable']).optional(),
  availabilityText: z.string().optional(),
  currentlyBuilding: z.string().optional(),
  currentlyBuildingUrl: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  profileImage: z.object({
    url: z.string().optional().or(z.literal('')),
    publicId: z.string().optional().or(z.literal('')),
  }).passthrough().optional(),
  resume: z.object({
    url: z.string().optional().or(z.literal('')),
    publicId: z.string().optional().or(z.literal('')),
    originalName: z.string().optional().or(z.literal('')),
    uploadedAt: z.any().optional(),
  }).passthrough().optional(),
  socialLinks: z.record(z.string().optional().or(z.literal(''))).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
  }).passthrough().optional(),
}).passthrough();
