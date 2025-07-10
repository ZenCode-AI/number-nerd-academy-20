
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModularTest, AdaptiveRule } from '@/types/modularTest';
import PathVisualization from './adaptive-learning/PathVisualization';
import RuleCreationForm from './adaptive-learning/RuleCreationForm';
import StatusMessages from './adaptive-learning/StatusMessages';

interface AdaptiveLearningStepProps {
  testData: Partial<ModularTest>;
  onUpdate: (updates: Partial<ModularTest>) => void;
}

const AdaptiveLearningStep: React.FC<AdaptiveLearningStepProps> = ({ testData, onUpdate }) => {
  const modules = testData.modules || [];

  const handleAddRule = (rule: AdaptiveRule) => {
    const updatedRules = [...(testData.adaptiveRules || []), rule];
    onUpdate({ adaptiveRules: updatedRules });
  };

  const handleRemoveRule = (ruleId: string) => {
    const updatedRules = (testData.adaptiveRules || []).filter(rule => rule.id !== ruleId);
    onUpdate({ adaptiveRules: updatedRules });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Multi-Level Adaptive Learning</h2>
        <p className="text-gray-600 mt-2">Configure branching rules for any module based on student performance</p>
      </div>

      <Tabs defaultValue="flow" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flow">Flow Visualization</TabsTrigger>
          <TabsTrigger value="rules">Add Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="flow" className="space-y-4">
          <PathVisualization 
            modules={modules}
            adaptiveRules={testData.adaptiveRules || []}
            onRemoveRule={handleRemoveRule}
          />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <RuleCreationForm 
            modules={modules}
            onAddRule={handleAddRule}
          />
        </TabsContent>
      </Tabs>

      <StatusMessages 
        modules={modules}
        adaptiveRules={testData.adaptiveRules}
      />
    </div>
  );
};

export default AdaptiveLearningStep;
