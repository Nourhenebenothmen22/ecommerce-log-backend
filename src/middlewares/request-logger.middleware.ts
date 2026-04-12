import { createHttpLogger } from '../infrastructure/http/http-logger.js';

/**
 * pino-http based request/response logger middleware.
 * Emits structured logs for every HTTP request with duration, status, and metadata.
 */
export const requestLoggerMiddleware = createHttpLogger();
