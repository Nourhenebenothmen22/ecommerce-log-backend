import { PaymentRepository } from './payment.repository.js';
import { createModuleLogger } from '../../core/logger/logger.js';
import type { ProcessPaymentDto } from './payment.schema.js';

const paymentLogger = createModuleLogger('payment_service');

export class PaymentService {
  private repository = new PaymentRepository();

  async processPayment(dto: ProcessPaymentDto) {
    // Mock processing
    paymentLogger.info({ orderId: dto.orderId }, 'Initiating payment processing');

    const amount = 99.99; // Mock amount
    const payment = await this.repository.recordPayment(dto.orderId, amount, 'success');

    paymentLogger.info({ paymentId: payment.id, orderId: payment.orderId, amount }, 'Payment received successfully');
    return payment;
  }
}
