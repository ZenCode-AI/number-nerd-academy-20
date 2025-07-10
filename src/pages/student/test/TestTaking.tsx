
import React from 'react';
import { useParams } from 'react-router-dom';
import { TestProvider } from '@/contexts/TestContext';
import { TestSetProvider } from '@/contexts/TestSetContext';
import { modularTestStorage } from '@/services/modularTestStorage';
import SingleTestContent from './TestTaking/SingleTestContent';
import TestSetContent from './TestTaking/TestSetContent';

const TestTakingPage = () => {
  const { testId } = useParams<{ testId: string }>();
  
  // Check if it's an admin-created modular test
  const adminTest = testId ? modularTestStorage.getById(testId) : null;
  const isModularTest = adminTest || testId?.includes('digital-sat') || testId?.includes('free-module') || testId?.includes('module');
  
  if (isModularTest) {
    return (
      <TestSetProvider>
        <TestSetContent />
      </TestSetProvider>
    );
  }
  
  return (
    <TestProvider>
      <SingleTestContent />
    </TestProvider>
  );
};

export default TestTakingPage;
