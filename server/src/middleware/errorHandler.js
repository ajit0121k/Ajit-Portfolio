import ApiError from '../utils/ApiError.js';
import config from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = ApiError.badRequest(message);
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = ApiError.conflict(message);
  }

  // Handle Mongoose cast errors
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = ApiError.badRequest(message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }

  // Default error format
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  if (statusCode === 500) {
    logger.error(`${err.message}\n${err.stack}`);
  } else {
    logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(config.env === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
