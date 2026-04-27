import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.resolve(__dirname, '../../logs');

export const LOGGING_CONFIG = {
  DIR: LOG_DIR,
  SQL_LOG: path.join(LOG_DIR, 'sql.log'),
  APACHE_LOG: path.join(LOG_DIR, 'apache.log'),
  APP_LOG: path.join(LOG_DIR, 'app.log'),
};

/**
 * Ensure log directory and files exist.
 */
export function ensureLogStorage() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  const files = [LOGGING_CONFIG.SQL_LOG, LOGGING_CONFIG.APACHE_LOG, LOGGING_CONFIG.APP_LOG];
  files.forEach(file => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '', { flag: 'a' });
    }
  });
}
