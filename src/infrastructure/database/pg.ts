import pg from 'pg';
import { dbConfig } from '../../config/db.config.js';
import { createModuleLogger } from '../../core/logger/logger.js';
import { DbError } from '../../core/errors/db-error.js';
import { monitorPool } from './database-monitor.js';


const dbLogger = createModuleLogger('database');

const pool = new pg.Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  min: dbConfig.min,
  max: dbConfig.max,
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,
  connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
});

/** Attach pool event monitors */
monitorPool(pool);

dbLogger.info('PostgreSQL pool initialized');

/**
 * Test database connectivity on startup.
 */
export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    dbLogger.info('Database connectivity check successful');
  } catch (error) {
    dbLogger.fatal({ err: error }, 'Database connectivity check FAILED');
    throw DbError.connectionError('Cannot connect to PostgreSQL', error as Error);
  }
}

export { pool };
