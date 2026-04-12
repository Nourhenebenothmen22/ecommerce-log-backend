import { query } from '../../infrastructure/database/query.js';
import { withTransaction, txQuery } from '../../infrastructure/database/transaction.js';
import type { Cart } from './cart.types.js';

export class CartRepository {
  async getActiveCartForUser(userId: string): Promise<Cart | undefined> {
        try {
            const result = await query<Cart>({
                name: 'cart_find_active',
                text: 'SELECT * FROM carts WHERE user_id = $1 AND status = \'active\'',
                values: [userId],
            });
            return result.rows[0];
        } catch (e) {
            throw e;
        }
  }

  async addItem(userId: string, productId: string, quantity: number, currentPrice: number): Promise<void> {
    await withTransaction(async (client: import('pg').PoolClient) => {
      // 1. Get or create active cart
      let cartResult = await txQuery<Cart>(client, {
        name: 'tx_get_cart',
        text: 'SELECT * FROM carts WHERE user_id = $1 AND status = \'active\'',
        values: [userId],
      });

      let cartId;
      if (cartResult.rowCount === 0) {
        cartResult = await txQuery<Cart>(client, {
          name: 'tx_create_cart',
          text: 'INSERT INTO carts (user_id, status) VALUES ($1, \'active\') RETURNING *',
          values: [userId],
        });
      }
      cartId = cartResult.rows[0].id;

      // 2. Upsert cart item
      await txQuery(client, {
        name: 'tx_upsert_cart_item',
        text: `
          INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) 
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (cart_id, product_id) 
          DO UPDATE SET quantity = cart_items.quantity + $3, price_at_addition = $4
        `,
        values: [cartId, productId, quantity, currentPrice],
      });
    }).catch((e: any) => {
        throw e;
    });
  }

  async checkoutCart(userId: string): Promise<void> {
      try {
        await query({
            name: 'cart_checkout',
            text: 'UPDATE carts SET status = \'checked_out\' WHERE user_id = $1 AND status = \'active\'',
            values: [userId],
        });
      } catch (e) {
          throw e;
      }
  }
}
