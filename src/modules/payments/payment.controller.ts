import type { Request, Response } from 'express';
import { PaymentService } from './payment.service.js';
import { successResponse } from '../../shared/types/api-response.js';

export class PaymentController {
  private paymentService = new PaymentService();

  process = async (req: Request, res: Response) => {
    const payment = await this.paymentService.processPayment(req.body);
    res.json(successResponse(payment));
  };
}
