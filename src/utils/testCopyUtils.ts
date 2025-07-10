import { ModularTest, TestModule, Question, AdaptiveRule } from '@/types/modularTest';

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Deep copy a question with new ID
export const copyQuestion = (question: Question): Question => ({
  ...question,
  id: generateId()
});

// Deep copy a module with new IDs for all questions
export const copyModule = (module: TestModule): TestModule => ({
  ...module,
  id: generateId(),
  questions: module.questions.map(copyQuestion)
});

// Deep copy an adaptive rule with new ID
export const copyAdaptiveRule = (rule: AdaptiveRule, moduleIdMap: Record<string, string>): AdaptiveRule => ({
  ...rule,
  id: generateId(),
  // Update module references to new module IDs
  sourceModuleId: moduleIdMap[rule.sourceModuleId] || rule.sourceModuleId,
  nextModuleId: moduleIdMap[rule.nextModuleId] || rule.nextModuleId
});

// Deep copy entire test with new IDs for everything
export const copyTest = (
  originalTest: ModularTest, 
  modifications: { name: string; plan?: string; description?: string }
): ModularTest => {
  // Copy modules and create ID mapping
  const newModules = originalTest.modules.map(copyModule);
  const moduleIdMap: Record<string, string> = {};
  
  originalTest.modules.forEach((originalModule, index) => {
    moduleIdMap[originalModule.id] = newModules[index].id;
  });

  // Copy adaptive rules with updated module references
  const newAdaptiveRules = originalTest.adaptiveRules?.map(rule => 
    copyAdaptiveRule(rule, moduleIdMap)
  ) || [];

  return {
    ...originalTest,
    id: generateId(),
    name: modifications.name,
    description: modifications.description || originalTest.description,
    plan: (modifications.plan as any) || originalTest.plan,
    modules: newModules,
    adaptiveRules: newAdaptiveRules,
    status: 'Draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Validate test name uniqueness
export const isTestNameUnique = (name: string, excludeId?: string): boolean => {
  try {
    const { modularTestStorage } = require('@/services/modularTestStorage');
    const allTests = modularTestStorage.getAll();
    
    return !allTests.some(test => 
      test.name.toLowerCase() === name.toLowerCase() && 
      test.id !== excludeId
    );
  } catch (error) {
    console.error('Error checking test name uniqueness:', error);
    return true; // If there's an error, assume the name is unique
  }
};

// Generate unique test name
export const generateUniqueTestName = (baseName: string): string => {
  let counter = 1;
  let newName = `${baseName} (Copy)`;
  
  while (!isTestNameUnique(newName)) {
    counter++;
    newName = `${baseName} (Copy ${counter})`;
  }
  
  return newName;
};