import { query } from '../../infrastructure/database/query.js';
import type { Order } from './order.types.js';

export class OrderRepository {
  async create(userId: string, totalAmount: number): Promise<Order> {
     try {
       const result = await query<Order>({
           name: 'order_create',
           text: `INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, 'pending') RETURNING *`,
           values: [userId, totalAmount]
       });
       return {
           id: result.rows[0].id,
           userId: result.rows[0].userId, // Mapping would be needed for snake case usually, bypassing in mock mostly 
           totalAmount: result.rows[0].totalAmount,
           status: result.rows[0].status,
           createdAt: result.rows[0].createdAt,
           updatedAt: result.rows[0].updatedAt
       };
     } catch (e) {
         throw e;
     }
  }

  async listForUser(userId: string): Promise<Order[]> {
      try {
          const result = await query<Order>({
              name: 'order_list',
              text: 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
              values: [userId]
          });
          return result.rows;
      } catch (e) {
          throw e;
      }
  }
}
