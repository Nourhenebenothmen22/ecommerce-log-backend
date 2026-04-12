import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../core/errors/http-error.js';
import { logSecurityEvent } from '../infrastructure/security/security-logger.js';
import { env } from '../config/env.js';

interface JwtPayload {
  sub: string;
  email: string;
  role: 'customer' | 'admin';
}

/**
 * Enhanced authentication middleware.
 * Checks for JWT in cookies first, then falls back to Authorization header.
 * Verifies the token and attaches the user payload to the request.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Try to get token from cookies
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } 
  // 2. Fallback to Authorization header
  else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logSecurityEvent('unauthorized_access', {
      requestId: req.requestId,
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
    });
    throw HttpError.unauthorized('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    req.log.debug({ userId: req.user.id, role: req.user.role }, 'User authenticated');
    next();
  } catch (error) {
    logSecurityEvent('invalid_token', {
      requestId: req.requestId,
      ip: req.ip,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw HttpError.unauthorized('Invalid or expired token', 'INVALID_TOKEN');
  }
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
