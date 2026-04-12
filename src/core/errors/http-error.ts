import { AppError } from './app-error.js';
import type { ErrorCode } from './error-codes.js';

export class HttpError extends AppError {
  constructor(statusCode: number, message: string, code: ErrorCode, details?: unknown) {
    super(message, code, statusCode, true, details);
    this.name = 'HttpError';
  }

  static badRequest(message: string, code: ErrorCode = 'BAD_REQUEST', details?: unknown) {
    return new HttpError(400, message, code, details);
  }

  static unauthorized(message: string = 'Unauthorized', code: ErrorCode = 'UNAUTHORIZED') {
    return new HttpError(401, message, code);
  }

  static forbidden(message: string = 'Forbidden', code: ErrorCode = 'FORBIDDEN') {
    return new HttpError(403, message, code);
  }

  static notFound(message: string = 'Resource not found', code: ErrorCode = 'NOT_FOUND') {
    return new HttpError(404, message, code);
  }

  static tooManyRequests(message: string = 'Too many requests', code: ErrorCode = 'RATE_LIMIT_EXCEEDED') {
    return new HttpError(429, message, code);
  }

  static internal(message: string = 'Internal server error', code: ErrorCode = 'INTERNAL_ERROR') {
    return new HttpError(500, message, code);
  }
}
