import { createModuleLogger } from '../../core/logger/logger.js';
import { dbConfig } from '../../config/db.config.js';
import { sanitizeParams } from '../../core/utils/safe-json.js';
import { logService, LogLevel } from '../../services/log.service.js';

const sqlLogger = createModuleLogger('sql');

export interface SqlLogEntry {
  queryName?: string;
  text?: string;
  durationMs: number;
  rowCount?: number;
  params?: unknown[];
  userId?: string; // Added userId for better logging
}

/**
 * Log a successful SQL query execution.
 */
export function logQuery(entry: SqlLogEntry): void {
  const isSlow = entry.durationMs >= dbConfig.slowQueryThresholdMs;
  const logData = {
    queryName: entry.queryName,
    durationMs: entry.durationMs,
    rowCount: entry.rowCount,
    params: sanitizeParams(entry.params),
    slow: isSlow || undefined,
  };

  if (isSlow) {
    sqlLogger.warn(logData, `Slow query detected: ${entry.queryName || 'unnamed'}`);
    logService.logSql(LogLevel.WARNING, entry.queryName || 'unnamed', `duration=${entry.durationMs}ms`, 'success', entry.userId);
  } else {
    sqlLogger.debug(logData, `Query executed: ${entry.queryName || 'unnamed'}`);
    logService.logSql(LogLevel.INFO, entry.queryName || 'unnamed', `duration=${entry.durationMs}ms`, 'success', entry.userId);
  }
}

/**
 * Log a failed SQL query.
 */
export function logQueryError(entry: Omit<SqlLogEntry, 'rowCount'>, error: Error): void {
  sqlLogger.error(
    {
      queryName: entry.queryName,
      durationMs: entry.durationMs,
      params: sanitizeParams(entry.params),
      err: error,
    },
    `Query failed: ${entry.queryName || 'unnamed'}`,
  );
  logService.logSql(LogLevel.ERROR, entry.queryName || 'unnamed', `duration=${entry.durationMs}ms`, 'failed', entry.userId, error.message);
}

/**
 * Log a transaction lifecycle event.
 */
export function logTransaction(action: 'BEGIN' | 'COMMIT' | 'ROLLBACK', durationMs?: number): void {
  sqlLogger.debug({ action, durationMs }, `Transaction ${action}`);
}
