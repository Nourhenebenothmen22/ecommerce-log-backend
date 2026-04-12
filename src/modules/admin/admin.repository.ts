import { query } from '../../infrastructure/database/query.js';

export class AdminRepository {
    async updateProductPrice(productId: string, newPrice: number): Promise<void> {
        try {
            await query({
                name: 'admin_update_price',
                text: 'UPDATE products SET price = $1 WHERE id = $2',
                values: [newPrice, productId]
            });
        } catch (e) {
            throw e;
        }
    }

    async refundOrder(orderId: string): Promise<void> {
        try {
            await query({
                name: 'admin_refund_order',
                text: 'UPDATE orders SET status = \'refunded\' WHERE id = $1',
                values: [orderId]
            });
        } catch (e) {
            throw e;
        }
    }

    async changeOrderStatus(orderId: string, status: string): Promise<void> {
        try {
            await query({
                name: 'admin_change_order_status',
                text: 'UPDATE orders SET status = $1 WHERE id = $2',
                values: [status, orderId]
            });
        } catch (e) {
            throw e;
        }
    }
}
