import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { logAuthError, retryWithBackoff } from '@/utils/authErrorHandler';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  isAuthenticated: boolean;
  avatar?: string;
  phone?: string;
  createdAt?: string;
  lastLogin?: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
    timezone?: string;
  };
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, name?: string) {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: name ? { name } : undefined
          }
        });

        if (error) throw error;
        return { data, error: null };
      });

      return result;
    } catch (error) {
      logAuthError(error, 'SIGN_UP', email);
      return { data: null, error: error as AuthError };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        return { data, error: null };
      });

      return result;
    } catch (error) {
      logAuthError(error, 'SIGN_IN', email);
      return { data: null, error: error as AuthError };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      logAuthError(error, 'SIGN_OUT');
      return { error: error as AuthError };
    }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user with profile data
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return null;
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      plan: profile.plan,
      isAuthenticated: true,
      avatar: profile.avatar_url,
      phone: profile.phone,
      createdAt: profile.created_at,
      preferences: (profile.preferences as any) || {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    };
  },

  // Update user profile
  async updateProfile(updates: Partial<AuthUser>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate updates before applying
      const validatedUpdates: any = {};
      if (updates.name !== undefined) validatedUpdates.name = updates.name;
      if (updates.phone !== undefined) validatedUpdates.phone = updates.phone;
      if (updates.avatar !== undefined) validatedUpdates.avatar_url = updates.avatar;
      if (updates.preferences !== undefined) validatedUpdates.preferences = updates.preferences;

      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('users')
          .update(validatedUpdates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      });

      return result;
    } catch (error) {
      logAuthError(error, 'UPDATE_PROFILE', updates.email);
      return { data: null, error: error as any };
    }
  },

  // Convert Supabase user to AuthUser
  async convertUser(user: User, session: Session): Promise<AuthUser | null> {
    // Get user profile from database
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      plan: profile.plan,
      isAuthenticated: true,
      avatar: profile.avatar_url,
      phone: profile.phone,
      createdAt: profile.created_at,
      preferences: (profile.preferences as any) || {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    };
  },

  // Subscribe to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};