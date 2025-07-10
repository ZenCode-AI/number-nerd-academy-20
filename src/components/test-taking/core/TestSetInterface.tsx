
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestSet } from '@/contexts/TestSetContext';
import TestSetModuleInterface from './TestSetModuleInterface';
import ModuleBreakEnhanced from './ModuleBreakEnhanced';
import NavigationWarningDialog from './NavigationWarningDialog';
import TestSetCompletion from './test-set-interface/TestSetCompletion';

const TestSetInterface = () => {
  const navigate = useNavigate();
  const [showExitWarning, setShowExitWarning] = useState(false);
  
  const { 
    testSet, 
    session, 
    currentModuleData, 
    currentModule, 
    isOnBreak, 
    breakTimeRemaining,
    moduleResults,
    endBreak,
    proceedToNextModule,
    completeTestSet
  } = useTestSet();

  // Prevent navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      setShowExitWarning(true);
      window.history.pushState(null, '', window.location.pathname);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
    };

    window.history.pushState(null, '', window.location.pathname);
    
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleConfirmExit = () => {
    window.removeEventListener('beforeunload', () => {});
    window.removeEventListener('popstate', () => {});
    
    navigate('/student/browse-tests', { replace: true });
  };

  const handleContinueAfterBreak = () => {
    console.log('🏃 TestSetInterface: User clicked continue after break');
    console.log('📊 TestSetInterface: Current state:', {
      currentModule,
      totalModules: testSet?.modules.length,
      isOnBreak,
      breakTimeRemaining
    });
    
    endBreak();
    
    setTimeout(() => {
      console.log('⏰ TestSetInterface: Calling proceedToNextModule after delay');
      proceedToNextModule();
    }, 200);
  };

  useEffect(() => {
    console.log('🔄 TestSetInterface: State changed:', {
      currentModule,
      isOnBreak,
      testSetModules: testSet?.modules.length,
      moduleResults: moduleResults.length,
      sessionStatus: session?.status
    });
  }, [currentModule, isOnBreak, testSet, moduleResults, session]);

  if (!testSet || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Test Set...</h2>
          <p className="text-gray-600">Please wait while we prepare your admin-created test.</p>
        </div>
      </div>
    );
  }

  if (isOnBreak) {
    console.log('🖥️ TestSetInterface: Rendering break screen');
    
    const currentModuleInfo = testSet.modules.find(m => m.moduleNumber === currentModule);
    const nextModuleInfo = testSet.modules.find(m => m.moduleNumber === currentModule + 1);
    const lastResult = moduleResults[moduleResults.length - 1];

    if (!nextModuleInfo) {
      console.log('🏁 TestSetInterface: No next module found, completing test set');
      completeTestSet();
      return null;
    }

    return (
      <ModuleBreakEnhanced
        currentModule={currentModule}
        nextModule={nextModuleInfo.moduleNumber}
        totalModules={testSet.modules.length}
        currentSubject={currentModuleInfo?.subject || 'Math'}
        nextSubject={nextModuleInfo.subject}
        breakDuration={breakTimeRemaining}
        onContinue={handleContinueAfterBreak}
        previousScore={lastResult?.percentage}
        nextDifficulty={nextModuleInfo.difficulty === 'Adaptive' ? 'Medium' : nextModuleInfo.difficulty}
      />
    );
  }

  if (session?.status === 'Completed' || currentModule > testSet.modules.length) {
    console.log('🎉 TestSetInterface: Rendering completion screen');
    return (
      <TestSetCompletion 
        testSet={testSet} 
        moduleResults={moduleResults} 
      />
    );
  }

  console.log('📝 TestSetInterface: Rendering test interface for module:', currentModule);
  
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {currentModuleData && <TestSetModuleInterface />}
      </div>

      <NavigationWarningDialog
        isOpen={showExitWarning}
        onClose={() => setShowExitWarning(false)}
        onConfirmExit={handleConfirmExit}
      />
    </>
  );
};

export default TestSetInterface;
