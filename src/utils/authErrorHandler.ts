// Authentication error handling
import { AuthError } from '@supabase/supabase-js';
import { ErrorReporter, createError } from './errorHandling';

export interface AuthErrorDetails {
  code: string;
  message: string;
  shouldRedirect?: boolean;
  retryable?: boolean;
}

export interface AuthErrorInfo {
  message: string;
  title: string;
  action?: string;
  severity: 'error' | 'warning' | 'info';
}

export class AuthErrorHandler {
  static handle(error: AuthError | Error | any): AuthErrorDetails {
    const errorDetails = this.mapError(error);
    
    // Report to global error handler
    ErrorReporter.report(createError(
      errorDetails.code,
      errorDetails.message,
      error,
      'AUTH'
    ));
    
    return errorDetails;
  }
  
  private static mapError(error: any): AuthErrorDetails {
    const message = error?.message || 'Unknown authentication error';
    
    // Supabase specific errors
    if (error?.code) {
      switch (error.code) {
        case 'invalid_credentials':
          return {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password. Please check your credentials.',
            retryable: true,
          };
          
        case 'email_not_confirmed':
          return {
            code: 'EMAIL_NOT_CONFIRMED',
            message: 'Please check your email and click the confirmation link.',
            retryable: false,
          };
          
        case 'too_many_requests':
          return {
            code: 'RATE_LIMIT',
            message: 'Too many login attempts. Please wait a few minutes and try again.',
            retryable: true,
          };
          
        case 'signup_disabled':
          return {
            code: 'SIGNUP_DISABLED',
            message: 'New registrations are currently disabled.',
            retryable: false,
          };
          
        case 'email_address_invalid':
          return {
            code: 'INVALID_EMAIL',
            message: 'Please enter a valid email address.',
            retryable: true,
          };
          
        case 'password_too_short':
          return {
            code: 'WEAK_PASSWORD',
            message: 'Password must be at least 6 characters long.',
            retryable: true,
          };
      }
    }
    
    // Session and token errors
    if (message.includes('session') || message.includes('token')) {
      return {
        code: 'SESSION_EXPIRED',
        message: 'Your session has expired. Please sign in again.',
        shouldRedirect: true,
        retryable: false,
      };
    }
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Connection failed. Please check your internet and try again.',
        retryable: true,
      };
    }
    
    // Permission errors
    if (message.includes('permission') || message.includes('unauthorized')) {
      return {
        code: 'PERMISSION_ERROR',
        message: 'You don\'t have permission to access this resource.',
        shouldRedirect: true,
        retryable: false,
      };
    }
    
    // Default error
    return {
      code: 'AUTH_ERROR',
      message: 'Authentication failed. Please try again.',
      retryable: true,
    };
  }
  
  static shouldRetry(errorDetails: AuthErrorDetails): boolean {
    return errorDetails.retryable === true;
  }
  
  static shouldRedirect(errorDetails: AuthErrorDetails): boolean {
    return errorDetails.shouldRedirect === true;
  }
}

// Legacy functions for backward compatibility
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