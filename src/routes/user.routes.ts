import { Router } from 'express';
import { UserController } from '../modules/users/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../core/utils/async-handler.js';

const router = Router();
const controller = new UserController();

router.use(authMiddleware);

router.get('/me', asyncHandler(controller.getCurrentUser));

export { router as userRoutes };
