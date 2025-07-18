// Legacy auth API for backward compatibility
// This file provides compatibility with the old auth API structure

import { authService, AuthUser } from '@/services/supabase/authService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authAPI = {
  async login(email: string, password: string): Promise<AuthUser> {
    const result = await authService.signIn(email, password);
    
    if (!result.user) {
      throw new Error('Authentication failed');
    }

    const authUser = await authService.convertUser(result.user, result.session!);
    if (!authUser) {
      throw new Error('Failed to load user profile');
    }

    return authUser;
  },

  async logout(): Promise<void> {
    const { error } = await authService.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    return await authService.getCurrentUser();
  },

  async updateProfile(userData: Partial<AuthUser>): Promise<AuthUser> {
    const { data, error } = await authService.updateProfile(userData);
    
    if (error) {
      throw new Error(error.message);
    }

    return { 
      ...data, 
      isAuthenticated: true,
      preferences: data.preferences as any || { notifications: true, theme: 'light', language: 'en' }
    } as AuthUser;
  },
};