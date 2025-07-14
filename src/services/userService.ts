// Legacy user service for backward compatibility
import { userService as supabaseUserService } from '@/services/supabase/userService';
import { AuthUser } from '@/services/supabase/authService';

export const userService = {
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const { data, error } = await supabaseUserService.getCurrentUser();
    
    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      plan: data.plan,
      isAuthenticated: true,
      avatar: data.avatar_url,
      phone: data.phone,
      createdAt: data.created_at,
      preferences: (data.preferences as any) || {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    };
  },

  setCurrentUser: (user: AuthUser | null): void => {
    // This is a no-op since Supabase manages auth state
    console.warn('setCurrentUser is deprecated with Supabase auth');
  },

  isAuthenticated: async (): Promise<boolean> => {
    const user = await userService.getCurrentUser();
    return user !== null && user.isAuthenticated;
  },

  getUserPlan: async (): Promise<string> => {
    const user = await userService.getCurrentUser();
    return user?.plan || 'Free';
  },

  updateUser: async (updates: Partial<AuthUser>): Promise<AuthUser | null> => {
    const { data, error } = await supabaseUserService.updateProfile(updates);
    
    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      plan: data.plan,
      isAuthenticated: true,
      avatar: data.avatar_url,
      phone: data.phone,
      createdAt: data.created_at,
      preferences: (data.preferences as any) || {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    };
  }
};