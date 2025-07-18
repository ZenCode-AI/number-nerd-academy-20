// Enhanced validation utilities for edge cases
import { z } from 'zod';
import { User } from '@/types/user';
import { BaseTest } from '@/types/tests';

// Email validation with comprehensive checks
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(254, 'Email is too long') // RFC standard
  .refine(
    (email) => !email.includes('..'), 
    'Email cannot contain consecutive dots'
  )
  .refine(
    (email) => !email.startsWith('.') && !email.endsWith('.'),
    'Email cannot start or end with a dot'
  );

// Password validation
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(128, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

// Test name validation
export const testNameSchema = z
  .string()
  .min(1, 'Test name is required')
  .max(100, 'Test name is too long')
  .regex(
    /^[a-zA-Z0-9\s\-_().]+$/,
    'Test name can only contain letters, numbers, spaces, and basic punctuation'
  );

// Question text validation
export const questionTextSchema = z
  .string()
  .min(5, 'Question must be at least 5 characters')
  .max(2000, 'Question is too long')
  .refine(
    (text) => text.trim().length > 0,
    'Question cannot be empty or just whitespace'
  );

// Numeric answer validation
export const numericAnswerSchema = z
  .number()
  .finite('Answer must be a valid number')
  .safe('Answer is too large');

// Points validation
export const pointsSchema = z
  .number()
  .int('Points must be a whole number')
  .min(1, 'Points must be at least 1')
  .max(100, 'Points cannot exceed 100');

// Duration validation (in minutes)
export const durationSchema = z
  .number()
  .int('Duration must be a whole number')
  .min(1, 'Duration must be at least 1 minute')
  .max(480, 'Duration cannot exceed 8 hours'); // 8 hours = 480 minutes

// Legacy validation functions
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

// Sanitization functions
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9\-_.]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .substring(0, 100); // Limit length
}

// Validation helper functions
export function isValidImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size cannot exceed 5MB' };
  }
  
  return { valid: true };
}

export function validateTestStructure(test: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!test.modules || test.modules.length === 0) {
    errors.push('Test must have at least one module');
  }
  
  test.modules?.forEach((module: any, moduleIndex: number) => {
    if (!module.questions || module.questions.length === 0) {
      errors.push(`Module ${moduleIndex + 1} must have at least one question`);
    }
    
    module.questions?.forEach((question: any, questionIndex: number) => {
      if (question.type === 'mcq') {
        if (!question.options || question.options.length < 2) {
          errors.push(`Question ${questionIndex + 1} in module ${moduleIndex + 1} must have at least 2 options`);
        }
        
        if (question.correctAnswer === undefined || question.correctAnswer === null) {
          errors.push(`Question ${questionIndex + 1} in module ${moduleIndex + 1} must have a correct answer selected`);
        }
      }
      
      if (question.type === 'numeric') {
        if (question.correctAnswer === undefined || question.correctAnswer === null) {
          errors.push(`Question ${questionIndex + 1} in module ${moduleIndex + 1} must have a correct numeric answer`);
        }
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Rate limiting validation
export function createRateLimiter(maxRequests: number, timeWindow: number) {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the time window
    const validRequests = userRequests.filter(time => now - time < timeWindow);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    
    return true; // Request allowed
  };
}