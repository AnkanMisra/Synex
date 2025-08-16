import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logLevel = process.env.LOG_LEVEL || 'info';

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', '..', 'logs');
try {
  fs.mkdirSync(logsDir, { recursive: true });
} catch (error) {
  console.warn('Failed to create logs directory:', error);
}

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'synex-backend' },
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logsDir, 'combined.log') })
  ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}
