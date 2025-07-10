
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  questionNumber: number;
  error?: string;
}

const AnswerInput = ({ value, onChange, questionNumber, error }: AnswerInputProps) => {
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={`answer-${questionNumber}`} className="text-xs font-medium">
        Correct Answer *
      </Label>
      <Input
        id={`answer-${questionNumber}`}
        type="text"
        inputMode="decimal"
        placeholder="Enter numeric answer"
        value={value}
        onChange={handleAnswerChange}
        className={`h-8 text-sm ${error ? 'border-red-500' : ''}`}
      />
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Accepts whole numbers, decimals, and negative values
      </p>
    </div>
  );
};

export default AnswerInput;
