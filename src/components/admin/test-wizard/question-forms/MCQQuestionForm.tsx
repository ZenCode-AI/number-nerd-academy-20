
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Info } from 'lucide-react';
import { Question, TestModule } from '@/types/modularTest';
import { validateMCQOptions, validateMCQDuplicates, getModulePointStatus } from '@/utils/testValidation';
import OptionsManager from './mcq/OptionsManager';
import CorrectAnswerSelector from './mcq/CorrectAnswerSelector';

interface MCQQuestionFormProps {
  question: Partial<Question>;
  questionNumber: number;
  module: TestModule;
  onUpdate: (updates: Partial<Question>) => void;
}

const MCQQuestionForm = ({ question, questionNumber, module, onUpdate }: MCQQuestionFormProps) => {
  const options = question.options || ['', '', '', ''];
  const basicValidationError = validateMCQOptions(options);
  const duplicateValidationError = validateMCQDuplicates(options);
  const pointStatus = getModulePointStatus(module);
  const mcqPointStatus = pointStatus.mcq;
  
  const correctAnswerError = !question.correctAnswer ? "Please select the correct answer" : null;

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
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
    
    if (question.correctAnswer === (index + 1).toString()) {
      onUpdate({ correctAnswer: '' });
    }
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseInt(value) || 1;
    const maxAllowed = mcqPointStatus.remaining + (question.points || 0);
    
    if (numericValue <= maxAllowed && numericValue >= 1) {
      onUpdate({ points: numericValue });
    }
  };

  const validationError = basicValidationError || duplicateValidationError;
  const showPointError = (question.points || 1) > (mcqPointStatus.remaining + (question.points || 0));

  return (
    <Card className="border-l-4 border-l-blue-500 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            MCQ Question {questionNumber}
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            <Info className="h-3 w-3" />
            {mcqPointStatus.remaining} points available
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Text */}
        <div className="space-y-2">
          <Label htmlFor={`question-${questionNumber}`} className="text-sm font-medium">
            Question Text *
          </Label>
          <Textarea
            id={`question-${questionNumber}`}
            placeholder="Enter your multiple choice question here..."
            value={question.question || ''}
            onChange={(e) => onUpdate({ question: e.target.value })}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Options Section */}
        <OptionsManager 
          options={options}
          onUpdateOption={updateOption}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          validationError={validationError}
        />

        {/* Correct Answer Selection */}
        <CorrectAnswerSelector 
          options={options}
          correctAnswer={question.correctAnswer || ''}
          onSelectCorrectAnswer={(value) => onUpdate({ correctAnswer: value })}
          questionNumber={questionNumber}
          validationError={correctAnswerError}
        />

        {/* Points and Explanation Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`points-${questionNumber}`} className="text-sm font-medium">
              Points *
            </Label>
            <Input
              id={`points-${questionNumber}`}
              type="number"
              min="1"
              max={mcqPointStatus.remaining + (question.points || 0)}
              value={question.points || 1}
              onChange={handlePointsChange}
              className={`h-8 ${showPointError ? 'border-red-500' : ''}`}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
            />
            {showPointError && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="h-3 w-3" />
                Exceeds available points
              </div>
            )}
            <p className="text-xs text-gray-500">
              Max: {mcqPointStatus.remaining + (question.points || 0)} points
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`explanation-${questionNumber}`} className="text-sm font-medium">
              Explanation (Optional)
            </Label>
            <Textarea
              id={`explanation-${questionNumber}`}
              placeholder="Explain the correct answer..."
              value={question.explanation || ''}
              onChange={(e) => onUpdate({ explanation: e.target.value })}
              rows={2}
              className="resize-none text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MCQQuestionForm;
