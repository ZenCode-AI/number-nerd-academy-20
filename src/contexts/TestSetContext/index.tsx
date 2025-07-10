
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TestSetContextType, TestSetState, TestSetAction } from './types';
import { testSetReducer } from './reducer';
import { TestSet, TestSetSession, ModuleResult } from '@/types/testSet';
import { TestData } from '@/types/test';

const initialState: TestSetState = {
  testSet: null,
  session: null,
  currentModuleData: null,
  currentModule: 0,
  isOnBreak: false,
  breakTimeRemaining: 0,
  moduleResults: [],
  adaptiveChoices: []
};

const TestSetContext = createContext<TestSetContextType | undefined>(undefined);

export const TestSetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(testSetReducer, initialState);
  
  // Break timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isOnBreak && state.breakTimeRemaining > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK_BREAK_TIMER' });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isOnBreak, state.breakTimeRemaining]);

  const startTestSet = (testSet: TestSet, originalData: TestData) => {
    dispatch({ 
      type: 'START_TEST_SET', 
      payload: { testSet, initialModuleData: originalData } 
    });
  };

  const completeModule = (result: ModuleResult) => {
    dispatch({ type: 'COMPLETE_MODULE', payload: result });
  };

  const startBreak = (duration: number = 300) => {
    dispatch({ type: 'START_BREAK', payload: { duration } });
  };

  const endBreak = () => {
    dispatch({ type: 'END_BREAK' });
  };

  const getNextModuleDifficulty = (moduleNumber: number, previousScore: number): 'Easy' | 'Medium' | 'Hard' => {
    if (previousScore >= 80) return 'Hard';
    if (previousScore >= 60) return 'Medium';
    return 'Easy';
  };

  const proceedToNextModule = () => {
    if (state.testSet && state.session) {
      const nextModuleNumber = state.currentModule + 1;
      if (nextModuleNumber < state.testSet.modules.length) {
        // Mock module data for next module
        const mockModuleData: TestData = {
          id: `module-${nextModuleNumber}`,
          name: `Module ${nextModuleNumber + 1}`,
          subject: 'Math',
          difficulty: 'Medium',
          duration: 60,
          questions: [],
          totalPoints: 100,
          instructions: `Instructions for module ${nextModuleNumber + 1}`
        };
        
        dispatch({ 
          type: 'PROCEED_TO_NEXT_MODULE', 
          payload: { 
            moduleData: mockModuleData, 
            difficulty: 'Medium',
            nextModuleNumber 
          } 
        });
      }
    }
  };

  const completeTestSet = () => {
    dispatch({ type: 'COMPLETE_TEST_SET' });
  };

  const totalProgress = state.testSet ? 
    (state.moduleResults.length / state.testSet.modules.length) * 100 : 0;

  const contextValue: TestSetContextType = {
    testSet: state.testSet,
    session: state.session,
    currentModuleData: state.currentModuleData,
    currentModule: state.currentModule,
    isOnBreak: state.isOnBreak,
    breakTimeRemaining: state.breakTimeRemaining,
    moduleResults: state.moduleResults,
    adaptiveChoices: state.adaptiveChoices,
    totalProgress,
    startTestSet,
    completeModule,
    startBreak,
    endBreak,
    getNextModuleDifficulty,
    proceedToNextModule,
    completeTestSet
  };

  return (
    <TestSetContext.Provider value={contextValue}>
      {children}
    </TestSetContext.Provider>
  );
};

export const useTestSet = (): TestSetContextType => {
  const context = useContext(TestSetContext);
  if (context === undefined) {
    throw new Error('useTestSet must be used within a TestSetProvider');
  }
  return context;
};
