import type { IncomingMessage, ServerResponse } from 'http';

export const requestSerializer = (req: IncomingMessage & { id?: string }) => ({
  id: req.id,
  method: req.method,
  url: req.url,
  headers: {
    host: req.headers.host,
    'user-agent': req.headers['user-agent'],
    'content-length': req.headers['content-length'],
    'x-forwarded-for': req.headers['x-forwarded-for'],
  },
  remoteAddress: req.socket?.remoteAddress,
});

export const responseSerializer = (res: ServerResponse) => ({
  statusCode: res.statusCode,
  headers: {
    'content-type': res.getHeader('content-type'),
    'content-length': res.getHeader('content-length'),
  },
});

export const errorSerializer = (err: Error & { code?: string; statusCode?: number; isOperational?: boolean }) => ({
  type: err.constructor?.name || 'Error',
  message: err.message,
  code: err.code,
  statusCode: err.statusCode,
  isOperational: err.isOperational,
  stack: err.stack,
});
