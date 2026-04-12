import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors/app-error.js';
import { HTTP_STATUS } from '../core/constants/http-status.js';
import { ERROR_CODES } from '../core/errors/error-codes.js';
import { logger } from '../core/logger/logger.js';
import { appConfig } from '../config/app.config.js';

/**
 * Centralized error-handling middleware.
 * Logs full error details, returns production-safe error responses.
 */
export function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isOperational = err instanceof AppError && err.isOperational;
  const statusCode = err instanceof AppError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const errorCode = err instanceof AppError ? err.code : ERROR_CODES.INTERNAL_ERROR;

  // Build structured error log
  const errorLog = {
    err,
    requestId: req.requestId,
    method: req.method,
    route: req.originalUrl,
    statusCode,
    errorCode,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user?.id,
    isOperational,
  };

  if (isOperational) {
    logger.warn(errorLog, `Operational error: ${err.message}`);
  } else {
    logger.error(errorLog, `Unexpected error: ${err.message}`);
  }

  // Build response — hide internal details in production
  const response: Record<string, unknown> = {
    success: false,
    error: {
      code: errorCode,
      message: isOperational ? err.message : 'An unexpected error occurred',
      ...(err instanceof AppError && err.details ? { details: err.details } : {}),
    },
    meta: { requestId: req.requestId },
  };

  // Include stack trace only in development
  if (appConfig.isDev && err.stack) {
    (response.error as Record<string, unknown>).stack = err.stack;
  }

  res.status(statusCode).json(response);
}
