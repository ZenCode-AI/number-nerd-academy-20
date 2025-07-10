import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Award, Play, Eye } from 'lucide-react';

interface TestCardProps {
  test: {
    id: string;
    name: string;
    subject: 'Math' | 'English';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    duration: number;
    questions: number;
    score?: number;
    maxScore?: number;
    status: 'Completed' | 'In Progress' | 'Not Started';
    plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
    completedAt?: string;
  };
  onStartTest: (testId: string) => void;
  onReviewTest: (testId: string) => void;
}

const TestCard = ({ test, onStartTest, onReviewTest }: TestCardProps) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'bg-gray-100 text-gray-800';
      case 'Basic': return 'bg-blue-100 text-blue-800';
      case 'Standard': return 'bg-purple-100 text-purple-800';
      case 'Premium': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTest = () => {
    navigate(`/student/test/${test.id}`);
  };

  const handleReviewTest = () => {
    navigate(`/student/test/${test.id}/results`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{test.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">{test.subject}</Badge>
              <Badge variant="secondary" className="text-xs">{test.difficulty}</Badge>
              <Badge className={`text-xs ${getPlanColor(test.plan)}`}>{test.plan}</Badge>
            </div>
          </div>
          <Badge className={`text-xs ${getStatusColor(test.status)}`}>
            {test.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{test.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span>{test.questions} questions</span>
          </div>
        </div>

        {test.status === 'Completed' && test.score !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Score</span>
              <span className="text-sm font-medium">{test.score}/{test.maxScore}</span>
            </div>
            <Progress value={(test.score / (test.maxScore || 100)) * 100} className="h-2" />
          </div>
        )}

        {test.completedAt && (
          <p className="text-xs text-gray-500 mb-4">
            Completed on {new Date(test.completedAt).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-2">
          {test.status === 'Completed' ? (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleReviewTest}
            >
              <Eye className="h-4 w-4 mr-2" />
              Review
            </Button>
          ) : (
            <Button 
              className="flex-1"
              onClick={handleStartTest}
            >
              <Play className="h-4 w-4 mr-2" />
              {test.status === 'In Progress' ? 'Continue' : 'Start Test'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCard;
