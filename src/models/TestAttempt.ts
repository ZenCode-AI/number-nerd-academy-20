
// MongoDB TestAttempt Model Schema
export interface TestAttempt {
  _id: string;
  userId: string;
  testId: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Abandoned';
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
  score: number;
  maxScore: number;
  percentage: number;
  answers: Answer[];
  feedback?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    overallComment: string;
  };
  analytics: {
    questionsCorrect: number;
    questionsIncorrect: number;
    questionsSkipped: number;
    averageTimePerQuestion: number;
    difficultyBreakdown: {
      easy: { correct: number; total: number };
      medium: { correct: number; total: number };
      hard: { correct: number; total: number };
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  pointsEarned: number;
  skipped: boolean;
}

// MongoDB Schema (for reference)
export const TestAttemptSchema = {
  userId: { type: String, required: true },
  testId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'Abandoned'], 
    default: 'Not Started' 
  },
  startedAt: { type: Date, required: true },
  completedAt: Date,
  timeSpent: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  maxScore: { type: Number, required: true },
  percentage: { type: Number, default: 0 },
  answers: [{
    questionId: { type: String, required: true },
    userAnswer: String,
    isCorrect: { type: Boolean, default: false },
    timeSpent: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    skipped: { type: Boolean, default: false }
  }],
  feedback: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    overallComment: String
  },
  analytics: {
    questionsCorrect: { type: Number, default: 0 },
    questionsIncorrect: { type: Number, default: 0 },
    questionsSkipped: { type: Number, default: 0 },
    averageTimePerQuestion: { type: Number, default: 0 },
    difficultyBreakdown: {
      easy: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
      medium: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
      hard: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// Indexes for better performance
export const TestAttemptIndexes = [
  { userId: 1, testId: 1 },
  { userId: 1, status: 1 },
  { testId: 1, status: 1 },
  { createdAt: -1 }
];
