import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as profileService from '../services/profileService.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile();
  return ApiResponse.success(res, 200, 'Profile retrieved', profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateProfile(req.body);
  return ApiResponse.success(res, 200, 'Profile updated', profile);
});

export const updateProfilePhoto = asyncHandler(async (req, res) => {
  const profile = await profileService.updateProfilePhoto(req.file, req.admin?.id);
  return ApiResponse.success(res, 200, 'Profile photo updated', profile);
});

export const updateResume = asyncHandler(async (req, res) => {
  const profile = await profileService.updateResume(req.file, req.admin?.id);
  return ApiResponse.success(res, 200, 'Resume updated', profile);
});

export const getProfileCompleteness = asyncHandler(async (req, res) => {
  const completeness = await profileService.getProfileCompleteness();
  return ApiResponse.success(res, 200, 'Profile completeness retrieved', completeness);
});
