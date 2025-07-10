
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTestSet } from '@/contexts/TestSetContext';
import TestSetInterface from '@/components/test-taking/core/TestSetInterface';
import { getTestData } from './testData';
import { convertToTestSet } from './testSetConverter';
import { modularTestStorage } from '@/services/modularTestStorage';

const TestSetContent = () => {
  const { testId } = useParams<{ testId: string }>();
  const { startTestSet } = useTestSet();

  useEffect(() => {
    if (testId) {
      const testData = getTestData(testId);
      const adminTest = modularTestStorage.getById(testId);
      const testSet = convertToTestSet(testData);
      
      console.log('Loading test set:', testSet.name, 'with', testSet.modules.length, 'modules');
      console.log('Admin test data available:', !!adminTest);
      
      startTestSet(testSet, testData, adminTest);
    }
  }, [testId, startTestSet]);

  return <TestSetInterface />;
};

export default TestSetContent;
