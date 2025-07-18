import { toast } from '@/hooks/use-toast';

export interface TestTakingError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  retryable: boolean;
}

export const TEST_TAKING_ERROR_CODES = {
  // Network & Connection
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONNECTION_LOST: 'CONNECTION_LOST',
  TIMEOUT: 'TIMEOUT',
  
  // Session & State
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  STATE_CORRUPTED: 'STATE_CORRUPTED',
  TIMER_DESYNC: 'TIMER_DESYNC',
  
  // Answer Submission
  ANSWER_SAVE_FAILED: 'ANSWER_SAVE_FAILED',
  SUBMISSION_CONFLICT: 'SUBMISSION_CONFLICT',
  INVALID_ANSWER_FORMAT: 'INVALID_ANSWER_FORMAT',
  
  // Navigation & UI
  NAVIGATION_BLOCKED: 'NAVIGATION_BLOCKED',
  COMPONENT_CRASH: 'COMPONENT_CRASH',
  RENDER_ERROR: 'RENDER_ERROR',
  
  // Test Content
  QUESTION_LOAD_FAILED: 'QUESTION_LOAD_FAILED',
  MODULE_TRANSITION_FAILED: 'MODULE_TRANSITION_FAILED',
  TEST_DATA_CORRUPTED: 'TEST_DATA_CORRUPTED'
} as const;

const errorMap: Record<string, TestTakingError> = {
  [TEST_TAKING_ERROR_CODES.NETWORK_ERROR]: {
    code: 'NETWORK_ERROR',
    message: 'Network connection failed. Your progress is being saved locally.',
    severity: 'medium',
    recoverable: true,
    retryable: true
  },
  [TEST_TAKING_ERROR_CODES.CONNECTION_LOST]: {
    code: 'CONNECTION_LOST',
    message: 'Connection lost. Working offline - your answers are being saved locally.',
    severity: 'medium',
    recoverable: true,
    retryable: true
  },
  [TEST_TAKING_ERROR_CODES.TIMEOUT]: {
    code: 'TIMEOUT',
    message: 'Request timed out. Please try again.',
    severity: 'low',
    recoverable: true,
    retryable: true
  },
  [TEST_TAKING_ERROR_CODES.SESSION_EXPIRED]: {
    code: 'SESSION_EXPIRED',
    message: 'Your session has expired. Please sign in again.',
    severity: 'critical',
    recoverable: false,
    retryable: false
  },
  [TEST_TAKING_ERROR_CODES.STATE_CORRUPTED]: {
    code: 'STATE_CORRUPTED',
    message: 'Test state error detected. Restoring from backup...',
    severity: 'high',
    recoverable: true,
    retryable: false
  },
  [TEST_TAKING_ERROR_CODES.TIMER_DESYNC]: {
    code: 'TIMER_DESYNC',
    message: 'Timer synchronization issue. Reconnecting...',
    severity: 'medium',
    recoverable: true,
    retryable: true
  },
  [TEST_TAKING_ERROR_CODES.ANSWER_SAVE_FAILED]: {
    code: 'ANSWER_SAVE_FAILED',
    message: 'Failed to save answer. Retrying automatically...',
    severity: 'medium',
    recoverable: true,
    retryable: true
  },
  [TEST_TAKING_ERROR_CODES.SUBMISSION_CONFLICT]: {
    code: 'SUBMISSION_CONFLICT',
    message: 'Answer conflict detected. Using most recent response.',
    severity: 'low',
    recoverable: true,
    retryable: false
  },
  [TEST_TAKING_ERROR_CODES.INVALID_ANSWER_FORMAT]: {
    code: 'INVALID_ANSWER_FORMAT',
    message: 'Invalid answer format. Please try again.',
    severity: 'low',
    recoverable: true,
    retryable: false
  },
  [TEST_TAKING_ERROR_CODES.NAVIGATION_BLOCKED]: {
    code: 'NAVIGATION_BLOCKED',
    message: 'Navigation temporarily blocked. Please wait...',
    severity: 'low',
    recoverable: true,
    retryable: true
  },
  [TEST_TAKING_ERROR_CODES.COMPONENT_CRASH]: {
    code: 'COMPONENT_CRASH',
    message: 'Interface error occurred. Reloading component...',
    severity: 'high',
    recoverable: true,
    retryable: false
  },
  [TEST_TAKING_ERROR_CODES.RENDER_ERROR]: {
    code: 'RENDER_ERROR',
    message: 'Display error. Refreshing view...',
    severity: 'medium',
    recoverable: true,
    retryable: false
  },
  [TEST_TAKING_ERROR_CODES.QUESTION_LOAD_FAILED]: {
    code: 'QUESTION_LOAD_FAILED',
    message: 'Failed to load question. Retrying...',
    severity: 'medium',
    recoverable: true,
    retryable: true
  },
  [TEST_TAKING_ERROR_CODES.MODULE_TRANSITION_FAILED]: {
    code: 'MODULE_TRANSITION_FAILED',
    message: 'Failed to transition to next module. Retrying...',
    severity: 'high',
    recoverable: true,
    retryable: true
  },
  [TEST_TAKING_ERROR_CODES.TEST_DATA_CORRUPTED]: {
    code: 'TEST_DATA_CORRUPTED',
    message: 'Test data corruption detected. Restoring from backup...',
    severity: 'critical',
    recoverable: true,
    retryable: false
  }
};

export class TestTakingErrorHandler {
  private static retryAttempts = new Map<string, number>();
  private static maxRetries = 3;
  
  static handle(error: any, context?: string): TestTakingError {
    const mappedError = this.mapError(error, context);
    this.logError(mappedError, error, context);
    this.displayError(mappedError);
    return mappedError;
  }
  
  private static mapError(error: any, context?: string): TestTakingError {
    // Network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network')) {
      return errorMap[TEST_TAKING_ERROR_CODES.NETWORK_ERROR];
    }
    
    // Connection errors
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return errorMap[TEST_TAKING_ERROR_CODES.TIMEOUT];
    }
    
    // Authentication errors
    if (error?.message?.includes('auth') || error?.status === 401) {
      return errorMap[TEST_TAKING_ERROR_CODES.SESSION_EXPIRED];
    }
    
    // Database/state errors
    if (error?.code?.startsWith('PGRST') || error?.message?.includes('state')) {
      return errorMap[TEST_TAKING_ERROR_CODES.STATE_CORRUPTED];
    }
    
    // Context-specific errors
    if (context?.includes('answer') || context?.includes('submit')) {
      return errorMap[TEST_TAKING_ERROR_CODES.ANSWER_SAVE_FAILED];
    }
    
    if (context?.includes('timer')) {
      return errorMap[TEST_TAKING_ERROR_CODES.TIMER_DESYNC];
    }
    
    if (context?.includes('question') || context?.includes('load')) {
      return errorMap[TEST_TAKING_ERROR_CODES.QUESTION_LOAD_FAILED];
    }
    
    if (context?.includes('module') || context?.includes('transition')) {
      return errorMap[TEST_TAKING_ERROR_CODES.MODULE_TRANSITION_FAILED];
    }
    
    // Default network error
    return errorMap[TEST_TAKING_ERROR_CODES.NETWORK_ERROR];
  }
  
  private static logError(testError: TestTakingError, originalError: any, context?: string) {
    console.error('[Test Taking Error]', {
      code: testError.code,
      message: testError.message,
      severity: testError.severity,
      context,
      originalError,
      timestamp: new Date().toISOString()
    });
  }
  
  private static displayError(error: TestTakingError) {
    const toastVariant = error.severity === 'critical' ? 'destructive' : 
                        error.severity === 'high' ? 'destructive' : 
                        'default';
    
    toast({
      title: error.severity === 'critical' ? 'Critical Error' : 'Test Taking Issue',
      description: error.message,
      variant: toastVariant,
      duration: error.severity === 'critical' ? 10000 : 5000
    });
  }
  
  static async withRetry<T>(
    operation: () => Promise<T>,
    errorCode: string,
    context?: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    const attemptKey = `${errorCode}-${context || 'default'}`;
    const currentAttempts = this.retryAttempts.get(attemptKey) || 0;
    
    try {
      const result = await operation();
      // Reset retry count on success
      this.retryAttempts.delete(attemptKey);
      return result;
    } catch (error) {
      const testError = this.mapError(error, context);
      
      if (testError.retryable && currentAttempts < maxRetries) {
        this.retryAttempts.set(attemptKey, currentAttempts + 1);
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, currentAttempts), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`Retrying operation (attempt ${currentAttempts + 1}/${maxRetries})`);
        return this.withRetry(operation, errorCode, context, maxRetries);
      }
      
      // Max retries reached or not retryable
      this.retryAttempts.delete(attemptKey);
      throw this.handle(error, context);
    }
  }
  
  static isRecoverable(error: TestTakingError): boolean {
    return error.recoverable;
  }
  
  static shouldRetry(error: TestTakingError): boolean {
    return error.retryable;
  }
  
  static reset() {
    this.retryAttempts.clear();
  }
}