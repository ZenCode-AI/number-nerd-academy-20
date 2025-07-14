import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { authService, AuthUser } from '@/services/supabase/authService';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = authService.onAuthStateChange(
          async (event, session) => {
            if (!isMounted) return;
            
            setSession(session);
            
            if (session?.user) {
              // Defer user profile fetch to avoid blocking auth state change
              setTimeout(async () => {
                if (!isMounted) return;
                try {
                  const authUser = await authService.convertUser(session.user, session);
                  if (isMounted) {
                    setUser(authUser);
                  }
                } catch (error) {
                  console.error('Error fetching user profile:', error);
                  if (isMounted) {
                    setUser(null);
                  }
                }
              }, 0);
            } else {
              if (isMounted) {
                setUser(null);
              }
            }
          }
        );

        // Then check for existing session
        const { session } = await authService.getSession();
        if (isMounted) {
          setSession(session);
          
          if (session?.user) {
            try {
              const authUser = await authService.convertUser(session.user, session);
              setUser(authUser);
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
            }
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      isMounted = false;
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password);
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await authService.signUp(email, password, name);
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const updateUser = async (updates: Partial<AuthUser>) => {
    if (!user) return;
    
    const { data, error } = await authService.updateProfile(updates);
    if (error) throw error;
    
    // Update local user state
    setUser(prev => prev ? { ...prev, ...updates } : null);
    return data;
  };

  return {
    user,
    session,
    isLoading,
    isInitialized,
    signIn,
    signUp,
    signOut,
    updateUser,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };
};