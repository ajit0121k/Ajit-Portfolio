import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as seoService from '../services/seoService.js';

export const getSEO = asyncHandler(async (req, res) => {
  const seo = await seoService.getSEO();
  return ApiResponse.success(res, 200, 'SEO retrieved', seo);
});

export const updateSEO = asyncHandler(async (req, res) => {
  const seo = await seoService.updateSEO(req.body);
  return ApiResponse.success(res, 200, 'SEO updated', seo);
});

export const getSitemap = asyncHandler(async (req, res) => {
  const sitemap = await seoService.getSitemap();
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

export const getRobotsTxt = asyncHandler(async (req, res) => {
  const robots = await seoService.getRobotsTxt();
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});
