
import React from 'react';
import { useTestSet } from '@/contexts/TestSetContext';
import TestSetHeader from './TestSetHeader';
import CompactTestSidebar from './CompactTestSidebar';
import TestFooter from './TestFooter';
import SubmitTestModal from './SubmitTestModal';
import TestSetCompletion from './test-set-interface/TestSetCompletion';
import TestSetModuleContent from './test-set-interface/TestSetModuleContent';
import { useTestSetModuleLogic } from './test-set-interface/TestSetModuleLogic';
import { useTestTimer } from './hooks/useTestTimer';
import { useTestKeyboardNavigation } from './hooks/useTestKeyboardNavigation';
import { useTestAnswerManager } from './hooks/useTestAnswerManager';

const TestSetModuleInterface = () => {
  const { currentModuleData, session, testSet, moduleResults } = useTestSet();
  const { timeRemaining } = useTestTimer();
  const { answers, handleAnswerSubmit } = useTestAnswerManager();
  
  const {
    currentQuestion,
    flaggedQuestions,
    showSubmitModal,
    isLastModule,
    isLastQuestion,
    navigateToQuestion,
    handleNext,
    handlePrevious,
    handleFlag,
    handleSubmitClick,
    handleComplete,
    setShowSubmitModal
  } = useTestSetModuleLogic();

  useTestKeyboardNavigation({
    currentQuestion,
    currentModuleData,
    handlePrevious,
    handleNext,
    handleFlag
  });

  // Show completion screen if test set is completed
  if (session?.status === 'Completed' && testSet) {
    return <TestSetCompletion testSet={testSet} moduleResults={moduleResults} />;
  }

  if (!currentModuleData || !currentModuleData.questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Module...</h2>
          <p className="text-gray-600">Please wait while we prepare your test.</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = currentModuleData.questions[currentQuestion];
  const currentAnswer = answers.find(a => a.questionIndex === currentQuestion)?.answer;
  const answerString = typeof currentAnswer === 'string' ? currentAnswer : 
                      typeof currentAnswer === 'number' ? currentAnswer.toString() : 
                      Array.isArray(currentAnswer) ? currentAnswer.join(', ') : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative pb-20">
      <TestSetHeader />
      
      <div className="flex-1 flex">
        <TestSetModuleContent
          currentModuleData={currentModuleData}
          currentQuestion={currentQuestion}
          currentQuestionData={currentQuestionData}
          currentAnswer={answerString}
          flaggedQuestions={flaggedQuestions}
          testSet={testSet}
          session={session}
          isLastQuestion={isLastQuestion}
          isLastModule={isLastModule}
          onAnswerChange={(answer) => handleAnswerSubmit(currentQuestion, answer)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onFlag={handleFlag}
          onSubmitClick={handleSubmitClick}
        />

        <CompactTestSidebar
          questions={currentModuleData.questions}
          currentQuestion={currentQuestion}
          answers={answers}
          onQuestionSelect={navigateToQuestion}
          timeRemaining={timeRemaining}
          flaggedQuestions={flaggedQuestions}
          onFlagQuestion={handleFlag}
        />
      </div>
      
      <TestFooter />

      <SubmitTestModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => handleComplete(answers, timeRemaining)}
        isLastModule={isLastModule}
        currentModule={session?.currentModule || 1}
        totalModules={testSet?.modules.length || 1}
      />
    </div>
  );
};

export default TestSetModuleInterface;
