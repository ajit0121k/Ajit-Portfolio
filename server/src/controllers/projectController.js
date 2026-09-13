import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as projectService from '../services/projectService.js';

export const getPublishedProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getPublishedProjects(req.query);
  return ApiResponse.success(res, 200, 'Published projects retrieved', projects);
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectBySlug(req.params.slug);
  return ApiResponse.success(res, 200, 'Project retrieved', project);
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjects(req.query);
  return ApiResponse.success(res, 200, 'All projects retrieved', projects);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  return ApiResponse.success(res, 200, 'Project retrieved', project);
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body);
  return ApiResponse.created(res, 'Project created', project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  return ApiResponse.success(res, 200, 'Project updated', project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  return ApiResponse.success(res, 200, 'Project deleted');
});

export const updateProjectStatus = asyncHandler(async (req, res) => {
  const project = await projectService.updateProjectStatus(req.params.id, req.body.status);
  return ApiResponse.success(res, 200, 'Project status updated', project);
});

export const duplicateProject = asyncHandler(async (req, res) => {
  const project = await projectService.duplicateProject(req.params.id);
  return ApiResponse.created(res, 'Project duplicated', project);
});

export const reorderProjects = asyncHandler(async (req, res) => {
  await projectService.reorderProjects(req.body);
  return ApiResponse.success(res, 200, 'Projects reordered');
});

export const getRelatedProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getRelatedProjects(req.params.slug);
  return ApiResponse.success(res, 200, 'Related projects retrieved', projects);
});
