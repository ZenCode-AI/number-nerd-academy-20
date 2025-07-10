
import { User } from '@/types/user';
import { BaseTest } from '@/types/tests';

export const validateUser = (user: any): user is User => {
  return (
    user &&
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.name === 'string' &&
    ['admin', 'student'].includes(user.role) &&
    ['Free', 'Basic', 'Standard', 'Premium'].includes(user.plan) &&
    typeof user.isAuthenticated === 'boolean'
  );
};

export const validateTest = (test: any): test is BaseTest => {
  return (
    test &&
    typeof test.id === 'string' &&
    typeof test.name === 'string' &&
    typeof test.description === 'string' &&
    ['Free', 'Basic', 'Standard', 'Premium'].includes(test.plan) &&
    ['Draft', 'Active', 'Archived'].includes(test.status) &&
    typeof test.createdAt === 'string' &&
    typeof test.updatedAt === 'string'
  );
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateLength = (
  value: string, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (value.length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return null;
};
