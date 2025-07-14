import { supabase } from '@/integrations/supabase/client';

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  totalScore: number;
  maxScore: number;
  timeSpent: number;
  currentQuestionIndex: number;
  answers: Record<string, any>;
}

export interface UserAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
}

export const testAttemptService = {
  // Create new test attempt
  async createAttempt(testId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('test_attempts')
      .insert([{
        test_id: testId,
        user_id: session.user.id,
        status: 'in_progress'
      }])
      .select()
      .single();

    return { data, error };
  },

  // Get user's attempts for a test
  async getUserAttempts(testId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('test_id', testId)
      .eq('user_id', session.user.id)
      .order('started_at', { ascending: false });

    return { data, error };
  },

  // Get attempt by ID
  async getAttemptById(attemptId: string) {
    const { data, error } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    return { data, error };
  },

  // Update attempt
  async updateAttempt(attemptId: string, updates: Partial<TestAttempt>) {
    const { data, error } = await supabase
      .from('test_attempts')
      .update({
        status: updates.status,
        completed_at: updates.completedAt,
        total_score: updates.totalScore,
        max_score: updates.maxScore,
        time_spent: updates.timeSpent,
        current_question_index: updates.currentQuestionIndex,
        answers: updates.answers
      })
      .eq('id', attemptId)
      .select()
      .single();

    return { data, error };
  },

  // Save user answer
  async saveAnswer(attemptId: string, questionId: string, userAnswer: string, isCorrect: boolean, pointsEarned: number, timeSpent: number) {
    const { data, error } = await supabase
      .from('user_answers')
      .upsert([{
        attempt_id: attemptId,
        question_id: questionId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        time_spent: timeSpent
      }], {
        onConflict: 'attempt_id,question_id'
      })
      .select()
      .single();

    return { data, error };
  },

  // Get answers for an attempt
  async getAttemptAnswers(attemptId: string) {
    const { data, error } = await supabase
      .from('user_answers')
      .select('*')
      .eq('attempt_id', attemptId);

    return { data, error };
  },

  // Complete attempt
  async completeAttempt(attemptId: string, totalScore: number, maxScore: number, timeSpent: number) {
    const { data, error } = await supabase
      .from('test_attempts')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        total_score: totalScore,
        max_score: maxScore,
        time_spent: timeSpent
      })
      .eq('id', attemptId)
      .select()
      .single();

    return { data, error };
  }
};