
import React from 'react';
import AdaptiveTestManager from '@/components/admin/AdaptiveTestManager';

const AdaptiveTesting = () => {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Adaptive Testing</h1>
        <p className="text-sm md:text-base text-gray-600">Configure adaptive test flows and thresholds</p>
      </div>
      <AdaptiveTestManager />
    </div>
  );
};

export default AdaptiveTesting;
