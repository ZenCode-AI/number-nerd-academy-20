
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ModularTest } from '@/types/modularTest';
import { calculateTotalTestScore } from '@/utils/testValidation';

export const useTestCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateTest = async (testData: Partial<ModularTest>) => {
    try {
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

      // Save to storage
      const { modularTestStorage } = await import('@/services/modularTestStorage');
      modularTestStorage.save(finalTest);
      
      toast({
        title: "Test Created Successfully!",
        description: `Test "${finalTest.name}" has been created with ${finalTest.modules.length} modules and is now visible in the Tests section.`,
      });

      // Navigate to tests page to show the created test
      setTimeout(() => {
        navigate('/admin/tests');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating test:', error);
      toast({
        title: "Error Creating Test",
        description: "There was an error saving your test. Please try again.",
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
