
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TestModule } from '@/types/modularTest';

interface QuestionDistributionProps {
  formData: TestModule;
  onUpdate: (updates: Partial<TestModule>) => void;
}

const QuestionDistribution = ({ formData, onUpdate }: QuestionDistributionProps) => {
  const updateQuestionCount = (type: keyof TestModule['questionCounts'], value: number) => {
    onUpdate({
      questionCounts: {
        ...formData.questionCounts,
        [type]: Math.max(0, value)
      }
    });
  };

  const getTotalQuestions = () => {
    return formData.questionCounts.numeric + 
           formData.questionCounts.passage + 
           formData.questionCounts.image + 
           formData.questionCounts.mcq;
  };

  const getAvailableQuestionTypes = () => {
    if (formData.subject === 'English') {
      return [
        { key: 'mcq', label: 'Multiple Choice Questions', available: true },
        { key: 'passage', label: 'Passage Questions', available: true },
        { key: 'numeric', label: 'Numeric Questions', available: false },
        { key: 'image', label: 'Image Questions', available: false }
      ];
    } else {
      return [
        { key: 'mcq', label: 'Multiple Choice Questions', available: true },
        { key: 'numeric', label: 'Numeric Questions', available: true },
        { key: 'image', label: 'Image Questions', available: true },
        { key: 'passage', label: 'Passage Questions', available: false }
      ];
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Distribution</CardTitle>
        <p className="text-sm text-gray-600">
          Specify how many questions of each type you want in this module
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getAvailableQuestionTypes().map(({ key, label, available }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                min="0"
                disabled={!available}
                value={formData.questionCounts[key as keyof TestModule['questionCounts']]}
                onChange={(e) => updateQuestionCount(
                  key as keyof TestModule['questionCounts'], 
                  parseInt(e.target.value) || 0
                )}
              />
              {!available && (
                <p className="text-xs text-gray-500">
                  Not available for {formData.subject} modules
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Questions:</span>
            <span className="text-lg font-bold text-gray-900">{getTotalQuestions()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionDistribution;
