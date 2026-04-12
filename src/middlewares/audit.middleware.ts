import type { Request } from 'express';
import { createModuleLogger } from '../core/logger/logger.js';

const auditLogger = createModuleLogger('audit');

export interface AuditEntry {
  action: string;
  resource: string;
  resourceId?: string;
  userId: string;
  details?: Record<string, unknown>;
  requestId?: string;
  ip?: string;
}

/**
 * Log an audit event for critical business or admin actions.
 */
export function logAuditEvent(entry: AuditEntry): void {
  auditLogger.info(
    {
      auditAction: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      userId: entry.userId,
      details: entry.details,
      requestId: entry.requestId,
      ip: entry.ip,
    },
    `AUDIT: ${entry.action} on ${entry.resource}${entry.resourceId ? ` (${entry.resourceId})` : ''}`,
  );
}

/**
 * Helper to build an audit entry from a request context.
 */
export function buildAuditEntry(
  req: Request,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>,
): AuditEntry {
  return {
    action,
    resource,
    resourceId,
    userId: req.user?.id || 'anonymous',
    details,
    requestId: req.requestId,
    ip: req.ip,
  };
}
