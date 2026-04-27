import { OrderRepository } from './order.repository.js';
import { createModuleLogger } from '../../core/logger/logger.js';
import { CartService } from '../carts/cart.service.js';
import { HttpError } from '../../core/errors/http-error.js';
import { logService, LogLevel } from '../../services/log.service.js';

const orderLogger = createModuleLogger('order_service');

export class OrderService {
  private repository = new OrderRepository();
  private cartService = new CartService();

  async createOrderFromCart(userId: string) {
    const cart = await this.cartService.getActiveCart(userId);
    if (!cart) {
        throw HttpError.badRequest('No active cart found');
    }

    // In a real app we'd calculate total from cart items. 
    const calculatedTotal = 99.99;

    const order = await this.repository.create(userId, calculatedTotal);
    
    // Mark cart as checked out
    await this.cartService.checkout(userId);

    orderLogger.info({ orderId: order.id, userId, totalAmount: order.totalAmount }, 'Order created');
    return order;
  }

  async listUserOrders(userId: string) {
      return this.repository.listForUser(userId);
  }
}
