import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as activityService from '../services/activityService.js';

export const getRecentActivity = asyncHandler(async (req, res) => {
  const activity = await activityService.getRecentActivity();
  return ApiResponse.success(res, 200, 'Recent activity retrieved', activity);
});

export const getAllActivity = asyncHandler(async (req, res) => {
  const activity = await activityService.getAllActivity(req.query);
  return ApiResponse.success(res, 200, 'All activity retrieved', activity);
});
