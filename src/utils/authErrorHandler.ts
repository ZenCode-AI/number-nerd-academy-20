import { AuthError } from '@supabase/supabase-js';
import { logError } from './errorHandling';

export interface AuthErrorInfo {
  message: string;
  title: string;
  action?: string;
  severity: 'error' | 'warning' | 'info';
}

export const mapAuthError = (error: AuthError | Error | unknown): AuthErrorInfo => {
  if (error instanceof AuthError) {
    switch (error.message) {
      case 'Invalid login credentials':
        return {
          title: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect. Please check and try again.',
          action: 'Try again or reset your password',
          severity: 'error'
        };
      
      case 'Email not confirmed':
        return {
          title: 'Email Not Verified',
          message: 'Please check your email and click the verification link to activate your account.',
          action: 'Check your email or resend verification',
          severity: 'warning'
        };
      
      case 'User already registered':
        return {
          title: 'Account Already Exists',
          message: 'An account with this email already exists. Please sign in instead.',
          action: 'Try signing in',
          severity: 'info'
        };
      
      case 'Password should be at least 6 characters':
        return {
          title: 'Weak Password',
          message: 'Your password must be at least 6 characters long.',
          action: 'Choose a stronger password',
          severity: 'error'
        };
      
      case 'Invalid email':
        return {
          title: 'Invalid Email',
          message: 'Please enter a valid email address.',
          action: 'Check your email format',
          severity: 'error'
        };
      
      case 'Signup disabled':
        return {
          title: 'Registration Unavailable',
          message: 'New account registration is currently disabled. Please contact support.',
          action: 'Contact support for assistance',
          severity: 'error'
        };
      
      case 'Email rate limit exceeded':
        return {
          title: 'Too Many Attempts',
          message: 'Too many email attempts. Please wait a few minutes before trying again.',
          action: 'Wait and try again later',
          severity: 'warning'
        };
      
      default:
        if (error.message.includes('network')) {
          return {
            title: 'Connection Problem',
            message: 'Unable to connect to our servers. Please check your internet connection.',
            action: 'Check connection and retry',
            severity: 'error'
          };
        }
        
        return {
          title: 'Authentication Error',
          message: error.message || 'An unexpected error occurred during authentication.',
          action: 'Please try again or contact support',
          severity: 'error'
        };
    }
  }
  
  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        action: 'Check your connection and retry',
        severity: 'error'
      };
    }
    
    return {
      title: 'Error',
      message: error.message,
      action: 'Please try again',
      severity: 'error'
    };
  }
  
  return {
    title: 'Unknown Error',
    message: 'An unexpected error occurred. Please try again.',
    action: 'Try again or contact support',
    severity: 'error'
  };
};

export const logAuthError = (error: unknown, context: string, userId?: string): void => {
  const errorInfo = mapAuthError(error);
  const logContext = `AUTH_${context}${userId ? `_USER_${userId}` : ''}`;
  
  logError(error, logContext);
  
  // Log additional context for auth errors
  console.error(`[${logContext}] Auth Error Details:`, {
    title: errorInfo.title,
    message: errorInfo.message,
    severity: errorInfo.severity,
    timestamp: new Date().toISOString(),
    userId: userId || 'anonymous'
  });
};

export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain auth errors
      if (error instanceof AuthError) {
        const nonRetryableErrors = [
          'Invalid login credentials',
          'User already registered',
          'Invalid email',
          'Password should be at least 6 characters',
          'Email not confirmed'
        ];
        
        if (nonRetryableErrors.includes(error.message)) {
          throw error;
        }
      }
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};