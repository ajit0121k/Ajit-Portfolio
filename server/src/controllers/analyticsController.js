import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as analyticsService from '../services/analyticsService.js';

export const trackEvent = asyncHandler(async (req, res) => {
  const event = await analyticsService.trackEvent(req.body);
  return ApiResponse.created(res, 'Event tracked successfully', event);
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  return ApiResponse.success(res, 200, 'Dashboard stats retrieved', stats);
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await analyticsService.getDashboardSummary();
  return ApiResponse.success(res, 200, 'Dashboard summary retrieved', summary);
});

export const getPopularProjects = asyncHandler(async (req, res) => {
  const projects = await analyticsService.getPopularProjects();
  return ApiResponse.success(res, 200, 'Popular projects retrieved', projects);
});
