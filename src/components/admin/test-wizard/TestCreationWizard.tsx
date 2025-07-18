import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { ModularTest, TestModule } from '@/types/modularTest';
import TestDetailsStep from './TestDetailsStep';
import ModuleConfigurationStep from './ModuleConfigurationStep';
import ModuleQuestionEditor from './ModuleQuestionEditor';
import AdaptiveLearningStep from './AdaptiveLearningStep';
import TestReviewStep from './TestReviewStep';
import EnhancedWizardNavigation from './EnhancedWizardNavigation';
import ScoreDashboard from './ScoreDashboard';
import { useWizardNavigation } from './wizard-logic/useWizardNavigation';
import { useTestCreation } from './wizard-logic/useTestCreation';
import { useTestValidation } from '@/hooks/useTestValidation';

import { useToast } from '@/hooks/use-toast';

const TestCreationWizard = () => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [testData, setTestData] = useState<Partial<ModularTest>>({
    name: '',
    description: '',
    modules: [],
    totalDuration: 60,
    totalScore: 0,
    breakDuration: 300, // Default 5 minutes break
    plan: 'Basic' as const,
    status: 'Draft' as const,
    isAdaptive: false,
    adaptiveRules: []
  });

  const { toast } = useToast();
  const { validationErrors, validateStep, getFieldError, hasErrors, hasWarnings } = useTestValidation();
  

  const {
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack
  } = useWizardNavigation(testData);

  const { handleCreateTest, resetWizard } = useTestCreation();


  // Build steps dynamically based on adaptive setting
  const steps = [
    { id: 'details', title: 'Test Details', description: 'Basic information' },
    { id: 'modules', title: 'Add Modules', description: 'Configure modules' },
    { id: 'questions', title: 'Create Questions', description: 'Add questions to modules' },
    ...(testData.isAdaptive ? [{ id: 'adaptive', title: 'Adaptive Learning', description: 'Configure adaptive rules' }] : []),
    { id: 'review', title: 'Review & Create', description: 'Final review' }
  ];

  const updateTestData = (updates: Partial<ModularTest>) => {
    const newData = { ...testData, ...updates };
    setTestData(newData);
  };

  const updateModule = (moduleIndex: number, updates: Partial<TestModule>) => {
    const updatedModules = [...(testData.modules || [])];
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], ...updates };
    updateTestData({ modules: updatedModules });
  };

  const handleNextWithValidation = () => {
    const isValid = validateStep(testData, currentStep);
    if (isValid || !hasErrors) {
      handleNext();
    }
  };

  const handleCreateAndReset = async () => {
    const isValid = validateStep(testData, 'review');
    if (!isValid && hasErrors) {
      toast({
        title: "Validation Failed",
        description: "Please fix all errors before creating the test.",
        variant: "destructive"
      });
      return;
    }

    await handleCreateTest(testData);
    
    setTestData({
      name: '',
      description: '',
      modules: [],
      totalDuration: 60,
      totalScore: 0,
      breakDuration: 300,
      plan: 'Basic' as const,
      status: 'Draft' as const,
      isAdaptive: false,
      adaptiveRules: []
    });
    setCurrentStep('details');
    setCurrentModuleIndex(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return <TestDetailsStep testData={testData} onUpdate={updateTestData} />;
      case 'modules':
        return <ModuleConfigurationStep modules={testData.modules || []} onUpdate={(modules) => updateTestData({ modules })} />;
      case 'questions':
        return <ModuleQuestionEditor modules={testData.modules || []} currentModuleIndex={currentModuleIndex} onUpdateModule={updateModule} onModuleChange={setCurrentModuleIndex} />;
      case 'adaptive':
        return <AdaptiveLearningStep testData={testData} onUpdate={updateTestData} />;
      case 'review':
        return <TestReviewStep testData={testData as ModularTest} onEdit={(step) => setCurrentStep(step)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* Compact Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Test</h1>
        <p className="text-gray-600 text-sm">Build your test step by step with multiple modules</p>
      </div>

      <EnhancedWizardNavigation steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Validation Alerts */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors: {validationErrors.filter(e => e.severity === 'error').map(e => e.message).join(', ')}
          </AlertDescription>
        </Alert>
      )}
      
      {hasWarnings && !hasErrors && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Warnings: {validationErrors.filter(e => e.severity === 'warning').map(e => e.message).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content - Horizontal Layout */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <Card className="min-h-[400px]">
            <CardContent className="p-4">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <ScoreDashboard modules={testData.modules || []} targetScore={testData.totalScore} />
        </div>
      </div>

      {/* Compact Navigation Controls */}
      <div className="flex justify-between items-center bg-white border rounded-lg p-3 shadow-sm">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 'details'} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="text-sm text-gray-600">
          Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
        </div>

        {currentStep === 'review' ? (
          <Button onClick={handleCreateAndReset} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Create Test
          </Button>
        ) : (
          <Button 
            onClick={handleNextWithValidation}
            disabled={hasErrors}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestCreationWizard;
