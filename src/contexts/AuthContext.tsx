
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { AuthUser } from '@/services/supabase/authService';
import { handleApiError, logError } from '@/utils/errorHandling';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name?: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => Promise<any>;
  isAdmin: boolean;
  isStudent: boolean;
  // Legacy method names for backward compatibility
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useSupabaseAuth();

  const login = async (email: string, password: string) => {
    try {
      return await auth.signIn(email, password);
    } catch (error) {
      logError(error, 'AuthProvider.login');
      throw new Error(handleApiError(error));
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      logError(error, 'AuthProvider.logout');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isLoading: auth.isLoading,
        isInitialized: auth.isInitialized,
        signIn: login,
        signUp: auth.signUp,
        signOut: logout,
        updateUser: auth.updateUser,
        isAdmin: auth.isAdmin,
        isStudent: auth.isStudent,
        // Legacy method names for backward compatibility
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
