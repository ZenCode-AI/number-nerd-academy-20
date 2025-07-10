
import React from 'react';
import { TestModule, AdaptiveRule } from '@/types/modularTest';

interface PathStatisticsProps {
  modules: TestModule[];
  adaptiveRules: AdaptiveRule[];
}

const PathStatistics = ({ modules, adaptiveRules }: PathStatisticsProps) => {
  const englishModules = modules.filter(m => m.subject === 'English');
  const mathModules = modules.filter(m => m.subject === 'Math');

  if (adaptiveRules.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-900 mb-2">Path Statistics</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-blue-700 font-medium">Total Modules:</span>
          <p className="text-blue-600">{modules.length}</p>
        </div>
        <div>
          <span className="text-blue-700 font-medium">Adaptive Rules:</span>
          <p className="text-blue-600">{adaptiveRules.length}</p>
        </div>
        <div>
          <span className="text-blue-700 font-medium">English Paths:</span>
          <p className="text-blue-600">{englishModules.length} modules</p>
        </div>
        <div>
          <span className="text-blue-700 font-medium">Math Paths:</span>
          <p className="text-blue-600">{mathModules.length} modules</p>
        </div>
      </div>
    </div>
  );
};

export default PathStatistics;
