
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, BookOpen, Calculator, Clock, FileText } from 'lucide-react';
import { ModularTest, WizardStep } from '@/types/modularTest';

interface TestReviewStepProps {
  testData: ModularTest;
  onEdit: (step: WizardStep) => void;
}

const TestReviewStep = ({ testData, onEdit }: TestReviewStepProps) => {
  const getTotalQuestions = () => {
    return testData.modules.reduce((total, module) => {
      return total + module.questionCounts.numeric + 
             module.questionCounts.passage + 
             module.questionCounts.image + 
             module.questionCounts.mcq;
    }, 0);
  };

  const getSubjectDistribution = () => {
    const subjects = testData.modules.reduce((acc, module) => {
      acc[module.subject] = (acc[module.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return subjects;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Review & Create Test</h2>
        <p className="text-gray-600 mt-2">Review all details before creating your test</p>
      </div>

      {/* Test Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Overview</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit('details')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{testData.name}</h3>
            {testData.description && (
              <p className="text-gray-600 mt-1">{testData.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="font-medium">{testData.totalDuration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Plan:</span>
              <Badge variant="outline">{testData.plan}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge variant="secondary">{testData.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Test Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{testData.modules.length}</div>
              <div className="text-sm text-blue-700">Total Modules</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{getTotalQuestions()}</div>
              <div className="text-sm text-green-700">Total Questions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">
                {Object.keys(getSubjectDistribution()).length}
              </div>
              <div className="text-sm text-purple-700">Subjects</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {Math.round(getTotalQuestions() / testData.modules.length)}
              </div>
              <div className="text-sm text-orange-700">Avg Questions/Module</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Modules ({testData.modules.length})</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit('modules')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Modules
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testData.modules.map((module, index) => {
              const SubjectIcon = module.subject === 'Math' ? Calculator : BookOpen;
              const totalQuestions = module.questionCounts.numeric + 
                                   module.questionCounts.passage + 
                                   module.questionCounts.image + 
                                   module.questionCounts.mcq;
              
              return (
                <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <SubjectIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">{module.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{module.subject}</Badge>
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
                    <div className="font-medium text-gray-900">{totalQuestions} questions</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {module.questions.length} created
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Ready to Create!</h3>
        <p className="text-blue-700 text-sm">
          Your test "{testData.name}" is configured with {testData.modules.length} modules 
          and {getTotalQuestions()} total questions. Click "Create Test" to save your test.
        </p>
      </div>
    </div>
  );
};

export default TestReviewStep;
