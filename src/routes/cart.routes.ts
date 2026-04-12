import { Router } from 'express';
import { CartController } from '../modules/carts/cart.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { addToCartSchema } from '../modules/carts/cart.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../core/utils/async-handler.js';

const router = Router();
const controller = new CartController();

router.use(authMiddleware);

router.get('/', asyncHandler(controller.getCart));
router.post('/items', validate(addToCartSchema), asyncHandler(controller.addToCart));
router.post('/checkout', asyncHandler(controller.checkout));

export { router as cartRoutes };
