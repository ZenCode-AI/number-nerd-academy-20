
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TestSet, TestSetModule } from '@/types/testSet';
import { testSetStorage } from '@/services/testSetStorage';
import TestSetDetailsCard from './test-set-builder/TestSetDetailsCard';
import ModulesCard from './test-set-builder/ModulesCard';
import AdaptiveConfigCard from './test-set-builder/AdaptiveConfigCard';

interface TestSetBuilderProps {
  onSave: (testSet: TestSet) => void;
  existingTestSet?: TestSet;
}

const TestSetBuilder = ({ onSave, existingTestSet }: TestSetBuilderProps) => {
  const [testSet, setTestSet] = useState<Partial<TestSet>>(existingTestSet || {
    name: '',
    description: '',
    modules: [],
    adaptiveConfig: {
      enabled: false,
      rules: []
    },
    totalDuration: 0,
    plan: 'Basic',
    status: 'Draft'
  });

  const handleDetailsUpdate = (updates: Partial<TestSet>) => {
    setTestSet(prev => ({ ...prev, ...updates }));
  };

  const handleAddModule = (module: TestSetModule) => {
    setTestSet(prev => ({
      ...prev,
      modules: [...(prev.modules || []), module],
      totalDuration: (prev.totalDuration || 0) + module.duration
    }));
  };

  const handleRemoveModule = (moduleId: string) => {
    const moduleToRemove = testSet.modules?.find(m => m.id === moduleId);
    if (!moduleToRemove) return;

    setTestSet(prev => ({
      ...prev,
      modules: prev.modules?.filter(m => m.id !== moduleId) || [],
      totalDuration: (prev.totalDuration || 0) - moduleToRemove.duration
    }));
  };

  const handleSave = () => {
    if (!testSet.name || !testSet.modules?.length) return;

    const completeTestSet: TestSet = {
      id: existingTestSet?.id || `testset_${Date.now()}`,
      name: testSet.name,
      description: testSet.description || '',
      modules: testSet.modules,
      adaptiveConfig: testSet.adaptiveConfig!,
      totalDuration: testSet.totalDuration!,
      plan: testSet.plan!,
      status: testSet.status!,
      createdAt: existingTestSet?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to both localStorage and callback
    testSetStorage.saveTestSet(completeTestSet);
    onSave(completeTestSet);
  };

  return (
    <div className="space-y-6">
      <TestSetDetailsCard
        testSet={testSet}
        onUpdate={handleDetailsUpdate}
      />

      <ModulesCard
        modules={testSet.modules || []}
        onAddModule={handleAddModule}
        onRemoveModule={handleRemoveModule}
      />

      <AdaptiveConfigCard
        adaptiveConfig={testSet.adaptiveConfig!}
        onUpdate={(config) => setTestSet(prev => ({ ...prev, adaptiveConfig: config }))}
      />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="px-8">
          Save Test Set
        </Button>
      </div>
    </div>
  );
};

export default TestSetBuilder;
