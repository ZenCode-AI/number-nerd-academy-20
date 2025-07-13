
// Enhanced answer validation for different question types
export const validateAnswer = (userAnswer: string | string[] | number, correctAnswer: string, questionType: string, options?: string[]): boolean => {
  const userStr = String(userAnswer).toLowerCase().trim();
  const correctStr = String(correctAnswer).toLowerCase().trim();
  
  console.log('Validating answer:', {
    userAnswer,
    correctAnswer,
    questionType,
    options,
    userStr,
    correctStr
  });
  
  switch (questionType) {
    case 'Numeric':
      const userNum = parseFloat(userStr);
      const correctNum = parseFloat(correctStr);
      return !isNaN(userNum) && !isNaN(correctNum) && Math.abs(userNum - correctNum) < 0.001;
      
    case 'MCQ':
    case 'Image':
      // MCQ answers are now stored as 0-based indices
      const userIndex = typeof userAnswer === 'number' ? userAnswer : parseInt(String(userAnswer));
      const correctIndex = parseInt(correctStr);
      
      console.log('MCQ validation:', {
        userAnswer,
        userIndex,
        correctAnswer,
        correctIndex,
        options
      });
      
      // Both should be valid indices
      if (!isNaN(userIndex) && !isNaN(correctIndex)) {
        // Admin stores 1-based indices, user stores 0-based indices
        // Convert admin's 1-based to 0-based for comparison
        const normalizedCorrectIndex = correctIndex > 0 && correctIndex <= (options?.length || 0) ? 
          correctIndex - 1 : correctIndex;
        
        console.log('Index comparison:', {
          userIndex,
          correctIndex,
          normalizedCorrectIndex,
          match: userIndex === normalizedCorrectIndex
        });
        
        return userIndex === normalizedCorrectIndex;
      }
      
      // Fallback to text comparison if indices don't work
      return userStr === correctStr;
      
    case 'Paragraph':
      // For paragraph questions, handle both options-based and free-text
      if (options && options.length > 0) {
        // If it has options, treat it like MCQ
        const userIndex = parseInt(userStr);
        const correctIndex = parseInt(correctStr);
        
        if (!isNaN(userIndex) && !isNaN(correctIndex)) {
          return userIndex === correctIndex;
        }
        
        // Also check if the user answer matches any option text
        const userOption = options.find(opt => opt.toLowerCase().trim() === userStr);
        if (userOption) {
          const userOptionIndex = options.indexOf(userOption);
          return userOptionIndex === correctIndex;
        }
        
        return false;
      } else {
        // Free-text paragraph question - use flexible matching
        return userStr.includes(correctStr) || correctStr.includes(userStr);
      }
      
    default:
      return userStr === correctStr;
  }
};

// Real scoring calculation using admin-defined points and correct answers
export const calculateModuleScore = (questions: any[], answers: any[]) => {
  if (!questions) return { score: 0, maxScore: 0 };
  
  let score = 0;
  let maxScore = 0;
  let questionsCorrect = 0;
  
  questions.forEach((question, index) => {
    const userAnswer = answers.find(a => a.questionIndex === index);
    const questionPoints = question.points || 1;
    
    maxScore += questionPoints;
    
    if (userAnswer && userAnswer.answer !== undefined && userAnswer.answer !== '') {
      const isCorrect = validateAnswer(userAnswer.answer, question.correctAnswer, question.type, question.options);
      console.log(`Question ${index + 1}:`, {
        type: question.type,
        userAnswer: userAnswer.answer,
        correctAnswer: question.correctAnswer,
        options: question.options,
        isCorrect
      });
      
      if (isCorrect) {
        score += questionPoints;
        questionsCorrect++;
      }
    }
  });
  
  return {
    score,
    maxScore,
    questionsCorrect,
    questionsIncorrect: questions.length - questionsCorrect,
    questionsSkipped: questions.length - answers.filter(a => a.answer !== undefined && a.answer !== '').length
  };
};
