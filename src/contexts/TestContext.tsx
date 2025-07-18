
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { TestData, TestQuestion, TestAnswer, TestSession } from '@/types/test';

interface TestContextType {
  testData: TestData | null;
  currentQuestion: number;
  answers: TestAnswer[];
  timeRemaining: number;
  isTestStarted: boolean;
  isTestCompleted: boolean;
  isModuleComplete: boolean;
  currentModule: number;
  nextModule: number;
  session: TestSession | null;
  startTest: (data: TestData) => void;
  submitAnswer: (questionIndex: number, answer: string | string[]) => void;
  navigateToQuestion: (index: number) => void;
  completeTest: () => void;
  submitTest: () => void;
  completeModule: () => void;
  startBreak: (currentMod: number, nextMod: number) => void;
  endBreak: () => void;
  continueToNextModule: () => void;
  isOnBreak: boolean;
  flagQuestion: (questionIndex: number) => void;
}

type TestAction = 
  | { type: 'START_TEST'; payload: TestData }
  | { type: 'SUBMIT_ANSWER'; payload: { questionIndex: number; answer: string | string[] } }
  | { type: 'NAVIGATE_TO_QUESTION'; payload: number }
  | { type: 'COMPLETE_TEST' }
  | { type: 'SUBMIT_TEST' }
  | { type: 'COMPLETE_MODULE' }
  | { type: 'START_BREAK'; payload: { currentModule: number; nextModule: number } }
  | { type: 'END_BREAK' }
  | { type: 'CONTINUE_TO_NEXT_MODULE' }
  | { type: 'TICK_TIMER' }
  | { type: 'FLAG_QUESTION'; payload: number };

interface TestState {
  testData: TestData | null;
  currentQuestion: number;
  answers: TestAnswer[];
  timeRemaining: number;
  isTestStarted: boolean;
  isTestCompleted: boolean;
  isModuleComplete: boolean;
  currentModule: number;
  nextModule: number;
  isOnBreak: boolean;
  session: TestSession | null;
}

const TestContext = createContext<TestContextType | null>(null);

const testReducer = (state: TestState, action: TestAction): TestState => {
  switch (action.type) {
    case 'START_TEST':
      return {
        ...state,
        testData: action.payload,
        isTestStarted: true,
        timeRemaining: action.payload.duration * 60,
        currentModule: 1,
        nextModule: 2,
        session: {
          testId: action.payload.id,
          attemptId: `attempt_${Date.now()}`,
          startTime: new Date(),
          endTime: undefined,
          timeRemaining: action.payload.duration * 60,
          currentQuestionIndex: 0,
          answers: [],
          flaggedQuestions: new Set(),
          isSubmitted: false
        }
      };
    
    case 'SUBMIT_ANSWER':
      const existingAnswerIndex = state.answers.findIndex(a => a.questionIndex === action.payload.questionIndex);
      let updatedAnswers;
      
      if (existingAnswerIndex >= 0) {
        updatedAnswers = [...state.answers];
        updatedAnswers[existingAnswerIndex] = {
          questionIndex: action.payload.questionIndex,
          answer: action.payload.answer,
        };
      } else {
        updatedAnswers = [...state.answers, {
          questionIndex: action.payload.questionIndex,
          answer: action.payload.answer,
        }];
      }
      
      return { ...state, answers: updatedAnswers };
    
    case 'NAVIGATE_TO_QUESTION':
      return { ...state, currentQuestion: action.payload };
    
    case 'COMPLETE_MODULE':
      const totalQuestions = state.testData?.questions.length || 0;
      
      // Digital SAT has 30 questions (3 modules of 10 each)
      if (totalQuestions === 30) {
        const isLastModule = state.currentModule >= 3;
        
        if (isLastModule) {
          return {
            ...state,
            isTestCompleted: true,
            session: state.session ? {
              ...state.session,
              endTime: new Date()
            } : null
          };
        }
        
        return {
          ...state,
          isModuleComplete: true,
          nextModule: state.currentModule + 1
        };
      }
      
      // For other test structures (2 modules)
      const isLastMod = state.currentModule >= 2;
      
      if (isLastMod) {
        return {
          ...state,
          isTestCompleted: true,
          session: state.session ? {
            ...state.session,
            endTime: new Date()
          } : null
        };
      }
      
      return {
        ...state,
        isModuleComplete: true,
        nextModule: state.currentModule + 1
      };
    
    case 'START_BREAK':
      return {
        ...state,
        isOnBreak: true,
        currentModule: action.payload.currentModule,
        nextModule: action.payload.nextModule
      };
    
    case 'END_BREAK':
      return {
        ...state,
        isOnBreak: false
      };
    
    case 'CONTINUE_TO_NEXT_MODULE':
      const questionsPerMod = 10;
      const nextQuestionIndex = (state.currentModule) * questionsPerMod;
      
      return {
        ...state,
        isModuleComplete: false,
        isOnBreak: false,
        currentModule: state.nextModule,
        currentQuestion: nextQuestionIndex,
        nextModule: state.nextModule + 1
      };
    
    case 'COMPLETE_TEST':
      return {
        ...state,
        isTestCompleted: true,
        session: state.session ? {
          ...state.session,
          endTime: new Date()
        } : null
      };
    
    case 'SUBMIT_TEST':
      return {
        ...state,
        isTestCompleted: true,
        session: state.session ? {
          ...state.session,
          endTime: new Date()
        } : null
      };
    
    case 'TICK_TIMER':
      const newTime = Math.max(0, state.timeRemaining - 1);
      if (newTime === 0) {
        return {
          ...state,
          timeRemaining: 0,
          isTestCompleted: true,
          session: state.session ? {
            ...state.session,
            endTime: new Date()
          } : null
        };
      }
      return { ...state, timeRemaining: newTime };
    
    case 'FLAG_QUESTION':
      if (!state.session) return state;
      
      const newFlaggedQuestions = new Set(state.session.flaggedQuestions);
      if (newFlaggedQuestions.has(action.payload)) {
        newFlaggedQuestions.delete(action.payload);
      } else {
        newFlaggedQuestions.add(action.payload);
      }
      
      return {
        ...state,
        session: {
          ...state.session,
          flaggedQuestions: newFlaggedQuestions
        }
      };
    
    default:
      return state;
  }
};

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(testReducer, {
    testData: null,
    currentQuestion: 0,
    answers: [],
    timeRemaining: 0,
    isTestStarted: false,
    isTestCompleted: false,
    isModuleComplete: false,
    currentModule: 1,
    nextModule: 2,
    isOnBreak: false,
    session: null,
  });

  useEffect(() => {
    if (state.isTestStarted && state.timeRemaining > 0 && !state.isTestCompleted && !state.isOnBreak) {
      const timer = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.isTestStarted, state.timeRemaining, state.isTestCompleted, state.isOnBreak]);

  const contextValue: TestContextType = {
    testData: state.testData,
    currentQuestion: state.currentQuestion,
    answers: state.answers,
    timeRemaining: state.timeRemaining,
    isTestStarted: state.isTestStarted,
    isTestCompleted: state.isTestCompleted,
    isModuleComplete: state.isModuleComplete,
    currentModule: state.currentModule,
    nextModule: state.nextModule,
    isOnBreak: state.isOnBreak,
    session: state.session,
    startTest: useCallback((data: TestData) => {
      dispatch({ type: 'START_TEST', payload: data });
    }, []),
    submitAnswer: useCallback((questionIndex: number, answer: string | string[]) => {
      dispatch({ type: 'SUBMIT_ANSWER', payload: { questionIndex, answer } });
    }, []),
    navigateToQuestion: useCallback((index: number) => {
      dispatch({ type: 'NAVIGATE_TO_QUESTION', payload: index });
    }, []),
    completeTest: useCallback(() => {
      dispatch({ type: 'COMPLETE_TEST' });
    }, []),
    submitTest: useCallback(() => {
      dispatch({ type: 'SUBMIT_TEST' });
    }, []),
    completeModule: useCallback(() => {
      dispatch({ type: 'COMPLETE_MODULE' });
    }, []),
    startBreak: useCallback((currentMod: number, nextMod: number) => {
      dispatch({ type: 'START_BREAK', payload: { currentModule: currentMod, nextModule: nextMod } });
    }, []),
    endBreak: useCallback(() => {
      dispatch({ type: 'END_BREAK' });
    }, []),
    continueToNextModule: useCallback(() => {
      dispatch({ type: 'CONTINUE_TO_NEXT_MODULE' });
    }, []),
    flagQuestion: useCallback((questionIndex: number) => {
      dispatch({ type: 'FLAG_QUESTION', payload: questionIndex });
    }, []),
  };

  return <TestContext.Provider value={contextValue}>{children}</TestContext.Provider>;
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};
