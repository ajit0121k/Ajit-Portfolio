import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as settingsService from '../services/settingsService.js';

export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getPublicSettings();
  return ApiResponse.success(res, 200, 'Public settings retrieved', settings);
});

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();
  return ApiResponse.success(res, 200, 'Settings retrieved', settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);
  return ApiResponse.success(res, 200, 'Settings updated', settings);
});
