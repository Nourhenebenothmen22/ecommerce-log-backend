import { Request, Response, NextFunction } from 'express';
import { logService } from '../services/log.service.js';

export const apacheLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const ip = req.ip || req.socket.remoteAddress || '-';
  const method = req.method;
  const url = req.originalUrl || req.url;
  const userAgent = req.headers['user-agent'] || '-';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    logService.logApache(ip as string, method, url, statusCode, userAgent, duration);
  });

  next();
};
