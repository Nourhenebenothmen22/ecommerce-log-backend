import { databaseSeeder } from '../seeders/database.seeder.js';
import { logSeeder } from '../seeders/log.seeder.js';
import { pool } from '../infrastructure/database/pg.js';

async function main() {
  try {
    await databaseSeeder.seed();
    await logSeeder.seed();
    console.log('Manual seeding completed successfully!');
  } catch (error) {
    console.error('Error during manual seeding:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

main();
