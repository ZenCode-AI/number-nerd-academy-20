import { useCallback, useEffect, useState } from 'react';
import { TestAnswer, TestSession } from '@/types/test';
import { TestSetSession, ModuleResult } from '@/types/testSet';
import { TestTakingErrorHandler, TEST_TAKING_ERROR_CODES } from '@/utils/testTakingErrorHandler';

interface SessionBackup {
  timestamp: number;
  testId: string;
  data: TestSession | TestSetSession;
  answers: TestAnswer[];
  moduleResults?: ModuleResult[];
}

const SESSION_STORAGE_KEY = 'testSessionBackup';
const BACKUP_INTERVAL = 30000; // 30 seconds
const MAX_BACKUP_AGE = 24 * 60 * 60 * 1000; // 24 hours

export const useTestSessionRecovery = () => {
  const [lastBackupTime, setLastBackupTime] = useState<number>(0);
  const [recoveryAvailable, setRecoveryAvailable] = useState(false);

  // Check for existing backup on mount
  useEffect(() => {
    checkForRecoveryData();
  }, []);

  const checkForRecoveryData = useCallback(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const backup: SessionBackup = JSON.parse(stored);
        const age = Date.now() - backup.timestamp;
        
        if (age < MAX_BACKUP_AGE) {
          setRecoveryAvailable(true);
          return backup;
        } else {
          // Clean up old backup
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error checking recovery data:', error);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    
    setRecoveryAvailable(false);
    return null;
  }, []);

  const createBackup = useCallback(async (
    testId: string,
    session: TestSession | TestSetSession,
    answers: TestAnswer[],
    moduleResults?: ModuleResult[]
  ) => {
    try {
      const backup: SessionBackup = {
        timestamp: Date.now(),
        testId,
        data: session,
        answers,
        moduleResults
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(backup));
      setLastBackupTime(Date.now());
      
      console.log('✅ Session backup created:', testId);
    } catch (error) {
      TestTakingErrorHandler.handle(error, 'session-backup');
    }
  }, []);

  const restoreSession = useCallback((): SessionBackup | null => {
    try {
      const backup = checkForRecoveryData();
      if (backup) {
        console.log('🔄 Restoring session from backup:', backup.testId);
        return backup;
      }
    } catch (error) {
      TestTakingErrorHandler.handle(error, 'session-restore');
    }
    return null;
  }, [checkForRecoveryData]);

  const clearBackup = useCallback((testId?: string) => {
    try {
      if (testId) {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const backup: SessionBackup = JSON.parse(stored);
          if (backup.testId === testId) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setRecoveryAvailable(false);
            console.log('🗑️ Session backup cleared for:', testId);
          }
        }
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setRecoveryAvailable(false);
        console.log('🗑️ All session backups cleared');
      }
    } catch (error) {
      console.error('Error clearing backup:', error);
    }
  }, []);

  const shouldCreateBackup = useCallback(() => {
    return Date.now() - lastBackupTime > BACKUP_INTERVAL;
  }, [lastBackupTime]);

  // Auto-backup hook for test context
  const useAutoBackup = useCallback((
    testId: string | null,
    session: TestSession | TestSetSession | null,
    answers: TestAnswer[],
    moduleResults?: ModuleResult[]
  ) => {
    useEffect(() => {
      if (testId && session && shouldCreateBackup()) {
        createBackup(testId, session, answers, moduleResults);
      }
    }, [testId, session, answers, moduleResults]);
  }, [createBackup, shouldCreateBackup]);

  return {
    recoveryAvailable,
    createBackup,
    restoreSession,
    clearBackup,
    shouldCreateBackup,
    useAutoBackup,
    lastBackupTime
  };
};