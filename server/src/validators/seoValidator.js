import { z } from 'zod';

export const updateSEOSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  twitterHandle: z.string().optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  favicon: z.string().optional(),
  robots: z.string().optional(),
});
