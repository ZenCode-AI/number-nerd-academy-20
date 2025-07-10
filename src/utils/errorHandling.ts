
import { ApiException } from '@/types/api';

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
