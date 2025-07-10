
export interface TestModule {
  id: string;
  name: string;
  subject: 'Math' | 'English';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCounts: {
    numeric: number;
    passage: number;
    image: number;
    mcq: number;
  };
  questionScores: {
    numeric: number;
    passage: number;
    image: number;
    mcq: number;
  };
  questions: Question[];
  order: number;
  adaptiveRules?: AdaptiveRule[];
  passage?: {
    id: string;
    title: string;
    content: string;
  };
  totalScore?: number;
}

export interface AdaptiveRule {
  id: string;
  sourceModuleId?: string; // The module this rule applies to
  operator: 'greater_than' | 'less_than';
  scoreThreshold: number;
  nextModuleId: string;
  elseModuleId?: string; // Added: Module to go to if condition is not met
  description: string;
}

export interface ModularTest {
  id: string;
  name: string;
  description: string;
  modules: TestModule[];
  totalDuration: number;
  totalScore: number;
  breakDuration?: number; // in seconds, default 300 (5 minutes)
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  createdAt: string;
  updatedAt: string;
  status: 'Draft' | 'Active';
  isAdaptive: boolean;
  adaptiveRules?: AdaptiveRule[];
}

export interface Question {
  id: string;
  type: 'MCQ' | 'Numeric' | 'Image' | 'Paragraph';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  imageUrl?: string;
}

export type WizardStep = 'details' | 'modules' | 'questions' | 'adaptive' | 'review';
