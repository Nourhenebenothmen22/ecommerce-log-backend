import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { successResponse } from '../../shared/types/api-response.js';
import { env } from '../../config/env.js';

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await this.authService.login(payload, req.requestId, req.ip);
    
    // Set HTTP-only cookie
    res.cookie('accessToken', result.token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: result.expiresIn * 1000 // Convert to ms
    });

    res.json(successResponse({
      user: {
        email: payload.email,
        role: payload.email === 'admin@example.com' ? 'admin' : 'customer'
      },
      expiresIn: result.expiresIn
    }));
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.json(successResponse({ message: 'Logged out successfully' }));
  };
}
