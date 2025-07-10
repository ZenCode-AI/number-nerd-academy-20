
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, Plus, AlertCircle, Info } from 'lucide-react';
import { Question, TestModule } from '@/types/modularTest';
import { getModulePointStatus } from '@/utils/testValidation';

interface PassageBasedQuestionFormProps {
  question: Partial<Question>;
  questionNumber: number;
  passage: string;
  module: TestModule;
  onUpdate: (updates: Partial<Question>) => void;
}

const PassageBasedQuestionForm = ({ question, questionNumber, passage, module, onUpdate }: PassageBasedQuestionFormProps) => {
  // Initialize with at least 2 options as required
  const options = question.options && question.options.length >= 2 ? question.options : ['', ''];
  const [hasPointsError, setHasPointsError] = useState(false);
  
  const pointStatus = getModulePointStatus(module);
  const passagePointStatus = pointStatus.passage;

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...options, ''];
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Enforce minimum 2 options
    const newOptions = options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
    
    if (question.correctAnswer === (index + 1).toString()) {
      onUpdate({ correctAnswer: '' });
    }
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseInt(value) || 1;
    const maxAllowed = passagePointStatus.remaining + (question.points || 0);
    
    // Only show error if user enters invalid value
    if (numericValue > maxAllowed) {
      setHasPointsError(true);
    } else {
      setHasPointsError(false);
      if (numericValue >= 1) {
        onUpdate({ points: numericValue });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Fix numpad input issues
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    if (e.currentTarget.type === 'number') {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const nonEmptyOptions = options.filter(opt => opt.trim().length > 0);
  const hasMinimumOptions = nonEmptyOptions.length >= 2;

  return (
    <Card className="border-l-4 border-l-orange-500 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Passage Question {questionNumber}
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            <Info className="h-3 w-3" />
            {passagePointStatus.remaining} points available
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Passage Display - Compact */}
        {passage && (
          <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-l-blue-400">
            <Label className="text-xs font-medium text-blue-800 uppercase tracking-wide">
              Reading Passage
            </Label>
            <div className="mt-1 text-xs text-gray-700 whitespace-pre-wrap max-h-24 overflow-y-auto">
              {passage}
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="space-y-1">
          <Label htmlFor={`question-${questionNumber}`} className="text-xs font-medium">
            Question Text *
          </Label>
          <Textarea
            id={`question-${questionNumber}`}
            placeholder="Enter your question based on the passage above..."
            value={question.question || ''}
            onChange={(e) => onUpdate({ question: e.target.value })}
            rows={2}
            className="resize-none text-sm"
          />
        </div>

        {/* Options Section with Minimum Requirement */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Answer Options * (minimum 2 required)</Label>
            <div className="flex items-center gap-2">
              {options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Option
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="min-w-[20px] text-xs font-medium text-gray-500 flex-shrink-0">
                  {String.fromCharCode(65 + index)}.
                </span>
                <Input
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 h-7 text-xs"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {!hasMinimumOptions && (
            <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-2 rounded">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              Please add at least 2 answer options for passage-based questions
            </div>
          )}
        </div>

        {/* Correct Answer Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Correct Answer *</Label>
          {!hasMinimumOptions ? (
            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Add at least 2 options to select correct answer
            </p>
          ) : (
            <RadioGroup
              value={question.correctAnswer || ''}
              onValueChange={(value) => onUpdate({ correctAnswer: value })}
              className="grid grid-cols-1 gap-1"
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
          )}
        </div>

        {/* Points and Explanation Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`points-${questionNumber}`} className="text-xs font-medium">
              Points *
            </Label>
            <Input
              id={`points-${questionNumber}`}
              type="number"
              inputMode="numeric"
              min="1"
              max={passagePointStatus.remaining + (question.points || 0)}
              value={question.points || 1}
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
              Max: {passagePointStatus.remaining + (question.points || 0)} points
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor={`explanation-${questionNumber}`} className="text-xs font-medium">
              Explanation (Optional)
            </Label>
            <Textarea
              id={`explanation-${questionNumber}`}
              placeholder="Explain the correct answer..."
              value={question.explanation || ''}
              onChange={(e) => onUpdate({ explanation: e.target.value })}
              rows={2}
              className="resize-none text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassageBasedQuestionForm;
