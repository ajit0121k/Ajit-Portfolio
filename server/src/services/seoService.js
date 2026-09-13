import SiteSettings from '../models/SiteSettings.js';
import Project from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export const getSEO = async () => {
  const settings = await SiteSettings.getSettings();
  return settings.seo || {};
};

export const updateSEO = async (seoData) => {
  const settings = await SiteSettings.getSettings();
  settings.seo = {
    ...settings.seo,
    ...seoData,
  };
  await settings.save();
  return settings.seo;
};

export const generateSitemap = async () => {
  const baseUrl = config.clientUrl || 'http://localhost:5173';
  const [projects, posts] = await Promise.all([
    Project.find({ status: 'published' }).select('slug updatedAt'),
    BlogPost.find({ status: 'published' }).select('slug updatedAt'),
  ]);

  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/projects', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog', changefreq: 'weekly', priority: '0.8' },
    { url: '/resume', changefreq: 'monthly', priority: '0.7' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach((p) => {
    xml += `  <url>\n    <loc>${baseUrl}${p.url}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
  });

  projects.forEach((p) => {
    const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString();
    xml += `  <url>\n    <loc>${baseUrl}/projects/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  posts.forEach((p) => {
    const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString();
    xml += `  <url>\n    <loc>${baseUrl}/blog/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
};

export const generateRobotsTxt = async () => {
  const settings = await SiteSettings.getSettings();
  const baseUrl = config.clientUrl || 'http://localhost:5173';
  const robotsSetting = settings.seo?.robots || 'index, follow';

  let txt = `User-agent: *\n`;
  if (robotsSetting.includes('noindex')) {
    txt += `Disallow: /\n`;
  } else {
    txt += `Disallow: /admin/\n`;
    txt += `Disallow: /api/\n`;
    txt += `Allow: /\n`;
  }
  txt += `\nSitemap: ${baseUrl}/api/seo/sitemap.xml\n`;
  return txt;
};

// Aliases matching seoController method names
export const getSitemap = generateSitemap;
export const getRobotsTxt = generateRobotsTxt;
