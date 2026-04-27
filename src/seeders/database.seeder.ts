import { fakeDataService } from '../services/fake-data.service.js';
import { pool } from '../infrastructure/database/pg.js';
import { up as createReviewsTable } from '../infrastructure/database/migrations/001_create_reviews.js';

export class DatabaseSeeder {
  async seed() {
    console.log('Starting Database Seeding...');
    
    // Ensure schema is up to date
    await createReviewsTable();

    // 1. Categories
    const categoryIds = [];
    for (let i = 0; i < 10; i++) {
      categoryIds.push(await fakeDataService.generateCategory());
    }

    // 2. Products
    const products = [];
    for (const catId of categoryIds) {
      if (catId) {
        for (let j = 0; j < 20; j++) {
          const productId = await fakeDataService.generateProduct(catId);
          if (productId) {
            const prodRes = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
            products.push(prodRes.rows[0]);
          }
        }
      }
    }

    // 3. Users (Admins and Customers)
    for (let i = 0; i < 3; i++) {
      await fakeDataService.generateUser('admin');
    }
    const customerIds = [];
    for (let i = 0; i < 50; i++) {
      customerIds.push(await fakeDataService.generateUser('customer'));
    }

    // 4. Orders and Payments
    for (const userId of customerIds) {
      if (userId) {
        const orderCount = faker.number.int({ min: 1, max: 5 });
        for (let k = 0; k < orderCount; k++) {
          const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, faker.number.int({ min: 1, max: 4 }));
          await fakeDataService.generateOrder(userId, randomProducts);
        }
      }
    }

    console.log('Database Seeding Completed!');
  }
}

export const databaseSeeder = new DatabaseSeeder();
