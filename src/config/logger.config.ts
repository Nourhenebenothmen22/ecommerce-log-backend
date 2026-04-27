import { env } from './env.js';
import { appConfig } from './app.config.js';
import type { LoggerOptions } from 'pino';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function createLoggerConfig(fileName: string): LoggerOptions {
  // If the fileName is not app.log, we redirect it to app.log to avoid creating many files
  // but keep the separation in the log content if needed.
  // Actually, let's just make everything go to app.log or be discarded if it's not app.log
  const effectiveFileName = (fileName === 'sql.log' || fileName === 'apache.log' || fileName === 'app.log') ? fileName : 'app.log';

  const targets: any[] = [{
    target: 'pino/file',
    options: { destination: path.join(logsDir, effectiveFileName), mkdir: true }
  }];

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

export const loggerConfig = createLoggerConfig('app.log');
export const securityLoggerConfig = createLoggerConfig('app.log');
export const auditLoggerConfig = createLoggerConfig('app.log');
export const httpLoggerConfig = createLoggerConfig('app.log');
export const successLoggerConfig = createLoggerConfig('app.log');

