import { env } from './env.js';
import { appConfig } from './app.config.js';
import type { LoggerOptions } from 'pino';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function createLoggerConfig(): LoggerOptions {
  const targets: any[] = [];

  // Always output to console via pino-pretty in development
  if (appConfig.isDev) {
    targets.push({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
      } as any
    });
  }

  return {
    name: appConfig.name,
    level: env.LOG_LEVEL,
    transport: { targets },
    serializers: {
      err: (err: Error & { code?: string; statusCode?: number }) => ({
        type: err.constructor?.name || 'Error',
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        stack: appConfig.isDev ? err.stack : undefined,
      }),
    },
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token', '*.secret'],
      censor: '[REDACTED]',
    },
  };
}

export const loggerConfig = createLoggerConfig();
export const securityLoggerConfig = createLoggerConfig();
export const auditLoggerConfig = createLoggerConfig();
export const httpLoggerConfig = createLoggerConfig();
export const successLoggerConfig = createLoggerConfig();

