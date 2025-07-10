
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Home, CheckCircle, XCircle, Flag, Clock, Target, BarChart3 } from 'lucide-react';

interface ModuleReviewData {
  moduleNumber: number;
  moduleName: string;
  questions: any[];
  userAnswers: any[];
  flaggedQuestions: number[];
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  difficulty: string;
}

interface TestSetReviewData {
  testName: string;
  modules: ModuleReviewData[];
  totalScore: number;
  totalMaxScore: number;
  totalPercentage: number;
  totalTimeSpent: number;
  skippedModules: number[];
}

const MultiModuleReview = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [reviewData, setReviewData] = useState<TestSetReviewData | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    // Load review data from localStorage
    const storedReviewData = localStorage.getItem('testSetReviewData');
    if (storedReviewData) {
      try {
        const data = JSON.parse(storedReviewData);
        setReviewData(data);
        console.log('Loaded review data:', data);
      } catch (error) {
        console.error('Failed to parse review data:', error);
        navigate('/student');
      }
    } else {
      // Fallback to single module review data
      const singleModuleData = localStorage.getItem('reviewData');
      if (singleModuleData) {
        try {
          const data = JSON.parse(singleModuleData);
          const fallbackData: TestSetReviewData = {
            testName: data.testName || 'Practice Test',
            modules: [{
              moduleNumber: 1,
              moduleName: 'Module 1',
              questions: data.questions || [],
              userAnswers: data.userAnswers || [],
              flaggedQuestions: data.flaggedQuestions || [],
              score: 0,
              maxScore: data.questions?.length || 0,
              percentage: 0,
              timeSpent: 0,
              difficulty: 'Medium'
            }],
            totalScore: 0,
            totalMaxScore: data.questions?.length || 0,
            totalPercentage: 0,
            totalTimeSpent: 0,
            skippedModules: []
          };
          setReviewData(fallbackData);
        } catch (error) {
          console.error('Failed to parse fallback review data:', error);
          navigate('/student');
        }
      } else {
        navigate('/student');
      }
    }
  }, [navigate]);

  if (!reviewData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Review...</h2>
          <p className="text-gray-600">Please wait while we prepare your comprehensive review.</p>
        </div>
      </div>
    );
  }

  const currentModuleData = reviewData.modules[currentModule];
  const question = currentModuleData?.questions[currentQuestion];
  const userAnswer = currentModuleData?.userAnswers?.find(a => a.questionIndex === currentQuestion);
  const isFlagged = currentModuleData?.flaggedQuestions?.includes(currentQuestion);
  
  const isCorrect = userAnswer && userAnswer.answer === question?.correctAnswer;
  const hasAnswer = userAnswer && userAnswer.answer;

  const getAnswerStatus = () => {
    if (!hasAnswer) return { icon: <XCircle className="h-4 w-4 text-gray-400" />, text: "Not Answered", color: "text-gray-400" };
    if (isCorrect) return { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: "Correct", color: "text-green-600" };
    return { icon: <XCircle className="h-4 w-4 text-red-600" />, text: "Incorrect", color: "text-red-600" };
  };

  const answerStatus = getAnswerStatus();

  const handleModuleChange = (moduleIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentQuestion(0);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentQuestion(reviewData.modules[currentModule - 1].questions.length - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < currentModuleData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentModule < reviewData.modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentQuestion(0);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Test Review</h1>
                <p className="text-sm text-gray-600">{reviewData.testName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">Overall Score</div>
                <div className="text-lg font-bold text-blue-600">
                  {reviewData.totalScore}/{reviewData.totalMaxScore} ({reviewData.totalPercentage}%)
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Module Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {reviewData.modules.map((module, index) => (
              <Button
                key={index}
                onClick={() => handleModuleChange(index)}
                variant={currentModule === index ? "default" : "outline"}
                size="sm"
                className="flex flex-col h-auto p-3 min-w-[100px]"
              >
                <span className="font-medium text-xs">Module {module.moduleNumber}</span>
                <span className="text-xs opacity-75">{module.percentage}%</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Module Summary */}
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                {currentModuleData.moduleName} Summary
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {currentModuleData.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {currentModuleData.score}/{currentModuleData.maxScore}
                </div>
                <div className="text-xs text-gray-600 font-medium">Score</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {currentModuleData.percentage}%
                </div>
                <div className="text-xs text-gray-600 font-medium">Percentage</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {formatTime(currentModuleData.timeSpent)}
                </div>
                <div className="text-xs text-gray-600 font-medium">Time Spent</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">
                  {currentModuleData.flaggedQuestions?.length || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Flagged</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Question {currentQuestion + 1} of {currentModuleData.questions.length}
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
          
          <Progress 
            value={((currentQuestion + 1) / currentModuleData.questions.length) * 100} 
            className="h-2"
          />
        </div>

        {/* Question Content - Improved Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
          {/* Question Card */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-gray-900 font-medium text-sm leading-relaxed">
                {question?.question}
              </div>
              
              {question?.imageUrl && (
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={question.imageUrl} 
                    alt="Question reference" 
                    className="w-full h-auto object-contain max-h-64"
                  />
                </div>
              )}
              
              {(question?.type === 'MCQ' || (question?.type === 'Image' && question?.options)) && question?.options && (
                <div className="space-y-2">
                  <p className="font-medium text-gray-700 text-xs">Options:</p>
                  {question.options.map((option: string, index: number) => (
                    <div 
                      key={index}
                      className={`p-2 text-xs rounded-lg border transition-colors ${
                        option === question.correctAnswer 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : option === userAnswer?.answer 
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {option === question.correctAnswer && <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />}
                        {option === userAnswer?.answer && option !== question.correctAnswer && <XCircle className="h-3 w-3 text-red-600 flex-shrink-0" />}
                        <span className="leading-relaxed">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Answer Analysis Card */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Answer Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Your Answer */}
              <div>
                <p className="font-medium text-gray-700 text-xs mb-1">Your Answer:</p>
                <div className={`p-2 text-xs rounded-lg ${
                  !hasAnswer 
                    ? 'bg-gray-50 border border-gray-200 text-gray-500' 
                    : isCorrect 
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {hasAnswer ? userAnswer.answer : 'Not answered'}
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <p className="font-medium text-gray-700 text-xs mb-1">Correct Answer:</p>
                <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-800 text-xs">
                  {question?.correctAnswer || 'N/A'}
                </div>
              </div>

              {/* Points */}
              <div>
                <p className="font-medium text-gray-700 text-xs mb-1">Points:</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {isCorrect ? question?.points || 1 : 0}
                  </span>
                  <span className="text-gray-500 text-xs">/ {question?.points || 1}</span>
                </div>
              </div>

              {/* Explanation */}
              {question?.explanation && (
                <div>
                  <p className="font-medium text-gray-700 text-xs mb-1">Explanation:</p>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs leading-relaxed">
                    {question.explanation}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Improved Navigation */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <Button
            onClick={handlePrevious}
            disabled={currentModule === 0 && currentQuestion === 0}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              Module {currentModule + 1}, Question {currentQuestion + 1}
            </div>
            <div className="text-xs text-gray-500">
              {reviewData.modules.reduce((sum, m) => sum + m.questions.length, 0)} total questions
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={
              currentModule === reviewData.modules.length - 1 && 
              currentQuestion === currentModuleData.questions.length - 1
            }
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiModuleReview;
