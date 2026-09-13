import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as mediaService from '../services/mediaService.js';

export const getAllMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.getAllMedia(req.query);
  return ApiResponse.success(res, 200, 'Media retrieved', media);
});

export const uploadMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.uploadMedia(req.file, req.admin?.id, req.body?.alt);
  return ApiResponse.created(res, 'Media uploaded successfully', media);
});

export const deleteMedia = asyncHandler(async (req, res) => {
  await mediaService.deleteMedia(req.params.id);
  return ApiResponse.success(res, 200, 'Media deleted');
});

export const getMediaById = asyncHandler(async (req, res) => {
  const media = await mediaService.getMediaById(req.params.id);
  return ApiResponse.success(res, 200, 'Media retrieved', media);
});
