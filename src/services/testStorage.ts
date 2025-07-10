import { TestDetails, Question, EnglishPassage } from '@/types/admin';

export interface SavedTest {
  id: string;
  details: TestDetails;
  questions: Question[];
  passage?: EnglishPassage;
  totalPoints: number;
  createdAt: string;
  lastModified: string;
  status: 'Active' | 'Draft';
}

class TestStorageService {
  private storageKey = 'nna_saved_tests';

  getAllTests(): SavedTest[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tests:', error);
      return [];
    }
  }

  saveTest(test: SavedTest): void {
    try {
      const tests = this.getAllTests();
      const existingIndex = tests.findIndex(t => t.id === test.id);
      
      if (existingIndex >= 0) {
        tests[existingIndex] = { ...test, lastModified: new Date().toISOString() };
      } else {
        tests.push(test);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(tests));
    } catch (error) {
      console.error('Error saving test:', error);
      throw new Error('Failed to save test');
    }
  }

  getTestById(id: string): SavedTest | undefined {
    return this.getAllTests().find(test => test.id === id);
  }

  deleteTest(id: string): void {
    try {
      const tests = this.getAllTests().filter(test => test.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(tests));
    } catch (error) {
      console.error('Error deleting test:', error);
      throw new Error('Failed to delete test');
    }
  }

  copyTest(originalId: string, modifications?: Partial<TestDetails>): SavedTest {
    const originalTest = this.getTestById(originalId);
    if (!originalTest) {
      throw new Error('Original test not found');
    }

    // Deep copy the test
    const copiedTest: SavedTest = {
      ...JSON.parse(JSON.stringify(originalTest)),
      id: Date.now().toString(),
      details: {
        ...originalTest.details,
        name: `${originalTest.details.name} (Copy)`,
        ...modifications
      },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'Draft' as const
    };

    // Update question IDs to ensure uniqueness
    copiedTest.questions = copiedTest.questions.map(question => ({
      ...question,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    // Update passage ID if exists
    if (copiedTest.passage) {
      copiedTest.passage = {
        ...copiedTest.passage,
        id: Date.now().toString()
      };
    }

    this.saveTest(copiedTest);
    return copiedTest;
  }

  createTestFromTemplate(
    templateData: {
      details: Partial<TestDetails>;
      questions: Question[];
      passage?: EnglishPassage;
    }
  ): SavedTest {
    const newTest: SavedTest = {
      id: Date.now().toString(),
      details: {
        name: '',
        subject: 'Math',
        difficulty: 'Medium',
        duration: 60,
        plan: 'Basic',
        description: '',
        ...templateData.details
      },
      questions: templateData.questions.map(q => ({
        ...q,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })),
      passage: templateData.passage ? {
        ...templateData.passage,
        id: Date.now().toString()
      } : undefined,
      totalPoints: templateData.questions.reduce((sum, q) => sum + q.points, 0),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'Draft'
    };

    this.saveTest(newTest);
    return newTest;
  }
}

export const testStorage = new TestStorageService();
