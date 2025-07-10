
import { useState } from 'react';
import { ModularTest, WizardStep } from '@/types/modularTest';
import { useToast } from '@/hooks/use-toast';

export const useWizardNavigation = (testData: Partial<ModularTest>) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');

  const canProceedFromDetails = () => {
    return testData.name && testData.name.trim().length > 0;
  };

  const canProceedFromModules = () => {
    return testData.modules && testData.modules.length > 0;
  };

  const canProceedFromQuestions = () => {
    return testData.modules?.every(module => 
      module.questions.length === getTotalQuestions(module)
    );
  };

  const canProceedFromAdaptive = () => {
    if (!testData.isAdaptive) return true;
    return testData.adaptiveRules && testData.adaptiveRules.length > 0;
  };

  const getTotalQuestions = (module: any) => {
    return module.questionCounts.numeric + 
           module.questionCounts.passage + 
           module.questionCounts.image + 
           module.questionCounts.mcq;
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'details':
        if (!canProceedFromDetails()) {
          toast({
            title: "Validation Error",
            description: "Please enter a test name to continue",
            variant: "destructive"
          });
          return;
        }
        setCurrentStep('modules');
        break;
      case 'modules':
        if (!canProceedFromModules()) {
          toast({
            title: "Validation Error", 
            description: "Please add at least one module to continue",
            variant: "destructive"
          });
          return;
        }
        setCurrentStep('questions');
        break;
      case 'questions':
        if (!canProceedFromQuestions()) {
          toast({
            title: "Validation Error",
            description: "Please complete all questions for all modules",
            variant: "destructive"
          });
          return;
        }
        if (testData.isAdaptive) {
          setCurrentStep('adaptive');
        } else {
          setCurrentStep('review');
        }
        break;
      case 'adaptive':
        if (!canProceedFromAdaptive()) {
          toast({
            title: "Validation Error",
            description: "Please configure at least one adaptive rule",
            variant: "destructive"
          });
          return;
        }
        setCurrentStep('review');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'modules':
        setCurrentStep('details');
        break;
      case 'questions':
        setCurrentStep('modules');
        break;
      case 'adaptive':
        setCurrentStep('questions');
        break;
      case 'review':
        if (testData.isAdaptive) {
          setCurrentStep('adaptive');
        } else {
          setCurrentStep('questions');
        }
        break;
    }
  };

  return {
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack,
    canProceedFromDetails,
    canProceedFromModules,
    canProceedFromQuestions,
    canProceedFromAdaptive
  };
};
