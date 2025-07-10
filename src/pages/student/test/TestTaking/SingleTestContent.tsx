
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTest } from '@/contexts/TestContext';
import TestInterface from '@/components/test-taking/core/TestInterface';
import ModuleBreakEnhanced from '@/components/test-taking/core/ModuleBreakEnhanced';
import { getTestData } from './testData';

const SingleTestContent = () => {
  const { testId } = useParams<{ testId: string }>();
  const { isOnBreak, startTest, endBreak, currentModule, nextModule } = useTest();

  useEffect(() => {
    if (testId && !testId.includes('digital-sat') && !testId.includes('module')) {
      const testData = getTestData(testId);
      console.log('Loading single test:', testData.name);
      startTest(testData);
    }
  }, [testId, startTest]);

  if (isOnBreak) {
    return (
      <ModuleBreakEnhanced
        currentModule={currentModule}
        nextModule={nextModule}
        totalModules={2}
        currentSubject="Math"
        nextSubject="Math"
        onContinue={endBreak}
      />
    );
  }

  return <TestInterface />;
};

export default SingleTestContent;
