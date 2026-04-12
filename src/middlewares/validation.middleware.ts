import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../core/errors/validation-error.js';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Creates a reusable validation middleware for the given Zod schema.
 * Validates the specified request target (body, query, or params).
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);
      // Replace the target with the parsed (and potentially transformed) data
      Object.assign(req[target], parsed);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        req.log.warn(
          { validationErrors: error.errors, target },
          'Request validation failed',
        );
        next(ValidationError.fromZodError(error));
      } else {
        next(error);
      }
    }
  };
}
