import { UserRepository } from './user.repository.js';
import type { SafeUser } from './user.types.js';
import { createModuleLogger } from '../../core/logger/logger.js';

const userLogger = createModuleLogger('user_service');

export class UserService {
  private repository = new UserRepository();

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await this.repository.findById(userId);
    
    // Stub for when db has no users yet since we didn't add migrations
    if (!user) {
        userLogger.debug({ userId }, 'User not found in DB, returning mock');
        return {
            id: userId,
            email: 'mock@example.com',
            firstName: 'Mock',
            lastName: 'User',
            role: 'customer',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    return user;
  }
}
