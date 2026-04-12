import { query } from '../../infrastructure/database/query.js';
import type { Payment } from './payment.types.js';

export class PaymentRepository {
  async recordPayment(orderId: string, amount: number, status: Payment['status']): Promise<Payment> {
      try {
        const result = await query<Payment>({
            name: 'payment_record',
            text: 'INSERT INTO payments (order_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
            values: [orderId, amount, status]
        });
        return result.rows[0];
      } catch (e) {
          throw e;
      }
  }
}
