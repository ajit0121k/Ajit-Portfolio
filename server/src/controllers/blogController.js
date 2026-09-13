import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as blogService from '../services/blogService.js';

export const getPublishedPosts = asyncHandler(async (req, res) => {
  const posts = await blogService.getPublishedPosts(req.query);
  return ApiResponse.success(res, 200, 'Published posts retrieved', posts);
});

export const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await blogService.getPostBySlug(req.params.slug);
  return ApiResponse.success(res, 200, 'Post retrieved', post);
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await blogService.getAllPosts(req.query);
  return ApiResponse.success(res, 200, 'All posts retrieved', posts);
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await blogService.getPostById(req.params.id);
  return ApiResponse.success(res, 200, 'Post retrieved', post);
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await blogService.createPost(req.body);
  return ApiResponse.created(res, 'Post created', post);
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await blogService.updatePost(req.params.id, req.body);
  return ApiResponse.success(res, 200, 'Post updated', post);
});

export const deletePost = asyncHandler(async (req, res) => {
  await blogService.deletePost(req.params.id);
  return ApiResponse.success(res, 200, 'Post deleted');
});

export const updatePostStatus = asyncHandler(async (req, res) => {
  const post = await blogService.updatePostStatus(req.params.id, req.body.status);
  return ApiResponse.success(res, 200, 'Post status updated', post);
});

export const getTags = asyncHandler(async (req, res) => {
  const tags = await blogService.getTags();
  return ApiResponse.success(res, 200, 'Tags retrieved', tags);
});
