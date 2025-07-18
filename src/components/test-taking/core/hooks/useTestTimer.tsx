
import { useEffect, useState, useCallback, useRef } from 'react';
import { useTestSet } from '@/contexts/TestSetContext';
import { TestTakingErrorHandler, TEST_TAKING_ERROR_CODES } from '@/utils/testTakingErrorHandler';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const useTestTimer = () => {
  const { currentModuleData, testSet, session } = useTestSet();
  const { isOnline } = useNetworkStatus();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [syncError, setSyncError] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<number>(Date.now());
  const serverTimeOffsetRef = useRef<number>(0);

  // Sync with server time periodically
  const syncServerTime = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      const start = Date.now();
      const response = await fetch('/api/time', { 
        method: 'HEAD',
        cache: 'no-cache' 
      });
      const end = Date.now();
      
      if (response.ok) {
        const serverTime = new Date(response.headers.get('date') || '').getTime();
        const networkDelay = (end - start) / 2;
        serverTimeOffsetRef.current = serverTime + networkDelay - end;
        lastSyncRef.current = Date.now();
        setSyncError(false);
        console.log('⏱️ Timer synced with server, offset:', serverTimeOffsetRef.current);
      }
    } catch (error) {
      console.warn('Failed to sync server time:', error);
      setSyncError(true);
      
      // If sync fails multiple times, handle as timer desync
      if (Date.now() - lastSyncRef.current > 60000) { // 1 minute without sync
        TestTakingErrorHandler.handle(
          { code: TEST_TAKING_ERROR_CODES.TIMER_DESYNC },
          'timer-sync'
        );
      }
    }
  }, [isOnline]);

  // Initialize timer with real admin-defined duration
  useEffect(() => {
    if (currentModuleData && testSet && session) {
      const currentModuleConfig = testSet.modules.find(m => m.moduleNumber === session.currentModule);
      const moduleDuration = currentModuleConfig?.duration || currentModuleData.duration;
      
      console.log('🕐 Timer: Setting real admin duration for module', session.currentModule, ':', moduleDuration, 'minutes');
      setTimeRemaining(moduleDuration * 60);
      
      // Initial server time sync
      syncServerTime();
    }
  }, [currentModuleData, testSet, session, syncServerTime]);

  // Timer countdown with error handling
  useEffect(() => {
    if (timeRemaining > 0 && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1);
          
          // Save timer state to localStorage for recovery
          try {
            if (session) {
              localStorage.setItem(`timer_${session.testSetId}`, JSON.stringify({
                timeRemaining: newTime,
                lastUpdate: Date.now(),
                moduleNumber: session.currentModule
              }));
            }
          } catch (error) {
            console.warn('Failed to save timer state:', error);
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeRemaining, isPaused, session]);

  // Periodic server sync (every 5 minutes)
  useEffect(() => {
    const syncInterval = setInterval(syncServerTime, 300000);
    return () => clearInterval(syncInterval);
  }, [syncServerTime]);

  // Recovery from localStorage on mount
  useEffect(() => {
    if (session) {
      try {
        const stored = localStorage.getItem(`timer_${session.testSetId}`);
        if (stored) {
          const timerState = JSON.parse(stored);
          const timeSinceLastUpdate = Date.now() - timerState.lastUpdate;
          
          // Only recover if less than 5 minutes passed and same module
          if (timeSinceLastUpdate < 300000 && timerState.moduleNumber === session.currentModule) {
            const adjustedTime = Math.max(0, timerState.timeRemaining - Math.floor(timeSinceLastUpdate / 1000));
            setTimeRemaining(adjustedTime);
            console.log('🔄 Timer recovered from localStorage:', adjustedTime);
          }
        }
      } catch (error) {
        console.warn('Failed to recover timer state:', error);
      }
    }
  }, [session]);

  // Pause/resume timer
  const pauseTimer = useCallback(() => {
    setIsPaused(true);
    console.log('⏸️ Timer paused');
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
    console.log('▶️ Timer resumed');
  }, []);

  // Add time (for extensions)
  const addTime = useCallback((seconds: number) => {
    setTimeRemaining(prev => prev + seconds);
    console.log(`⏱️ Added ${seconds} seconds to timer`);
  }, []);

  // Reset timer
  const resetTimer = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
    console.log(`🔄 Timer reset to ${newTime} seconds`);
  }, []);

  return {
    timeRemaining,
    isPaused,
    syncError,
    pauseTimer,
    resumeTimer,
    addTime,
    resetTimer,
    lastSync: lastSyncRef.current
  };
};
