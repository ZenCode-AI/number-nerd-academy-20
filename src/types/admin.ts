
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

export interface EnglishPassage {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface TestDetails {
  name: string;
  subject: 'Math' | 'English';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  description: string;
}

export interface Test {
  id: string;
  details: TestDetails;
  questions: Question[];
  passage?: EnglishPassage; // For English tests
  totalPoints: number;
  createdAt: string;
  status: 'Draft' | 'Active';
}

export interface AdaptiveTestConfig {
  subject: 'Math' | 'English';
  module1TestId: string;
  module2TestId?: string;
  module3TestId?: string;
  threshold: number;
}
