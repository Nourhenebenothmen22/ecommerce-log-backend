import { env } from './env.js';

export const dbConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  min: env.DB_POOL_MIN,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  slowQueryThresholdMs: env.SLOW_QUERY_THRESHOLD_MS,
} as const;
