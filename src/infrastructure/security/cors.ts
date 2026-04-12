import cors from 'cors';
import { env } from '../../config/env.js';

/**
 * Create CORS middleware configured from environment.
 */
export function createCorsMiddleware() {
  return cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    exposedHeaders: ['x-request-id'],
    credentials: true,
    maxAge: 86400,
  });
}
