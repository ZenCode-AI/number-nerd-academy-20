
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTest } from '@/contexts/TestContext';
import TestHeader from './TestHeader';
import TestSidebar from './TestSidebar';
import QuestionRenderer from '../questions/QuestionRenderer';
import ModuleComplete from './ModuleComplete';
import HelpPanel from '../tools/HelpPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const TestInterface = () => {
  const { testId } = useParams<{ testId: string }>();
  const { 
    testData, 
    currentQuestion, 
    isTestStarted, 
    isModuleComplete, 
    currentModule,
    nextModule,
    startBreak,
    continueToNextModule,
    answers,
    timeRemaining,
    session,
    navigateToQuestion,
    flagQuestion
  } = useTest();
  
  const [showHelp, setShowHelp] = useState(false);

  if (!isTestStarted || !testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Test...</h2>
          <p className="text-gray-600">Please wait while we prepare your test.</p>
        </div>
      </div>
    );
  }

  // Show module completion screen
  if (isModuleComplete && currentModule < 2) {
    return (
      <ModuleComplete
        currentModule={currentModule}
        nextModule={nextModule}
        onTakeBreak={() => startBreak(currentModule, nextModule)}
        onContinue={continueToNextModule}
      />
    );
  }

  const currentQuestionData = testData.questions[currentQuestion];

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h2>
          <p className="text-gray-600">The requested question could not be loaded.</p>
        </div>
      </div>
    );
  }

  const flaggedQuestions = session?.flaggedQuestions || new Set<number>();

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Logo Watermark - Centered and Prominent */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-9xl font-bold text-gray-200 opacity-20 select-none">
          NNA
        </div>
      </div>
      
      <TestHeader />
      
      <div className="flex relative z-10 h-[calc(100vh-80px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <Card className="h-full shadow-lg">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Question Number and Progress */}
              <div className="mb-6 border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Question {currentQuestion + 1} of {testData.questions.length}
                  </h2>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHelp(true)}
                      className="flex items-center gap-1"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help
                    </Button>
                    <div className="text-sm font-medium text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                      {currentQuestionData.points} {currentQuestionData.points === 1 ? 'point' : 'points'}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestion + 1) / testData.questions.length) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Module {currentModule} • {testData.subject} Test
                </div>
              </div>

              {/* Question Content */}
              <div className="flex-1 overflow-auto">
                <QuestionRenderer 
                  question={currentQuestionData} 
                  questionIndex={currentQuestion}
                  answer={answers.find(a => a.questionIndex === currentQuestion)?.answer?.toString() || ''}
                  onAnswerChange={(answer) => {
                    // Handle answer change logic here
                    console.log('Answer changed:', answer);
                  }}
                  onNext={() => {
                    if (currentQuestion < testData.questions.length - 1) {
                      navigateToQuestion(currentQuestion + 1);
                    }
                  }}
                  onPrevious={() => {
                    if (currentQuestion > 0) {
                      navigateToQuestion(currentQuestion - 1);
                    }
                  }}
                  onFlag={() => flagQuestion(currentQuestion)}
                  onComplete={() => {
                    // Handle completion logic
                    console.log('Test completion requested');
                  }}
                  isFirstQuestion={currentQuestion === 0}
                  isLastQuestion={currentQuestion === testData.questions.length - 1}
                  isFlagged={flaggedQuestions.has(currentQuestion)}
                  totalQuestions={testData.questions.length}
                  isLastModule={currentModule === 2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <TestSidebar
          questions={testData.questions}
          currentQuestion={currentQuestion}
          answers={answers}
          onQuestionSelect={navigateToQuestion}
          timeRemaining={timeRemaining}
          flaggedQuestions={flaggedQuestions}
          onFlagQuestion={() => flagQuestion(currentQuestion)}
        />
      </div>

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        subject={testData.subject}
      />
    </div>
  );
};

export default TestInterface;
