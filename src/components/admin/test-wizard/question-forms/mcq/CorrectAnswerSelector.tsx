
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle } from 'lucide-react';

interface CorrectAnswerSelectorProps {
  options: string[];
  correctAnswer: string;
  onSelectCorrectAnswer: (value: string) => void;
  questionNumber: number;
  validationError?: string;
}

const CorrectAnswerSelector = ({ 
  options, 
  correctAnswer, 
  onSelectCorrectAnswer, 
  questionNumber, 
  validationError 
}: CorrectAnswerSelectorProps) => {
  const nonEmptyOptions = options.filter(opt => opt.trim().length > 0);

  if (nonEmptyOptions.length < 2) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Correct Answer *</Label>
        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          Add at least 2 options to select correct answer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Correct Answer *</Label>
      <RadioGroup
        value={correctAnswer || ''}
        onValueChange={onSelectCorrectAnswer}
        className="grid grid-cols-1 gap-2"
      >
        {options.map((option, index) => {
          if (!option.trim()) return null;
          return (
            <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
              <RadioGroupItem value={(index + 1).toString()} id={`correct-${questionNumber}-${index}`} />
              <Label htmlFor={`correct-${questionNumber}-${index}`} className="text-xs flex-1 cursor-pointer">
                {String.fromCharCode(65 + index)}. {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {validationError && (
        <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {validationError}
        </div>
      )}
    </div>
  );
};

export default CorrectAnswerSelector;
