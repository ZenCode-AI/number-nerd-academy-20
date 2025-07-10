
// Enhanced answer validation for different question types
export const validateAnswer = (userAnswer: string | string[] | number, correctAnswer: string, questionType: string, options?: string[]): boolean => {
  const userStr = String(userAnswer).toLowerCase().trim();
  const correctStr = String(correctAnswer).toLowerCase().trim();
  
  switch (questionType) {
    case 'Numeric':
      const userNum = parseFloat(userStr);
      const correctNum = parseFloat(correctStr);
      return !isNaN(userNum) && !isNaN(correctNum) && Math.abs(userNum - correctNum) < 0.001;
    case 'MCQ':
    case 'Image':
      // Handle both index-based and text-based correct answers
      if (options && options.length > 0) {
        // Check if userAnswer is an index (0, 1, 2, 3) or option number (1, 2, 3, 4)
        const userIndex = parseInt(userStr);
        const correctIndex = parseInt(correctStr);
        
        // If both are valid indices, compare directly
        if (!isNaN(userIndex) && !isNaN(correctIndex)) {
          // Handle both 0-based and 1-based indexing
          const normalizedUserIndex = userIndex >= options.length ? userIndex - 1 : userIndex;
          const normalizedCorrectIndex = correctIndex >= options.length ? correctIndex - 1 : correctIndex;
          
          console.log('Index-based comparison:', {
            userIndex,
            correctIndex,
            normalizedUserIndex,
            normalizedCorrectIndex,
            match: normalizedUserIndex === normalizedCorrectIndex
          });
          
          return normalizedUserIndex === normalizedCorrectIndex;
        }
        
        // If correctAnswer is a number (index), convert it to the actual option text
        if (!isNaN(correctIndex) && correctIndex >= 0 && correctIndex < options.length) {
          // correctAnswer is an index, compare with the option at that index
          const actualCorrectAnswer = options[correctIndex].toLowerCase().trim();
          return userStr === actualCorrectAnswer;
        } else {
          // correctAnswer is already the text, compare directly
          return userStr === correctStr;
        }
      }
      return userStr === correctStr;
    case 'Paragraph':
      // For paragraph questions, handle index-based answers if options exist
      if (options && options.length > 0) {
        const correctIndex = parseInt(correctStr);
        if (!isNaN(correctIndex) && correctIndex >= 0 && correctIndex < options.length) {
          const actualCorrectAnswer = options[correctIndex].toLowerCase().trim();
          return userStr.includes(actualCorrectAnswer) || actualCorrectAnswer.includes(userStr);
        }
      }
      return userStr.includes(correctStr) || correctStr.includes(userStr);
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
    
    if (userAnswer && userAnswer.answer) {
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
    questionsSkipped: questions.length - answers.length
  };
};
