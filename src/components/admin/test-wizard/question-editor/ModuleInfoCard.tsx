
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, BookOpen } from 'lucide-react';
import { TestModule } from '@/types/modularTest';

interface ModuleInfoCardProps {
  module: TestModule;
  completedQuestions: number;
  totalQuestions: number;
}

const ModuleInfoCard = ({ module, completedQuestions, totalQuestions }: ModuleInfoCardProps) => {
  const SubjectIcon = module.subject === 'Math' ? Calculator : BookOpen;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SubjectIcon className="h-6 w-6 text-gray-600" />
            <div>
              <CardTitle className="text-lg">{module.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{module.subject}</Badge>
                <Badge className={`text-xs ${
                  module.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  module.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {module.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="text-lg font-semibold">
              {completedQuestions} / {totalQuestions}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ModuleInfoCard;
