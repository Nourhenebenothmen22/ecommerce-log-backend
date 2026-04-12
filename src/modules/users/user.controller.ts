import type { Request, Response } from 'express';
import { UserService } from './user.service.js';
import { successResponse } from '../../shared/types/api-response.js';

export class UserController {
  private userService = new UserService();

  getCurrentUser = async (req: Request, res: Response) => {
    // req.user is guaranteed to exist due to authMiddleware
    const userId = req.user!.id;
    const user = await this.userService.getCurrentUser(userId);
    
    res.json(successResponse(user));
  };
}
