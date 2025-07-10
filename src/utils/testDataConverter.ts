
import { SavedTest } from '@/services/testStorage';
import { TestData, TestQuestion } from '@/types/test';

export const convertSavedTestToTestData = (savedTest: SavedTest): TestData => {
  // Convert questions from admin format to test-taking format
  const convertedQuestions: TestQuestion[] = savedTest.questions.map((question) => ({
    id: question.id,
    type: question.type,
    question: question.question,
    options: (question.type === 'MCQ' || (question.type === 'Image' && question.options && question.options.length > 0)) 
      ? question.options : undefined,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation || '',
    points: question.points,
    imageUrl: question.imageUrl,
    difficulty: 'Medium', // Default since admin Question type doesn't have difficulty
    timeLimit: undefined // Admin Question type doesn't have timeLimit
  }));

  // Convert passage if it exists
  const convertedPassage = savedTest.passage ? {
    title: savedTest.passage.title,
    content: savedTest.passage.content,
    imageUrl: savedTest.passage.imageUrl
  } : undefined;

  // Create the TestData object
  const testData: TestData = {
    id: savedTest.id,
    name: savedTest.details.name,
    subject: savedTest.details.subject === 'Math' || savedTest.details.subject === 'English' 
      ? savedTest.details.subject 
      : 'Mixed',
    difficulty: savedTest.details.difficulty === 'Easy' || savedTest.details.difficulty === 'Medium' || savedTest.details.difficulty === 'Hard'
      ? savedTest.details.difficulty
      : 'Mixed',
    duration: savedTest.details.duration,
    questions: convertedQuestions,
    passage: convertedPassage,
    totalPoints: savedTest.totalPoints,
    instructions: savedTest.details.description || 'Follow the instructions for each question carefully.'
  };

  return testData;
};

// Helper function to get test data by ID from localStorage
export const getTestDataById = (testId: string): TestData | null => {
  try {
    const savedTests = JSON.parse(localStorage.getItem('nna_saved_tests') || '[]');
    const savedTest = savedTests.find((test: SavedTest) => test.id === testId);
    
    if (!savedTest) {
      return null;
    }
    
    return convertSavedTestToTestData(savedTest);
  } catch (error) {
    console.error('Error loading test data:', error);
    return null;
  }
};

// Helper function to get all available tests as TestData
export const getAllTestsAsTestData = (): TestData[] => {
  try {
    const savedTests = JSON.parse(localStorage.getItem('nna_saved_tests') || '[]');
    return savedTests
      .filter((test: SavedTest) => test.status === 'Active')
      .map((test: SavedTest) => convertSavedTestToTestData(test));
  } catch (error) {
    console.error('Error loading tests:', error);
    return [];
  }
};
