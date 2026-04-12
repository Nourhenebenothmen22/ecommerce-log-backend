import { Router } from 'express';
import { AdminController } from '../modules/admin/admin.controller.js';
import { authMiddleware, adminGuard } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../core/utils/async-handler.js';

const router = Router();
const controller = new AdminController();

router.use(authMiddleware, adminGuard);

router.patch('/products/:productId/price', asyncHandler(controller.updatePrice));
router.post('/products/:productId/stock-adjust', asyncHandler(controller.adjustStock));
router.post('/orders/:orderId/refund', asyncHandler(controller.refundOrder));
router.patch('/orders/:orderId/status', asyncHandler(controller.changeOrderStatus));

export { router as adminRoutes };
