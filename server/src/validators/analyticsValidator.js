import { z } from 'zod';

export const trackEventSchema = z.object({
  type: z.enum([
    'page_view',
    'project_view',
    'resume_download',
    'external_link_click',
    'contact_submit',
    'blog_view'
  ]),
  path: z.string().optional(),
  projectId: z.string().optional(),
  referrer: z.string().optional(),
});
