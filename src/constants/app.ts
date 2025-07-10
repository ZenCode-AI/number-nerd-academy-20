
export const APP_CONFIG = {
  name: 'NNA Testing Platform',
  version: '1.0.0',
  description: 'Educational Testing Platform',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export const USER_PLANS = {
  FREE: 'Free',
  BASIC: 'Basic',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
} as const;

export const TEST_STATUS = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
} as const;

export const TEST_SUBJECTS = {
  MATH: 'Math',
  ENGLISH: 'English',
} as const;

export const TEST_DIFFICULTIES = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  TESTS: {
    AVAILABLE: '/student/tests/available',
    PURCHASED: '/student/tests/purchased',
    DETAILS: (id: string) => `/tests/${id}`,
  },
  ADMIN: {
    TESTS: '/admin/tests',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
  },
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'auth_user',
  TEST_PROGRESS: 'test_progress',
  USER_PREFERENCES: 'user_preferences',
} as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
} as const;
