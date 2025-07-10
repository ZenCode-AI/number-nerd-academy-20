
import { useState } from 'react';
import { TestAnswer } from '@/types/test';

export const useTestAnswerManager = () => {
  const [answers, setAnswers] = useState<TestAnswer[]>([]);

  const handleAnswerSubmit = (questionIndex: number, answer: string | string[] | number) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionIndex === questionIndex);
    let updatedAnswers;
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = {
        questionIndex,
        answer,
      };
    } else {
      updatedAnswers = [...answers, {
        questionIndex,
        answer,
      }];
    }
    
    setAnswers(updatedAnswers);
  };

  return {
    answers,
    handleAnswerSubmit
  };
};
