
import React from 'react';
import QuestionRenderer from '../../questions/QuestionRenderer';

interface TestSetModuleContentProps {
  currentModuleData: any;
  currentQuestion: number;
  currentQuestionData: any;
  currentAnswer: string;
  flaggedQuestions: Set<number>;
  testSet: any;
  session: any;
  isLastQuestion: boolean;
  isLastModule: boolean;
  onAnswerChange: (answer: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFlag: () => void;
  onSubmitClick: () => void;
}

const TestSetModuleContent = ({
  currentModuleData,
  currentQuestion,
  currentQuestionData,
  currentAnswer,
  flaggedQuestions,
  testSet,
  session,
  isLastQuestion,
  isLastModule,
  onAnswerChange,
  onNext,
  onPrevious,
  onFlag,
  onSubmitClick
}: TestSetModuleContentProps) => {
  if (!currentModuleData || !currentQuestionData) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Module...</h2>
            <p className="text-gray-500">Please wait while we prepare your test content.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto h-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Question {currentQuestion + 1} of {currentModuleData.questions?.length || 0}
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {currentQuestionData.points || 1} point{(currentQuestionData.points || 1) !== 1 ? 's' : ''}
              </div>
              {testSet && session && (
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Module {(session.currentModule || 0) + 1} of {testSet.modules?.length || 1}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-280px)]">
          <QuestionRenderer
            question={currentQuestionData}
            questionIndex={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={onAnswerChange}
            onNext={onNext}
            onPrevious={onPrevious}
            onFlag={onFlag}
            onComplete={onSubmitClick}
            isFirstQuestion={currentQuestion === 0}
            isLastQuestion={isLastQuestion}
            isFlagged={flaggedQuestions.has(currentQuestion)}
            totalQuestions={currentModuleData.questions?.length || 0}
            isLastModule={isLastModule}
          />
        </div>
      </div>
    </div>
  );
};

export default TestSetModuleContent;
