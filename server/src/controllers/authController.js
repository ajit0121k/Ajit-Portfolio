import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as authService from '../services/authService.js';

export const sendOtp = asyncHandler(async (req, res) => {
  const result = await authService.sendLoginOtp(req.body);
  return ApiResponse.success(res, 200, result.message, result);
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyLoginOtp(req.body);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth'
  });
  return ApiResponse.success(res, 200, 'Two-Step Verification successful', {
    admin: result.admin,
    accessToken: result.accessToken
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  if (result.requires2FA) {
    return ApiResponse.success(res, 200, result.message, result);
  }
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth'
  });
  return ApiResponse.success(res, 200, 'Login successful', { admin: result.admin, accessToken: result.accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await authService.refreshToken(refreshToken);
  return ApiResponse.success(res, 200, 'Token refreshed', { accessToken: result.accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.admin.id);
  res.clearCookie('refreshToken', { path: '/api/auth' });
  return ApiResponse.success(res, 200, 'Logout successful');
});

export const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 200, 'Admin profile retrieved', { admin: req.admin });
});
