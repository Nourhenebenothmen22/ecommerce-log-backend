import { Router } from 'express';
import { CategoryController } from '../modules/categories/category.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createCategorySchema } from '../modules/categories/category.schema.js';
import { authMiddleware, adminGuard } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../core/utils/async-handler.js';

const router = Router();
const controller = new CategoryController();

router.get('/', asyncHandler(controller.listCategories));

// Protected admin routes
router.post(
  '/',
  authMiddleware,
  adminGuard,
  validate(createCategorySchema),
  asyncHandler(controller.createCategory),
);

export { router as categoryRoutes };
