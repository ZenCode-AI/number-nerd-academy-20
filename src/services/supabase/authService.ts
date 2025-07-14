import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name: name || email.split('@')[0]
        }
      }
    });
    return { data, error };
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
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
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        avatar_url: updates.avatar,
        phone: updates.phone,
        preferences: updates.preferences
      })
      .eq('id', session.user.id)
      .select()
      .single();

    return { data, error };
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