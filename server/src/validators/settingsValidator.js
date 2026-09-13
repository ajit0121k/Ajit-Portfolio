import { z } from 'zod';

export const updateSettingsSchema = z.object({
  siteName: z.string().optional(),
  websiteLogo: z.string().optional(),
  websiteDescription: z.string().optional(),
  authorName: z.string().optional(),
  defaultTheme: z.enum(['light', 'dark', 'system']).optional(),
  themePreset: z.enum(['default', 'midnight', 'ocean', 'emerald', 'monochrome']).optional().or(z.string()),
  accentColor: z.string().optional(),
  appearance: z.record(z.any()).optional(),
  sectionVisibility: z.record(z.boolean()).optional(),
  portfolio: z.record(z.any()).optional(),
  navigation: z.array(z.any()).optional(),
  seo: z.record(z.any()).optional(),
  socialLinks: z.record(z.any()).optional(),
  contactSettings: z.record(z.any()).optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  fontFamily: z.string().optional(),
  customCss: z.string().optional(),
  customJs: z.string().optional(),
}).passthrough();

export const updateSEOSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  twitterHandle: z.string().optional(),
  canonicalUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  favicon: z.string().optional(),
  robots: z.string().optional(),
});
