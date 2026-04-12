import type { Request, Response } from 'express';
import { CartService } from './cart.service.js';
import { successResponse } from '../../shared/types/api-response.js';

export class CartController {
  private cartService = new CartService();

  getCart = async (req: Request, res: Response) => {
    const cart = await this.cartService.getActiveCart(req.user!.id);
    res.json(successResponse(cart || { status: 'empty' }));
  };

  addToCart = async (req: Request, res: Response) => {
    await this.cartService.addToCart(req.user!.id, req.body);
    res.json(successResponse({ added: true }));
  };

  checkout = async (req: Request, res: Response) => {
      await this.cartService.checkout(req.user!.id);
      res.json(successResponse({ checkedOut: true }));
  }
}
