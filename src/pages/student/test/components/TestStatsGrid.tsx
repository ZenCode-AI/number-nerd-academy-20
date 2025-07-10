
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Target } from 'lucide-react';

interface TestStatsGridProps {
  questionsCorrect: number;
  questionsIncorrect: number;
  timeSpent: number;
  totalQuestions: number;
  questionsSkipped: number;
  averageTimePerQuestion: number;
}

const TestStatsGrid = ({
  questionsCorrect,
  questionsIncorrect,
  timeSpent,
  totalQuestions,
  questionsSkipped,
  averageTimePerQuestion
}: TestStatsGridProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{questionsCorrect}</div>
          <div className="text-xs text-gray-600 font-medium">Correct</div>
          <div className="text-xs text-green-600 mt-1">
            {Math.round((questionsCorrect / totalQuestions) * 100)}%
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{questionsIncorrect}</div>
          <div className="text-xs text-gray-600 font-medium">Incorrect</div>
          <div className="text-xs text-red-600 mt-1">
            {Math.round((questionsIncorrect / totalQuestions) * 100)}%
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{formatTime(timeSpent)}</div>
          <div className="text-xs text-gray-600 font-medium">Time Spent</div>
          <div className="text-xs text-blue-600 mt-1">
            {formatTime(averageTimePerQuestion)}/q
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{totalQuestions}</div>
          <div className="text-xs text-gray-600 font-medium">Total Questions</div>
          <div className="text-xs text-purple-600 mt-1">
            {questionsSkipped} skipped
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestStatsGrid;
