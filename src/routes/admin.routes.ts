import { Router } from 'express';
import { AdminController } from '../modules/admin/admin.controller.js';
import { authMiddleware, adminGuard } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../core/utils/async-handler.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updatePriceSchema, adjustStockSchema, orderStatusSchema } from '../modules/admin/admin.schema.js';

const router = Router();
const controller = new AdminController();

router.use(authMiddleware, adminGuard);

router.patch('/products/:productId/price', validate(updatePriceSchema), asyncHandler(controller.updatePrice));
router.post('/products/:productId/stock-adjust', validate(adjustStockSchema), asyncHandler(controller.adjustStock));
router.post('/orders/:orderId/refund', asyncHandler(controller.refundOrder));
router.patch('/orders/:orderId/status', validate(orderStatusSchema), asyncHandler(controller.changeOrderStatus));

export { router as adminRoutes };
