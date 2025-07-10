import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { TestSetContextType, TestSetState } from './TestSetContext/types';
import { testSetReducer } from './TestSetContext/reducer';
import { getModuleData } from './TestSetContext/utils';
import { TestData } from '@/types/test';

const TestSetContext = createContext<TestSetContextType | null>(null);

export const TestSetProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(testSetReducer, {
    testSet: null,
    session: null,
    currentModuleData: null,
    currentModule: 1,
    isOnBreak: false,
    breakTimeRemaining: 0,
    moduleResults: [],
    adaptiveChoices: [],
  });

  const [originalTestData, setOriginalTestData] = React.useState<TestData | null>(null);
  const [adminTestData, setAdminTestData] = React.useState<any | null>(null);

  // Break timer effect
  useEffect(() => {
    if (state.isOnBreak && state.breakTimeRemaining > 0) {
      console.log('⏰ Break timer running:', state.breakTimeRemaining);
      const timer = setInterval(() => {
        dispatch({ type: 'TICK_BREAK_TIMER' });
      }, 1000);
      return () => clearInterval(timer);
    } else if (state.isOnBreak && state.breakTimeRemaining === 0) {
      console.log('⏰ Break timer finished, auto-ending break');
      dispatch({ type: 'END_BREAK' });
    }
  }, [state.isOnBreak, state.breakTimeRemaining]);

  const getNextModuleNumber = useCallback((currentModuleNumber: number, lastResult?: any): number => {
    console.log('🔍 getNextModuleNumber called:', { 
      currentModuleNumber, 
      adaptiveEnabled: state.testSet?.adaptiveConfig.enabled, 
      hasResult: !!lastResult,
      availableRules: state.testSet?.adaptiveConfig.rules.length || 0,
      skippedModules: state.session?.skippedModules || []
    });
    
    if (!state.testSet?.adaptiveConfig.enabled || !lastResult) {
      let nextModule = currentModuleNumber + 1;
      
      // Skip any modules that are in the skipped list
      while (state.session?.skippedModules.includes(nextModule) && nextModule <= (state.testSet?.modules.length || 0)) {
        console.log('⏭️ Skipping module:', nextModule, '(in skipped list)');
        nextModule++;
      }
      
      console.log('➡️ Non-adaptive progression:', currentModuleNumber, '→', nextModule);
      return nextModule;
    }

    // Find applicable adaptive rules for current module
    const applicableRules = state.testSet.adaptiveConfig.rules.filter(
      rule => rule.fromModule === currentModuleNumber
    );

    console.log('📋 Applicable rules for module', currentModuleNumber, ':', applicableRules);

    if (applicableRules.length > 0) {
      // Use the first applicable rule (can be enhanced for multiple rules)
      const rule = applicableRules[0];
      const percentage = lastResult.percentage;
      const meetsThreshold = percentage >= rule.scoreThreshold;
      
      let nextModule: number;
      if (meetsThreshold) {
        nextModule = rule.toModule;
        console.log('✅ Score threshold met:', percentage, '>=', rule.scoreThreshold, ', jumping to module:', nextModule);
      } else {
        // Go to next sequential module, but skip any that should be skipped
        nextModule = currentModuleNumber + 1;
        while (state.session?.skippedModules.includes(nextModule) && nextModule <= (state.testSet?.modules.length || 0)) {
          console.log('⏭️ Skipping module:', nextModule, '(threshold not met)');
          nextModule++;
        }
        console.log('➡️ Score threshold not met, proceeding to module:', nextModule);
      }
      
      console.log('🔄 Adaptive rule applied:', { 
        rule: { fromModule: rule.fromModule, toModule: rule.toModule, threshold: rule.scoreThreshold },
        score: percentage, 
        threshold: rule.scoreThreshold,
        meetsThreshold,
        nextModule 
      });
      
      return nextModule;
    }

    let defaultNext = currentModuleNumber + 1;
    
    // Skip any modules that are in the skipped list
    while (state.session?.skippedModules.includes(defaultNext) && defaultNext <= (state.testSet?.modules.length || 0)) {
      console.log('⏭️ Skipping module:', defaultNext, '(in skipped list)');
      defaultNext++;
    }
    
    console.log('➡️ No adaptive rules, default progression:', currentModuleNumber, '→', defaultNext);
    return defaultNext;
  }, [state.testSet, state.session]);

  const getNextModuleDifficulty = useCallback((moduleNumber: number, previousScore: number): 'Easy' | 'Medium' | 'Hard' => {
    if (!state.testSet?.adaptiveConfig.enabled) {
      return 'Medium';
    }

    const rule = state.testSet.adaptiveConfig.rules.find(r => r.fromModule === moduleNumber - 1 && r.toModule === moduleNumber);
    if (!rule) {
      return 'Medium';
    }

    return previousScore >= rule.scoreThreshold ? rule.highPerformanceDifficulty : rule.lowPerformanceDifficulty;
  }, [state.testSet]);

  const getTotalProgress = useCallback((): number => {
    if (!state.testSet) return 0;
    
    // Calculate progress including skipped modules
    const totalModules = state.testSet.modules.length;
    const completedModules = state.moduleResults.length;
    const skippedModules = state.session?.skippedModules.length || 0;
    
    return ((completedModules + skippedModules) / totalModules) * 100;
  }, [state.testSet, state.moduleResults, state.session]);

  const contextValue: TestSetContextType = {
    testSet: state.testSet,
    session: state.session,
    currentModuleData: state.currentModuleData,
    currentModule: state.currentModule,
    isOnBreak: state.isOnBreak,
    breakTimeRemaining: state.breakTimeRemaining,
    moduleResults: state.moduleResults,
    adaptiveChoices: state.adaptiveChoices,
    totalProgress: getTotalProgress(),
    
    startTestSet: useCallback((testSet, originalData, adminTest = null) => {
      console.log('🚀 TestSetContext: Starting test set:', testSet.name, 'isAdmin:', !!adminTest);
      setOriginalTestData(originalData);
      setAdminTestData(adminTest);
      
      const initialModuleData = getModuleData(testSet, 1, originalData, adminTest);
      console.log('📝 TestSetContext: Initial module data loaded:', initialModuleData.name, 'questions:', initialModuleData.questions.length);
      
      dispatch({ 
        type: 'START_TEST_SET', 
        payload: { testSet, initialModuleData } 
      });
    }, []),
    
    completeModule: useCallback((result) => {
      console.log('✅ TestSetContext: completeModule called for module:', result.moduleNumber);
      console.log('🔍 Current state before completion:', {
        currentModule: state.currentModule,
        testSetModules: state.testSet?.modules.length,
        moduleResultsLength: state.moduleResults.length,
        resultModuleNumber: result.moduleNumber,
        adaptiveEnabled: state.testSet?.adaptiveConfig.enabled
      });
      
      dispatch({ type: 'COMPLETE_MODULE', payload: result });
      
      // Check if this would be the last module after adaptive skipping
      const nextModuleNumber = getNextModuleNumber(result.moduleNumber, result);
      const totalModules = state.testSet?.modules.length || 0;
      
      console.log('📊 Module completion analysis:', {
        nextModule: nextModuleNumber,
        totalModules,
        isLastModule: nextModuleNumber > totalModules,
        skippedModules: state.session?.skippedModules || []
      });
      
      if (nextModuleNumber > totalModules) {
        console.log('🏁 TestSetContext: All modules completed (including adaptive skipping)');
        setTimeout(() => {
          dispatch({ type: 'COMPLETE_TEST_SET' });
        }, 100);
      } else {
        console.log('📚 TestSetContext: More modules remaining, will continue or start break');
      }
    }, [state.currentModule, state.testSet, state.moduleResults, state.session, getNextModuleNumber]),
    
    startBreak: useCallback((duration = 300) => {
      console.log('☕ TestSetContext: Starting break for:', Math.round(duration / 60), 'minutes (', duration, 'seconds)');
      dispatch({ type: 'START_BREAK', payload: { duration } });
    }, []),
    
    endBreak: useCallback(() => {
      console.log('🏃 TestSetContext: endBreak called');
      dispatch({ type: 'END_BREAK' });
    }, []),
    
    getNextModuleDifficulty,
    
    proceedToNextModule: useCallback(() => {
      console.log('🔄 TestSetContext: proceedToNextModule called');
      console.log('🔍 Current state:', {
        currentModule: state.currentModule,
        testSetModules: state.testSet?.modules.length,
        isOnBreak: state.isOnBreak,
        hasOriginalTestData: !!originalTestData,
        hasAdminTestData: !!adminTestData,
        skippedModules: state.session?.skippedModules || []
      });
      
      if (!state.testSet || !originalTestData) {
        console.error('❌ TestSetContext: Cannot proceed - missing testSet or originalTestData');
        return;
      }
      
      // Get the last completed module result for adaptive evaluation
      const lastResult = state.moduleResults[state.moduleResults.length - 1];
      const nextModuleNumber = getNextModuleNumber(state.currentModule, lastResult);
      
      console.log('➡️ TestSetContext: Determined next module:', nextModuleNumber);
      
      if (nextModuleNumber > state.testSet.modules.length) {
        console.log('🏁 TestSetContext: All modules completed in proceedToNextModule');
        dispatch({ type: 'COMPLETE_TEST_SET' });
        return;
      }
      
      console.log('📚 TestSetContext: Loading data for module:', nextModuleNumber);
      const nextModuleData = getModuleData(state.testSet, nextModuleNumber, originalTestData, adminTestData);
      console.log('✅ TestSetContext: Next module data loaded:', nextModuleData.name, 'questions:', nextModuleData.questions.length);
      
      dispatch({ 
        type: 'PROCEED_TO_NEXT_MODULE', 
        payload: { 
          moduleData: nextModuleData, 
          difficulty: 'Medium',
          nextModuleNumber 
        } 
      });
      
      console.log('✅ TestSetContext: proceedToNextModule dispatch completed');
    }, [state.testSet, state.currentModule, state.isOnBreak, state.moduleResults, state.session, originalTestData, adminTestData, getNextModuleNumber]),
    
    completeTestSet: useCallback(() => {
      console.log('🎉 TestSetContext: Completing entire test set');
      dispatch({ type: 'COMPLETE_TEST_SET' });
    }, []),
  };

  return <TestSetContext.Provider value={contextValue}>{children}</TestSetContext.Provider>;
};

export const useTestSet = () => {
  const context = useContext(TestSetContext);
  if (!context) {
    throw new Error('useTestSet must be used within a TestSetProvider');
  }
  return context;
};
