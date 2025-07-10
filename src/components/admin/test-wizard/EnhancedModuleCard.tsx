
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, BookOpen, Calculator, Clock, Target, AlertTriangle } from 'lucide-react';
import { TestModule } from '@/types/modularTest';

interface EnhancedModuleCardProps {
  module: TestModule;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onReorder?: (direction: 'up' | 'down') => void;
}

const EnhancedModuleCard = ({ module, index, onEdit, onDelete, onReorder }: EnhancedModuleCardProps) => {
  const getTotalQuestions = () => {
    return module.questionCounts.numeric + 
           module.questionCounts.passage + 
           module.questionCounts.image + 
           module.questionCounts.mcq;
  };

  const getCompletedQuestions = () => {
    return module.questions?.length || 0;
  };

  const calculateModuleScore = () => {
    const { questionCounts, questionScores } = module;
    return (
      (questionCounts.mcq * questionScores.mcq) +
      (questionCounts.numeric * questionScores.numeric) +
      (questionCounts.image * questionScores.image) +
      (questionCounts.passage * questionScores.passage)
    );
  };

  const estimatedTime = getTotalQuestions() * 2; // 2 minutes per question estimate
  const totalQuestions = getTotalQuestions();
  const completedQuestions = getCompletedQuestions();
  const completionPercentage = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
  const moduleScore = calculateModuleScore();

  const getSubjectIcon = () => {
    return module.subject === 'Math' ? Calculator : BookOpen;
  };

  const getDifficultyColor = () => {
    switch (module.difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusInfo = () => {
    if (totalQuestions === 0) return { color: 'text-gray-500', status: 'Not Configured', icon: AlertTriangle };
    if (completedQuestions === 0) return { color: 'text-orange-500', status: 'Pending', icon: Clock };
    if (completedQuestions < totalQuestions) return { color: 'text-blue-500', status: 'In Progress', icon: Clock };
    return { color: 'text-green-500', status: 'Complete', icon: Target };
  };

  const SubjectIcon = getSubjectIcon();
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Module Number & Icon */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white text-lg font-bold shadow-lg">
                {index + 1}
              </div>
              <SubjectIcon className="h-5 w-5 text-gray-400" />
            </div>

            {/* Module Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 text-lg truncate">
                  {module.name || 'Untitled Module'}
                </h3>
                <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {module.subject}
                </Badge>
                <Badge className={`text-xs border ${getDifficultyColor()}`}>
                  {module.difficulty}
                </Badge>
                <Badge variant="outline" className={`text-xs ${statusInfo.color}`}>
                  {statusInfo.status}
                </Badge>
              </div>

              {/* Progress Bar */}
              {totalQuestions > 0 && (
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Questions Progress</span>
                    <span>{completedQuestions}/{totalQuestions}</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Total Questions */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">{totalQuestions}</div>
            <div className="text-xs text-gray-500">Questions</div>
          </div>

          {/* Total Score */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{moduleScore}</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>

          {/* Estimated Time */}
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{estimatedTime}</div>
            <div className="text-xs text-gray-500">Minutes</div>
          </div>
        </div>

        {/* Question Breakdown */}
        {totalQuestions > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs font-medium text-gray-700 mb-2">Question Types</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {module.questionCounts.mcq > 0 && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">MCQ:</span>
                  <span className="font-medium">{module.questionCounts.mcq}</span>
                </div>
              )}
              {module.questionCounts.numeric > 0 && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Numeric:</span>
                  <span className="font-medium">{module.questionCounts.numeric}</span>
                </div>
              )}
              {module.questionCounts.passage > 0 && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Passage:</span>
                  <span className="font-medium">{module.questionCounts.passage}</span>
                </div>
              )}
              {module.questionCounts.image > 0 && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Image:</span>
                  <span className="font-medium">{module.questionCounts.image}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedModuleCard;
