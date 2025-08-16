import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  logger.error('Error occurred:', {
    error: {
      message: error.message,
      stack: error.stack,
      statusCode
    },
    request: {
      method: req.method,
      url: req.path, // Use path instead of full URL to exclude query params
      ip: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 100) // Truncate long user agents
    }
  });

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    },
    timestamp: new Date().toISOString()
  });
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};