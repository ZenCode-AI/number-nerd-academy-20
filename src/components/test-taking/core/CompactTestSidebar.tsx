
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flag, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { TestQuestion, TestAnswer } from '@/types/test';

interface CompactTestSidebarProps {
  questions: TestQuestion[];
  currentQuestion: number;
  answers: TestAnswer[];
  onQuestionSelect: (index: number) => void;
  timeRemaining: number;
  flaggedQuestions: Set<number>;
  onFlagQuestion: () => void;
}

const CompactTestSidebar = ({
  questions,
  currentQuestion,
  answers,
  onQuestionSelect,
  timeRemaining,
  flaggedQuestions,
  onFlagQuestion,
}: CompactTestSidebarProps) => {
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
    if (timeRemaining <= 300) return 'text-red-600 bg-red-50';
    if (timeRemaining <= 600) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getQuestionStatus = (index: number) => {
    const isAnswered = answers.some(a => a.questionIndex === index);
    const isFlagged = flaggedQuestions.has(index);
    const isCurrent = index === currentQuestion;

    if (isCurrent) return { icon: AlertCircle, color: 'bg-blue-500 text-white border-blue-500' };
    if (isAnswered && isFlagged) return { icon: CheckCircle, color: 'bg-green-500 text-white border-green-500' };
    if (isAnswered) return { icon: CheckCircle, color: 'bg-green-500 text-white border-green-500' };
    if (isFlagged) return { icon: Flag, color: 'bg-yellow-500 text-white border-yellow-500' };
    return { icon: Circle, color: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200' };
  };

  const answeredCount = answers.length;
  const flaggedCount = flaggedQuestions.size;
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      {/* Timer */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Left
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-xl font-mono font-bold p-2 rounded-lg text-center ${getTimeColor()}`}>
            {formatTime(timeRemaining)}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Answered:</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
              {answeredCount}/{questions.length}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Flagged:</span>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
              {flaggedCount}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Points:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
              {totalPoints}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Questions Grid - Fixed to prevent horizontal scroll */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((question, index) => {
              const status = getQuestionStatus(index);
              const StatusIcon = status.icon;
              
              return (
                <button
                  key={index}
                  onClick={() => onQuestionSelect(index)}
                  className={`w-full h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all hover:shadow-sm ${status.color}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactTestSidebar;
