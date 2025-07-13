
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Target, BookOpen, Home } from 'lucide-react';
import { TestSet } from '@/types/testSet';
import { ModuleResult } from '@/types/testSet';

interface TestSetCompletionProps {
  testSet: TestSet;
  moduleResults: ModuleResult[];
}

const TestSetCompletion = ({ testSet, moduleResults }: TestSetCompletionProps) => {
  const navigate = useNavigate();

  const handleReviewAnswers = () => {
    // Check if this is a single module test or multi-module test set
    if (moduleResults.length === 1) {
      // For single module tests, use the simple review page
      const singleModuleData = {
        questions: moduleResults[0].questions || [],
        userAnswers: moduleResults[0].userAnswers || [],
        flaggedQuestions: moduleResults[0].flaggedQuestions || [],
        testName: testSet.name
      };
      localStorage.setItem('reviewData', JSON.stringify(singleModuleData));
      navigate('/student/test/digital-sat-practice/review');
    } else {
      // For multi-module test sets, use the comprehensive review
      navigate(`/student/test/${testSet.id}/multi-module-review`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/student');
  };

  const totalScore = moduleResults.reduce((sum, result) => sum + result.score, 0);
  const totalMaxScore = moduleResults.reduce((sum, result) => sum + result.maxScore, 0);
  const averagePercentage = Math.round(moduleResults.reduce((sum, r) => sum + r.percentage, 0) / moduleResults.length);
  const totalTimeMinutes = Math.round(moduleResults.reduce((sum, r) => sum + r.timeSpent, 0) / 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Set Complete!</h1>
            <p className="text-xl text-gray-600">{testSet.name}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {totalScore}/{totalMaxScore}
            </div>
            <div className="text-sm text-gray-600">Final Score</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{moduleResults.length}</div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{totalTimeMinutes}m</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{averagePercentage}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={handleReviewAnswers}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <BookOpen className="h-4 w-4" />
              Review All Answers
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSetCompletion;
