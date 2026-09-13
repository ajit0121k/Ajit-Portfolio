import rateLimit from 'express-rate-limit';
import ApiError from '../utils/ApiError.js';
import config from '../config/env.js';

const isDev = config.env === 'development';

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max: isDev ? max * 50 : max, // Generous multiplier for local development
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(ApiError.tooManyRequests(message));
    },
  });
};

// 100 requests per 15 minutes for general API endpoints
export const globalLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP, please try again after 15 minutes'
);

// 5 requests per 15 minutes for auth routes
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many authentication attempts, please try again after 15 minutes'
);

// 3 requests per 15 minutes for contact form
export const contactLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many contact requests sent, please try again after 15 minutes'
);

// 20 requests per 15 minutes for uploads
export const uploadLimiter = createLimiter(
  15 * 60 * 1000,
  50,
  'Too many upload requests, please try again after 15 minutes'
);
