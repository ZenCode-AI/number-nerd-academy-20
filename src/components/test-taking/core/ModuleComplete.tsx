
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Coffee, ArrowRight } from 'lucide-react';

interface ModuleCompleteProps {
  currentModule: number;
  nextModule: number;
  onTakeBreak: () => void;
  onContinue: () => void;
}

const ModuleComplete = ({ 
  currentModule, 
  nextModule, 
  onTakeBreak, 
  onContinue 
}: ModuleCompleteProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Module {currentModule} Complete!
          </CardTitle>
          <p className="text-gray-600">
            Excellent work! You've finished Module {currentModule}.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <p className="text-sm text-blue-700">
              You can take a 5-minute break to rest and recharge, or continue directly to Module {nextModule}.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium">Choose your next step:</p>
            
            <Button 
              onClick={onTakeBreak}
              variant="outline"
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <Coffee className="h-4 w-4" />
              Take 5-Minute Break
            </Button>
            
            <Button 
              onClick={onContinue}
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <ArrowRight className="h-4 w-4" />
              Continue to Module {nextModule}
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p>Taking breaks can help improve focus and performance!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleComplete;
