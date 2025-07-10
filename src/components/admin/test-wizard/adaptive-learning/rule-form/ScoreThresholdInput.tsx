
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScoreThresholdInputProps {
  value: number;
  onChange: (value: number) => void;
  operator: 'greater_than' | 'less_than';
}

const ScoreThresholdInput = ({ value, onChange, operator }: ScoreThresholdInputProps) => {
  const getHelpText = () => {
    if (operator === 'greater_than') {
      return 'Students scoring above this percentage will be redirected';
    }
    return 'Students scoring below this percentage will be redirected';
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="scoreThreshold">
        Score Threshold (%)
        <span className="ml-1 font-mono text-blue-600">
          {operator === 'greater_than' ? '>' : '<'} {value}%
        </span>
      </Label>
      <Input
        id="scoreThreshold"
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 70)}
      />
      <p className="text-xs text-gray-500">{getHelpText()}</p>
    </div>
  );
};

export default ScoreThresholdInput;
