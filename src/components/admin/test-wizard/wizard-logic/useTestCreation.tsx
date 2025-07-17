
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ModularTest } from '@/types/modularTest';
import { calculateTotalTestScore } from '@/utils/testValidation';
import { mapTestError, validateTestData, logTestError } from '@/utils/testErrorHandler';

export const useTestCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateTest = async (testData: Partial<ModularTest>) => {
    try {
      // Validate test data before creation
      const validationErrors = validateTestData(testData);
      const criticalErrors = validationErrors.filter(error => error.severity === 'error');
      
      if (criticalErrors.length > 0) {
        const errorMessage = criticalErrors.map(e => e.message).join(', ');
        toast({
          title: "Validation Failed",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      // Show warnings but allow creation
      const warnings = validationErrors.filter(error => error.severity === 'warning');
      if (warnings.length > 0) {
        toast({
          title: "Please Note",
          description: warnings.map(w => w.message).join(', '),
          duration: 5000,
        });
      }

      // Calculate final total score
      const calculatedScore = testData.modules ? calculateTotalTestScore(testData.modules) : 0;
      const finalScore = testData.totalScore && testData.totalScore > 0 ? testData.totalScore : calculatedScore;

      const now = new Date().toISOString();
      const finalTest: ModularTest = {
        id: Date.now().toString(),
        name: testData.name!,
        description: testData.description || '',
        modules: testData.modules!,
        totalDuration: testData.totalDuration!,
        totalScore: finalScore,
        plan: testData.plan!,
        createdAt: now,
        updatedAt: now,
        status: 'Draft',
        isAdaptive: testData.isAdaptive || false,
        adaptiveRules: testData.adaptiveRules || []
      };

      // Save to storage with error handling
      try {
        const { modularTestStorage } = await import('@/services/modularTestStorage');
        await modularTestStorage.save(finalTest);
        
        toast({
          title: "Test Created Successfully!",
          description: `Test "${finalTest.name}" has been created with ${finalTest.modules.length} modules and is now visible in the Tests section.`,
        });

        // Navigate to tests page to show the created test
        setTimeout(() => {
          navigate('/admin/tests');
        }, 2000);
        
      } catch (storageError) {
        logTestError(storageError, 'SAVE_TO_STORAGE', finalTest);
        const errorInfo = mapTestError(storageError);
        
        toast({
          title: errorInfo.title,
          description: errorInfo.message,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      logTestError(error, 'CREATE_TEST', testData);
      const errorInfo = mapTestError(error);
      
      toast({
        title: errorInfo.title,
        description: errorInfo.message,
        variant: "destructive"
      });
    }
  };

  const resetWizard = () => {
    return {
      name: '',
      description: '',
      modules: [],
      totalDuration: 60,
      totalScore: 0,
      plan: 'Basic',
      status: 'Draft',
      isAdaptive: false,
      adaptiveRules: []
    };
  };

  return {
    handleCreateTest,
    resetWizard
  };
};
