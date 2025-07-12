
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Save, LogOut } from 'lucide-react';

interface NavigationWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  title?: string;
  message?: string;
}

const NavigationWarningDialog = ({
  isOpen,
  onClose,
  onConfirmExit,
  title = "Exit Test Warning",
  message = "⚠️ IMPORTANT EXAM WARNING ⚠️\n\nOnce you navigate away from this test, you CANNOT return to it. Your current progress will be lost and you will need to restart the entire test.\n\nThis is similar to real exam conditions where going back to previous sections is not allowed.\n\nWhat would you like to do?"
}: NavigationWarningDialogProps) => {
  
  const handleExitWithoutSaving = () => {
    // Remove all event listeners before exiting
    window.removeEventListener('popstate', () => {});
    window.removeEventListener('beforeunload', () => {});
    
    // Clear all test-related data from localStorage
    localStorage.removeItem('testSession');
    localStorage.removeItem('testAnswers');
    localStorage.removeItem('testResults');
    localStorage.removeItem('reviewData');
    localStorage.removeItem('flaggedQuestions');
    localStorage.removeItem('currentTestData');
    
    // Close the dialog first
    onClose();
    
    // Navigate to dashboard instead of browse page
    setTimeout(() => {
      window.location.href = '/student';
    }, 100);
  };

  const handleSaveAndExit = () => {
    // Close the dialog first
    onClose();
    
    // Call the original exit function which saves progress
    setTimeout(() => {
      onConfirmExit();
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto order-3 sm:order-1"
          >
            Stay in Test
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleSaveAndExit}
            className="w-full sm:w-auto order-2 sm:order-2 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save & Exit
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleExitWithoutSaving}
            className="w-full sm:w-auto order-1 sm:order-3 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Exit (No Save)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationWarningDialog;
