
import { ModularTest, TestModule, Question } from '@/types/modularTest';

export const validateTestName = async (name: string, excludeId?: string): Promise<string | null> => {
  if (!name.trim()) {
    return "Test name is required";
  }
  
  try {
    const { modularTestStorage } = await import('@/services/modularTestStorage');
    const existingTests = await modularTestStorage.getAll();
    const isDuplicate = existingTests.some(test => 
      test.name.toLowerCase() === name.toLowerCase() && test.id !== excludeId
    );
    
    if (isDuplicate) {
      return "A test with this name already exists";
    }
  } catch (error) {
    console.warn('Could not validate test name:', error);
  }
  
  return null;
};

export const validateModuleName = (name: string, modules: TestModule[], excludeId?: string): string | null => {
  if (!name.trim()) {
    return "Module name is required";
  }
  
  const isDuplicate = modules.some(module => 
    module.name.toLowerCase() === name.toLowerCase() && module.id !== excludeId
  );
  
  if (isDuplicate) {
    return "A module with this name already exists";
  }
  
  return null;
};

export const validateMCQOptions = (options: string[]): string | null => {
  const validOptions = options.filter(opt => opt.trim().length > 0);
  
  if (validOptions.length < 2) {
    return "MCQ questions must have at least 2 options";
  }
  
  return null;
};

// New validation functions
export const validateMCQDuplicates = (options: string[]): string | null => {
  const validOptions = options.filter(opt => opt.trim().length > 0);
  const normalizedOptions = validOptions.map(opt => opt.trim().toLowerCase());
  const uniqueOptions = new Set(normalizedOptions);
  
  if (uniqueOptions.size !== validOptions.length) {
    return "MCQ options cannot be identical. Please ensure all options are unique.";
  }
  
  return null;
};

export const validatePointAllocation = (
  questionType: keyof TestModule['questionCounts'],
  currentPoints: number,
  moduleConfig: TestModule
): { isValid: boolean; error?: string; remainingPoints?: number } => {
  const maxPointsPerQuestion = moduleConfig.questionScores[questionType];
  const totalQuestionsOfType = moduleConfig.questionCounts[questionType];
  const maxTotalPoints = maxPointsPerQuestion * totalQuestionsOfType;
  
  // Calculate points already used by existing questions of this type
  const existingPointsUsed = moduleConfig.questions
    .filter(q => {
      const typeMapping: Record<Question['type'], keyof TestModule['questionCounts']> = {
        'MCQ': 'mcq',
        'Numeric': 'numeric',
        'Image': 'image',
        'Paragraph': 'passage'
      };
      return typeMapping[q.type] === questionType;
    })
    .reduce((sum, q) => sum + q.points, 0);
  
  const remainingPoints = maxTotalPoints - existingPointsUsed;
  
  if (currentPoints > remainingPoints) {
    return {
      isValid: false,
      error: `Points exceed limit. Maximum ${remainingPoints} points available for this question type.`,
      remainingPoints
    };
  }
  
  return { isValid: true, remainingPoints };
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // File type validation
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images only.'
    };
  }
  
  // File size validation (5MB limit)
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: 'File size too large. Please upload images smaller than 5MB.'
    };
  }
  
  return { isValid: true };
};

export const validateImageResolution = (
  imageElement: HTMLImageElement
): { isValid: boolean; error?: string } => {
  const minWidth = 100;
  const minHeight = 100;
  const maxWidth = 2048;
  const maxHeight = 2048;
  
  if (imageElement.width < minWidth || imageElement.height < minHeight) {
    return {
      isValid: false,
      error: `Image resolution too small. Minimum ${minWidth}x${minHeight} pixels required.`
    };
  }
  
  if (imageElement.width > maxWidth || imageElement.height > maxHeight) {
    return {
      isValid: false,
      error: `Image resolution too large. Maximum ${maxWidth}x${maxHeight} pixels allowed.`
    };
  }
  
  return { isValid: true };
};

export const validateModuleOrder = (modules: TestModule[]): string | null => {
  if (modules.length === 0) {
    return "At least one module is required";
  }
  
  const orders = modules.map(m => m.order).sort((a, b) => a - b);
  
  // Check for gaps in ordering
  for (let i = 0; i < orders.length; i++) {
    if (orders[i] !== i) {
      return "Module order has gaps. Please ensure sequential ordering starting from 0.";
    }
  }
  
  return null;
};

export const validateStartingModule = (modules: TestModule[]): string | null => {
  if (modules.length === 0) {
    return "At least one module is required";
  }
  
  const startingModule = modules.find(m => m.order === 0);
  if (!startingModule) {
    return "A starting module (order 0) must be defined";
  }
  
  return null;
};

export const validateAdaptiveFlow = (modules: TestModule[]): string | null => {
  if (modules.length <= 1) {
    return null; // No adaptive flow needed for single module
  }
  
  // Check that each module (except the last) has adaptive rules
  const sortedModules = modules.sort((a, b) => a.order - b.order);
  
  for (let i = 0; i < sortedModules.length - 1; i++) {
    const module = sortedModules[i];
    if (!module.adaptiveRules || module.adaptiveRules.length === 0) {
      return `Module "${module.name}" needs adaptive rules to determine the next module`;
    }
  }
  
  return null;
};

export const validateQuestionScores = (questionScores: TestModule['questionScores']): string | null => {
  const scores = Object.values(questionScores);
  
  if (scores.some(score => score <= 0)) {
    return "All question scores must be greater than 0";
  }
  
  return null;
};

export const calculateModuleScore = (module: TestModule): number => {
  const { questionCounts, questionScores } = module;
  return (
    questionCounts.mcq * questionScores.mcq +
    questionCounts.numeric * questionScores.numeric +
    questionCounts.passage * questionScores.passage +
    questionCounts.image * questionScores.image
  );
};

export const calculateTotalTestScore = (modules: TestModule[]): number => {
  return modules.reduce((total, module) => total + calculateModuleScore(module), 0);
};

// Helper function to get point allocation status for a module
export const getModulePointStatus = (module: TestModule) => {
  const status = {
    mcq: { used: 0, available: 0, remaining: 0 },
    numeric: { used: 0, available: 0, remaining: 0 },
    image: { used: 0, available: 0, remaining: 0 },
    passage: { used: 0, available: 0, remaining: 0 }
  };
  
  // Calculate available points for each type
  Object.keys(status).forEach(type => {
    const key = type as keyof typeof status;
    const questionType = key as keyof TestModule['questionCounts'];
    status[key].available = module.questionCounts[questionType] * module.questionScores[questionType];
  });
  
  // Calculate used points from existing questions
  module.questions.forEach(question => {
    const typeMapping: Record<Question['type'], keyof typeof status> = {
      'MCQ': 'mcq',
      'Numeric': 'numeric',
      'Image': 'image',
      'Paragraph': 'passage'
    };
    
    const statusKey = typeMapping[question.type];
    if (statusKey) {
      status[statusKey].used += question.points;
    }
  });
  
  // Calculate remaining points
  Object.keys(status).forEach(type => {
    const key = type as keyof typeof status;
    status[key].remaining = status[key].available - status[key].used;
  });
  
  return status;
};
