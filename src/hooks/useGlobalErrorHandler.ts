// Global error handling hook
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorReporter, handleGlobalError } from '@/utils/errorHandling';
import { AuthErrorHandler } from '@/utils/authErrorHandler';
import { toast } from '@/hooks/use-toast';

export const useGlobalErrorHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleGlobalError(event.reason, 'UNHANDLED_PROMISE');
      event.preventDefault(); // Prevent browser default error handling
    };
    
    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      handleGlobalError(event.error, 'GLOBAL_ERROR');
    };
    
    // Handle chunk loading errors (code splitting)
    const handleChunkError = () => {
      toast({
        title: "Update Available",
        description: "The application has been updated. Refreshing...",
        variant: "default",
      });
      
      // Reload the page to get the new chunks
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Listen for chunk loading errors
    window.addEventListener('error', (event) => {
      if (event.filename?.includes('chunk') || event.message?.includes('Loading chunk')) {
        handleChunkError();
      }
    });
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  // Function to handle auth errors with redirect
  const handleAuthError = (error: any) => {
    const authError = AuthErrorHandler.handle(error);
    
    if (AuthErrorHandler.shouldRedirect(authError)) {
      toast({
        title: "Authentication Required",
        description: authError.message,
        variant: "destructive",
      });
      
      // Redirect to sign in page
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    }
    
    return authError;
  };
  
  // Function to check if user should be redirected on permission errors
  const handlePermissionError = (error: any) => {
    if (error.message?.includes('permission') || error.message?.includes('unauthorized')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this resource.",
        variant: "destructive",
      });
      
      // Redirect to home page
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
      return true;
    }
    
    return false;
  };
  
  return {
    handleAuthError,
    handlePermissionError,
    reportError: ErrorReporter.report,
    getRecentErrors: ErrorReporter.getRecentErrors,
  };
};