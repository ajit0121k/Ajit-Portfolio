import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as educationService from '../services/educationService.js';

export const getVisibleEducation = asyncHandler(async (req, res) => {
  const education = await educationService.getVisibleEducation();
  return ApiResponse.success(res, 200, 'Visible education retrieved', education);
});

export const getAllEducation = asyncHandler(async (req, res) => {
  const education = await educationService.getAllEducation();
  return ApiResponse.success(res, 200, 'All education retrieved', education);
});

export const createEducation = asyncHandler(async (req, res) => {
  const education = await educationService.createEducation(req.body);
  return ApiResponse.created(res, 'Education created', education);
});

export const updateEducation = asyncHandler(async (req, res) => {
  const education = await educationService.updateEducation(req.params.id, req.body);
  return ApiResponse.success(res, 200, 'Education updated', education);
});

export const deleteEducation = asyncHandler(async (req, res) => {
  await educationService.deleteEducation(req.params.id);
  return ApiResponse.success(res, 200, 'Education deleted');
});

export const reorderEducation = asyncHandler(async (req, res) => {
  await educationService.reorderEducation(req.body);
  return ApiResponse.success(res, 200, 'Education reordered');
});
