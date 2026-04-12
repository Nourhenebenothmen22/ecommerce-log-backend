import type { Request, Response } from 'express';
import { OrderService } from './order.service.js';
import { successResponse } from '../../shared/types/api-response.js';

export class OrderController {
  private orderService = new OrderService();

  createOrder = async (req: Request, res: Response) => {
    const order = await this.orderService.createOrderFromCart(req.user!.id);
    res.status(201).json(successResponse(order));
  };

  listOrders = async (req: Request, res: Response) => {
    const orders = await this.orderService.listUserOrders(req.user!.id);
    res.json(successResponse(orders));
  };
}
