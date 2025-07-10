
export interface User {
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
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
  timezone?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByPlan: Record<User['plan'], number>;
}
