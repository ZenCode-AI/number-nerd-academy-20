// API request/response interceptor for global error handling
import { supabase } from '@/integrations/supabase/client';
import { ErrorReporter, createError } from '@/utils/errorHandling';
import { AuthErrorHandler } from '@/utils/authErrorHandler';

export class ApiInterceptor {
  private static retryQueue: Map<string, number> = new Map();
  private static maxRetries = 3;
  private static retryDelay = 1000; // 1 second base delay
  
  static async withRetry<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    const key = `${context}-${Date.now()}`;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        
        // Clear retry count on success
        this.retryQueue.delete(key);
        
        return result;
      } catch (error: any) {
        console.warn(`Attempt ${attempt}/${maxRetries} failed for ${context}:`, error);
        
        // Don't retry certain errors
        if (this.shouldNotRetry(error)) {
          throw error;
        }
        
        // Last attempt - throw the error
        if (attempt === maxRetries) {
          ErrorReporter.report(createError(
            'API_MAX_RETRIES',
            `Failed after ${maxRetries} attempts`,
            error,
            context
          ));
          throw error;
        }
        
        // Wait before retry with exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Unexpected retry loop exit');
  }
  
  private static shouldNotRetry(error: any): boolean {
    // Don't retry auth errors (except network issues)
    if (error?.code && ['invalid_credentials', 'email_not_confirmed', 'signup_disabled'].includes(error.code)) {
      return true;
    }
    
    // Don't retry validation errors
    if (error?.message?.includes('validation') || error?.message?.includes('invalid')) {
      return true;
    }
    
    // Don't retry permission errors
    if (error?.message?.includes('permission') || error?.message?.includes('unauthorized')) {
      return true;
    }
    
    // Don't retry if resource not found
    if (error?.code === 'PGRST116' || error?.message?.includes('not found')) {
      return true;
    }
    
    return false;
  }
  
  static async handleSupabaseOperation<T>(
    operation: () => Promise<{ data: T; error: any }>,
    context: string
  ): Promise<T> {
    return this.withRetry(async () => {
      const { data, error } = await operation();
      
      if (error) {
        // Handle auth errors specifically
        if (this.isAuthError(error)) {
          const authError = AuthErrorHandler.handle(error);
          throw new Error(authError.message);
        }
        
        // Handle other errors
        this.handleError(error, context);
        throw error;
      }
      
      return data;
    }, context);
  }
  
  private static isAuthError(error: any): boolean {
    const authErrorCodes = [
      'invalid_credentials',
      'email_not_confirmed',
      'too_many_requests',
      'signup_disabled',
      'session_not_found',
      'token_expired'
    ];
    
    return authErrorCodes.includes(error?.code) || 
           error?.message?.includes('auth') ||
           error?.message?.includes('session') ||
           error?.message?.includes('token');
  }
  
  private static handleError(error: any, context: string) {
    let errorCode = 'API_ERROR';
    let errorMessage = error.message || 'Unknown error';
    
    // Map specific error types
    if (error.code === 'PGRST301') {
      errorCode = 'RATE_LIMIT';
      errorMessage = 'Too many requests. Please wait and try again.';
    } else if (error.code === 'PGRST116') {
      errorCode = 'NOT_FOUND';
      errorMessage = 'Resource not found.';
    } else if (error.code?.startsWith('PGRST')) {
      errorCode = 'DATABASE_ERROR';
      errorMessage = 'Database operation failed.';
    } else if (error.message?.includes('network')) {
      errorCode = 'NETWORK_ERROR';
      errorMessage = 'Network connection failed.';
    }
    
    ErrorReporter.report(createError(
      errorCode,
      errorMessage,
      error,
      context
    ));
  }
  
  static getRetryCount(key: string): number {
    return this.retryQueue.get(key) || 0;
  }
}