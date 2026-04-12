import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { successResponse } from '../../shared/types/api-response.js';

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await this.authService.login(payload, req.requestId, req.ip);
    
    res.json(successResponse(result));
  };
}
