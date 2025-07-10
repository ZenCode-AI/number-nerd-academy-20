
import { ModularTest, TestModule } from '@/types/modularTest';

const STORAGE_KEY = 'modular_tests';

export const modularTestStorage = {
  getAll: (): ModularTest[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading modular tests:', error);
      return [];
    }
  },

  save: (test: ModularTest): void => {
    try {
      const tests = modularTestStorage.getAll();
      const existingIndex = tests.findIndex(t => t.id === test.id);
      
      if (existingIndex >= 0) {
        tests[existingIndex] = test;
      } else {
        tests.push(test);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
    } catch (error) {
      console.error('Error saving modular test:', error);
      throw new Error('Failed to save test');
    }
  },

  create: (testData: Omit<ModularTest, 'id' | 'createdAt' | 'updatedAt'>): ModularTest => {
    const now = new Date().toISOString();
    const newTest: ModularTest = {
      ...testData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    
    modularTestStorage.save(newTest);
    return newTest;
  },

  update: (id: string, testData: Partial<ModularTest>): ModularTest => {
    const tests = modularTestStorage.getAll();
    const existingIndex = tests.findIndex(t => t.id === id);
    
    if (existingIndex === -1) {
      throw new Error('Test not found');
    }
    
    const updatedTest = { 
      ...tests[existingIndex], 
      ...testData,
      updatedAt: new Date().toISOString()
    };
    tests[existingIndex] = updatedTest;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
    return updatedTest;
  },

  delete: (testId: string): void => {
    try {
      const tests = modularTestStorage.getAll().filter(t => t.id !== testId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
    } catch (error) {
      console.error('Error deleting modular test:', error);
      throw new Error('Failed to delete test');
    }
  },

  getById: (testId: string): ModularTest | null => {
    const tests = modularTestStorage.getAll();
    return tests.find(t => t.id === testId) || null;
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
