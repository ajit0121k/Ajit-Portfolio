import mongoose from 'mongoose';
import config from './env.js';
import logger from '../utils/logger.js';

let retryCount = 0;
const maxRetries = 3;
const retryDelay = 5000;

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

/**
 * Connect to MongoDB with retry logic
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    retryCount = 0; // Reset on success
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`);
    if (retryCount < maxRetries) {
      retryCount++;
      logger.info(`Retrying connection in ${retryDelay / 1000}s... (Attempt ${retryCount}/${maxRetries})`);
      setTimeout(connectDB, retryDelay);
    } else {
      logger.error('Max connection retries reached. Exiting...');
      process.exit(1);
    }
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});
