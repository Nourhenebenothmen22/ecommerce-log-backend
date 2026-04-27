import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './core/logger/logger.js';
import { testConnection, pool } from './infrastructure/database/pg.js';
import { dailyLogScheduler } from './schedulers/daily-log.scheduler.js';

const PORT = env.PORT;

async function bootstrap() {
  logger.info('Starting server boot sequence...');

  try {
    await testConnection();
    
    // Start the daily log scheduler
    dailyLogScheduler.start();

    const server = app.listen(PORT, () => {
      logger.info(`Server startup success on port ${PORT} [${env.NODE_ENV}]`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info({ signal }, `Graceful shutdown start (${signal} received)`);
      
      server.close(async (err) => {
        if (err) {
            logger.error({ err }, 'Error closing Express server');
        } else {
            logger.info('Express HTTP server closed');
        }

        try {
            await pool.end();
            logger.info('PostgreSQL pool closed');
        } catch (dbErr) {
            logger.error({ err: dbErr }, 'Error closing PostgreSQL pool');
        }

        logger.info('Shutdown completion');
        process.exit(err ? 1 : 0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.fatal({ err: error }, 'App startup failure');
    process.exit(1);
  }
}

// Uncaught exceptions mapping
process.on('uncaughtException', (err: Error) => {
  logger.fatal({ err }, 'uncaughtException - terminating process');
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal({ err: reason instanceof Error ? reason : new Error(String(reason)) }, 'unhandledRejection - terminating process');
  process.exit(1);
});

// Actually start the application
void bootstrap();
