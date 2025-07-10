
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flag, Send } from 'lucide-react';

interface QuestionNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isFlagged: boolean;
  currentQuestion: number;
  totalQuestions: number;
  isLastModule?: boolean;
}

const QuestionNavigation = ({
  onPrevious,
  onNext,
  onFlag,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  isFlagged,
  currentQuestion,
  totalQuestions,
  isLastModule = false,
}: QuestionNavigationProps) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Previous button */}
          <Button
            onClick={onPrevious}
            disabled={isFirstQuestion}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 min-w-[80px] h-8 text-xs font-medium disabled:opacity-50"
          >
            <ChevronLeft className="h-3 w-3" />
            Previous
          </Button>

          {/* Center controls */}
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-gray-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
              {currentQuestion + 1} of {totalQuestions}
            </div>
            <Button
              onClick={onFlag}
              variant={isFlagged ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 h-8 text-xs font-medium ${
                isFlagged 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-orange-300 text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Flag className="h-3 w-3" />
              {isFlagged ? 'Unflag' : 'Flag'}
            </Button>
          </div>

          {/* Next/Submit button */}
          {isLastQuestion ? (
            <Button
              onClick={onSubmit}
              size="sm"
              className={`flex items-center gap-2 min-w-[100px] h-8 text-xs font-medium ${
                isLastModule 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Send className="h-3 w-3" />
              {isLastModule ? 'Submit Test' : 'Complete Module'}
            </Button>
          ) : (
            <Button
              onClick={onNext}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 min-w-[80px] h-8 text-xs font-medium border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
