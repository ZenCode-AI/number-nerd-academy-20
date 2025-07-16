import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { ModularTest, TestModule } from '@/types/modularTest';
import { useToast } from '@/hooks/use-toast';
import { modularTestStorage } from '@/services/modularTestStorage';
import TestDetailsStep from './test-wizard/TestDetailsStep';
import ModuleConfigurationStep from './test-wizard/ModuleConfigurationStep';
import ModuleQuestionEditor from './test-wizard/ModuleQuestionEditor';
import AdaptiveLearningStep from './test-wizard/AdaptiveLearningStep';
import TestReviewStep from './test-wizard/TestReviewStep';
import EnhancedWizardNavigation from './test-wizard/EnhancedWizardNavigation';
import ScoreDashboard from './test-wizard/ScoreDashboard';
import { useWizardNavigation } from './test-wizard/wizard-logic/useWizardNavigation';

const EditTestWizard = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testData, setTestData] = useState<Partial<ModularTest>>({
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

  const {
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack
  } = useWizardNavigation(testData);

  // Load existing test data
  useEffect(() => {
    if (testId) {
      const loadTest = async () => {
        try {
          const existingTest = await modularTestStorage.getById(testId);
          if (existingTest) {
            setTestData(existingTest);
          } else {
            toast({
              title: "Test Not Found",
              description: "The requested test could not be found.",
              variant: "destructive"
            });
            navigate('/admin/tests');
          }
        } catch (error) {
          console.error('Error loading test:', error);
          toast({
            title: "Error",
            description: "Failed to load test data.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };

      loadTest();
    }
  }, [testId, navigate, toast]);

  // Build steps dynamically based on adaptive setting
  const steps = [
    { id: 'details', title: 'Test Details', description: 'Basic information' },
    { id: 'modules', title: 'Edit Modules', description: 'Configure modules' },
    { id: 'questions', title: 'Edit Questions', description: 'Modify questions' },
    ...(testData.isAdaptive ? [{ id: 'adaptive', title: 'Adaptive Learning', description: 'Configure adaptive rules' }] : []),
    { id: 'review', title: 'Review & Save', description: 'Final review' }
  ];

  const updateTestData = (updates: Partial<ModularTest>) => {
    setTestData(prev => ({ ...prev, ...updates }));
  };

  const updateModule = (moduleIndex: number, updates: Partial<TestModule>) => {
    const updatedModules = [...(testData.modules || [])];
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], ...updates };
    setTestData(prev => ({ ...prev, modules: updatedModules }));
  };

  const handleSaveTest = async () => {
    if (!testId) return;

    setIsSaving(true);
    try {
      const updatedTest: ModularTest = {
        ...testData as ModularTest,
        id: testId,
        updatedAt: new Date().toISOString()
      };

      modularTestStorage.update(testId, updatedTest);
      
      toast({
        title: "Test Updated Successfully!",
        description: `Test "${updatedTest.name}" has been updated.`,
      });

      navigate('/admin/tests');
    } catch (error) {
      console.error('Error updating test:', error);
      toast({
        title: "Error Updating Test",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading test data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/tests')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tests
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Test</h1>
          <p className="text-gray-600 text-sm">Modify your test configuration and content</p>
        </div>
      </div>

      <EnhancedWizardNavigation steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Main Content */}
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

      {/* Navigation Controls */}
      <div className="flex justify-between items-center bg-white border rounded-lg p-3 shadow-sm">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 'details'} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="text-sm text-gray-600">
          Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
        </div>

        {currentStep === 'review' ? (
          <Button onClick={handleSaveTest} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex items-center gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditTestWizard;