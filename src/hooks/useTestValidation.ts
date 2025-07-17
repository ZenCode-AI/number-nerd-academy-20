import { useState, useCallback } from 'react';
import { validateTestData, ValidationError } from '@/utils/testErrorHandler';

export const useTestValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateStep = useCallback((testData: any, step: string): boolean => {
    setIsValidating(true);
    const errors = validateTestData(testData);
    
    // Filter errors relevant to current step
    let stepErrors: ValidationError[] = [];
    
    switch (step) {
      case 'details':
        stepErrors = errors.filter(error => 
          ['name', 'subject', 'difficulty', 'plan', 'duration'].includes(error.field)
        );
        break;
      case 'modules':
        stepErrors = errors.filter(error => 
          error.field.startsWith('modules') && !error.field.includes('questions')
        );
        break;
      case 'questions':
        stepErrors = errors.filter(error => 
          error.field.includes('questions') || error.field === 'questions'
        );
        break;
      default:
        stepErrors = errors;
    }
    
    setValidationErrors(stepErrors);
    setIsValidating(false);
    
    // Only block on error severity, allow warnings
    return stepErrors.filter(e => e.severity === 'error').length === 0;
  }, []);

  const validateField = useCallback((testData: any, fieldName: string): ValidationError | null => {
    const allErrors = validateTestData(testData);
    return allErrors.find(error => error.field === fieldName) || null;
  }, []);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  const getFieldError = useCallback((fieldName: string): ValidationError | undefined => {
    return validationErrors.find(error => error.field === fieldName);
  }, [validationErrors]);

  return {
    validationErrors,
    isValidating,
    validateStep,
    validateField,
    clearValidationErrors,
    getFieldError,
    hasErrors: validationErrors.filter(e => e.severity === 'error').length > 0,
    hasWarnings: validationErrors.filter(e => e.severity === 'warning').length > 0
  };
};