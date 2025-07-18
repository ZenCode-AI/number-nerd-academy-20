import { useState, useEffect, useCallback } from 'react';
import { TestTakingErrorHandler, TEST_TAKING_ERROR_CODES } from '@/utils/testTakingErrorHandler';

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  reconnecting: boolean;
  lastConnected: number | null;
}

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    reconnecting: false,
    lastConnected: navigator.onLine ? Date.now() : null
  });

  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const maxReconnectAttempts = 5;

  // Test connection with a small request
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/ping', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      // Try alternative lightweight endpoint
      try {
        const response = await fetch(window.location.origin, {
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(3000)
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  }, []);

  // Detect slow connection
  const detectSlowConnection = useCallback(async (): Promise<boolean> => {
    const start = Date.now();
    try {
      await testConnection();
      const duration = Date.now() - start;
      return duration > 3000; // Consider > 3s as slow
    } catch {
      return true; // Failed connection is considered slow
    }
  }, [testConnection]);

  // Handle connection changes
  const handleOnline = useCallback(async () => {
    setStatus(prev => ({ ...prev, reconnecting: true }));
    
    const isActuallyOnline = await testConnection();
    const isSlowConnection = await detectSlowConnection();
    
    if (isActuallyOnline) {
      setStatus({
        isOnline: true,
        isSlowConnection,
        reconnecting: false,
        lastConnected: Date.now()
      });
      setReconnectAttempt(0);
      console.log('🟢 Connection restored');
    } else {
      // False positive - still offline
      setStatus(prev => ({ ...prev, reconnecting: false }));
    }
  }, [testConnection, detectSlowConnection]);

  const handleOffline = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      isOnline: false,
      reconnecting: false
    }));
    
    TestTakingErrorHandler.handle(
      { code: TEST_TAKING_ERROR_CODES.CONNECTION_LOST },
      'network-status'
    );
    
    console.log('🔴 Connection lost');
  }, []);

  // Automatic reconnection attempts
  const attemptReconnection = useCallback(async () => {
    if (reconnectAttempt >= maxReconnectAttempts) {
      console.log('🚫 Max reconnection attempts reached');
      return;
    }

    setStatus(prev => ({ ...prev, reconnecting: true }));
    setReconnectAttempt(prev => prev + 1);

    console.log(`🔄 Reconnection attempt ${reconnectAttempt + 1}/${maxReconnectAttempts}`);

    const isOnline = await testConnection();
    if (isOnline) {
      await handleOnline();
    } else {
      setStatus(prev => ({ ...prev, reconnecting: false }));
      
      // Schedule next attempt with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
      setTimeout(attemptReconnection, delay);
    }
  }, [reconnectAttempt, testConnection, handleOnline]);

  // Monitor connection status
  useEffect(() => {
    const handleOnlineEvent = () => handleOnline();
    const handleOfflineEvent = () => handleOffline();

    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);

    // Periodic connection check when offline
    let intervalId: NodeJS.Timeout;
    if (!status.isOnline && !status.reconnecting) {
      intervalId = setInterval(attemptReconnection, 10000);
    }

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
      if (intervalId) clearInterval(intervalId);
    };
  }, [status.isOnline, status.reconnecting, handleOnline, handleOffline, attemptReconnection]);

  // Initial connection test
  useEffect(() => {
    if (navigator.onLine) {
      detectSlowConnection().then(isSlowConnection => {
        setStatus(prev => ({ ...prev, isSlowConnection }));
      });
    }
  }, [detectSlowConnection]);

  return {
    ...status,
    testConnection,
    attemptReconnection: attemptReconnection,
    canRetry: reconnectAttempt < maxReconnectAttempts
  };
};