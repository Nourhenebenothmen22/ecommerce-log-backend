import { Router } from 'express';
import { PaymentController } from '../modules/payments/payment.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { processPaymentSchema } from '../modules/payments/payment.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../core/utils/async-handler.js';

const router = Router();
const controller = new PaymentController();

router.use(authMiddleware);

router.post('/process', validate(processPaymentSchema), asyncHandler(controller.process));

export { router as paymentRoutes };
