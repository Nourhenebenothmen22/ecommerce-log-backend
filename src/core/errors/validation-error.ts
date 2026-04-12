import { AppError } from './app-error.js';
import { ERROR_CODES } from './error-codes.js';
import type { ZodError } from 'zod';

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400, true, details);
    this.name = 'ValidationError';
  }

  static fromZodError(error: ZodError) {
    const details = error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return new ValidationError('Request validation failed', details);
  }
}
