// Global error handling utilities
import { toast } from "@/hooks/use-toast";
import { ApiException } from '@/types/api';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  context?: string;
}

export class ErrorReporter {
  private static errors: AppError[] = [];
  
  static report(error: AppError) {
    this.errors.push(error);
    console.error('[AppError]', error);
    
    // Show user-friendly message
    this.showUserError(error);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
    }
  }
  
  private static showUserError(error: AppError) {
    const userMessage = this.getUserFriendlyMessage(error);
    
    toast({
      title: "Something went wrong",
      description: userMessage,
      variant: "destructive",
    });
  }
  
  private static getUserFriendlyMessage(error: AppError): string {
    const messageMap: Record<string, string> = {
      'NETWORK_ERROR': 'Please check your internet connection and try again.',
      'AUTH_ERROR': 'Please sign in again to continue.',
      'PERMISSION_ERROR': 'You don\'t have permission to perform this action.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'SERVER_ERROR': 'Our servers are having issues. Please try again later.',
      'NOT_FOUND': 'The requested item could not be found.',
      'RATE_LIMIT': 'Too many requests. Please wait a moment and try again.',
      'STORAGE_FULL': 'Storage is full. Please free up some space.',
    };
    
    return messageMap[error.code] || 'An unexpected error occurred. Please try again.';
  }
  
  static getRecentErrors(): AppError[] {
    return this.errors.slice(-50); // Last 50 errors
  }
  
  static clearErrors() {
    this.errors = [];
  }
}

export function createError(
  code: string, 
  message: string, 
  details?: any, 
  context?: string
): AppError {
  return {
    code,
    message,
    details,
    timestamp: new Date(),
    context,
  };
}

export function handleGlobalError(error: any, context?: string) {
  const appError = createError(
    'GLOBAL_ERROR',
    error.message || 'Unknown error',
    error,
    context
  );
  
  ErrorReporter.report(appError);
}

// Legacy exports for backward compatibility
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiException) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

export const logError = (error: unknown, context?: string): void => {
  const errorMessage = handleApiError(error);
  const logContext = context ? `[${context}]` : '';
  
  console.error(`${logContext} ${errorMessage}`, error);
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error);
  }
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, context);
      return null;
    }
  };
};

// Global error boundary fallback (will be used in React components)
export const GlobalErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  return null; // This will be implemented by the ErrorBoundary component
};