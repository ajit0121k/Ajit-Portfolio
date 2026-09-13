import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as skillService from '../services/skillService.js';

export const getVisibleSkills = asyncHandler(async (req, res) => {
  const skills = await skillService.getVisibleSkills();
  return ApiResponse.success(res, 200, 'Visible skills retrieved', skills);
});

export const getAllSkills = asyncHandler(async (req, res) => {
  const skills = await skillService.getAllSkills();
  return ApiResponse.success(res, 200, 'All skills retrieved', skills);
});

export const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.body);
  return ApiResponse.created(res, 'Skill created', skill);
});

export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.updateSkill(req.params.id, req.body);
  return ApiResponse.success(res, 200, 'Skill updated', skill);
});

export const deleteSkill = asyncHandler(async (req, res) => {
  await skillService.deleteSkill(req.params.id);
  return ApiResponse.success(res, 200, 'Skill deleted');
});

export const reorderSkills = asyncHandler(async (req, res) => {
  await skillService.reorderSkills(req.body);
  return ApiResponse.success(res, 200, 'Skills reordered');
});
