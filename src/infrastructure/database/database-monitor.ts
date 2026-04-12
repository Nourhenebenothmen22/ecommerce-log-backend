import type { Pool } from 'pg';
import { createModuleLogger } from '../../core/logger/logger.js';

const dbLogger = createModuleLogger('db-monitor');

/**
 * Attach event listeners to the pg Pool for operational logging.
 */
export function monitorPool(pool: Pool): void {
  pool.on('connect', () => {
    dbLogger.debug('Pool: new client connected');
  });

  pool.on('acquire', () => {
    dbLogger.trace('Pool: client acquired');
  });

  pool.on('release', () => {
    dbLogger.trace('Pool: client released');
  });

  pool.on('remove', () => {
    dbLogger.debug('Pool: client removed');
  });

  pool.on('error', (err: Error) => {
    dbLogger.error({ err }, 'Pool: idle client error');
  });
}
