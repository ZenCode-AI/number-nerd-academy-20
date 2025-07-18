
import { useState, useCallback, useEffect, useRef } from 'react';
import { TestAnswer } from '@/types/test';
import { TestTakingErrorHandler, TEST_TAKING_ERROR_CODES } from '@/utils/testTakingErrorHandler';
import { testAttemptService } from '@/services/supabase/testAttemptService';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface PendingAnswer {
  questionIndex: number;
  answer: string | string[] | number;
  timestamp: number;
  attempts: number;
}

export const useTestAnswerManager = (attemptId?: string) => {
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOnline } = useNetworkStatus();
  const submitQueueRef = useRef<Map<number, PendingAnswer>>(new Map());

  // Load answers from local storage on mount
  useEffect(() => {
    if (attemptId) {
      loadLocalAnswers(attemptId);
    }
  }, [attemptId]);

  // Process pending submissions when back online
  useEffect(() => {
    if (isOnline && pendingSubmissions.length > 0) {
      processPendingSubmissions();
    }
  }, [isOnline]);

  const loadLocalAnswers = useCallback((attemptId: string) => {
    try {
      const stored = localStorage.getItem(`answers_${attemptId}`);
      if (stored) {
        const localAnswers = JSON.parse(stored);
        setAnswers(localAnswers);
        console.log('📥 Loaded local answers:', localAnswers.length);
      }
    } catch (error) {
      console.error('Failed to load local answers:', error);
    }
  }, []);

  const saveLocalAnswers = useCallback((attemptId: string, answers: TestAnswer[]) => {
    try {
      localStorage.setItem(`answers_${attemptId}`, JSON.stringify(answers));
      console.log('💾 Saved answers locally:', answers.length);
    } catch (error) {
      console.error('Failed to save local answers:', error);
    }
  }, []);

  const submitAnswerToServer = useCallback(async (
    attemptId: string, 
    questionId: string, 
    answer: string | string[] | number
  ): Promise<boolean> => {
    return TestTakingErrorHandler.withRetry(
      async () => {
        const answerString = Array.isArray(answer) ? answer.join(',') : String(answer);
        const { error } = await testAttemptService.saveAnswer(
          attemptId,
          questionId,
          answerString,
          false, // Will be calculated later
          0,     // Will be calculated later
          0      // Time tracking to be added
        );
        
        if (error) throw error;
        return true;
      },
      TEST_TAKING_ERROR_CODES.ANSWER_SAVE_FAILED,
      'answer-submission'
    );
  }, []);

  const processPendingSubmissions = useCallback(async () => {
    if (!attemptId || isSubmitting || pendingSubmissions.length === 0) return;

    setIsSubmitting(true);
    const failedSubmissions: PendingAnswer[] = [];

    for (const pending of pendingSubmissions) {
      try {
        const questionId = `question_${pending.questionIndex}`;
        await submitAnswerToServer(attemptId, questionId, pending.answer);
        console.log(`✅ Submitted pending answer for question ${pending.questionIndex}`);
      } catch (error) {
        console.error(`❌ Failed to submit answer for question ${pending.questionIndex}:`, error);
        
        // Retry logic with max attempts
        if (pending.attempts < 3) {
          failedSubmissions.push({
            ...pending,
            attempts: pending.attempts + 1
          });
        } else {
          console.error(`🚫 Max attempts reached for question ${pending.questionIndex}`);
          TestTakingErrorHandler.handle(error, 'answer-submission-final-failure');
        }
      }
    }

    setPendingSubmissions(failedSubmissions);
    setIsSubmitting(false);
  }, [attemptId, isSubmitting, pendingSubmissions, submitAnswerToServer]);

  const handleAnswerSubmit = useCallback((
    questionIndex: number, 
    answer: string | string[] | number,
    optimistic: boolean = true
  ) => {
    const newAnswer: TestAnswer = {
      questionId: `question_${questionIndex}`,
      questionIndex,
      answer,
      timeSpent: 0,
      flagged: false,
      lastModified: new Date()
    };

    // Optimistic update - update UI immediately
    if (optimistic) {
      setAnswers(prev => {
        const existingIndex = prev.findIndex(a => a.questionIndex === questionIndex);
        let updated;
        
        if (existingIndex >= 0) {
          updated = [...prev];
          updated[existingIndex] = newAnswer;
        } else {
          updated = [...prev, newAnswer];
        }
        
        // Save to local storage
        if (attemptId) {
          saveLocalAnswers(attemptId, updated);
        }
        
        return updated;
      });
    }

    // Handle server submission
    if (attemptId) {
      if (isOnline) {
        // Try immediate submission
        submitAnswerToServer(attemptId, newAnswer.questionId, answer)
          .then(() => {
            console.log(`✅ Answer submitted for question ${questionIndex}`);
            // Remove from submit queue if successful
            submitQueueRef.current.delete(questionIndex);
          })
          .catch(error => {
            console.error(`❌ Failed to submit answer for question ${questionIndex}:`, error);
            
            // Add to pending submissions for retry
            const pendingAnswer: PendingAnswer = {
              questionIndex,
              answer,
              timestamp: Date.now(),
              attempts: 1
            };
            
            setPendingSubmissions(prev => {
              const existingIndex = prev.findIndex(p => p.questionIndex === questionIndex);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = pendingAnswer;
                return updated;
              }
              return [...prev, pendingAnswer];
            });
          });
      } else {
        // Offline - add to pending submissions
        const pendingAnswer: PendingAnswer = {
          questionIndex,
          answer,
          timestamp: Date.now(),
          attempts: 0
        };
        
        setPendingSubmissions(prev => {
          const existingIndex = prev.findIndex(p => p.questionIndex === questionIndex);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = pendingAnswer;
            return updated;
          }
          return [...prev, pendingAnswer];
        });
        
        console.log(`📴 Answer queued for submission when online: question ${questionIndex}`);
      }
    }
  }, [attemptId, isOnline, submitAnswerToServer, saveLocalAnswers]);

  // Retry failed submissions
  const retryFailedSubmissions = useCallback(() => {
    if (pendingSubmissions.length > 0) {
      processPendingSubmissions();
    }
  }, [processPendingSubmissions, pendingSubmissions.length]);

  // Get answer for a specific question
  const getAnswer = useCallback((questionIndex: number): TestAnswer | undefined => {
    return answers.find(a => a.questionIndex === questionIndex);
  }, [answers]);

  // Check if answer is pending submission
  const isPending = useCallback((questionIndex: number): boolean => {
    return pendingSubmissions.some(p => p.questionIndex === questionIndex);
  }, [pendingSubmissions]);

  return {
    answers,
    pendingSubmissions,
    isSubmitting,
    handleAnswerSubmit,
    retryFailedSubmissions,
    getAnswer,
    isPending,
    hasPendingSubmissions: pendingSubmissions.length > 0
  };
};
