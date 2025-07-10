
import { useEffect } from 'react';

interface UseTestKeyboardNavigationProps {
  currentQuestion: number;
  currentModuleData: any;
  handlePrevious: () => void;
  handleNext: () => void;
  handleFlag: () => void;
}

export const useTestKeyboardNavigation = ({
  currentQuestion,
  currentModuleData,
  handlePrevious,
  handleNext,
  handleFlag
}: UseTestKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          handleFlag();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, currentModuleData, handlePrevious, handleNext, handleFlag]);
};
