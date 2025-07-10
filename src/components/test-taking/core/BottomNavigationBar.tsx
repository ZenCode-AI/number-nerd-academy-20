
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flag, Send } from 'lucide-react';

interface BottomNavigationBarProps {
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isFlagged: boolean;
  currentQuestion: number;
  totalQuestions: number;
}

const BottomNavigationBar = ({
  onPrevious,
  onNext,
  onFlag,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  isFlagged,
  currentQuestion,
  totalQuestions,
}: BottomNavigationBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-6">
        {/* Previous button */}
        <Button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          variant="outline"
          className="flex items-center gap-2 min-w-[120px]"
          size="lg"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {/* Question counter and flag */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium px-4 py-2 bg-gray-100 rounded-full">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <Button
            onClick={onFlag}
            variant={isFlagged ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
          >
            <Flag className="h-4 w-4" />
            {isFlagged ? 'Unflag' : 'Flag'}
          </Button>
        </div>

        {/* Next/Submit button */}
        {isLastQuestion ? (
          <Button
            onClick={onSubmit}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 min-w-[150px]"
            size="lg"
          >
            <Send className="h-4 w-4" />
            Submit Module
          </Button>
        ) : (
          <Button
            onClick={onNext}
            variant="outline"
            className="flex items-center gap-2 min-w-[120px]"
            size="lg"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default BottomNavigationBar;
