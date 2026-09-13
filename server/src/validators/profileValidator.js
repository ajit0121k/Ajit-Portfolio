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
  currentlyBuildingUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  socialLinks: z.object({
    github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    youtube: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    dribbble: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    medium: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    devto: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  }).optional(),
});
