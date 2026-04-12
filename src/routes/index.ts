import { Router } from 'express';
import { healthRoutes } from './health.routes.js';
import { authRoutes } from './auth.routes.js';
import { userRoutes } from './user.routes.js';
import { productRoutes } from './product.routes.js';
import { categoryRoutes } from './category.routes.js';
import { cartRoutes } from './cart.routes.js';
import { orderRoutes } from './order.routes.js';
import { paymentRoutes } from './payment.routes.js';
import { adminRoutes } from './admin.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/products', productRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/carts', cartRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/payments', paymentRoutes);
router.use('/api/admin', adminRoutes);

export { router as apiRoutes };
