export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;
