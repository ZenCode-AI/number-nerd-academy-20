
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Home, CheckCircle, XCircle, Flag } from 'lucide-react';
import { validateAnswer } from '@/components/test-taking/core/utils/testScoring';

interface ReviewData {
  questions: any[];
  userAnswers: any[];
  flaggedQuestions: number[];
  testName: string;
}

const TestReview = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const storedReviewData = localStorage.getItem('reviewData');
    if (storedReviewData) {
      setReviewData(JSON.parse(storedReviewData));
    } else {
      // Fallback to dashboard instead of browse page
      navigate('/student');
    }
  }, [navigate]);

  if (!reviewData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Review...</h2>
          <p className="text-gray-600">Please wait while we prepare your answer review.</p>
        </div>
      </div>
    );
  }

  const question = reviewData.questions[currentQuestion];
  const userAnswer = reviewData.userAnswers.find(a => a.questionIndex === currentQuestion);
  const isFlagged = reviewData.flaggedQuestions.includes(currentQuestion);
  
  // Use the proper validateAnswer function for accurate comparison
  const isCorrect = userAnswer && userAnswer.answer ? 
    validateAnswer(userAnswer.answer, question?.correctAnswer, question?.type, question?.options) : false;
  const hasAnswer = userAnswer && userAnswer.answer;

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < reviewData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBackToResults = () => {
    if (testId) {
      navigate(`/student/test/${testId}/results`);
    } else {
      navigate('/student/test/results');
    }
  };

  const getAnswerStatus = () => {
    if (!hasAnswer) return { icon: <XCircle className="h-4 w-4 text-gray-400" />, text: "Not Answered", color: "text-gray-400" };
    if (isCorrect) return { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: "Correct", color: "text-green-600" };
    return { icon: <XCircle className="h-4 w-4 text-red-600" />, text: "Incorrect", color: "text-red-600" };
  };

  const answerStatus = getAnswerStatus();

  // Helper function to get correct answer display
  const getCorrectAnswerDisplay = () => {
    if (question?.type === 'MCQ' && question?.options) {
      const correctIndex = parseInt(question.correctAnswer);
      // Admin stores 1-based indices, convert to 0-based for display
      const displayIndex = correctIndex > 0 && correctIndex <= question.options.length ? 
        correctIndex - 1 : correctIndex;
      
      if (!isNaN(displayIndex) && displayIndex >= 0 && displayIndex < question.options.length) {
        return question.options[displayIndex];
      }
    }
    return question?.correctAnswer || 'N/A';
  };

  // Helper function to get user answer display
  const getUserAnswerDisplay = () => {
    if (!hasAnswer) return 'Not answered';
    
    if (question?.type === 'MCQ' && question?.options) {
      // User answer is already 0-based index
      const userIndex = typeof userAnswer.answer === 'number' ? userAnswer.answer : parseInt(String(userAnswer.answer));
      if (!isNaN(userIndex) && userIndex >= 0 && userIndex < question.options.length) {
        return question.options[userIndex];
      }
    }
    return userAnswer.answer;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b mb-4">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToResults}
                className="flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Results
              </Button>
              <div>
                <h1 className="text-base font-bold text-gray-900">Answer Review</h1>
                <p className="text-xs text-gray-600">{reviewData.testName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student')}
                className="flex items-center gap-1 text-xs"
              >
                <Home className="h-3 w-3" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Question Navigation */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-700">
              Question {currentQuestion + 1} of {reviewData.questions.length}
            </h2>
            <div className="flex items-center gap-2">
              {isFlagged && (
                <Badge variant="outline" className="border-orange-300 text-orange-600 text-xs">
                  <Flag className="h-3 w-3 mr-1" />
                  Flagged
                </Badge>
              )}
              <div className="flex items-center gap-1">
                {answerStatus.icon}
                <span className={`font-medium text-xs ${answerStatus.color}`}>
                  {answerStatus.text}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / reviewData.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Content - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          {/* Question */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="text-gray-900 text-sm font-medium">
                {question?.question}
              </div>
              
              {question?.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={question.imageUrl} 
                    alt="Question reference" 
                    className="max-w-full h-auto rounded-lg border max-h-32 object-contain"
                  />
                </div>
              )}
              
              {/* Display options for both MCQ and Paragraph questions */}
              {(question?.type === 'MCQ' || question?.type === 'Paragraph') && question?.options && (
                <div className="space-y-1 mt-2">
                  <p className="font-medium text-gray-700 text-xs">Options:</p>
                  {question.options.map((option: string, index: number) => {
                    const isCorrectOption = question.type === 'MCQ' ? 
                      // Admin stores 1-based indices, convert to 0-based for comparison
                      (parseInt(question.correctAnswer) - 1 === index) :
                      (question.correctAnswer && (question.correctAnswer.toLowerCase().includes(option.toLowerCase()) || option.toLowerCase().includes(question.correctAnswer.toLowerCase())));
                    
                    const isUserOption = question.type === 'MCQ' ?
                      // User answer is already 0-based index
                      (typeof userAnswer?.answer === 'number' ? userAnswer.answer === index : parseInt(String(userAnswer?.answer)) === index) :
                      (userAnswer?.answer && (String(userAnswer.answer).toLowerCase().includes(option.toLowerCase()) || option.toLowerCase().includes(String(userAnswer.answer).toLowerCase())));

                    return (
                      <div 
                        key={index}
                        className={`p-2 rounded-lg border text-xs ${
                          isCorrectOption 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : isUserOption && !isCorrectOption
                              ? 'bg-red-50 border-red-200 text-red-800'
                              : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrectOption && <CheckCircle className="h-3 w-3 text-green-600" />}
                          {isUserOption && !isCorrectOption && <XCircle className="h-3 w-3 text-red-600" />}
                          <span>{option}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Answer Analysis */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Answer Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {/* Your Answer */}
              <div className="space-y-1">
                <p className="font-medium text-gray-700 text-xs">Your Answer:</p>
                <div className={`p-2 rounded-lg text-xs ${
                  !hasAnswer 
                    ? 'bg-gray-50 border border-gray-200 text-gray-500' 
                    : isCorrect 
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {getUserAnswerDisplay()}
                </div>
              </div>

              {/* Correct Answer */}
              <div className="space-y-1">
                <p className="font-medium text-gray-700 text-xs">Correct Answer:</p>
                <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-800 text-xs">
                  {getCorrectAnswerDisplay()}
                </div>
              </div>

              {/* Points */}
              <div className="space-y-1">
                <p className="font-medium text-gray-700 text-xs">Points:</p>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">
                    {isCorrect ? question?.points || 1 : 0}
                  </span>
                  <span className="text-gray-500 text-xs">/ {question?.points || 1}</span>
                </div>
              </div>

              {/* Explanation */}
              {question?.explanation && (
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 text-xs">Explanation:</p>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs">
                    {question.explanation}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pb-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="h-3 w-3" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              Question {currentQuestion + 1} of {reviewData.questions.length}
            </span>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentQuestion === reviewData.questions.length - 1}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
          >
            Next
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestReview;
