import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../core/errors/http-error.js';
import { logSecurityEvent } from '../infrastructure/security/security-logger.js';

/**
 * Placeholder auth middleware.
 * In production, replace the token parsing logic with real JWT verification.
 * Attaches a user object to the request if a valid token is present.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logSecurityEvent('unauthorized_access', {
      requestId: req.requestId,
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
    });
    throw HttpError.unauthorized('Missing authorization header');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    logSecurityEvent('malformed_auth_header', {
      requestId: req.requestId,
      ip: req.ip,
      route: req.originalUrl,
    });
    throw HttpError.unauthorized('Malformed authorization header', 'INVALID_TOKEN');
  }

  const token = parts[1];

  // Placeholder: In production, verify JWT here
  // For now, accept any non-empty token and attach a fake user
  if (!token || token.length < 10) {
    logSecurityEvent('invalid_token', {
      requestId: req.requestId,
      ip: req.ip,
      route: req.originalUrl,
    });
    throw HttpError.unauthorized('Invalid or expired token', 'INVALID_TOKEN');
  }

  // Placeholder user — replace with real JWT payload decoding
  req.user = {
    id: token.includes('admin') 
      ? '00000000-0000-0000-0000-000000000001' // Placeholder Admin ID
      : '00000000-0000-0000-0000-000000000002', // Placeholder Customer ID
    email: token.includes('admin') ? 'admin@example.com' : 'user@example.com',
    role: token.includes('admin') ? 'admin' : 'customer',
  };

  req.log.debug({ userId: req.user.id }, 'User authenticated via token');
  next();
}

/**
 * Middleware that requires the user to have an admin role.
 */
export function adminGuard(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    logSecurityEvent('admin_route_denied', {
      requestId: req.requestId,
      userId: req.user?.id,
      ip: req.ip,
      route: req.originalUrl,
    });
    throw HttpError.forbidden('Admin access required');
  }
  next();
}
