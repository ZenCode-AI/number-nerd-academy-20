
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = userService.getCurrentUser();
        console.log('Initializing auth, saved user:', savedUser);
        if (savedUser && savedUser.isAuthenticated) {
          setUser(savedUser);
          console.log('User authenticated:', savedUser);
        } else {
          console.log('No authenticated user found');
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        userService.setCurrentUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []); // Remove dependencies to avoid infinite loops

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    userService.setCurrentUser(updatedUser);
    console.log('User updated:', updatedUser);
  };

  const clearUser = () => {
    setUser(null);
    userService.setCurrentUser(null);
    console.log('User cleared');
  };

  const setUserState = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      userService.setCurrentUser(newUser);
      console.log('User set:', newUser);
    }
  };

  return {
    user,
    setUser: setUserState,
    updateUser,
    clearUser,
    isLoading,
    isInitialized,
  };
};
