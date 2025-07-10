
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Coffee, CheckCircle } from 'lucide-react';

interface ModuleBreakProps {
  currentModule: number;
  nextModule: number;
  onContinue: () => void;
  breakDuration?: number; // in seconds, default 5 minutes
}

const ModuleBreak = ({ 
  currentModule, 
  nextModule, 
  onContinue, 
  breakDuration = 300 
}: ModuleBreakProps) => {
  const [timeLeft, setTimeLeft] = useState(breakDuration);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanContinue(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    onContinue();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Module {currentModule} Complete!
          </CardTitle>
          <p className="text-gray-600">
            Great job! Take a well-deserved break before continuing.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coffee className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Break Time</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-900">
                {formatTime(timeLeft)}
              </span>
            </div>
            {!canContinue && (
              <p className="text-sm text-blue-700 mt-2">
                Relax and prepare for Module {nextModule}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Use this time to:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Rest your eyes</li>
              <li>• Stretch or move around</li>
              <li>• Hydrate</li>
              <li>• Review your progress</li>
            </ul>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full"
              size="lg"
            >
              {canContinue ? `Continue to Module ${nextModule}` : 'Please wait...'}
            </Button>
            {canContinue && (
              <p className="text-xs text-gray-500 mt-2">
                You can now continue to the next module
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleBreak;
