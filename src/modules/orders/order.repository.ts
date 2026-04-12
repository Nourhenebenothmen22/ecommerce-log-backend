import { query } from '../../infrastructure/database/query.js';
import type { Order } from './order.types.js';

export class OrderRepository {
  async create(userId: string, totalAmount: number): Promise<Order> {
     try {
       const result = await query<Order>({
           name: 'order_create',
           text: `INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, 'pending') RETURNING id, user_id as "userId", total_amount as "totalAmount", status, created_at as "createdAt", updated_at as "updatedAt"`,
           values: [userId, totalAmount]
       });
       return result.rows[0];
     } catch (e) {
         throw e;
     }
  }

  async listForUser(userId: string): Promise<Order[]> {
      try {
          const result = await query<Order>({
              name: 'order_list',
              text: 'SELECT id, user_id as "userId", total_amount as "totalAmount", status, created_at as "createdAt", updated_at as "updatedAt" FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
              values: [userId]
          });
          return result.rows;
      } catch (e) {
          throw e;
      }
  }

  async findById(orderId: string): Promise<Order | undefined> {
    try {
      const result = await query<Order>({
        name: 'order_find_by_id',
        text: 'SELECT id, user_id as "userId", total_amount as "totalAmount", status, created_at as "createdAt", updated_at as "updatedAt" FROM orders WHERE id = $1',
        values: [orderId],
      });
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
}
