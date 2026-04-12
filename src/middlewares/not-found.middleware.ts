import type { Request, Response } from 'express';
import { HTTP_STATUS } from '../core/constants/http-status.js';
import { ERROR_CODES } from '../core/errors/error-codes.js';
import { logger } from '../core/logger/logger.js';

/**
 * Catch-all middleware for unmatched routes. Must be registered after all route handlers.
 */
export function notFoundMiddleware(req: Request, res: Response): void {
  logger.warn(
    {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
    `Route not found: ${req.method} ${req.originalUrl}`,
  );

  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
    meta: { requestId: req.requestId },
  });
}
