import { pool } from './pg.js';
import { startTimer, elapsed } from '../../core/utils/timings.js';
import { logQuery, logQueryError } from './sql-logger.js';
import { DbError } from '../../core/errors/db-error.js';
import type { QueryResultRow } from 'pg';

export interface QueryOptions {
  name?: string;
  text: string;
  values?: unknown[];
}

export interface QueryResult<T extends QueryResultRow = QueryResultRow> {
  rows: T[];
  rowCount: number;
}

/**
 * Execute a parameterized SQL query with timing, logging, and error wrapping.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  options: QueryOptions,
): Promise<QueryResult<T>> {
  const start = startTimer();

  try {
    const result = await pool.query<T>({
      text: options.text,
      values: options.values,
      name: options.name,
    });

    const durationMs = elapsed(start);

    logQuery({
      queryName: options.name,
      text: options.text,
      durationMs,
      rowCount: result.rowCount ?? 0,
      params: options.values,
    });

    return {
      rows: result.rows,
      rowCount: result.rowCount ?? 0,
    };
  } catch (error) {
    const durationMs = elapsed(start);

    logQueryError(
      { queryName: options.name, durationMs, params: options.values },
      error as Error,
    );

    throw new DbError(
      `Query failed: ${options.name || 'unnamed'}`,
      options.text,
      error as Error,
    );
  }
}
