import type { Request, Response, NextFunction } from 'express';
import { getRequestId } from '../core/utils/request-id.js';
import { createRequestLogger } from '../core/logger/logger.js';
import { APP_CONSTANTS } from '../core/constants/app.constants.js';

/**
 * Injects requestId, startTime, and a request-scoped logger onto each request.
 */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = getRequestId(req);

  req.requestId = requestId;
  req.startTime = performance.now();
  req.log = createRequestLogger(requestId, {
    method: req.method,
    url: req.originalUrl,
  });

  // Echo the requestId back in the response header
  res.setHeader(APP_CONSTANTS.REQUEST_ID_HEADER, requestId);

  next();
}
