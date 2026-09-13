import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as testimonialService from '../services/testimonialService.js';

export const getVisibleTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getVisibleTestimonials();
  return ApiResponse.success(res, 200, 'Visible testimonials retrieved', testimonials);
});

export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getAllTestimonials();
  return ApiResponse.success(res, 200, 'All testimonials retrieved', testimonials);
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.createTestimonial(req.body);
  return ApiResponse.created(res, 'Testimonial created', testimonial);
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
  return ApiResponse.success(res, 200, 'Testimonial updated', testimonial);
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.deleteTestimonial(req.params.id);
  return ApiResponse.success(res, 200, 'Testimonial deleted');
});

export const reorderTestimonials = asyncHandler(async (req, res) => {
  await testimonialService.reorderTestimonials(req.body);
  return ApiResponse.success(res, 200, 'Testimonials reordered');
});
