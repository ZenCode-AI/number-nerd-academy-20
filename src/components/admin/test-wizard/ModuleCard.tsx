
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, BookOpen, Calculator } from 'lucide-react';
import { TestModule } from '@/types/modularTest';

interface ModuleCardProps {
  module: TestModule;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const ModuleCard = ({ module, index, onEdit, onDelete }: ModuleCardProps) => {
  const getTotalQuestions = () => {
    return module.questionCounts.numeric + 
           module.questionCounts.passage + 
           module.questionCounts.image + 
           module.questionCounts.mcq;
  };

  const getSubjectIcon = () => {
    return module.subject === 'Math' ? Calculator : BookOpen;
  };

  const getDifficultyColor = () => {
    switch (module.difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SubjectIcon = getSubjectIcon();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
              {index + 1}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{module.name || 'Untitled Module'}</h3>
              <div className="flex items-center gap-2 mt-1">
                <SubjectIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{module.subject}</span>
                <Badge className={`text-xs ${getDifficultyColor()}`}>
                  {module.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Questions:</span>
            <span className="text-sm font-bold text-gray-900">{getTotalQuestions()}</span>
          </div>
          
          {getTotalQuestions() > 0 && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              {module.questionCounts.mcq > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">MCQ:</span>
                  <span className="font-medium">{module.questionCounts.mcq}</span>
                </div>
              )}
              {module.questionCounts.numeric > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Numeric:</span>
                  <span className="font-medium">{module.questionCounts.numeric}</span>
                </div>
              )}
              {module.questionCounts.passage > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Passage:</span>
                  <span className="font-medium">{module.questionCounts.passage}</span>
                </div>
              )}
              {module.questionCounts.image > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Image:</span>
                  <span className="font-medium">{module.questionCounts.image}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
