
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Send } from 'lucide-react';

interface SubmitTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLastModule?: boolean;
  currentModule?: number;
  totalModules?: number;
}

const SubmitTestModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLastModule = true,
  currentModule = 1,
  totalModules = 1,
}: SubmitTestModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {isLastModule ? 'Submit Test' : 'Complete Module'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isLastModule ? (
              <>
                Are you sure you want to submit your test? Once submitted, you cannot make any changes to your answers.
                <br />
                <br />
                <strong>Module {currentModule} of {totalModules} - Final Module</strong>
              </>
            ) : (
              <>
                Are you sure you want to complete this module? You will proceed to the next module after a short break.
                <br />
                <br />
                <strong>Module {currentModule} of {totalModules}</strong>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
            {isLastModule ? 'Submit Test' : 'Complete Module'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubmitTestModal;
