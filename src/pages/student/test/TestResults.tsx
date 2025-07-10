
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, RotateCcw, TrendingUp, BookOpen } from 'lucide-react';
import TestResultsHeader from './components/TestResultsHeader';
import TestScoreCard from './components/TestScoreCard';
import TestStatsGrid from './components/TestStatsGrid';

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
      <TestResultsHeader testName={results.testName} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Results Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TestScoreCard 
              score={results.score}
              maxScore={results.maxScore}
              percentage={results.percentage}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TestStatsGrid
              questionsCorrect={results.questionsCorrect}
              questionsIncorrect={results.questionsIncorrect}
              timeSpent={results.timeSpent}
              totalQuestions={results.totalQuestions}
              questionsSkipped={results.questionsSkipped}
              averageTimePerQuestion={results.averageTimePerQuestion}
            />

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
