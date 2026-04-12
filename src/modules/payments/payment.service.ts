import { PaymentRepository } from './payment.repository.js';
import { createModuleLogger } from '../../core/logger/logger.js';
import type { ProcessPaymentDto } from './payment.schema.js';
import { OrderRepository } from '../orders/order.repository.js';
import { HttpError } from '../../core/errors/http-error.js';

const paymentLogger = createModuleLogger('payment_service');

export class PaymentService {
  private repository = new PaymentRepository();
  private orderRepository = new OrderRepository();

  async processPayment(dto: ProcessPaymentDto) {
    paymentLogger.info({ orderId: dto.orderId }, 'Initiating payment processing');

    // 1. Verify order exists to avoid 500 error on foreign key violation
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw HttpError.notFound(`Order with ID ${dto.orderId} not found`);
    }

    // 2. Mock processing
    const amount = order.totalAmount; 
    const payment = await this.repository.recordPayment(dto.orderId, amount, 'success');

    paymentLogger.info({ paymentId: payment.id, orderId: payment.orderId, amount }, 'Payment received successfully');
    return payment;
  }
}
