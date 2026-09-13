import app from './app.js';
import { connectDB } from './config/db.js';
import config from './config/env.js';
import logger from './utils/logger.js';
import mongoose from 'mongoose';

let server;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start Express server
    server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! 💥 Shutting down...\n${err.stack}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! 💥 Shutting down...\n${err.stack}`);
  process.exit(1);
});

// Handle SIGTERM and SIGINT for graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal. Closing HTTP server...');
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await mongoose.connection.close();
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server; // For testing
