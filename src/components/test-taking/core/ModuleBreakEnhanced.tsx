
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Coffee, CheckCircle, BookOpen, Calculator, Lightbulb, Target, ArrowRight, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ModuleBreakEnhancedProps {
  currentModule: number;
  nextModule: number;
  totalModules: number;
  currentSubject: 'Math' | 'English';
  nextSubject: 'Math' | 'English';
  breakDuration?: number; // in seconds, default 5 minutes
  onContinue: () => void;
  previousScore?: number;
  nextDifficulty?: 'Easy' | 'Medium' | 'Hard';
}

const ModuleBreakEnhanced = ({ 
  currentModule,
  nextModule,
  totalModules,
  currentSubject,
  nextSubject,
  breakDuration = 300,
  onContinue,
  previousScore,
  nextDifficulty
}: ModuleBreakEnhancedProps) => {
  const [timeLeft, setTimeLeft] = useState(breakDuration);
  const [canContinue, setCanContinue] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

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

  const getSubjectIcon = (subject: 'Math' | 'English') => {
    return subject === 'Math' ? Calculator : BookOpen;
  };

  const getBreakTips = (nextSubject: 'Math' | 'English') => {
    const mathTips = [
      'Review basic formulas in your mind',
      'Take deep breaths to stay calm',
      'Stretch your hands and wrists',
      'Hydrate with water'
    ];
    
    const englishTips = [
      'Clear your mind for reading comprehension',
      'Practice active reading mindset',
      'Rest your eyes by looking away from screen',
      'Take slow, deep breaths'
    ];
    
    return nextSubject === 'Math' ? mathTips : englishTips;
  };

  const getAdaptiveMessage = () => {
    if (!previousScore || !nextDifficulty) return null;
    
    if (nextDifficulty === 'Hard') {
      return {
        message: "Great performance! Your next module will be more challenging.",
        color: "text-green-600",
        bgColor: "bg-green-50"
      };
    } else if (nextDifficulty === 'Easy') {
      return {
        message: "Let's build your confidence with the next module.",
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      };
    }
    return {
      message: "You're doing well! Keep up the steady progress.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    };
  };

  const handleSkipBreak = () => {
    setShowSkipDialog(false);
    onContinue();
  };

  const overallProgress = (currentModule / totalModules) * 100;
  const adaptiveMessage = getAdaptiveMessage();
  const breakTips = getBreakTips(nextSubject);
  const NextSubjectIcon = getSubjectIcon(nextSubject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Module Break</h1>
              <p className="text-sm text-gray-600">
                Module {currentModule} Complete • Preparing for Module {nextModule}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">Test Progress</div>
              <div className="text-lg font-bold text-blue-600">{Math.round(overallProgress)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Module {currentModule} Complete!</h1>
            <div className="space-y-2">
              <p className="text-lg text-gray-600">Take a well-deserved break</p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Break Timer */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Coffee className="h-6 w-6 text-blue-600" />
                  Break Time
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <span className="text-4xl font-bold text-blue-900">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  {!canContinue && (
                    <p className="text-lg text-blue-700">
                      Relax and prepare for your next module
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={onContinue}
                    disabled={!canContinue}
                    className="w-full text-lg py-3"
                    size="lg"
                  >
                    {canContinue ? `Continue to Module ${nextModule}` : 'Please wait...'}
                  </Button>
                  
                  {!canContinue && (
                    <Button 
                      onClick={() => setShowSkipDialog(true)}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Skip Break
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Next Module Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NextSubjectIcon className="h-6 w-6" />
                  Next: Module {nextModule}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Subject:</span>
                    <span className="text-lg font-bold text-blue-600">{nextSubject}</span>
                  </div>
                  {nextDifficulty && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Difficulty:</span>
                      <span className={`font-bold ${
                        nextDifficulty === 'Hard' ? 'text-red-600' :
                        nextDifficulty === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {nextDifficulty}
                      </span>
                    </div>
                  )}
                </div>

                {adaptiveMessage && (
                  <div className={`p-4 rounded-lg ${adaptiveMessage.bgColor}`}>
                    <div className="flex items-start gap-2">
                      <Target className="h-5 w-5 mt-0.5 text-blue-600" />
                      <p className={`font-medium ${adaptiveMessage.color}`}>
                        {adaptiveMessage.message}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Break Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Break Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Recommended Activities:</h4>
                  <ul className="space-y-2">
                    {breakTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Quick Stats:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Modules Completed:</span>
                      <span className="font-bold">{currentModule}/{totalModules}</span>
                    </div>
                    {previousScore && (
                      <div className="flex justify-between">
                        <span>Last Module Score:</span>
                        <span className="font-bold text-blue-600">{previousScore}%</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Break Duration:</span>
                      <span className="font-bold">{Math.ceil(breakDuration / 60)} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skip Break Confirmation Dialog */}
      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Skip Break?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to skip your break? Taking breaks helps maintain focus and performance during long tests.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSkipDialog(false)}>
              Continue Break
            </Button>
            <Button onClick={handleSkipBreak}>
              Skip Break
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleBreakEnhanced;
