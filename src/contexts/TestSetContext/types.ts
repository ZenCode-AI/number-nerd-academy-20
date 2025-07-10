
import { TestSet, TestSetSession, ModuleResult, AdaptiveChoice } from '@/types/testSet';
import { TestData } from '@/types/test';

export interface TestSetContextType {
  testSet: TestSet | null;
  session: TestSetSession | null;
  currentModuleData: TestData | null;
  currentModule: number;
  isOnBreak: boolean;
  breakTimeRemaining: number;
  moduleResults: ModuleResult[];
  adaptiveChoices: AdaptiveChoice[];
  totalProgress: number;
  startTestSet: (testSet: TestSet, originalData: TestData, adminTest?: any) => void;
  completeModule: (result: ModuleResult) => void;
  startBreak: (duration?: number) => void;
  endBreak: () => void;
  getNextModuleDifficulty: (moduleNumber: number, previousScore: number) => 'Easy' | 'Medium' | 'Hard';
  proceedToNextModule: () => void;
  completeTestSet: () => void;
}

export type TestSetAction = 
  | { type: 'START_TEST_SET'; payload: { testSet: TestSet; initialModuleData: TestData } }
  | { type: 'COMPLETE_MODULE'; payload: ModuleResult }
  | { type: 'START_BREAK'; payload: { duration: number } }
  | { type: 'END_BREAK' }
  | { type: 'PROCEED_TO_NEXT_MODULE'; payload: { moduleData: TestData; difficulty: string; nextModuleNumber?: number } }
  | { type: 'COMPLETE_TEST_SET' }
  | { type: 'TICK_BREAK_TIMER' };

export interface TestSetState {
  testSet: TestSet | null;
  session: TestSetSession | null;
  currentModuleData: TestData | null;
  currentModule: number;
  isOnBreak: boolean;
  breakTimeRemaining: number;
  moduleResults: ModuleResult[];
  adaptiveChoices: AdaptiveChoice[];
}
