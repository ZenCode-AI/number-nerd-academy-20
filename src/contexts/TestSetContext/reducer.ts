
import { TestSetState, TestSetAction } from './types';

export const testSetReducer = (state: TestSetState, action: TestSetAction): TestSetState => {
  switch (action.type) {
    case 'START_TEST_SET':
      return {
        ...state,
        testSet: action.payload.testSet,
        currentModuleData: action.payload.initialModuleData,
        currentModule: 1, // Start at module 1, not 0
        session: {
          id: Date.now().toString(),
          testSetId: action.payload.testSet.id,
          studentId: 'current-student',
          startTime: new Date(),
          currentModule: 1, // Start at module 1, not 0
          moduleResults: [],
          skippedModules: [],
          isOnBreak: false,
          totalTimeSpent: 0,
          status: 'In Progress',
          adaptiveChoices: []
        },
        moduleResults: [],
        adaptiveChoices: [],
        isOnBreak: false,
        breakTimeRemaining: 0
      };

    case 'COMPLETE_MODULE':
      const newSkippedModules = [...(state.session?.skippedModules || [])];
      
      // Calculate which modules should be skipped based on adaptive rules
      if (state.testSet?.adaptiveConfig.enabled && state.testSet.adaptiveConfig.rules.length > 0) {
        const applicableRules = state.testSet.adaptiveConfig.rules.filter(
          rule => rule.fromModule === action.payload.moduleNumber
        );
        
        if (applicableRules.length > 0) {
          const rule = applicableRules[0];
          const percentage = action.payload.percentage;
          const meetsThreshold = percentage >= rule.scoreThreshold;
          
          console.log('🔄 Adaptive rule evaluation:', {
            moduleNumber: action.payload.moduleNumber,
            score: percentage,
            threshold: rule.scoreThreshold,
            meetsThreshold,
            fromModule: rule.fromModule,
            toModule: rule.toModule
          });
          
          if (meetsThreshold) {
            // Skip modules between current and target
            const currentModule = action.payload.moduleNumber;
            const targetModule = rule.toModule;
            
            for (let i = currentModule + 1; i < targetModule; i++) {
              if (!newSkippedModules.includes(i)) {
                newSkippedModules.push(i);
                console.log('⏭️ Skipping module:', i);
              }
            }
          } else if (rule.skipModules) {
            // Add any modules specified in skipModules
            rule.skipModules.forEach(moduleNum => {
              if (!newSkippedModules.includes(moduleNum)) {
                newSkippedModules.push(moduleNum);
                console.log('⏭️ Skipping module (rule-based):', moduleNum);
              }
            });
          }
        }
      }
      
      return {
        ...state,
        moduleResults: [...state.moduleResults, action.payload],
        session: state.session ? {
          ...state.session,
          moduleResults: [...state.session.moduleResults, action.payload],
          skippedModules: newSkippedModules
        } : null
      };

    case 'START_BREAK':
      return {
        ...state,
        isOnBreak: true,
        breakTimeRemaining: action.payload.duration,
        session: state.session ? {
          ...state.session,
          isOnBreak: true,
          breakStartTime: new Date()
        } : null
      };

    case 'END_BREAK':
      return {
        ...state,
        isOnBreak: false,
        breakTimeRemaining: 0,
        session: state.session ? {
          ...state.session,
          isOnBreak: false,
          breakEndTime: new Date()
        } : null
      };

    case 'PROCEED_TO_NEXT_MODULE':
      return {
        ...state,
        currentModule: action.payload.nextModuleNumber || state.currentModule + 1,
        currentModuleData: action.payload.moduleData,
        session: state.session ? {
          ...state.session,
          currentModule: action.payload.nextModuleNumber || state.currentModule + 1
        } : null
      };

    case 'COMPLETE_TEST_SET':
      return {
        ...state,
        session: state.session ? {
          ...state.session,
          status: 'Completed',
          endTime: new Date()
        } : null
      };

    case 'TICK_BREAK_TIMER':
      return {
        ...state,
        breakTimeRemaining: Math.max(0, state.breakTimeRemaining - 1)
      };

    default:
      return state;
  }
};
