
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TestModule } from '@/types/modularTest';
import ModuleDetailsForm from './module-editor/ModuleDetailsForm';
import QuestionDistribution from './module-editor/QuestionDistribution';
import { calculateModuleScore } from '@/utils/testValidation';

interface ModuleEditorProps {
  module: TestModule;
  existingModules?: TestModule[];
  onSave: (module: TestModule) => void;
  onCancel: () => void;
  isNew: boolean;
}

const ModuleEditor = ({ module, existingModules = [], onSave, onCancel, isNew }: ModuleEditorProps) => {
  const [formData, setFormData] = useState<TestModule>({
    ...module,
    questionScores: module.questionScores || {
      mcq: module.subject === 'Math' ? 1 : 1,
      numeric: module.subject === 'Math' ? 2 : 0,
      image: module.subject === 'Math' ? 2 : 0,
      passage: module.subject === 'English' ? 3 : 0
    }
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      return;
    }
    
    const moduleScore = calculateModuleScore(formData);
    const finalModule = {
      ...formData,
      totalScore: moduleScore
    };
    
    onSave(finalModule);
  };

  const updateFormData = (updates: Partial<TestModule>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getTotalQuestions = () => {
    return formData.questionCounts.numeric + 
           formData.questionCounts.passage + 
           formData.questionCounts.image + 
           formData.questionCounts.mcq;
  };

  const moduleScore = calculateModuleScore(formData);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isNew ? 'Create New Module' : 'Edit Module'}
        </h2>
        <p className="text-gray-600 mt-2">Configure module settings and question distribution</p>
      </div>

      <ModuleDetailsForm 
        formData={formData} 
        existingModules={existingModules}
        onUpdate={updateFormData} 
      />
      <QuestionDistribution formData={formData} onUpdate={updateFormData} />

      {/* Score Summary */}
      {getTotalQuestions() > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Module Score Summary</h3>
          <p className="text-blue-700 text-sm">
            Total Questions: {getTotalQuestions()} | Total Points: {moduleScore}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!formData.name.trim() || getTotalQuestions() === 0}
        >
          {isNew ? 'Add Module' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ModuleEditor;
