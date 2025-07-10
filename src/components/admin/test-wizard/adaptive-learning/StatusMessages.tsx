
import React from 'react';
import { TestModule, AdaptiveRule } from '@/types/modularTest';

interface StatusMessagesProps {
  modules: TestModule[];
  adaptiveRules?: AdaptiveRule[];
}

const StatusMessages = ({ modules, adaptiveRules }: StatusMessagesProps) => {
  if (modules.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-900 mb-2">No Modules Available</h3>
        <p className="text-yellow-700 text-sm">
          You need to create modules first before setting up adaptive learning rules.
        </p>
      </div>
    );
  }

  if (!adaptiveRules || adaptiveRules.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Ready for Adaptive Rules</h3>
        <p className="text-blue-700 text-sm">
          You have {modules.length} modules available. Start adding adaptive rules to create branching paths based on student performance.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="font-medium text-green-900 mb-2">Multi-Level Adaptive Learning Active</h3>
      <p className="text-green-700 text-sm">
        Students will be dynamically routed through {modules.length} available modules based on their performance, with {adaptiveRules.length} adaptive rules configured.
      </p>
    </div>
  );
};

export default StatusMessages;
