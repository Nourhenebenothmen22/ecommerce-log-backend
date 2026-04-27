import fs from 'fs';
import { LOGGING_CONFIG, ensureLogStorage } from '../config/logging.config.js';

export enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export class LogService {
  constructor() {
    ensureLogStorage();
  }

  private formatMessage(type: string, level: LogLevel, message: string): string {
    const now = new Date();
    const dateStr = now.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    // Ensure format is YYYY-MM-DD HH:mm:ss
    // toISOString gives YYYY-MM-DDTHH:mm:ss.sssZ, so we replace T and slice
    const formattedDate = dateStr; 
    return `[${formattedDate}] ${type} ${level}: ${message}\n`;
  }

  private append(filePath: string, content: string) {
    try {
      fs.appendFileSync(filePath, content, 'utf8');
    } catch (error) {
      console.error(`Failed to write to log file: ${filePath}`, error);
    }
  }

  /**
   * Log SQL actions
   */
  logSql(
    level: LogLevel,
    action: string,
    querySummary: string,
    status: 'success' | 'failed',
    userId?: string,
    errorMessage?: string
  ) {
    const userPart = userId ? `user_id=${userId} ` : '';
    const errorPart = errorMessage ? `error="${errorMessage}"` : '';
    const message = `${action} ${userPart}${querySummary} status=${status} ${errorPart}`.trim();
    this.append(LOGGING_CONFIG.SQL_LOG, this.formatMessage('SQL', level, message));
  }

  /**
   * Log HTTP requests (Apache style)
   */
  logApache(
    ip: string,
    method: string,
    url: string,
    code: number,
    userAgent: string,
    responseTimeMs: number
  ) {
    const now = new Date();
    const dateStr = now.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const message = `${ip} ${method} ${url} ${code} "${userAgent}" response_time=${responseTimeMs}ms\n`;
    const formattedEntry = `[${dateStr}] APACHE: ${message}`;
    this.append(LOGGING_CONFIG.APACHE_LOG, formattedEntry);
  }

  /**
   * Log Application actions
   */
  logApp(
    level: LogLevel,
    action: string,
    status: 'success' | 'failed',
    userId?: string,
    details?: string,
    reason?: string
  ) {
    const userPart = userId ? `user_id=${userId} ` : '';
    const statusPart = `status=${status}`;
    const reasonPart = reason ? ` reason="${reason}"` : '';
    const detailsPart = details ? ` ${details}` : '';
    
    // Format: action user_id=... details... status=... reason=...
    const message = `${action} ${userPart}${detailsPart.trim()} ${statusPart}${reasonPart}`.trim();
    this.append(LOGGING_CONFIG.APP_LOG, this.formatMessage('APP', level, message));
  }
}

export const logService = new LogService();
