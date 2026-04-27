import jwt from 'jsonwebtoken';
import { HttpError } from '../../core/errors/http-error.js';
import { logSecurityEvent } from '../../infrastructure/security/security-logger.js';
import { createModuleLogger } from '../../core/logger/logger.js';
import { env } from '../../config/env.js';
import { logService, LogLevel } from '../../services/log.service.js';
import type { LoginDto } from './auth.schema.js';
import type { AuthTokenResponse } from './auth.types.js';

const authLogger = createModuleLogger('auth_service');

export class AuthService {
  async login(payload: LoginDto, requestId?: string, ip?: string): Promise<AuthTokenResponse> {
    
    // Stub validation logic - in real app would use AuthRepository + bcrypt
    let user;
    if (payload.email === 'admin@example.com' && payload.password === 'admin123') {
       user = { id: '00000000-0000-0000-0000-000000000001', email: payload.email, role: 'admin' };
    } else if (payload.email === 'user@example.com' && payload.password === 'user123') {
       user = { id: '00000000-0000-0000-0000-000000000002', email: payload.email, role: 'customer' };
    }

    if (!user) {
      logSecurityEvent('repeated_login_failures', { email: payload.email, requestId, ip });
      logService.logApp(LogLevel.ERROR, 'connexion utilisateur', 'failed', undefined, `email=${payload.email}`, 'invalid credentials');
      throw HttpError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    authLogger.info({ email: payload.email, role: user.role }, 'User login success');
    logService.logApp(LogLevel.INFO, 'connexion utilisateur', 'success', user.id, `email=${payload.email}`);

    // Generate real JWT using standard Interop import
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      expiresIn: 3600 // 1 hour in seconds
    };
  }
}
