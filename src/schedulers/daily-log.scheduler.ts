import cron from 'node-cron';
import { databaseSeeder } from '../seeders/database.seeder.js';
import { logSeeder } from '../seeders/log.seeder.js';

export class DailyLogScheduler {
  start() {
    console.log('Daily Log Scheduler initialized.');

    // Run every day at midnight (0 0 * * *)
    // For testing purposes, we could run it more frequently, but let's stick to the requirement.
    cron.schedule('0 0 * * *', async () => {
      console.log('Running daily scheduled seeding task...');
      try {
        await databaseSeeder.seed();
        await logSeeder.seed();
        console.log('Daily scheduled task completed successfully.');
      } catch (error) {
        console.error('Error in daily scheduled task:', error);
      }
    });
  }
}

export const dailyLogScheduler = new DailyLogScheduler();
