import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTest } from '@/contexts/TestContext';
import { useTestSessionRecovery } from '@/hooks/useTestSessionRecovery';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TestTakingErrorHandler, TEST_TAKING_ERROR_CODES } from '@/utils/testTakingErrorHandler';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import TestInterface from './TestInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const EnhancedTestInterface: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { 
    testData, 
    currentQuestion, 
    answers, 
    timeRemaining, 
    isTestStarted,
    session
  } = useTest();
  
  const { isOnline, isSlowConnection, reconnecting } = useNetworkStatus();
  const { 
    recoveryAvailable, 
    restoreSession, 
    clearBackup, 
    useAutoBackup 
  } = useTestSessionRecovery();
  
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);
  const [recoveryProcessed, setRecoveryProcessed] = useState(false);

  // Auto-backup session data
  useAutoBackup(testId || null, session, answers);

  // Check for recovery data on mount
  useEffect(() => {
    if (recoveryAvailable && !recoveryProcessed && !isTestStarted) {
      setShowRecoveryPrompt(true);
    }
  }, [recoveryAvailable, recoveryProcessed, isTestStarted]);

  // Handle session recovery
  const handleRecoveryAccept = useCallback(() => {
    try {
      const backup = restoreSession();
      if (backup && backup.testId === testId) {
        console.log('🔄 Restoring test session from backup');
        // Note: In a real implementation, you'd restore the session state here
        // For now, we'll just clear the recovery prompt
        setShowRecoveryPrompt(false);
        setRecoveryProcessed(true);
      }
    } catch (error) {
      TestTakingErrorHandler.handle(error, 'session-recovery');
      setShowRecoveryPrompt(false);
      setRecoveryProcessed(true);
    }
  }, [restoreSession, testId]);

  const handleRecoveryDecline = useCallback(() => {
    if (testId) {
      clearBackup(testId);
    }
    setShowRecoveryPrompt(false);
    setRecoveryProcessed(true);
  }, [clearBackup, testId]);

  // Network status indicator
  const NetworkStatusIndicator = () => (
    <div className="fixed top-4 right-4 z-50">
      {!isOnline ? (
        <Badge variant="destructive" className="gap-1">
          <WifiOff className="h-3 w-3" />
          Offline
        </Badge>
      ) : isSlowConnection ? (
        <Badge variant="secondary" className="gap-1">
          <Wifi className="h-3 w-3" />
          Slow Connection
        </Badge>
      ) : reconnecting ? (
        <Badge variant="outline" className="gap-1">
          <LoadingSpinner size="sm" />
          Reconnecting...
        </Badge>
      ) : (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Online
        </Badge>
      )}
    </div>
  );

  // Session recovery prompt
  if (showRecoveryPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Resume Previous Session?
            </CardTitle>
            <CardDescription>
              We found a previous test session for this test. Would you like to resume where you left off?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Choosing "Start Fresh" will permanently delete your previous progress.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              <Button onClick={handleRecoveryAccept} className="w-full">
                Resume Previous Session
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRecoveryDecline}
                className="w-full"
              >
                Start Fresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading states
  if (!testData || !isTestStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentQuestionData = testData.questions[currentQuestion];
  if (!currentQuestionData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Question Not Found</CardTitle>
            <CardDescription>
              Unable to load question {currentQuestion + 1}. Please try refreshing the page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary 
      context="test-interface"
      resetKeys={[testId, currentQuestion]}
      resetOnPropsChange={false}
    >
      <div className="relative min-h-screen">
        <NetworkStatusIndicator />
        
        {/* Offline warning */}
        {!isOnline && (
          <Alert className="m-4 border-warning bg-warning/10">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You're currently offline. Your answers are being saved locally and will sync when connection is restored.
            </AlertDescription>
          </Alert>
        )}
        
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <TestInterface />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};