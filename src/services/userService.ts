import { User } from '@/types/user';

export const userService = {
  getCurrentUser: (): User | null => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  },

  isAuthenticated: (): boolean => {
    const user = userService.getCurrentUser();
    return user !== null && user.isAuthenticated;
  },

  getUserPlan: (): string => {
    const user = userService.getCurrentUser();
    return user?.plan || 'Free';
  },

  updateUser: (updates: Partial<User>): User | null => {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    userService.setCurrentUser(updatedUser);
    return updatedUser;
  }
};
