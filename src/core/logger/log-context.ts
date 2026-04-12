import type { Request } from 'express';

export interface LogContext {
  requestId?: string;
  userId?: string;
  module?: string;
  service?: string;
  method?: string;
  route?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export function extractLogContext(req: Request): LogContext {
  return {
    requestId: req.requestId,
    userId: req.user?.id,
    method: req.method,
    route: req.originalUrl,
    ip: req.ip || (req.headers['x-forwarded-for'] as string),
    userAgent: req.headers['user-agent'],
  };
}
