
import { TestSet, ModuleResult, AdaptiveChoice } from '@/types/testSet';
import { TestData } from '@/types/test';

export const calculateTestSetProgress = (
  moduleResults: ModuleResult[],
  totalModules: number
): number => {
  return totalModules > 0 ? (moduleResults.length / totalModules) * 100 : 0;
};

export const calculateOverallScore = (moduleResults: ModuleResult[]): {
  totalScore: number;
  maxScore: number;
  percentage: number;
} => {
  const totalScore = moduleResults.reduce((sum, result) => sum + result.score, 0);
  const maxScore = moduleResults.reduce((sum, result) => sum + result.maxScore, 0);
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  return { totalScore, maxScore, percentage };
};

export const determineNextModuleDifficulty = (
  previousScore: number,
  adaptiveRules?: any[]
): 'Easy' | 'Medium' | 'Hard' => {
  if (!adaptiveRules || adaptiveRules.length === 0) {
    // Default adaptive logic
    if (previousScore >= 80) return 'Hard';
    if (previousScore >= 60) return 'Medium';
    return 'Easy';
  }

  // Apply custom adaptive rules with else conditions
  for (const rule of adaptiveRules) {
    const conditionMet = rule.operator === 'greater_than' 
      ? previousScore > rule.scoreThreshold
      : previousScore < rule.scoreThreshold;

    if (conditionMet) {
      // Use the main condition result
      return rule.highPerformanceDifficulty || 'Hard';
    } else if (rule.elseModuleId) {
      // Use the else condition result
      return rule.lowPerformanceDifficulty || 'Easy';
    }
  }

  return 'Easy';
};

export const shouldShowBreak = (
  currentModuleIndex: number,
  testSet: TestSet
): boolean => {
  if (currentModuleIndex >= testSet.modules.length - 1) {
    return false; // No break after last module
  }

  const currentModule = testSet.modules[currentModuleIndex];
  return currentModule.breakAfter === true;
};

export const getBreakDuration = (
  currentModuleIndex: number,
  testSet: TestSet
): number => {
  const currentModule = testSet.modules[currentModuleIndex];
  return currentModule.breakDuration || 300; // Default 5 minutes
};

export const createMockModuleData = (
  moduleId: string,
  moduleNumber: number,
  difficulty: 'Easy' | 'Medium' | 'Hard'
): TestData => {
  return {
    id: moduleId,
    name: `Module ${moduleNumber}`,
    subject: 'Math',
    difficulty,
    duration: 60,
    questions: [],
    totalPoints: 100,
    instructions: `Instructions for module ${moduleNumber}`
  };
};

export const getModuleData = (
  testSet: TestSet,
  moduleNumber: number,
  originalData: TestData,
  adminTestData?: any
): TestData => {
  console.log('🔍 getModuleData called:', { 
    moduleNumber, 
    testSetId: testSet.id, 
    adminTestData: !!adminTestData,
    totalModules: testSet.modules.length 
  });
  
  // Find the module in the test set
  const module = testSet.modules.find(m => m.moduleNumber === moduleNumber);
  
  if (!module) {
    console.error('❌ Module not found for moduleNumber:', moduleNumber, 'Available modules:', testSet.modules.map(m => m.moduleNumber));
    return createMockModuleData(`module-${moduleNumber}`, moduleNumber, 'Medium');
  }

  console.log('📚 Found module:', {
    name: module.name,
    testId: module.testId,
    subject: module.subject,
    difficulty: module.difficulty,
    duration: module.duration
  });

  // If we have admin test data, extract module-specific questions
  if (adminTestData && adminTestData.modules) {
    const adminModule = adminTestData.modules.find((m: any) => m.id === module.testId);
    if (adminModule && adminModule.questions) {
      console.log('✅ Using admin module questions:', {
        moduleId: adminModule.id,
        questionsCount: adminModule.questions.length,
        totalScore: adminModule.totalScore,
        hasPassage: !!adminModule.passage
      });
      
      return {
        id: module.testId,
        name: module.name,
        subject: module.subject,
        difficulty: module.difficulty === 'Adaptive' ? 'Medium' : module.difficulty,
        duration: module.duration,
        questions: adminModule.questions,
        totalPoints: adminModule.totalScore || adminModule.questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0),
        instructions: originalData.instructions || `Instructions for ${module.name}`,
        passage: adminModule.passage
      };
    } else {
      console.warn('⚠️ Admin module not found or has no questions:', {
        searchedId: module.testId,
        availableModules: adminTestData.modules?.map((m: any) => ({ id: m.id, questionsCount: m.questions?.length || 0 }))
      });
    }
  }

  // For non-admin tests, distribute questions by module
  const totalModules = testSet.modules.length;
  const questionsPerModule = Math.floor((originalData.questions?.length || 0) / totalModules);
  const startIndex = (moduleNumber - 1) * questionsPerModule;
  const endIndex = moduleNumber === totalModules 
    ? originalData.questions?.length || 0 
    : startIndex + questionsPerModule;
  
  const moduleQuestions = originalData.questions?.slice(startIndex, endIndex) || [];
  console.log('📝 Distributed questions for module', moduleNumber, ':', {
    questionsCount: moduleQuestions.length,
    startIndex,
    endIndex,
    totalOriginalQuestions: originalData.questions?.length || 0
  });

  return {
    id: module.testId,
    name: module.name,
    subject: module.subject,
    difficulty: module.difficulty === 'Adaptive' ? 'Medium' : module.difficulty,
    duration: module.duration,
    questions: moduleQuestions,
    totalPoints: moduleQuestions.reduce((sum, q) => sum + (q.points || 10), 0),
    instructions: originalData.instructions || `Instructions for ${module.name}`
  };
};

// New function to handle adaptive rule evaluation with else conditions
export const evaluateAdaptiveRules = (
  sourceModuleId: string,
  score: number,
  adaptiveRules: any[]
): string | null => {
  const applicableRules = adaptiveRules.filter(rule => rule.sourceModuleId === sourceModuleId);
  
  for (const rule of applicableRules) {
    const conditionMet = rule.operator === 'greater_than' 
      ? score > rule.scoreThreshold
      : score < rule.scoreThreshold;

    if (conditionMet) {
      console.log(`Adaptive rule condition met: ${rule.description}`);
      return rule.nextModuleId;
    } else if (rule.elseModuleId) {
      console.log(`Adaptive rule else condition triggered: ${rule.description}`);
      return rule.elseModuleId;
    }
  }

  return null; // No applicable rules found
};
