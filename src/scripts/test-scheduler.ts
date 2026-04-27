import { databaseSeeder } from '../seeders/database.seeder.js';
import { logSeeder } from '../seeders/log.seeder.js';
import { pool } from '../infrastructure/database/pg.js';

async function testSchedulerTask() {
  console.log('Simulating Daily Scheduler Task...');
  try {
    await databaseSeeder.seed();
    await logSeeder.seed();
    console.log('Scheduler task simulation successful!');
  } catch (error) {
    console.error('Scheduler task simulation failed:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testSchedulerTask();
