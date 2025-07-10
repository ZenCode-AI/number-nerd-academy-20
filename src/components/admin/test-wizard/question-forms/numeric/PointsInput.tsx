
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface PointsInputProps {
  value: number;
  onChange: (points: number) => void;
  questionNumber: number;
  maxAllowed: number;
}

const PointsInput = ({ value, onChange, questionNumber, maxAllowed }: PointsInputProps) => {
  const [hasPointsError, setHasPointsError] = useState(false);

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue) || 1;
    
    if (numericValue > maxAllowed) {
      setHasPointsError(true);
    } else {
      setHasPointsError(false);
      if (numericValue >= 1) {
        onChange(numericValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={`points-${questionNumber}`} className="text-xs font-medium">
        Points *
      </Label>
      <Input
        id={`points-${questionNumber}`}
        type="number"
        inputMode="numeric"
        min="1"
        max={maxAllowed}
        value={value}
        onChange={handlePointsChange}
        onKeyDown={handleKeyDown}
        className={`h-8 text-sm ${hasPointsError ? 'border-red-500' : ''}`}
      />
      {hasPointsError && (
        <div className="flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle className="h-3 w-3" />
          Exceeds available points
        </div>
      )}
      <p className="text-xs text-gray-500">
        Max: {maxAllowed} points
      </p>
    </div>
  );
};

export default PointsInput;
