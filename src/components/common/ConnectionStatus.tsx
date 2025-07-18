// Network connection status indicator
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';

export const ConnectionStatus = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  
  if (isOnline && !isSlowConnection) {
    return null; // Don't show anything when connection is good
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {!isOnline && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            No internet connection. Changes will be saved locally and synced when connection is restored.
          </AlertDescription>
        </Alert>
      )}
      
      {isOnline && isSlowConnection && (
        <Alert>
          <Wifi className="h-4 w-4" />
          <AlertDescription>
            Slow connection detected. Some features may be delayed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};