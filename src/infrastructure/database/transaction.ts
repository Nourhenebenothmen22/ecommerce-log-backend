import { pool } from './pg.js';
import { startTimer, elapsed } from '../../core/utils/timings.js';
import { logTransaction } from './sql-logger.js';
import { DbError } from '../../core/errors/db-error.js';
import type { PoolClient, QueryResultRow } from 'pg';

export interface TransactionQueryOptions {
  text: string;
  values?: unknown[];
  name?: string;
}

/**
 * Execute a callback inside a database transaction.
 * Automatically handles BEGIN, COMMIT, and ROLLBACK with logging.
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  const start = startTimer();

  try {
    await client.query('BEGIN');
    logTransaction('BEGIN');

    const result = await callback(client);

    await client.query('COMMIT');
    logTransaction('COMMIT', elapsed(start));

    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logTransaction('ROLLBACK', elapsed(start));

    throw DbError.transactionError('Transaction rolled back', error as Error);
  } finally {
    client.release();
  }
}

/**
 * Execute a query within a transaction client context.
 */
export async function txQuery<T extends QueryResultRow = QueryResultRow>(
  client: PoolClient,
  options: TransactionQueryOptions,
): Promise<{ rows: T[]; rowCount: number }> {
  const result = await client.query<T>({
    text: options.text,
    values: options.values,
    name: options.name,
  });
  return { rows: result.rows, rowCount: result.rowCount ?? 0 };
}
