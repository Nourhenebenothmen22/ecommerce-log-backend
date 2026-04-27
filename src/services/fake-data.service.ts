import { faker } from '@faker-js/faker';
import { logService, LogLevel } from './log.service.js';
import { pool } from '../infrastructure/database/pg.js';

export class FakeDataService {
  /**
   * Generate a random user
   */
  async generateUser(role: 'customer' | 'admin' = 'customer') {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const passwordHash = '$2b$10$YourHashedPasswordHere'; // Mock hash

    try {
      const res = await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [email, passwordHash, firstName, lastName, role]
      );
      const userId = res.rows[0].id;

      logService.logSql(LogLevel.INFO, 'INSERT INTO users', `email=${email} role=${role}`, 'success', userId);
      logService.logApp(LogLevel.INFO, role === 'admin' ? 'création admin' : 'inscription utilisateur', 'success', userId, `email=${email}`);
      
      return userId;
    } catch (error) {
      logService.logSql(LogLevel.ERROR, 'INSERT INTO users', `email=${email}`, 'failed', undefined, (error as Error).message);
      return null;
    }
  }

  /**
   * Generate random products
   */
  async generateProduct(categoryId: string) {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = parseFloat(faker.commerce.price());
    const stock = faker.number.int({ min: 10, max: 100 });
    const sku = faker.string.alphanumeric(10).toUpperCase();

    try {
      const res = await pool.query(
        'INSERT INTO products (category_id, name, description, price, stock_quantity, sku) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [categoryId, name, description, price, stock, sku]
      );
      const productId = res.rows[0].id;

      logService.logSql(LogLevel.INFO, 'INSERT INTO products', `sku=${sku} price=${price}`, 'success');
      logService.logApp(LogLevel.INFO, 'ajout produit admin', 'success', undefined, `product_id=${productId} sku=${sku}`);
      
      return productId;
    } catch (error) {
      logService.logSql(LogLevel.ERROR, 'INSERT INTO products', `name=${name}`, 'failed', undefined, (error as Error).message);
      return null;
    }
  }

  /**
   * Generate categories
   */
  async generateCategory() {
    const name = faker.commerce.department();
    const slug = faker.helpers.slugify(name).toLowerCase();
    
    try {
      const res = await pool.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET updated_at = NOW() RETURNING id',
        [name, slug]
      );
      return res.rows[0].id;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate orders and payments
   */
  async generateOrder(userId: string, products: any[]) {
    const totalAmount = products.reduce((sum, p) => sum + parseFloat(p.price), 0);
    
    try {
      // 1. Create order
      const orderRes = await pool.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
        [userId, totalAmount, 'paid']
      );
      const orderId = orderRes.rows[0].id;
      logService.logSql(LogLevel.INFO, 'INSERT INTO orders', `user_id=${userId} total=${totalAmount}`, 'success', userId);
      logService.logApp(LogLevel.INFO, 'création commande', 'success', userId, `order_id=${orderId} amount=${totalAmount}`);

      // 2. Create payment
      await pool.query(
        'INSERT INTO payments (order_id, amount, status, provider_transaction_id) VALUES ($1, $2, $3, $4)',
        [orderId, totalAmount, 'completed', faker.string.uuid()]
      );
      logService.logSql(LogLevel.INFO, 'INSERT INTO payments', `order_id=${orderId} amount=${totalAmount}`, 'success', userId);
      logService.logApp(LogLevel.INFO, 'paiement réussi', 'success', userId, `order_id=${orderId} amount=${totalAmount}`);

      return orderId;
    } catch (error) {
      logService.logApp(LogLevel.ERROR, 'paiement échoué', 'failed', userId, `reason="database error"`);
      return null;
    }
  }
}

export const fakeDataService = new FakeDataService();
