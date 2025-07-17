import { PostgrestError } from '@supabase/supabase-js';
import { logError } from './errorHandling';

export interface TestErrorInfo {
  message: string;
  title: string;
  action?: string;
  severity: 'error' | 'warning' | 'info';
  field?: string;
}

export const mapTestError = (error: PostgrestError | Error | unknown): TestErrorInfo => {
  if (error && typeof error === 'object' && 'code' in error) {
    const pgError = error as PostgrestError;
    
    switch (pgError.code) {
      case '23505': // Unique constraint violation
        if (pgError.message.includes('test_name')) {
          return {
            title: 'Duplicate Test Name',
            message: 'A test with this name already exists. Please choose a different name.',
            action: 'Change the test name',
            severity: 'error',
            field: 'name'
          };
        }
        return {
          title: 'Duplicate Entry',
          message: 'This entry already exists. Please check your input.',
          action: 'Review and modify your input',
          severity: 'error'
        };
      
      case '23503': // Foreign key constraint violation
        return {
          title: 'Invalid Reference',
          message: 'This operation references data that no longer exists. Please refresh and try again.',
          action: 'Refresh the page and retry',
          severity: 'error'
        };
      
      case '23514': // Check constraint violation
        if (pgError.message.includes('duration')) {
          return {
            title: 'Invalid Duration',
            message: 'Test duration must be between 1 and 480 minutes (8 hours).',
            action: 'Set a valid duration',
            severity: 'error',
            field: 'duration'
          };
        }
        if (pgError.message.includes('total_score')) {
          return {
            title: 'Invalid Score',
            message: 'Total score must be greater than 0.',
            action: 'Set a valid score',
            severity: 'error',
            field: 'totalScore'
          };
        }
        return {
          title: 'Invalid Data',
          message: 'Some data doesn\'t meet the required constraints.',
          action: 'Check your input values',
          severity: 'error'
        };
      
      case '42501': // Insufficient privileges
        return {
          title: 'Permission Denied',
          message: 'You don\'t have permission to perform this action.',
          action: 'Contact your administrator',
          severity: 'error'
        };
      
      case 'PGRST116': // Row not found
        return {
          title: 'Test Not Found',
          message: 'The test you\'re looking for no longer exists or has been deleted.',
          action: 'Return to tests list',
          severity: 'warning'
        };
      
      default:
        if (pgError.message.includes('network')) {
          return {
            title: 'Connection Problem',
            message: 'Unable to connect to the server. Please check your internet connection.',
            action: 'Check connection and retry',
            severity: 'error'
          };
        }
        
        return {
          title: 'Database Error',
          message: pgError.message || 'An unexpected database error occurred.',
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
    
    if (error.message.includes('timeout')) {
      return {
        title: 'Request Timeout',
        message: 'The operation took too long to complete. Please try again.',
        action: 'Retry the operation',
        severity: 'warning'
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
    message: 'An unexpected error occurred while processing your request.',
    action: 'Try again or contact support',
    severity: 'error'
  };
};

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export const validateTestData = (testData: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Required fields validation
  if (!testData.name || testData.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Test name is required',
      severity: 'error'
    });
  } else if (testData.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Test name must be at least 3 characters long',
      severity: 'error'
    });
  } else if (testData.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Test name cannot exceed 100 characters',
      severity: 'error'
    });
  }
  
  if (!testData.subject || testData.subject.trim().length === 0) {
    errors.push({
      field: 'subject',
      message: 'Subject is required',
      severity: 'error'
    });
  }
  
  if (!testData.difficulty) {
    errors.push({
      field: 'difficulty',
      message: 'Difficulty level is required',
      severity: 'error'
    });
  }
  
  if (!testData.plan) {
    errors.push({
      field: 'plan',
      message: 'Subscription plan is required',
      severity: 'error'
    });
  }
  
  // Duration validation
  if (!testData.duration || testData.duration <= 0) {
    errors.push({
      field: 'duration',
      message: 'Duration must be greater than 0 minutes',
      severity: 'error'
    });
  } else if (testData.duration > 480) {
    errors.push({
      field: 'duration',
      message: 'Duration cannot exceed 8 hours (480 minutes)',
      severity: 'error'
    });
  } else if (testData.duration < 5) {
    errors.push({
      field: 'duration',
      message: 'Duration should be at least 5 minutes for meaningful assessment',
      severity: 'warning'
    });
  }
  
  // Modules validation
  if (!testData.modules || testData.modules.length === 0) {
    errors.push({
      field: 'modules',
      message: 'At least one module is required',
      severity: 'error'
    });
  } else {
    // Validate each module
    testData.modules.forEach((module: any, index: number) => {
      if (!module.name || module.name.trim().length === 0) {
        errors.push({
          field: `modules.${index}.name`,
          message: `Module ${index + 1} name is required`,
          severity: 'error'
        });
      }
      
      if (!module.questions || module.questions.length === 0) {
        errors.push({
          field: `modules.${index}.questions`,
          message: `Module ${index + 1} must have at least one question`,
          severity: 'error'
        });
      } else {
        // Validate questions
        module.questions.forEach((question: any, qIndex: number) => {
          if (!question.questionText || question.questionText.trim().length === 0) {
            errors.push({
              field: `modules.${index}.questions.${qIndex}.questionText`,
              message: `Module ${index + 1}, Question ${qIndex + 1}: Question text is required`,
              severity: 'error'
            });
          }
          
          if (!question.correctAnswer || question.correctAnswer.trim().length === 0) {
            errors.push({
              field: `modules.${index}.questions.${qIndex}.correctAnswer`,
              message: `Module ${index + 1}, Question ${qIndex + 1}: Correct answer is required`,
              severity: 'error'
            });
          }
          
          if (question.questionType === 'MCQ' && (!question.options || question.options.length < 2)) {
            errors.push({
              field: `modules.${index}.questions.${qIndex}.options`,
              message: `Module ${index + 1}, Question ${qIndex + 1}: MCQ questions need at least 2 options`,
              severity: 'error'
            });
          }
          
          if (question.points && (question.points <= 0 || question.points > 100)) {
            errors.push({
              field: `modules.${index}.questions.${qIndex}.points`,
              message: `Module ${index + 1}, Question ${qIndex + 1}: Points must be between 1 and 100`,
              severity: 'error'
            });
          }
        });
      }
    });
  }
  
  // Business logic validation
  if (testData.modules && testData.modules.length > 0) {
    const totalQuestions = testData.modules.reduce((sum: number, module: any) => 
      sum + (module.questions ? module.questions.length : 0), 0);
    
    if (totalQuestions === 0) {
      errors.push({
        field: 'questions',
        message: 'Test must have at least one question across all modules',
        severity: 'error'
      });
    } else if (totalQuestions > 200) {
      errors.push({
        field: 'questions',
        message: 'Test has too many questions. Consider splitting into multiple tests.',
        severity: 'warning'
      });
    }
    
    // Check if duration is reasonable for number of questions
    if (testData.duration && totalQuestions > 0) {
      const timePerQuestion = testData.duration / totalQuestions;
      if (timePerQuestion < 0.5) {
        errors.push({
          field: 'duration',
          message: 'Duration may be too short for the number of questions',
          severity: 'warning'
        });
      } else if (timePerQuestion > 10) {
        errors.push({
          field: 'duration',
          message: 'Duration may be too long for the number of questions',
          severity: 'warning'
        });
      }
    }
  }
  
  return errors;
};

export const logTestError = (error: unknown, context: string, testData?: any): void => {
  const errorInfo = mapTestError(error);
  const logContext = `TEST_${context}`;
  
  logError(error, logContext);
  
  // Log additional context for test errors
  console.error(`[${logContext}] Test Error Details:`, {
    title: errorInfo.title,
    message: errorInfo.message,
    severity: errorInfo.severity,
    field: errorInfo.field,
    testData: testData ? {
      name: testData.name,
      id: testData.id,
      modulesCount: testData.modules?.length || 0
    } : undefined,
    timestamp: new Date().toISOString()
  });
};