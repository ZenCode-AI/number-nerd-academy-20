
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TestSet } from '@/types/testSet';

interface TestSetProgressProps {
  testSet: TestSet;
  currentModule: number;
  totalProgress: number;
}

const TestSetProgress = ({ testSet, currentModule, totalProgress }: TestSetProgressProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{testSet.name}</h1>
            <p className="text-sm text-gray-600">
              Module {currentModule} of {testSet.modules.length} • 
              {testSet.modules.find(m => m.moduleNumber === currentModule)?.subject} • 
              {testSet.modules.find(m => m.moduleNumber === currentModule)?.name}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">Overall Progress</div>
            <div className="text-lg font-bold text-blue-600">{Math.round(totalProgress)}%</div>
          </div>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </div>
    </div>
  );
};

export default TestSetProgress;
