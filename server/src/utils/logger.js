import config from '../config/env.js';

const colors = {
  info: '\x1b[36m', // Cyan
  warn: '\x1b[33m', // Yellow
  error: '\x1b[31m', // Red
  debug: '\x1b[35m', // Magenta
  reset: '\x1b[0m',
};

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `${colors[level]}[${timestamp}] [${level.toUpperCase()}]: ${message}${colors.reset}`;
};

const logger = {
  info: (message) => console.log(formatMessage('info', message)),
  warn: (message) => console.warn(formatMessage('warn', message)),
  error: (message) => console.error(formatMessage('error', message)),
  debug: (message) => {
    if (config.env !== 'production') {
      console.debug(formatMessage('debug', message));
    }
  },
};

export default logger;
