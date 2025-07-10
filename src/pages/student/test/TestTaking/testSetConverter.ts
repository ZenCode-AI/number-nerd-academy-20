
import { TestData } from '@/types/test';
import { TestSet } from '@/types/testSet';
import { modularTestStorage } from '@/services/modularTestStorage';

export const convertToTestSet = (testData: TestData): TestSet => {
  // Check if this is an admin-created modular test
  const adminTest = modularTestStorage.getById(testData.id);
  if (adminTest) {
    return convertModularTestToTestSet(adminTest);
  }

  if (testData.id === 'digital-sat-practice') {
    return {
      id: testData.id,
      name: testData.name,
      description: 'Digital SAT Practice Test with adaptive modules',
      totalDuration: testData.duration,
      modules: [
        {
          id: 'math-module-1',
          moduleNumber: 1,
          name: 'Math Module 1',
          subject: 'Math',
          difficulty: 'Medium',
          testId: 'sat-math-1',
          duration: 45,
          breakAfter: true,
          breakDuration: 300, // 5 minutes
        },
        {
          id: 'reading-module',
          moduleNumber: 2,
          name: 'Reading Module',
          subject: 'English',
          difficulty: 'Medium',
          testId: 'sat-reading',
          duration: 45,
          breakAfter: true,
          breakDuration: 300, // 5 minutes
        },
        {
          id: 'math-module-2',
          moduleNumber: 3,
          name: 'Math Module 2',
          subject: 'Math',
          difficulty: 'Adaptive',
          testId: 'sat-math-2',
          duration: 45,
          breakAfter: false,
        },
      ],
      adaptiveConfig: {
        enabled: true,
        rules: [
          {
            fromModule: 1,
            toModule: 3,
            scoreThreshold: 70,
            highPerformanceDifficulty: 'Hard',
            lowPerformanceDifficulty: 'Medium',
          },
        ],
      },
      plan: 'Free',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  return {
    id: testData.id,
    name: testData.name,
    description: testData.instructions,
    totalDuration: testData.duration,
    modules: [
      {
        id: 'module-1',
        moduleNumber: 1,
        name: 'Module 1',
        subject: testData.subject as 'Math' | 'English',
        difficulty: 'Medium',
        testId: `${testData.id}-mod-1`,
        duration: testData.duration / 2,
        breakAfter: true,
        breakDuration: 300, // 5 minutes
      },
      {
        id: 'module-2',
        moduleNumber: 2,
        name: 'Module 2',
        subject: testData.subject as 'Math' | 'English',
        difficulty: 'Medium',
        testId: `${testData.id}-mod-2`,
        duration: testData.duration / 2,
        breakAfter: false,
      },
    ],
    adaptiveConfig: {
      enabled: false,
      rules: [],
    },
    plan: 'Free',
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Convert admin ModularTest to TestSet format
const convertModularTestToTestSet = (modularTest: any): TestSet => {
  const modules = modularTest.modules.map((module: any, index: number) => ({
    id: module.id,
    moduleNumber: index + 1,
    name: module.name,
    subject: module.subject,
    difficulty: module.difficulty,
    testId: module.id,
    duration: Math.ceil(modularTest.totalDuration / modularTest.modules.length),
    breakAfter: index < modularTest.modules.length - 1,
    breakDuration: 300, // 5 minutes
  }));

  const adaptiveRules = modularTest.adaptiveRules?.map((rule: any) => {
    const fromModuleIndex = modularTest.modules.findIndex((m: any) => m.id === rule.sourceModuleId);
    const toModuleIndex = modularTest.modules.findIndex((m: any) => m.id === rule.nextModuleId);
    const elseModuleIndex = rule.elseModuleId ? modularTest.modules.findIndex((m: any) => m.id === rule.elseModuleId) : -1;
    
    console.log('🔄 Converting adaptive rule:', {
      sourceModuleId: rule.sourceModuleId,
      nextModuleId: rule.nextModuleId,
      elseModuleId: rule.elseModuleId,
      fromModuleIndex,
      toModuleIndex,
      elseModuleIndex
    });
    
    const convertedRule = {
      fromModule: fromModuleIndex + 1,
      toModule: toModuleIndex + 1,
      scoreThreshold: rule.scoreThreshold,
      highPerformanceDifficulty: rule.operator === 'greater_than' ? 'Hard' : 'Medium',
      lowPerformanceDifficulty: rule.operator === 'less_than' ? 'Easy' : 'Medium',
      skipModules: rule.elseModuleId && elseModuleIndex >= 0 ? 
        // If there's an else module, create skip list for modules between current and else
        Array.from({length: elseModuleIndex - fromModuleIndex}, (_, i) => fromModuleIndex + i + 2).filter(m => m !== elseModuleIndex + 1)
        : undefined
    };
    
    console.log('✅ Converted rule:', convertedRule);
    return convertedRule;
  }) || [];

  return {
    id: modularTest.id,
    name: modularTest.name,
    description: modularTest.description,
    totalDuration: modularTest.totalDuration,
    modules,
    adaptiveConfig: {
      enabled: modularTest.isAdaptive,
      rules: adaptiveRules,
    },
    plan: modularTest.plan,
    status: modularTest.status,
    createdAt: modularTest.createdAt,
    updatedAt: new Date().toISOString(),
  };
};
