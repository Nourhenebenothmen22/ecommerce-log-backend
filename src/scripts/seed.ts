import pg from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5434'),
  database: process.env.DB_NAME || 'ecommerce',
  user: process.env.DB_USER || 'ecommerce_user',
  password: process.env.DB_PASSWORD || 'ecommerce_pass',
});

async function seed() {
  console.log('🚀 Starting database seeding...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Clean existing data
    console.log('🧹 Cleaning existing data...');
    await client.query('TRUNCATE TABLE payments, orders, cart_items, carts, products, categories, users CASCADE');

    // 2. Insert Users
    console.log('👤 Seeding users...');
    const adminId = uuidv4();
    const customerId = uuidv4();

    await client.query(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, role)
      VALUES 
      ($1, 'admin@example.com', '$2b$10$placeholder_hash', 'Admin', 'User', 'admin'),
      ($2, 'user@example.com', '$2b$10$placeholder_hash', 'John', 'Doe', 'customer')
    `, [adminId, customerId]);

    // 3. Insert Categories
    console.log('📂 Seeding categories...');
    const electronicsId = uuidv4();
    const clothingId = uuidv4();

    await client.query(`
      INSERT INTO categories (id, name, slug, description)
      VALUES 
      ($1, 'Electronics', 'electronics', 'Gadgets and devices'),
      ($2, 'Clothing', 'clothing', 'Apparel and accessories')
    `, [electronicsId, clothingId]);

    // 4. Insert Products
    console.log('📦 Seeding products...');
    const laptopId = uuidv4();
    const phoneId = uuidv4();
    const shirtId = uuidv4();

    await client.query(`
      INSERT INTO products (id, category_id, name, description, price, stock_quantity, sku)
      VALUES 
      ($1, $2, 'Pro Laptop', 'High performance laptop', 1299.99, 50, 'LAP-001'),
      ($3, $2, 'Smart Phone', 'Latest generation smart phone', 799.50, 100, 'PHN-001'),
      ($4, $5, 'Cotton T-Shirt', 'Comfortable 100% cotton t-shirt', 19.99, 200, 'CLT-001')
    `, [laptopId, electronicsId, phoneId, shirtId, clothingId]);

    // 5. Insert Cart for Customer
    console.log('🛒 Seeding cart...');
    const cartId = uuidv4();
    await client.query(`
      INSERT INTO carts (id, user_id, status)
      VALUES ($1, $2, 'active')
    `, [cartId, customerId]);

    await client.query(`
      INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition)
      VALUES ($1, $2, 1, 1299.99)
    `, [cartId, laptopId]);

    // 6. Insert an Order for Customer
    console.log('📜 Seeding orders...');
    const orderId = uuidv4();
    await client.query(`
      INSERT INTO orders (id, user_id, total_amount, status)
      VALUES ($1, $2, 799.50, 'completed')
    `, [orderId, customerId]);

    console.log('✅ Seeding completed successfully!');
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
