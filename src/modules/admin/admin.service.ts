import type { Request } from 'express';
import { AdminRepository } from './admin.repository.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { logAuditEvent, buildAuditEntry } from '../../middlewares/audit.middleware.js';

export class AdminService {
  private repository = new AdminRepository();
  private inventoryService = new InventoryService();

  async updatePrice(req: Request, productId: string, newPrice: number) {
      await this.repository.updateProductPrice(productId, newPrice);
      
      logAuditEvent(buildAuditEntry(req, 'admin_updates_price', 'product', productId, { newPrice }));
      return { success: true, message: 'Price updated' };
  }

  async manualStockAdjustment(req: Request, productId: string, change: number, reason: string) {
      await this.inventoryService.adjustStock({
          productId,
          quantityChange: change,
          reason,
          adjustedBy: req.user!.id
      });

      logAuditEvent(buildAuditEntry(req, 'admin_changes_stock_manually', 'inventory', productId, { change, reason }));
      return { success: true, message: 'Stock adjusted' };
  }

  async refundOrder(req: Request, orderId: string) {
      await this.repository.refundOrder(orderId);
      logAuditEvent(buildAuditEntry(req, 'admin_refunds_order', 'order', orderId));
      return { success: true, message: 'Order refunded' };
  }

   async changeOrderStatus(req: Request, orderId: string, status: string) {
      await this.repository.changeOrderStatus(orderId, status);
      logAuditEvent(buildAuditEntry(req, 'admin_changes_order_status', 'order', orderId, { status }));
      return { success: true, message: 'Order status changed' };
  }
}
