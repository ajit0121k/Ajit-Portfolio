import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as githubService from '../services/githubService.js';

export const getGitHubStats = asyncHandler(async (req, res) => {
  const stats = await githubService.getGitHubStats();
  return ApiResponse.success(res, 200, 'GitHub stats retrieved', stats);
});

export const getGitHubProfile = asyncHandler(async (req, res) => {
  const profile = await githubService.getGitHubProfile();
  return ApiResponse.success(res, 200, 'GitHub profile retrieved', profile);
});

export const getGitHubRepos = asyncHandler(async (req, res) => {
  const repos = await githubService.getGitHubRepos();
  return ApiResponse.success(res, 200, 'GitHub repos retrieved', repos);
});

export const importFromGitHub = asyncHandler(async (req, res) => {
  const result = await githubService.importFromGitHub(req.body);
  return ApiResponse.success(res, 200, 'Import from GitHub successful', result);
});
