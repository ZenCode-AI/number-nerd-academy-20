
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Plus, X } from 'lucide-react';
import { Question } from '@/types/modularTest';

interface ParagraphQuestionFormProps {
  question: Partial<Question>;
  questionNumber: number;
  onUpdate: (updates: Partial<Question>) => void;
}

const ParagraphQuestionForm = ({ question, questionNumber, onUpdate }: ParagraphQuestionFormProps) => {
  // Add correct answer validation
  const correctAnswerError = !question.correctAnswer?.trim() ? "Expected answer is required" : null;
  
  // State for whether this paragraph question uses options
  const hasOptions = question.options && question.options.length > 0;

  const handleToggleOptions = (enabled: boolean) => {
    if (enabled) {
      onUpdate({ 
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: '0' // Default to first option
      });
    } else {
      onUpdate({ 
        options: undefined,
        correctAnswer: '' 
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (question.options) {
      const newOptions = [...question.options];
      newOptions[index] = value;
      onUpdate({ options: newOptions });
    }
  };

  const handleAddOption = () => {
    if (question.options) {
      const newOptions = [...question.options, `Option ${question.options.length + 1}`];
      onUpdate({ options: newOptions });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, i) => i !== index);
      onUpdate({ options: newOptions });
      
      // Reset correct answer if it was pointing to removed option
      const correctIndex = parseInt(question.correctAnswer || '0');
      if (correctIndex === index) {
        onUpdate({ correctAnswer: '0' });
      } else if (correctIndex > index) {
        onUpdate({ correctAnswer: String(correctIndex - 1) });
      }
    }
  };

  const handleCorrectAnswerChange = (value: string) => {
    if (hasOptions) {
      // For options-based, store the index
      onUpdate({ correctAnswer: value });
    } else {
      // For free-text, store the text
      onUpdate({ correctAnswer: value });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Paragraph Question {questionNumber}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${questionNumber}`}>Question Text *</Label>
          <Textarea
            id={`question-${questionNumber}`}
            placeholder="Enter your reading comprehension question..."
            value={question.question || ''}
            onChange={(e) => onUpdate({ question: e.target.value })}
            rows={3}
          />
        </div>

        {/* Toggle for Options vs Free Text */}
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <Switch
            id={`options-toggle-${questionNumber}`}
            checked={hasOptions}
            onCheckedChange={handleToggleOptions}
          />
          <Label htmlFor={`options-toggle-${questionNumber}`} className="text-sm">
            Use multiple choice options instead of free text
          </Label>
        </div>

        {/* Options Section */}
        {hasOptions ? (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Answer Options</Label>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {question.options && question.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>

            {/* Correct Answer Selection for Options */}
            <div className="space-y-2">
              <Label>Correct Answer *</Label>
              <select
                value={question.correctAnswer || '0'}
                onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {question.options?.map((option, index) => (
                  <option key={index} value={index.toString()}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* Free Text Answer Section */
          <div className="space-y-2">
            <Label htmlFor={`answer-${questionNumber}`}>Expected Answer *</Label>
            <Textarea
              id={`answer-${questionNumber}`}
              placeholder="Enter expected answer or key points..."
              value={question.correctAnswer || ''}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              rows={3}
              className={correctAnswerError ? 'border-red-500' : ''}
            />
            {correctAnswerError && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="h-3 w-3" />
                {correctAnswerError}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`points-${questionNumber}`}>Points</Label>
            <Input
              id={`points-${questionNumber}`}
              type="number"
              min="1"
              value={question.points || 1}
              onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`explanation-${questionNumber}`}>Explanation (Optional)</Label>
          <Textarea
            id={`explanation-${questionNumber}`}
            placeholder="Provide explanation or rubric for grading..."
            value={question.explanation || ''}
            onChange={(e) => onUpdate({ explanation: e.target.value })}
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ParagraphQuestionForm;
