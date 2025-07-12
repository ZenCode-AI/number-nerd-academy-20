
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const [selectedOption, setSelectedOption] = useState<number | null>(
    question.options && typeof answer === 'number' ? answer : null
  );

  const hasOptions = question.options && question.options.length > 0;

  const handleAnswerChange = (value: string | number) => {
    if (hasOptions && typeof value === 'number') {
      setSelectedOption(value);
      onAnswerChange?.(value);
    } else if (!hasOptions && typeof value === 'string') {
      setTextAnswer(value);
      onAnswerChange?.(value);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    handleAnswerChange(optionIndex);
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
            {hasOptions ? (
              /* Multiple Choice Options */
              <>
                <h4 className="text-base font-medium text-gray-900">Select your answer:</h4>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {question.options?.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedOption === index ? "default" : "outline"}
                        className={`w-full text-left justify-start h-auto p-4 whitespace-normal ${
                          selectedOption === index 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleOptionSelect(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                            selectedOption === index 
                              ? 'bg-white border-white' 
                              : 'border-gray-300'
                          }`}>
                            {selectedOption === index && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full m-0.5"></div>
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Free Text Input */
              <>
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
              </>
            )}
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
