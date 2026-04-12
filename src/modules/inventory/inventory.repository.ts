import { query } from '../../infrastructure/database/query.js';

export class InventoryRepository {
  async adjustStock(productId: string, quantity: number): Promise<void> {
     try {
         await query({
             name: 'inventory_adjust_stock',
             text: 'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
             values: [quantity, productId]
         });
     } catch {
         // mock
     }
  }
}
