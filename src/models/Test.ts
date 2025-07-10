
// MongoDB Test Model Schema
export interface Test {
  _id: string;
  name: string;
  subject: 'Math' | 'English';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  module: 1 | 2 | 3; // For adaptive testing
  duration: number; // in minutes
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  description: string;
  questions: Question[];
  passage?: EnglishPassage; // For English tests
  totalPoints: number;
  adaptiveThreshold?: number; // Percentage threshold for adaptive testing
  parentTestId?: string; // For linked adaptive tests
  tags: string[];
  status: 'Draft' | 'Active' | 'Archived';
  createdBy: string; // Admin user ID
  createdAt: Date;
  updatedAt: Date;
  analytics: {
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
  };
}

export interface Question {
  _id: string;
  type: 'MCQ' | 'Numeric' | 'Image' | 'Paragraph';
  question: string;
  options: string[]; // For MCQ
  correctAnswer: string;
  explanation: string;
  points: number;
  imageUrl?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  timeLimit?: number; // in seconds
}

export interface EnglishPassage {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  wordCount: number;
  readingLevel: string;
}

// MongoDB Schema (for reference)
export const TestSchema = {
  name: { type: String, required: true },
  subject: { type: String, enum: ['Math', 'English'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  module: { type: Number, enum: [1, 2, 3], required: true },
  duration: { type: Number, required: true },
  plan: { type: String, enum: ['Free', 'Basic', 'Standard', 'Premium'], required: true },
  description: { type: String, required: true },
  questions: [{
    type: { type: String, enum: ['MCQ', 'Numeric', 'Image', 'Paragraph'], required: true },
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    points: { type: Number, required: true },
    imageUrl: String,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    tags: [String],
    timeLimit: Number
  }],
  passage: {
    title: String,
    content: String,
    imageUrl: String,
    wordCount: Number,
    readingLevel: String
  },
  totalPoints: { type: Number, required: true },
  adaptiveThreshold: Number,
  parentTestId: { type: String },
  tags: [String],
  status: { type: String, enum: ['Draft', 'Active', 'Archived'], default: 'Draft' },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  analytics: {
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  }
};
