import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as experienceService from '../services/experienceService.js';

export const getVisibleExperience = asyncHandler(async (req, res) => {
  const experience = await experienceService.getVisibleExperience();
  return ApiResponse.success(res, 200, 'Visible experience retrieved', experience);
});

export const getAllExperience = asyncHandler(async (req, res) => {
  const experience = await experienceService.getAllExperience();
  return ApiResponse.success(res, 200, 'All experience retrieved', experience);
});

export const createExperience = asyncHandler(async (req, res) => {
  const experience = await experienceService.createExperience(req.body);
  return ApiResponse.created(res, 'Experience created', experience);
});

export const updateExperience = asyncHandler(async (req, res) => {
  const experience = await experienceService.updateExperience(req.params.id, req.body);
  return ApiResponse.success(res, 200, 'Experience updated', experience);
});

export const deleteExperience = asyncHandler(async (req, res) => {
  await experienceService.deleteExperience(req.params.id);
  return ApiResponse.success(res, 200, 'Experience deleted');
});

export const reorderExperience = asyncHandler(async (req, res) => {
  await experienceService.reorderExperience(req.body);
  return ApiResponse.success(res, 200, 'Experience reordered');
});
