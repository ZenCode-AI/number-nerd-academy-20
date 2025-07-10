
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TestQuestion } from '@/types/test';
import QuestionNavigation from '../core/QuestionNavigation';

interface ImageQuestionProps {
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

const ImageQuestion = ({ 
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
}: ImageQuestionProps) => {
  const currentAnswer = typeof answer === 'string' ? answer : '';
  const [selectedOption, setSelectedOption] = useState(currentAnswer);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onAnswerChange?.(option);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardContent className="flex-1 flex flex-col p-6 pb-0">
        {/* Content Area with increased height */}
        <div className="flex-1 grid grid-cols-2 gap-8 min-h-[650px]">
          {/* Left: Question and Image */}
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
                    className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                    onError={(e) => {
                      console.error('Failed to load image:', question.imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          {/* Right: Answer Input */}
          <div className="flex flex-col space-y-6 overflow-auto pl-4 border-l border-gray-200">
            {question.options && question.options.length > 0 ? (
              // MCQ-style image question with options
              <>
                <h4 className="text-base font-medium text-gray-900">Choose your answer:</h4>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <Card 
                      key={index}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedOption === option 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === option 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {selectedOption === option && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className={`flex-1 ${
                            selectedOption === option ? 'text-blue-900 font-medium' : 'text-gray-700'
                          }`}>
                            {option}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              // Text input image question
              <>
                <h4 className="text-base font-medium text-gray-900">Your answer:</h4>
                <div className="space-y-3">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      onAnswerChange?.(e.target.value);
                    }}
                    placeholder="Enter your answer here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                    rows={4}
                  />
                </div>
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

export default ImageQuestion;
