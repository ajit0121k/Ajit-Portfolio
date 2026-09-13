import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * Middleware to authenticate admin users
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(ApiError.unauthorized('Not authorized to access this route'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    
    try {
      const Admin = mongoose.model('Admin');
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return next(ApiError.unauthorized('User no longer exists'));
      }
      req.admin = admin;
    } catch (e) {
      // If Admin model is not registered yet, just attach decoded payload
      req.admin = { id: decoded.id };
    }

    next();
  } catch (error) {
    return next(ApiError.unauthorized('Token is invalid or expired'));
  }
});

/**
 * Middleware for optional authentication
 * Doesn't fail if no token is present, just attaches admin if valid token exists
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    
    try {
      const Admin = mongoose.model('Admin');
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.admin = admin;
      }
    } catch (e) {
      req.admin = { id: decoded.id };
    }

    next();
  } catch (error) {
    // Silently continue if token is invalid for optional auth
    next();
  }
});
