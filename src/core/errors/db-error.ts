import { AppError } from './app-error.js';
import { ERROR_CODES } from './error-codes.js';

export class DbError extends AppError {
  public readonly query?: string;

  constructor(message: string, query?: string, cause?: Error) {
    super(message, ERROR_CODES.DB_QUERY_ERROR, 500, true);
    this.name = 'DbError';
    this.query = query;
    if (cause) {
      this.cause = cause;
    }
  }

  static connectionError(message: string = 'Database connection failed', cause?: Error) {
    const err = new DbError(message, undefined, cause);
    (err as { code: string }).code = ERROR_CODES.DB_CONNECTION_ERROR;
    return err;
  }

  static transactionError(message: string = 'Transaction failed', cause?: Error) {
    const err = new DbError(message, undefined, cause);
    (err as { code: string }).code = ERROR_CODES.DB_TRANSACTION_ERROR;
    return err;
  }
}
