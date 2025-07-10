
// Test Set Types for Modular Testing System
export interface TestSet {
  id: string;
  name: string;
  description: string;
  modules: TestSetModule[];
  adaptiveConfig: TestSetAdaptiveConfig;
  totalDuration: number; // in minutes
  breakDuration?: number; // in seconds, default 300 (5 minutes)
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  status: 'Draft' | 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface TestSetModule {
  id: string;
  moduleNumber: number; // 1, 2, 3
  name: string;
  subject: 'Math' | 'English';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
  testId: string; // Reference to the actual test
  duration: number; // in minutes
  breakAfter?: boolean; // Whether to show break after this module
  breakDuration?: number; // Break duration in minutes (default 5)
}

export interface TestSetAdaptiveConfig {
  enabled: boolean;
  rules: AdaptiveRule[];
}

export interface AdaptiveRule {
  fromModule: number;
  toModule: number;
  scoreThreshold: number; // Percentage threshold
  highPerformanceDifficulty: 'Medium' | 'Hard';
  lowPerformanceDifficulty: 'Easy' | 'Medium';
  skipModules?: number[]; // Optional: modules to skip when this rule is applied
}

export interface TestSetSession {
  id: string;
  testSetId: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  currentModule: number;
  moduleResults: ModuleResult[];
  skippedModules: number[]; // Add tracking for skipped modules
  isOnBreak: boolean;
  breakStartTime?: Date;
  breakEndTime?: Date;
  totalTimeSpent: number; // in seconds
  status: 'In Progress' | 'On Break' | 'Completed' | 'Abandoned';
  adaptiveChoices: AdaptiveChoice[];
}

export interface ModuleResult {
  moduleNumber: number;
  moduleId: string;
  testId: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number; // in seconds
  questionsCorrect: number;
  questionsIncorrect: number;
  questionsSkipped: number;
  completedAt: Date;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions?: any[]; // Store questions for review
  userAnswers?: any[]; // Store user answers for review
  flaggedQuestions?: number[]; // Store flagged questions for review
}

export interface AdaptiveChoice {
  afterModule: number;
  nextModule: number;
  selectedDifficulty: 'Easy' | 'Medium' | 'Hard';
  basedOnScore: number;
  threshold: number;
  skippedModules?: number[]; // Track which modules were skipped
}

export interface TestSetAttempt {
  id: string;
  testSetId: string;
  session: TestSetSession;
  finalScore: number;
  finalMaxScore: number;
  finalPercentage: number;
  modulesCompleted: number;
  totalTimeSpent: number;
  completedAt?: Date;
  passed: boolean;
  grade: string;
}
