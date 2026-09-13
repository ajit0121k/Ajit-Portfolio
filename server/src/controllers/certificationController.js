import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as certificationService from '../services/certificationService.js';

export const getVisibleCertifications = asyncHandler(async (req, res) => {
  const certifications = await certificationService.getVisibleCertifications();
  return ApiResponse.success(res, 200, 'Visible certifications retrieved', certifications);
});

export const getAllCertifications = asyncHandler(async (req, res) => {
  const certifications = await certificationService.getAllCertifications();
  return ApiResponse.success(res, 200, 'All certifications retrieved', certifications);
});

export const createCertification = asyncHandler(async (req, res) => {
  const certification = await certificationService.createCertification(req.body);
  return ApiResponse.created(res, 'Certification created', certification);
});

export const updateCertification = asyncHandler(async (req, res) => {
  const certification = await certificationService.updateCertification(req.params.id, req.body);
  return ApiResponse.success(res, 200, 'Certification updated', certification);
});

export const deleteCertification = asyncHandler(async (req, res) => {
  await certificationService.deleteCertification(req.params.id);
  return ApiResponse.success(res, 200, 'Certification deleted');
});

export const reorderCertifications = asyncHandler(async (req, res) => {
  await certificationService.reorderCertifications(req.body);
  return ApiResponse.success(res, 200, 'Certifications reordered');
});
