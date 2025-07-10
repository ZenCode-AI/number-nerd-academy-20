
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { TestQuestion } from '@/types/test';
import QuestionNavigation from '../core/QuestionNavigation';

interface NumericQuestionProps {
  question: TestQuestion;
  questionIndex: number;
  answer?: string | string[] | number;
  onAnswerChange?: (answer: string | string[] | number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onFlag?: () => void;
  onComplete?: () => void;
  isFirstQuestion?: boolean;
  isLastQuestion?: boolean;
  isFlagged?: boolean;
  totalQuestions?: number;
}

const NumericQuestion = ({ 
  question, 
  questionIndex, 
  answer,
  onAnswerChange,
  onNext,
  onPrevious,
  onFlag,
  onComplete,
  isFirstQuestion = false,
  isLastQuestion = false,
  isFlagged = false,
  totalQuestions = 0
}: NumericQuestionProps) => {
  const currentAnswer = typeof answer === 'number' ? answer.toString() : (typeof answer === 'string' ? answer : '');
  const [numericAnswer, setNumericAnswer] = useState(currentAnswer);

  const handleAnswerChange = (value: string) => {
    setNumericAnswer(value);
    const numericValue = parseFloat(value);
    onAnswerChange?.(isNaN(numericValue) ? value : numericValue);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardContent className="flex-1 flex flex-col p-6 pb-0">
        {/* Content Area with increased height */}
        <div className="flex-1 grid grid-cols-2 gap-8 min-h-[650px]">
          {/* Left: Question */}
          <div className="flex flex-col space-y-6 overflow-auto pr-4">
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                {question.question}
              </h3>
            </div>
            {question.imageUrl && (
              <Card>
                <CardContent className="p-4">
                  <img 
                    src={question.imageUrl} 
                    alt="Question reference" 
                    className="max-w-full h-auto rounded-lg"
                  />
                </CardContent>
              </Card>
            )}
          </div>
          {/* Right: Answer Input */}
          <div className="flex flex-col space-y-6 overflow-auto pl-4 border-l border-gray-200">
            <h4 className="text-base font-medium text-gray-900">Enter your answer:</h4>
            <Card>
              <CardContent className="p-4">
                <Input
                  type="number"
                  value={numericAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Enter your numeric answer"
                  className="text-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>

      {/* Integrated Navigation - directly attached to the card */}
      <QuestionNavigation
        onPrevious={onPrevious || (() => {})}
        onNext={onNext || (() => {})}
        onFlag={onFlag || (() => {})}
        onSubmit={onComplete || (() => {})}
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        isFlagged={isFlagged}
        currentQuestion={questionIndex}
        totalQuestions={totalQuestions}
      />
    </Card>
  );
};

export default NumericQuestion;
