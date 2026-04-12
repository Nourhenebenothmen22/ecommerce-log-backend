import { v4 as uuidv4 } from 'uuid';
import { APP_CONSTANTS } from '../constants/app.constants.js';
import type { Request } from 'express';

/**
 * Extract an existing request ID from headers or generate a new one.
 */
export function getRequestId(req: Request): string {
  const existing = req.headers[APP_CONSTANTS.REQUEST_ID_HEADER] as string | undefined;
  return existing || uuidv4();
}
