// Legacy test set storage for backward compatibility
import { testService } from '@/services/supabase/testService';
import { TestSet } from '@/types/testSet';

class TestSetStorageService {
  private storageKey = 'nna_saved_test_sets';

  async getAllTestSets(): Promise<TestSet[]> {
    try {
      // Get tests from Supabase
      const { data, error } = await testService.getAllTests();
      
      if (error || !data) {
        console.error('Error loading test sets:', error);
        return [];
      }

      // Convert to TestSet format - simplified for compatibility
      return data.map(test => ({
        id: test.id,
        name: test.name,
        description: test.description || '',
        modules: [], // This would need to be populated from test_modules table
        status: test.status as 'Draft' | 'Active' | 'Archived',
        plan: test.plan,
        totalDuration: test.duration || 0,
        createdAt: test.created_at,
        updatedAt: test.updated_at,
        adaptiveConfig: null
      }));
    } catch (error) {
      console.error('Error loading test sets:', error);
      return [];
    }
  }

  async saveTestSet(testSet: TestSet): Promise<void> {
    try {
      if (testSet.id) {
        // Update existing test
        await testService.updateTest(testSet.id, {
          name: testSet.name,
          description: testSet.description,
          status: testSet.status as any,
          plan: testSet.plan
        });
      } else {
        // Create new test
        await testService.createTest({
          name: testSet.name,
          description: testSet.description,
          subject: 'Mixed', // Default subject
          difficulty: 'Medium', // Default difficulty
          duration: 60, // Default duration
          plan: testSet.plan,
          status: testSet.status as any,
          totalScore: 0
        });
      }
    } catch (error) {
      console.error('Error saving test set:', error);
      throw new Error('Failed to save test set');
    }
  }

  async getTestSetById(id: string): Promise<TestSet | undefined> {
    const { data, error } = await testService.getTestById(id);
    
    if (error || !data) {
      return undefined;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      modules: [],
      status: data.status as 'Draft' | 'Active' | 'Archived',
      totalDuration: data.duration || 0,
      plan: data.plan,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      adaptiveConfig: null
    };
  }

  async deleteTestSet(id: string): Promise<void> {
    try {
      const { error } = await testService.deleteTest(id);
      if (error) {
        throw new Error('Failed to delete test set');
      }
    } catch (error) {
      console.error('Error deleting test set:', error);
      throw new Error('Failed to delete test set');
    }
  }

  async copyTestSet(originalId: string, modifications?: Partial<TestSet>): Promise<TestSet> {
    const originalTestSet = await this.getTestSetById(originalId);
    if (!originalTestSet) {
      throw new Error('Original test set not found');
    }

    const { data, error } = await testService.createTest({
      name: `${originalTestSet.name} (Copy)`,
      description: originalTestSet.description,
      subject: 'Mixed',
      difficulty: 'Medium',
      duration: 60,
      plan: originalTestSet.plan,
      status: 'Draft' as any,
      totalScore: 0,
      ...modifications
    });

    if (error || !data) {
      throw new Error('Failed to copy test set');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      modules: [],
      status: data.status as 'Draft' | 'Active' | 'Archived',
      totalDuration: data.duration || 0,
      plan: data.plan,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      adaptiveConfig: null
    };
  }
}

export const testSetStorage = new TestSetStorageService();