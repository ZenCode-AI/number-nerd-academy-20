// Legacy modular test storage for backward compatibility
import { testService } from '@/services/supabase/testService';
import { ModularTest } from '@/types/modularTest';

export const modularTestStorage = {
  getAll: async (): Promise<ModularTest[]> => {
    // Convert Supabase tests to modular test format
    const { data, error } = await testService.getAllTests();
    
    if (error || !data) {
      console.error('Error loading modular tests:', error);
      return [];
    }

    // Convert to ModularTest format - simplified for compatibility
    return data.map(test => ({
      id: test.id,
      name: test.name,
      description: test.description || '',
      subject: test.subject,
      difficulty: test.difficulty,
      plan: test.plan,
      status: test.status as 'Draft' | 'Active',
      totalDuration: test.duration,
      totalScore: test.total_score,
      isAdaptive: false,
      modules: [], // This would need to be populated from test_modules table
      adaptiveConfig: null,
      createdAt: test.created_at,
      updatedAt: test.updated_at
    }));
  },

  save: async (test: ModularTest): Promise<void> => {
    try {
      if (test.id) {
        // Update existing test
        await testService.updateTest(test.id, {
      name: test.name,
      description: test.description,
          duration: test.totalDuration,
          plan: test.plan,
          status: test.status as any
        });
      } else {
        // Create new test
        await testService.createTest({
      name: test.name,
      description: test.description,
          duration: test.totalDuration,
          plan: test.plan,
          status: test.status as any,
          totalScore: test.totalScore
        });
      }
    } catch (error) {
      console.error('Error saving modular test:', error);
      throw new Error('Failed to save test');
    }
  },

  create: async (testData: Omit<ModularTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ModularTest> => {
    const { data, error } = await testService.createTest({
      name: testData.name,
      description: testData.description,
      subject: 'Mixed',
      difficulty: 'Medium',
      duration: testData.totalDuration,
      plan: testData.plan,
      status: testData.status as any,
      totalScore: testData.totalScore
    });

    if (error || !data) {
      throw new Error('Failed to create test');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      totalDuration: data.duration,
      totalScore: data.total_score,
      isAdaptive: false,
      modules: [],
      plan: data.plan,
      status: data.status as 'Draft' | 'Active',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  update: async (id: string, testData: Partial<ModularTest>): Promise<ModularTest> => {
    const { data, error } = await testService.updateTest(id, {
      name: testData.name,
      description: testData.description,
      duration: testData.totalDuration,
      plan: testData.plan,
      status: testData.status
    });

    if (error || !data) {
      throw new Error('Test not found');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      totalDuration: data.duration,
      totalScore: data.total_score,
      isAdaptive: false,
      modules: [],
      plan: data.plan,
      status: data.status as 'Draft' | 'Active',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  delete: async (testId: string): Promise<void> => {
    try {
      const { error } = await testService.deleteTest(testId);
      if (error) {
        throw new Error('Failed to delete test');
      }
    } catch (error) {
      console.error('Error deleting modular test:', error);
      throw new Error('Failed to delete test');
    }
  },

  getById: async (testId: string): Promise<ModularTest | null> => {
    const { data, error } = await testService.getTestById(testId);
    
    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      totalDuration: data.duration,
      totalScore: data.total_score,
      isAdaptive: false,
      modules: [],
      plan: data.plan,
      status: data.status as 'Draft' | 'Active',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
};

// Convert modular tests to display format for Tests page
export const convertModularTestForDisplay = (modularTest: ModularTest) => {
  const totalQuestions = modularTest.modules.reduce((total, module) => {
    return total + module.questionCounts.numeric + 
           module.questionCounts.passage + 
           module.questionCounts.image + 
           module.questionCounts.mcq;
  }, 0);

  return {
    id: parseInt(modularTest.id),
    name: modularTest.name,
    subject: modularTest.modules.length > 0 ? modularTest.modules[0].subject : 'Math' as const,
    difficulty: modularTest.modules.length > 0 ? modularTest.modules[0].difficulty : 'Medium' as const,
    plan: modularTest.plan,
    questions: totalQuestions,
    duration: modularTest.totalDuration,
    status: modularTest.status,
    createdAt: modularTest.createdAt.split('T')[0],
    attempts: 0,
    avgScore: 0,
    isModular: true,
    moduleCount: modularTest.modules.length
  };
};