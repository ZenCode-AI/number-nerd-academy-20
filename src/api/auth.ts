
import { User } from '@/types/user';
import { ApiResponse } from './types';

// Mock authentication - replace with real API calls
export const authAPI = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    const isAdmin = email.includes('admin');
    const mockUser: User = {
      id: isAdmin ? 'admin-123' : 'student-123',
      email,
      name: isAdmin ? 'Admin User' : 'Student User',
      role: isAdmin ? 'admin' : 'student',
      plan: isAdmin ? 'Premium' : 'Free',
      isAuthenticated: true,
    };

    return mockUser;
  },

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async getCurrentUser(): Promise<User | null> {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    return updatedUser;
  },
};
