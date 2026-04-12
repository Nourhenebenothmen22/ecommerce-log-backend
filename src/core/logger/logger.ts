import pino, { type Logger } from 'pino';
import { loggerConfig, securityLoggerConfig, auditLoggerConfig, httpLoggerConfig } from '../../config/logger.config.js';

/** Root application logger */
export const logger: Logger = pino(loggerConfig);

/** Dedicated loggers */
export const securityLogInstance: Logger = pino(securityLoggerConfig);
export const auditLogInstance: Logger = pino(auditLoggerConfig);
export const httpLogInstance: Logger = pino(httpLoggerConfig);

/** Create a child logger scoped to a module/service */
export function createModuleLogger(module: string): Logger {
  if (module === 'security') return securityLogInstance.child({ module });
  if (module === 'audit') return auditLogInstance.child({ module });
  return logger.child({ module });
}

/** Create a child logger scoped to a request */
export function createRequestLogger(requestId: string, extra?: Record<string, unknown>): Logger {
  return logger.child({ requestId, ...extra });
}
