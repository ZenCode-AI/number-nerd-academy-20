
import React from 'react';
import { TestQuestion } from '@/types/test';
import MCQQuestion from './MCQQuestion';
import NumericQuestion from './NumericQuestion';
import ParagraphQuestion from './ParagraphQuestion';
import ImageQuestion from './ImageQuestion';
import QuestionNavigation from '../core/QuestionNavigation';

interface QuestionRendererProps {
  question: TestQuestion;
  questionIndex: number;
  answer?: string;
  onAnswerChange: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFlag: () => void;
  onComplete: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isFlagged: boolean;
  totalQuestions: number;
  isLastModule?: boolean;
}

const QuestionRenderer = ({
  question,
  questionIndex,
  answer,
  onAnswerChange,
  onNext,
  onPrevious,
  onFlag,
  onComplete,
  isFirstQuestion,
  isLastQuestion,
  isFlagged,
  totalQuestions,
  isLastModule = false,
}: QuestionRendererProps) => {
  const renderQuestion = () => {
    switch (question.type) {
      case 'MCQ':
        return (
          <MCQQuestion
            question={question}
            questionIndex={questionIndex}
            answer={answer}
            onAnswerChange={onAnswerChange}
            onNext={onNext}
            onPrevious={onPrevious}
            onFlag={onFlag}
            onComplete={onComplete}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isFlagged={isFlagged}
            totalQuestions={totalQuestions}
          />
        );
      case 'Numeric':
        return (
          <NumericQuestion
            question={question}
            questionIndex={questionIndex}
            answer={answer}
            onAnswerChange={onAnswerChange}
            onNext={onNext}
            onPrevious={onPrevious}
            onFlag={onFlag}
            onComplete={onComplete}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isFlagged={isFlagged}
            totalQuestions={totalQuestions}
          />
        );
      case 'Paragraph':
        return (
          <ParagraphQuestion
            question={question}
            questionIndex={questionIndex}
            answer={answer}
            onAnswerChange={onAnswerChange}
            onNext={onNext}
            onPrevious={onPrevious}
            onFlag={onFlag}
            onComplete={onComplete}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isFlagged={isFlagged}
            totalQuestions={totalQuestions}
          />
        );
      case 'Image':
        return (
          <ImageQuestion
            question={question}
            questionIndex={questionIndex}
            answer={answer}
            onAnswerChange={onAnswerChange}
            onNext={onNext}
            onPrevious={onPrevious}
            onFlag={onFlag}
            onComplete={onComplete}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isFlagged={isFlagged}
            totalQuestions={totalQuestions}
          />
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {renderQuestion()}
      </div>
    </div>
  );
};

export default QuestionRenderer;
