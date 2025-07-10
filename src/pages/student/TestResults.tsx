
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Clock, CheckCircle, XCircle, Home, RotateCcw, Target, ArrowLeft, TrendingUp, BookOpen } from 'lucide-react';

interface TestResultsData {
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  questionsSkipped: number;
  totalQuestions: number;
  testName: string;
  averageTimePerQuestion: number;
  questions: any[];
  userAnswers: any[];
  flaggedQuestions: number[];
}

const TestResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResultsData | null>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem('testResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Results...</h2>
          <p className="text-gray-600">Please wait while we prepare your test results.</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (percentage >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 65) return 'D';
    return 'F';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding Performance!", color: "text-green-600" };
    if (percentage >= 80) return { message: "Great Job!", color: "text-blue-600" };
    if (percentage >= 70) return { message: "Good Work!", color: "text-yellow-600" };
    if (percentage >= 60) return { message: "Keep Practicing!", color: "text-orange-600" };
    return { message: "More Practice Needed", color: "text-red-600" };
  };

  const performance = getPerformanceMessage(results.percentage);
  const grade = getGrade(results.percentage);

  const handleReviewAnswers = () => {
    localStorage.setItem('reviewData', JSON.stringify({
      questions: results.questions,
      userAnswers: results.userAnswers,
      flaggedQuestions: results.flaggedQuestions,
      testName: results.testName
    }));
    navigate('/student/test/digital-sat-practice/review');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-bold text-gray-900">Test Results</h1>
                <p className="text-sm text-gray-600">{results.testName}</p>
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Results Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Score Card */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white h-full">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Final Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">
                    {results.score}
                    <span className="text-lg text-gray-500">/{results.maxScore}</span>
                  </div>
                  <Badge className={`text-lg px-3 py-1 border ${getGradeColor(results.percentage)}`}>
                    {grade}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.percentage}%
                  </div>
                  <Progress value={results.percentage} className="h-2" />
                  <div className={`text-sm font-semibold ${results.percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.percentage >= 70 ? '✓ PASSED' : '✗ NOT PASSED'}
                  </div>
                </div>

                <div className={`text-lg font-semibold ${performance.color} pt-2`}>
                  {performance.message}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{results.questionsCorrect}</div>
                  <div className="text-xs text-gray-600 font-medium">Correct</div>
                  <div className="text-xs text-green-600 mt-1">
                    {Math.round((results.questionsCorrect / results.totalQuestions) * 100)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{results.questionsIncorrect}</div>
                  <div className="text-xs text-gray-600 font-medium">Incorrect</div>
                  <div className="text-xs text-red-600 mt-1">
                    {Math.round((results.questionsIncorrect / results.totalQuestions) * 100)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{formatTime(results.timeSpent)}</div>
                  <div className="text-xs text-gray-600 font-medium">Time Spent</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {formatTime(results.averageTimePerQuestion)}/q
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{results.totalQuestions}</div>
                  <div className="text-xs text-gray-600 font-medium">Total Questions</div>
                  <div className="text-xs text-purple-600 mt-1">
                    {results.questionsSkipped} skipped
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary and Insights */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">{results.totalQuestions}</div>
                      <div className="text-xs text-gray-600">Total Questions</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-orange-600">{results.questionsSkipped}</div>
                      <div className="text-xs text-gray-600">Skipped</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Accuracy: <span className="font-semibold text-gray-900">{Math.round((results.questionsCorrect / results.totalQuestions) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-gray-700 space-y-1.5">
                    <li>• Review incorrect answers to identify patterns</li>
                    <li>• Focus on time management strategies</li>
                    <li>• Practice similar questions in weak areas</li>
                    <li>• Take additional practice tests</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/student')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={handleReviewAnswers}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            Review Answers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
