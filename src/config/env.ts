import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  APP_NAME: z.string().default('ecommerce-api'),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  SLOW_QUERY_THRESHOLD_MS: z.coerce.number().default(500),

  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('ecommerce'),
  DB_USER: z.string().default('ecommerce_user'),
  DB_PASSWORD: z.string().default('ecommerce_pass'),
  DB_POOL_MIN: z.coerce.number().default(2),
  DB_POOL_MAX: z.coerce.number().default(10),

  CORS_ORIGIN: z.string().default('*'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  JWT_SECRET: z.string().default('change-me-in-production'),
  JWT_EXPIRES_IN: z.string().default('1h'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.format();
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', JSON.stringify(formatted, null, 2));
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
