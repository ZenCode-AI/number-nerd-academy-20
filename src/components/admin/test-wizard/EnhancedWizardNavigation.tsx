
import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WizardStep } from '@/types/modularTest';

interface EnhancedWizardNavigationProps {
  steps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
  completionData?: {
    totalSteps: number;
    completedSteps: number;
    currentStepProgress: number;
  };
}

const EnhancedWizardNavigation = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  completionData 
}: EnhancedWizardNavigationProps) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex < getCurrentStepIndex();
  };

  const isStepCurrent = (stepId: string) => {
    return stepId === currentStep;
  };

  const isStepAccessible = (stepIndex: number) => {
    return stepIndex <= getCurrentStepIndex();
  };

  const currentStepIndex = getCurrentStepIndex();
  const overallProgress = completionData ? 
    ((completionData.completedSteps + (completionData.currentStepProgress / 100)) / completionData.totalSteps) * 100 
    : ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Test Creation Progress</h3>
            <p className="text-sm text-gray-600">
              Step {currentStepIndex + 1} of {steps.length} • {Math.round(overallProgress)}% Complete
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(overallProgress)}%
            </div>
          </div>
        </div>
        <Progress value={overallProgress} className="h-3 bg-white" />
        {completionData && completionData.currentStepProgress < 100 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-blue-700">
            <Clock className="h-4 w-4" />
            Current step: {Math.round(completionData.currentStepProgress)}% complete
          </div>
        )}
      </div>

      {/* Step Navigation */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="relative">
          {/* Connection Lines */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" 
               style={{ 
                 left: `${100 / steps.length / 2}%`, 
                 right: `${100 / steps.length / 2}%` 
               }} 
          />
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center group cursor-pointer"
                   onClick={() => isStepAccessible(index) && onStepClick(step.id as WizardStep)}>
                
                {/* Step Circle */}
                <div className={`
                  relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300 shadow-lg
                  ${isStepCompleted(index) 
                    ? 'bg-green-500 text-white shadow-green-200 transform scale-105' 
                    : isStepCurrent(step.id)
                    ? 'bg-blue-500 text-white shadow-blue-200 ring-4 ring-blue-100 transform scale-110'
                    : isStepAccessible(index)
                    ? 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-300 hover:shadow-md'
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  }
                  ${isStepAccessible(index) ? 'hover:scale-105' : 'cursor-not-allowed'}
                `}>
                  {isStepCompleted(index) ? (
                    <Check className="h-5 w-5" />
                  ) : isStepCurrent(step.id) ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Content */}
                <div className="mt-4 text-center max-w-32">
                  <div className={`text-sm font-semibold mb-1 transition-colors ${
                    isStepCurrent(step.id) ? 'text-blue-600' : 
                    isStepCompleted(index) ? 'text-green-600' : 
                    'text-gray-700'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">
                    {step.description}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mt-2">
                    {isStepCurrent(step.id) && (
                      <Badge variant="default" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Current
                      </Badge>
                    )}
                    {isStepCompleted(index) && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                        Complete
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWizardNavigation;
