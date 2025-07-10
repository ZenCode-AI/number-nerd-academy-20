
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTestSet } from '@/contexts/TestSetContext';

const TestSetHeader = () => {
  const navigate = useNavigate();
  const { testSet, currentModuleData, session, moduleResults } = useTestSet();

  const handleSubmitTest = () => {
    if (window.confirm('Are you sure you want to submit your test? This action cannot be undone.')) {
      navigate(`/student/test/${testSet?.id}/results`);
    }
  };

  // Get current module info for display
  const currentModuleConfig = testSet?.modules.find(m => m.moduleNumber === session?.currentModule);
  
  // Calculate real progress based on completed modules
  const progressPercentage = testSet ? Math.round((moduleResults.length / testSet.modules.length) * 100) : 0;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-20">
      <div className="flex items-center justify-between">
        {/* Real Test Info from Admin */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">{testSet?.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{currentModuleData?.subject}</span>
            <span>•</span>
            <span>Module {session?.currentModule}</span>
            {currentModuleConfig && (
              <>
                <span>•</span>
                <span className="text-blue-600 font-medium">{currentModuleConfig.difficulty}</span>
              </>
            )}
            <span>•</span>
            <span className="text-green-600 font-medium">{progressPercentage}% Complete</span>
          </div>
        </div>

        {/* Module Progress & Submit */}
        <div className="flex items-center gap-6">
          {/* Real Module Progress */}
          {testSet && session && (
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="font-medium">Progress:</span> {moduleResults.length}/{testSet.modules.length} modules completed
            </div>
          )}
          
          {/* Real Total Points */}
          {currentModuleData && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <span className="font-medium">Module Points:</span> {currentModuleData.totalPoints}
            </div>
          )}
          
          <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700 px-6 py-2">
            Submit Test
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TestSetHeader;
