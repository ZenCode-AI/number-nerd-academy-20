
import { TestSet } from '@/types/testSet';
import { TestData } from '@/types/test';
import { ModularTest } from '@/types/modularTest';

export const getModuleData = (testSet: TestSet, moduleNumber: number, originalData: TestData, adminTest?: ModularTest | null): TestData => {
  console.log('🔍 getModuleData called:', { 
    testSetId: testSet.id, 
    moduleNumber, 
    hasAdminTest: !!adminTest,
    totalModules: testSet.modules.length 
  });
  
  const moduleConfig = testSet.modules.find(m => m.moduleNumber === moduleNumber);
  if (!moduleConfig) {
    console.error('❌ Module config not found for module:', moduleNumber);
    return originalData;
  }

  // For admin-created tests, use the actual module data
  if (adminTest) {
    console.log('📚 Using admin test data for module:', moduleNumber);
    
    // Find the corresponding module in admin test (0-based index)
    const adminModule = adminTest.modules[moduleNumber - 1];
    if (adminModule) {
      const moduleData: TestData = {
        id: adminModule.id,
        name: adminModule.name,
        subject: adminModule.subject,
        difficulty: adminModule.difficulty,
        duration: Math.ceil(adminTest.totalDuration / adminTest.modules.length),
        questions: adminModule.questions.map(q => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
          imageUrl: q.imageUrl,
          difficulty: adminModule.difficulty // Add the missing difficulty property
        })),
        totalPoints: adminModule.questions.reduce((sum, q) => sum + (q.points || 1), 0),
        instructions: `Complete all questions in ${adminModule.name}. You have ${Math.ceil(adminTest.totalDuration / adminTest.modules.length)} minutes.`,
        passage: adminModule.passage
      };
      
      console.log('✅ Admin module data prepared:', {
        moduleId: moduleData.id,
        moduleName: moduleData.name,
        questionsCount: moduleData.questions.length,
        totalPoints: moduleData.totalPoints
      });
      
      return moduleData;
    }
  }

  // For built-in tests like Digital SAT
  const mockModuleData: TestData = {
    id: moduleConfig.testId,
    name: moduleConfig.name,
    subject: moduleConfig.subject,
    difficulty: moduleConfig.difficulty === 'Adaptive' ? 'Medium' : moduleConfig.difficulty,
    duration: moduleConfig.duration,
    questions: generateMockQuestions(moduleConfig.subject, moduleConfig.difficulty === 'Adaptive' ? 'Medium' : moduleConfig.difficulty),
    totalPoints: 100,
    instructions: `Complete all questions in ${moduleConfig.name}. You have ${moduleConfig.duration} minutes.`
  };

  console.log('✅ Mock module data prepared:', {
    moduleId: mockModuleData.id,
    moduleName: mockModuleData.name,
    questionsCount: mockModuleData.questions.length
  });

  return mockModuleData;
};

const generateMockQuestions = (subject: 'Math' | 'English', difficulty: 'Easy' | 'Medium' | 'Hard') => {
  const questionCount = 15;
  const questions = [];
  
  for (let i = 0; i < questionCount; i++) {
    if (subject === 'Math') {
      questions.push({
        id: `math-${difficulty.toLowerCase()}-${i + 1}`,
        type: 'MCQ' as const,
        question: `Math ${difficulty} Question ${i + 1}: Solve for x in the equation 2x + 5 = 13`,
        options: ['x = 4', 'x = 6', 'x = 8', 'x = 10'],
        correctAnswer: '0', // Index-based: first option is correct
        explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
        points: 1,
        difficulty: difficulty
      });
    } else {
      questions.push({
        id: `english-${difficulty.toLowerCase()}-${i + 1}`,
        type: 'MCQ' as const,
        question: `English ${difficulty} Question ${i + 1}: Choose the correct grammar usage.`,
        options: ['Their going to the store', 'There going to the store', "They're going to the store", 'Theyre going to the store'],
        correctAnswer: '2', // Index-based: third option is correct
        explanation: "They're is the contraction for 'they are'",
        points: 1,
        difficulty: difficulty
      });
    }
  }
  
  return questions;
};
