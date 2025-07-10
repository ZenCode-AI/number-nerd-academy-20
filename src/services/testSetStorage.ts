
import { TestSet } from '@/types/testSet';

class TestSetStorageService {
  private storageKey = 'nna_saved_test_sets';

  getAllTestSets(): TestSet[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading test sets:', error);
      return [];
    }
  }

  saveTestSet(testSet: TestSet): void {
    try {
      const testSets = this.getAllTestSets();
      const existingIndex = testSets.findIndex(ts => ts.id === testSet.id);
      
      if (existingIndex >= 0) {
        testSets[existingIndex] = { ...testSet, updatedAt: new Date().toISOString() };
      } else {
        testSets.push(testSet);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(testSets));
    } catch (error) {
      console.error('Error saving test set:', error);
      throw new Error('Failed to save test set');
    }
  }

  getTestSetById(id: string): TestSet | undefined {
    return this.getAllTestSets().find(testSet => testSet.id === id);
  }

  deleteTestSet(id: string): void {
    try {
      const testSets = this.getAllTestSets().filter(testSet => testSet.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(testSets));
    } catch (error) {
      console.error('Error deleting test set:', error);
      throw new Error('Failed to delete test set');
    }
  }

  copyTestSet(originalId: string, modifications?: Partial<TestSet>): TestSet {
    const originalTestSet = this.getTestSetById(originalId);
    if (!originalTestSet) {
      throw new Error('Original test set not found');
    }

    const copiedTestSet: TestSet = {
      ...JSON.parse(JSON.stringify(originalTestSet)),
      id: `testset_${Date.now()}`,
      name: `${originalTestSet.name} (Copy)`,
      status: 'Draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...modifications
    };

    // Update module IDs to ensure uniqueness
    copiedTestSet.modules = copiedTestSet.modules.map((module, index) => ({
      ...module,
      id: `module_${Date.now()}_${index}`
    }));

    this.saveTestSet(copiedTestSet);
    return copiedTestSet;
  }
}

export const testSetStorage = new TestSetStorageService();
