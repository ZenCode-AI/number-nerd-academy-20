
export interface TestSession {
  testId: string;
  attemptId: string;
  startTime: Date;
  endTime?: Date;
  timeRemaining: number; // in seconds
  currentQuestionIndex: number;
  answers: TestAnswer[];
  flaggedQuestions: Set<number>;
  isSubmitted: boolean;
  autoSaveEnabled: boolean;
}

export interface TestAnswer {
  questionId: string;
  questionIndex: number;
  answer: string | string[] | number;
  timeSpent: number; // in seconds
  isCorrect?: boolean;
  pointsEarned?: number;
  flagged: boolean;
  lastModified: Date;
}

export interface TestQuestion {
  id: string;
  type: 'MCQ' | 'Numeric' | 'Image' | 'Paragraph';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  imageUrl?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit?: number;
}

export interface TestData {
  id: string;
  name: string;
  subject: 'Math' | 'English' | 'Mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  duration: number; // in minutes
  questions: TestQuestion[];
  passage?: {
    title: string;
    content: string;
    imageUrl?: string;
  };
  totalPoints: number;
  instructions: string;
}

export interface TestResult {
  attemptId: string;
  testId: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  questionsSkipped: number;
  completedAt: Date;
}
