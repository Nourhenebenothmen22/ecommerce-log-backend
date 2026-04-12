import type { Request, Response } from 'express';
import { AdminService } from './admin.service.js';
import { successResponse } from '../../shared/types/api-response.js';
import type { UpdatePriceDto, AdjustStockDto, OrderStatusDto } from './admin.schema.js';

export class AdminController {
  private adminService = new AdminService();

  updatePrice = async (req: Request, res: Response) => {
    const productId = String(req.params.productId);
    const { price } = req.body as UpdatePriceDto;
    const result = await this.adminService.updatePrice(req, productId, price);
    res.json(successResponse(result));
  };

  adjustStock = async (req: Request, res: Response) => {
    const productId = String(req.params.productId);
    const { change, reason } = req.body as AdjustStockDto;
    const result = await this.adminService.manualStockAdjustment(req, productId, change, reason);
    res.json(successResponse(result));
  };

  refundOrder = async (req: Request, res: Response) => {
    const orderId = String(req.params.orderId);
    const result = await this.adminService.refundOrder(req, orderId);
    res.json(successResponse(result));
  };
  
   changeOrderStatus = async (req: Request, res: Response) => {
    const orderId = String(req.params.orderId);
    const { status } = req.body as OrderStatusDto;
    const result = await this.adminService.changeOrderStatus(req, orderId, status);
    res.json(successResponse(result));
  };
}
