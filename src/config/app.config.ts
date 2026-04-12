import { env } from './env.js';

export const appConfig = {
  name: env.APP_NAME,
  port: env.PORT,
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
} as const;
