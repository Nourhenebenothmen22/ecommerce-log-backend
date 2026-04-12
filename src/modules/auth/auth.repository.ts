import { query } from '../../infrastructure/database/query.js';
import type { User } from '../users/user.types.js';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | undefined> {
    const result = await query<User>({
      name: 'auth_find_user',
      text: 'SELECT id, email, password_hash as "passwordHash", role FROM users WHERE email = $1 AND is_active = true',
      values: [email],
    });
    return result.rows[0];
  }
}
