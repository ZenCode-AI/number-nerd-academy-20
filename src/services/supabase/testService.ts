import { supabase } from '@/integrations/supabase/client';
import { mapTestError, logTestError } from '@/utils/testErrorHandler';
import { retryWithBackoff } from '@/utils/authErrorHandler';

export interface TestData {
  id: string;
  name: string;
  description?: string;
  subject: string;
  difficulty: string;
  duration: number;
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  totalScore: number;
  status: 'Draft' | 'Active' | 'Inactive' | 'Archived';
  instructions?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestQuestion {
  id: string;
  testId: string;
  moduleId?: string;
  questionType: 'MCQ' | 'Paragraph' | 'Numeric' | 'Image';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  imageUrl?: string;
  questionOrder: number;
}

export interface TestModule {
  id: string;
  testId: string;
  name: string;
  subject: string;
  difficulty: string;
  moduleOrder: number;
  totalScore: number;
  passageTitle?: string;
  passageContent?: string;
  passageImageUrl?: string;
}

export const testService = {
  // Get all active tests
  async getActiveTests() {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .eq('status', 'Active')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { data, error: null };
      });
      
      return result;
    } catch (error) {
      logTestError(error, 'GET_ACTIVE_TESTS');
      return { data: null, error: mapTestError(error) };
    }
  },

  // Get all tests (admin only)
  async getAllTests() {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { data, error: null };
      });
      
      return result;
    } catch (error) {
      logTestError(error, 'GET_ALL_TESTS');
      return { data: null, error: mapTestError(error) };
    }
  },

  // Get test by ID
  async getTestById(testId: string) {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .eq('id', testId)
          .single();
        
        if (error) throw error;
        return { data, error: null };
      });
      
      return result;
    } catch (error) {
      logTestError(error, 'GET_TEST_BY_ID', { id: testId });
      return { data: null, error: mapTestError(error) };
    }
  },

  // Create new test
  async createTest(testData: Omit<TestData, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Add current user as creator
      const { data: { user } } = await supabase.auth.getUser();
      const dataWithCreator = {
        ...testData,
        created_by: user?.id
      };
      
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('tests')
          .insert([dataWithCreator])
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      });
      
      return result;
    } catch (error) {
      logTestError(error, 'CREATE_TEST', testData);
      return { data: null, error: mapTestError(error) };
    }
  },

  // Update test
  async updateTest(testId: string, updates: Partial<TestData>) {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('tests')
          .update(updates)
          .eq('id', testId)
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      });
      
      return result;
    } catch (error) {
      logTestError(error, 'UPDATE_TEST', { id: testId, updates });
      return { data: null, error: mapTestError(error) };
    }
  },

  // Delete test
  async deleteTest(testId: string) {
    try {
      const result = await retryWithBackoff(async () => {
        const { error } = await supabase
          .from('tests')
          .delete()
          .eq('id', testId);
        
        if (error) throw error;
        return { error: null };
      });
      
      return result;
    } catch (error) {
      logTestError(error, 'DELETE_TEST', { id: testId });
      return { error: mapTestError(error) };
    }
  },

  // Get test questions
  async getTestQuestions(testId: string) {
    const { data, error } = await supabase
      .from('test_questions')
      .select('*')
      .eq('test_id', testId)
      .order('question_order', { ascending: true });
    
    return { data, error };
  },

  // Create test question
  async createTestQuestion(questionData: Omit<TestQuestion, 'id'>) {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('test_questions')
          .insert([{
            test_id: questionData.testId,
            module_id: questionData.moduleId,
            question_type: questionData.questionType,
            question_text: questionData.questionText,
            options: questionData.options,
            correct_answer: questionData.correctAnswer,
            explanation: questionData.explanation,
            points: questionData.points,
            image_url: questionData.imageUrl,
            question_order: questionData.questionOrder
          }])
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      });
      
      return result;
    } catch (error) {
      logTestError(error, 'CREATE_QUESTION', questionData);
      return { data: null, error: mapTestError(error) };
    }
  },

  // Get test modules
  async getTestModules(testId: string) {
    const { data, error } = await supabase
      .from('test_modules')
      .select('*')
      .eq('test_id', testId)
      .order('module_order', { ascending: true });
    
    return { data, error };
  },

  // Create test module
  async createTestModule(moduleData: Omit<TestModule, 'id'>) {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('test_modules')
          .insert([{
            test_id: moduleData.testId,
            name: moduleData.name,
            subject: moduleData.subject,
            difficulty: moduleData.difficulty,
            module_order: moduleData.moduleOrder,
            total_score: moduleData.totalScore,
            passage_title: moduleData.passageTitle,
            passage_content: moduleData.passageContent,
            passage_image_url: moduleData.passageImageUrl
          }])
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      });
      
      return result;
    } catch (error) {
      logTestError(error, 'CREATE_MODULE', moduleData);
      return { data: null, error: mapTestError(error) };
    }
  }
};