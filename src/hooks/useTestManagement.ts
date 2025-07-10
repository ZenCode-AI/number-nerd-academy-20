
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { studentTestsAPI } from '@/api/student/tests';
import { useToast } from '@/hooks/use-toast';
import { BaseTest, TestAccess } from '@/types/tests';
import { handleApiError, logError } from '@/utils/errorHandling';

export interface TestWithAccess extends BaseTest {
  hasAccess: boolean;
  isPurchased: boolean;
  accessType?: 'free' | 'purchased' | 'subscription';
}

export const useTestManagement = (showPurchased: boolean = false) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tests, setTests] = useState<TestWithAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTests = useCallback(async () => {
    if (!user) {
      setTests([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      if (showPurchased) {
        response = await studentTestsAPI.getPurchasedTests(user.id);
      } else {
        response = await studentTestsAPI.getAvailableTests(user.id);
      }
      
      if (response.success && Array.isArray(response.data)) {
        setTests(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      logError(error, 'useTestManagement.loadTests');
      
      toast({
        title: "Error",
        description: "Failed to load tests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, showPurchased, toast]);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const refreshTests = useCallback(() => {
    loadTests();
  }, [loadTests]);

  return {
    tests,
    isLoading,
    error,
    refreshTests,
  };
};
