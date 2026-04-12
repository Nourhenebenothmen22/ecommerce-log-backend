import { InventoryRepository } from './inventory.repository.js';
import { createModuleLogger } from '../../core/logger/logger.js';
import type { StockAdjustment } from './inventory.types.js';

const inventoryLogger = createModuleLogger('inventory_service');

export class InventoryService {
  private repository = new InventoryRepository();

  async adjustStock(adjustment: StockAdjustment) {
      await this.repository.adjustStock(adjustment.productId, adjustment.quantityChange);
      inventoryLogger.info({
          productId: adjustment.productId,
          quantityChange: adjustment.quantityChange,
          reason: adjustment.reason,
          adjustedBy: adjustment.adjustedBy
      }, 'Stock adjusted');
  }

  async decrementStockForOrder(orderItems: {productId: string, quantity: number}[]) {
      // Typically done in a transaction, mocked here
      for(const item of orderItems) {
         await this.repository.adjustStock(item.productId, -Math.abs(item.quantity));
         inventoryLogger.info({ productId: item.productId, quantityDecremented: Math.abs(item.quantity) }, 'Stock decremented for order');
      }
  }
}
