import { Router } from 'express';
import { ProductController } from '../modules/products/product.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createProductSchema } from '../modules/products/product.schema.js';
import { paginationSchema } from '../shared/types/pagination.js';
import { authMiddleware, adminGuard } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../core/utils/async-handler.js';

const router = Router();
const controller = new ProductController();

router.get('/', validate(paginationSchema, 'query'), asyncHandler(controller.listProducts));

// Protected admin routes
router.post(
  '/',
  authMiddleware,
  adminGuard,
  validate(createProductSchema),
  asyncHandler(controller.createProduct),
);

export { router as productRoutes };
