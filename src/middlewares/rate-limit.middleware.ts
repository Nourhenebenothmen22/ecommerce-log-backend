import type { Request, Response, NextFunction } from 'express';
import { createRateLimiter } from '../infrastructure/security/rate-limit.js';

const limiter = createRateLimiter();

/**
 * Rate-limit middleware — applies the global rate limiter.
 */
export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  limiter(req, res, next);
}
