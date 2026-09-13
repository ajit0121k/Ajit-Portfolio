import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as resumeService from '../services/resumeService.js';
import path from 'path';
import fs from 'fs';

export const getActiveResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getActive();
  return ApiResponse.success(res, 200, 'Active resume retrieved', resume);
});

export const previewActiveResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getActive();
  if (!resume || !resume.url) {
    const localFallback = path.join(process.cwd(), 'uploads/resume.pdf');
    if (fs.existsSync(localFallback)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="Ajit_Kumar_Resume.pdf"');
      return fs.createReadStream(localFallback).pipe(res);
    }
    return ApiResponse.notFound(res, 'No active resume found');
  }

  if (resume.url.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), resume.url.replace(/^\//, ''));
    if (fs.existsSync(localPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + (resume.originalName || 'Ajit_Kumar_Resume.pdf') + '"');
      return fs.createReadStream(localPath).pipe(res);
    }
  }

  return res.redirect(resume.url);
});

export const downloadActiveResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getActive();
  if (!resume || !resume.url) {
    // Fallback to static resume.pdf if exists
    const localFallback = path.join(process.cwd(), 'uploads/resume.pdf');
    if (fs.existsSync(localFallback)) {
      return res.download(localFallback, 'Ajit_Kumar_Resume.pdf');
    }
    return ApiResponse.notFound(res, 'No active resume found');
  }

  // If local file URL
  if (resume.url.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), resume.url.replace(/^\//, ''));
    if (fs.existsSync(localPath)) {
      return res.download(localPath, resume.originalName || 'Ajit_Kumar_Resume.pdf');
    }
  }

  // If external Cloudinary URL, redirect to it
  return res.redirect(resume.url);
});

export const getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await resumeService.getAll();
  return ApiResponse.success(res, 200, 'Resumes retrieved', resumes);
});

export const uploadResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.upload(req.file, req.admin?.id);
  return ApiResponse.created(res, 'Resume uploaded and activated successfully', resume);
});

export const activateResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.activate(req.params.id);
  return ApiResponse.success(res, 200, 'Resume activated', resume);
});

export const deleteResume = asyncHandler(async (req, res) => {
  const result = await resumeService.deleteResume(req.params.id);
  return ApiResponse.success(res, 200, 'Resume deleted', result);
});
