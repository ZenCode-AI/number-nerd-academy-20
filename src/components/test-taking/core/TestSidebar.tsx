
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flag, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { TestQuestion, TestAnswer } from '@/types/test';

interface TestSidebarProps {
  questions: TestQuestion[];
  currentQuestion: number;
  answers: TestAnswer[];
  onQuestionSelect: (index: number) => void;
  timeRemaining: number;
  flaggedQuestions: Set<number>;
  onFlagQuestion: () => void;
}

const TestSidebar = ({
  questions,
  currentQuestion,
  answers,
  onQuestionSelect,
  timeRemaining,
  flaggedQuestions,
  onFlagQuestion,
}: TestSidebarProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const totalTime = questions.length * 90; // Estimate 1.5 minutes per question
    const timeProgress = 1 - (timeRemaining / totalTime);
    
    if (timeRemaining <= 300) return 'text-red-600 bg-red-50'; // Last 5 minutes
    if (timeRemaining <= 600) return 'text-yellow-600 bg-yellow-50'; // Last 10 minutes
    if (timeProgress > 0.75) return 'text-orange-600 bg-orange-50'; // 75% time used
    return 'text-green-600 bg-green-50';
  };

  const getQuestionStatus = (index: number) => {
    const isAnswered = answers.some(a => a.questionIndex === index);
    const isFlagged = flaggedQuestions.has(index);
    const isCurrent = index === currentQuestion;

    if (isCurrent) {
      return { icon: AlertCircle, color: 'bg-blue-100 border-blue-300 text-blue-700' };
    }
    if (isAnswered) {
      return { icon: CheckCircle, color: 'bg-green-100 border-green-300 text-green-700' };
    }
    if (isFlagged) {
      return { icon: Flag, color: 'bg-yellow-100 border-yellow-300 text-yellow-700' };
    }
    return { icon: Circle, color: 'bg-gray-100 border-gray-300 text-gray-600' };
  };

  const answeredCount = answers.length;
  const flaggedCount = flaggedQuestions.size;
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      {/* Timer Card */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Remaining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-mono font-bold p-3 rounded-lg text-center ${getTimeColor()}`}>
            {formatTime(timeRemaining)}
          </div>
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Answered:</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {answeredCount}/{questions.length}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Flagged:</span>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {flaggedCount}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Points:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {totalPoints}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-center">
            {Math.round((answeredCount / questions.length) * 100)}% Complete
          </div>
        </CardContent>
      </Card>

      {/* Flag Current Question */}
      <div className="mb-4">
        <Button
          onClick={onFlagQuestion}
          variant={flaggedQuestions.has(currentQuestion) ? "default" : "outline"}
          className="w-full flex items-center gap-2"
        >
          <Flag className="h-4 w-4" />
          {flaggedQuestions.has(currentQuestion) ? 'Unflag Question' : 'Flag Question'}
        </Button>
      </div>

      {/* Question Navigation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const status = getQuestionStatus(index);
              const StatusIcon = status.icon;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuestionSelect(index)}
                  className={`h-10 w-10 p-0 relative ${status.color}`}
                  title={`Question ${index + 1} (${question.points || 1} points)`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-medium">{index + 1}</span>
                    <StatusIcon className="h-3 w-3 absolute top-0 right-0 transform translate-x-1 -translate-y-1" />
                  </div>
                </Button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 text-gray-600" />
              <span>Not answered</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="h-3 w-3 text-yellow-600" />
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-blue-600" />
              <span>Current</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSidebar;
