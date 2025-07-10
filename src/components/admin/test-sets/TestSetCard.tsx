
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestSet } from '@/types/testSet';
import { Edit, Trash2, Play, Calculator, BookOpen } from 'lucide-react';

interface TestSetCardProps {
  testSet: TestSet;
  onEdit: (testSet: TestSet) => void;
  onDelete: (testSetId: string) => void;
}

const TestSetCard = ({ testSet, onEdit, onDelete }: TestSetCardProps) => {
  const getSubjectIcon = (subject: 'Math' | 'English') => {
    return subject === 'Math' ? Calculator : BookOpen;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{testSet.name}</CardTitle>
            <p className="text-sm text-gray-600 line-clamp-2">{testSet.description}</p>
          </div>
          <Badge variant={testSet.status === 'Active' ? 'default' : 'secondary'}>
            {testSet.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Modules Overview */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Modules ({testSet.modules.length})</h4>
          <div className="flex flex-wrap gap-1">
            {testSet.modules.map((module) => {
              const SubjectIcon = getSubjectIcon(module.subject);
              return (
                <Badge key={module.id} variant="outline" className="text-xs">
                  <SubjectIcon className="h-3 w-3 mr-1" />
                  {module.subject} {module.moduleNumber}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Test Set Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Duration:</span>
            <div className="font-semibold">{testSet.totalDuration} min</div>
          </div>
          <div>
            <span className="text-gray-600">Plan:</span>
            <div className="font-semibold">{testSet.plan}</div>
          </div>
        </div>

        {/* Adaptive Badge */}
        {testSet.adaptiveConfig.enabled && (
          <Badge variant="secondary" className="w-fit">
            Adaptive Testing
          </Badge>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(testSet)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(testSet.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestSetCard;
