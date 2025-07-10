
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface QuestionTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  questionNumber: number;
}

const QuestionTextArea = ({ value, onChange, questionNumber }: QuestionTextAreaProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={`question-${questionNumber}`} className="text-xs font-medium">
        Question Text *
      </Label>
      <Textarea
        id={`question-${questionNumber}`}
        placeholder="Enter your numeric question here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="resize-none text-sm"
      />
    </div>
  );
};

export default QuestionTextArea;
