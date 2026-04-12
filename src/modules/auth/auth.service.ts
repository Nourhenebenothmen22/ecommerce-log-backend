import { HttpError } from '../../core/errors/http-error.js';
import { logSecurityEvent } from '../../infrastructure/security/security-logger.js';
import { createModuleLogger } from '../../core/logger/logger.js';
import type { LoginDto } from './auth.schema.js';
import type { AuthTokenResponse } from './auth.types.js';

const authLogger = createModuleLogger('auth_service');

export class AuthService {
  // In a real app, this would use the AuthRepository and bcrypt to verify passwords.
  // We keep it simple here as a functional standalone stub.
  async login(payload: LoginDto, requestId?: string, ip?: string): Promise<AuthTokenResponse> {
    
    // Stub implementation
    if (payload.email === 'admin@example.com' && payload.password === 'admin123') {
       authLogger.info({ email: payload.email }, 'User login success');
       return {
         token: 'fake-jwt-token-admin',
         expiresIn: 3600
       };
    }
    
    if (payload.email === 'user@example.com' && payload.password === 'user123') {
       authLogger.info({ email: payload.email }, 'User login success');
       return {
         token: 'fake-jwt-token-user',
         expiresIn: 3600
       };
    }

    // Example of security logging on failure
    logSecurityEvent('repeated_login_failures', {
      email: payload.email,
      requestId,
      ip
    });

    throw HttpError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}
