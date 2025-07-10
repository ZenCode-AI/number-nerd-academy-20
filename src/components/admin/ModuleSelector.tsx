
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestDetails } from '@/types/admin';

interface ModuleSelectorProps {
  testDetails: TestDetails;
  onUpdate: (field: keyof TestDetails, value: any) => void;
}

const ModuleSelector = ({ testDetails, onUpdate }: ModuleSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test Configuration
          <Badge variant="outline" className="text-xs">
            {testDetails.subject}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Module Information</h3>
          <p className="text-sm text-blue-700">
            This test will be available for use in adaptive test sets. Modules and adaptive testing 
            are configured at the test set level, not individual test level.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="p-3 bg-green-50 rounded border">
            <div className="font-medium text-green-800">Module 1</div>
            <div className="text-green-600">Medium Difficulty</div>
            <div className="text-xs text-green-500">Starting module</div>
          </div>
          <div className="p-3 bg-red-50 rounded border">
            <div className="font-medium text-red-800">Module 2</div>
            <div className="text-red-600">Hard Difficulty</div>
            <div className="text-xs text-red-500">High performers</div>
          </div>
          <div className="p-3 bg-blue-50 rounded border">
            <div className="font-medium text-blue-800">Module 3</div>
            <div className="text-blue-600">Easy Difficulty</div>
            <div className="text-xs text-blue-500">Support needed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleSelector;
