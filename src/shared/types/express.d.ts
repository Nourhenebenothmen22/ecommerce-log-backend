import type { Logger } from 'pino';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      log: Logger;
      startTime: number;
      user?: {
        id: string;
        email: string;
        role: 'customer' | 'admin';
      };
    }
  }
}

export {};
