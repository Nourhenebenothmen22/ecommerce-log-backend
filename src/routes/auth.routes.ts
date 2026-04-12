import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { loginSchema } from '../modules/auth/auth.schema.js';
import { asyncHandler } from '../core/utils/async-handler.js';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), asyncHandler(controller.login));

export { router as authRoutes };
