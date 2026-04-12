import { pinoHttp } from 'pino-http';
import { httpLogInstance } from '../../core/logger/logger.js';
import { APP_CONSTANTS } from '../../core/constants/app.constants.js';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Create a pino-http middleware instance for structured HTTP request/response logging.
 */
export function createHttpLogger() {
  return pinoHttp({
    logger: httpLogInstance,
    genReqId: (req: IncomingMessage) => {
      return (req.headers[APP_CONSTANTS.REQUEST_ID_HEADER] as string) || '';
    },
    customLogLevel: (_req: IncomingMessage, res: ServerResponse, err?: Error) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req: IncomingMessage, res: ServerResponse, responseTime: number) => {
      return `${req.method} ${req.url} completed ${res.statusCode} in ${Math.round(responseTime)}ms`;
    },
    customErrorMessage: (req: IncomingMessage, _res: ServerResponse, err: Error) => {
      return `${req.method} ${req.url} errored: ${err.message}`;
    },
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'durationMs',
    },
    serializers: {
      req: (req: any) => ({
        method: req.method,
        url: req.url,
        headers: {
          host: req.headers.host,
          'user-agent': req.headers['user-agent'],
          'content-length': req.headers['content-length'],
          'x-forwarded-for': req.headers['x-forwarded-for'],
        },
        remoteAddress: req.remoteAddress,
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
      }),
    },
  });
}
