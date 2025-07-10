
import React from 'react';
import { Check } from 'lucide-react';
import { WizardStep } from '@/types/modularTest';

interface WizardNavigationProps {
  steps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}

const WizardNavigation = ({ steps, currentStep, onStepClick }: WizardNavigationProps) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex < getCurrentStepIndex();
  };

  const isStepCurrent = (stepId: string) => {
    return stepId === currentStep;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors
                  ${isStepCompleted(index) 
                    ? 'bg-green-500 text-white' 
                    : isStepCurrent(step.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
                onClick={() => onStepClick(step.id as WizardStep)}
              >
                {isStepCompleted(index) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${isStepCurrent(step.id) ? 'text-blue-600' : 'text-gray-900'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${isStepCompleted(index) ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardNavigation;
