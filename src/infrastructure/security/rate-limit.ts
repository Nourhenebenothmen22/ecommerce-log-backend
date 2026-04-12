import rateLimit from 'express-rate-limit';
import { env } from '../../config/env.js';
import { logSecurityEvent } from './security-logger.js';
import { HTTP_STATUS } from '../../core/constants/http-status.js';
import { ERROR_CODES } from '../../core/errors/error-codes.js';
import type { Request, Response } from 'express';

/**
 * Create a rate-limit middleware configured from environment.
 */
export function createRateLimiter() {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logSecurityEvent('rate_limit_exceeded', {
        ip: req.ip,
        route: req.originalUrl,
        method: req.method,
        requestId: req.requestId,
      });

      res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        error: {
          code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
          message: 'Too many requests, please try again later',
        },
      });
    },
    keyGenerator: (req: Request) => {
      return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
    },
  });
}
