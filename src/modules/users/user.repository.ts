import { query } from '../../infrastructure/database/query.js';
import type { User } from './user.types.js';

export class UserRepository {
  async findById(id: string): Promise<User | undefined> {
    const result = await query<User>({
      name: 'user_find_by_id',
      text: 'SELECT id, email, first_name as "firstName", last_name as "lastName", role, is_active as "isActive", created_at as "createdAt" FROM users WHERE id = $1',
      values: [id],
    });
    return result.rows[0];
  }
}
