
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { TestQuestion } from '@/types/test';
import QuestionNavigation from '../core/QuestionNavigation';

interface ParagraphQuestionProps {
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

const ParagraphQuestion = ({ 
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
}: ParagraphQuestionProps) => {
  const currentAnswer = typeof answer === 'string' ? answer : '';
  const [textAnswer, setTextAnswer] = useState(currentAnswer);

  const handleAnswerChange = (value: string) => {
    setTextAnswer(value);
    onAnswerChange?.(value);
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
            <h4 className="text-base font-medium text-gray-900">Write your answer:</h4>
            <Card>
              <CardContent className="p-4">
                <Textarea
                  value={textAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Write your detailed answer here..."
                  className="min-h-[200px] text-base"
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

export default ParagraphQuestion;
