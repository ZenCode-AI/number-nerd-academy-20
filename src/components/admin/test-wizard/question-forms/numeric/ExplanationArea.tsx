
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ExplanationAreaProps {
  value: string;
  onChange: (value: string) => void;
  questionNumber: number;
}

const ExplanationArea = ({ value, onChange, questionNumber }: ExplanationAreaProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={`explanation-${questionNumber}`} className="text-xs font-medium">
        Explanation (Optional)
      </Label>
      <Textarea
        id={`explanation-${questionNumber}`}
        placeholder="Provide explanation for the correct answer..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="resize-none text-xs"
      />
    </div>
  );
};

export default ExplanationArea;
