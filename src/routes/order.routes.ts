import { Router } from 'express';
import { OrderController } from '../modules/orders/order.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../core/utils/async-handler.js';

const router = Router();
const controller = new OrderController();

router.use(authMiddleware);

router.post('/', asyncHandler(controller.createOrder));
router.get('/', asyncHandler(controller.listOrders));

export { router as orderRoutes };
