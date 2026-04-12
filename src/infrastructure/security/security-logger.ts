import { createModuleLogger } from '../../core/logger/logger.js';

const securityLogger = createModuleLogger('security');

export type SecurityEventType =
  | 'unauthorized_access'
  | 'forbidden_access'
  | 'invalid_token'
  | 'malformed_auth_header'
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'repeated_login_failures'
  | 'admin_route_denied';

/**
 * Log a security event with structured metadata.
 */
export function logSecurityEvent(event: SecurityEventType, context: Record<string, unknown> = {}): void {
  securityLogger.warn({ securityEvent: event, ...context }, `Security event: ${event}`);
}

/**
 * Log a critical security event.
 */
export function logSecurityAlert(event: SecurityEventType, context: Record<string, unknown> = {}): void {
  securityLogger.error({ securityEvent: event, ...context }, `Security ALERT: ${event}`);
}
