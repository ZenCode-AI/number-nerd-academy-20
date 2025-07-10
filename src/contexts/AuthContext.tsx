
import React, { createContext, useContext, ReactNode } from 'react';
import { authAPI } from '@/api/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { User, AuthState, LoginCredentials } from '@/types/user';
import { handleApiError, logError } from '@/utils/errorHandling';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAdmin: boolean;
  isStudent: boolean;
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
  const { user, setUser, updateUser, clearUser, isLoading, isInitialized } = useAuthState();

  const login = async (credentials: LoginCredentials) => {
    try {
      const userData = await authAPI.login(credentials.email, credentials.password);
      setUser(userData);
      // Store in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (error) {
      logError(error, 'AuthProvider.login');
      throw new Error(handleApiError(error));
    }
  };

  const logout = () => {
    try {
      clearUser();
      localStorage.removeItem('auth_user');
      authAPI.logout();
    } catch (error) {
      logError(error, 'AuthProvider.logout');
    }
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isInitialized,
        login,
        logout,
        updateUser,
        isAdmin,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
