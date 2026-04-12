import type { Request, Response, NextFunction } from 'express';
import { successLogInstance } from '../core/logger/logger.js';

/**
 * Middleware that logs successful responses (2xx/3xx) to success.log.
 */
export function successLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Use 'finish' instead of 'close' to ensure the response was sent
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      const duration = req.startTime ? performance.now() - req.startTime : undefined;
      
      successLogInstance.info({
        requestId: req.requestId,
        userId: req.user?.id,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: duration ? parseFloat(duration.toFixed(2)) : undefined,
        msg: `Request completed successfully: ${req.method} ${req.originalUrl}`
      });
    }
  });

  next();
}
