import { CartRepository } from './cart.repository.js';
import type { AddToCartDto } from './cart.schema.js';
import { createModuleLogger } from '../../core/logger/logger.js';

const cartLogger = createModuleLogger('cart_service');

export class CartService {
  private repository = new CartRepository();

  async addToCart(userId: string, dto: AddToCartDto) {
    // We would normally verify the product exists and fetch its price here
    // But since it's a mock setup mostly, we'll assign a fake price.
    const price = 49.99; 
    
    await this.repository.addItem(userId, dto.productId, dto.quantity, price);
    cartLogger.info({ userId, productId: dto.productId, quantity: dto.quantity }, 'Item added to cart');
  }

  async getActiveCart(userId: string) {
      return this.repository.getActiveCartForUser(userId);
  }

  async checkout(userId: string) {
      await this.repository.checkoutCart(userId);
      cartLogger.info({ userId }, 'Cart checked out successfully');
  }
}
