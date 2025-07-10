
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, Info, Plus, Trash2 } from 'lucide-react';
import { Question, TestModule } from '@/types/modularTest';
import { validatePointAllocation, getModulePointStatus } from '@/utils/testValidation';
import ImageUploadSection from './image/ImageUploadSection';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ImageQuestionFormProps {
  question: Partial<Question>;
  questionNumber: number;
  module: TestModule;
  onUpdate: (updates: Partial<Question>) => void;
}

const ImageQuestionForm = ({ question, questionNumber, module, onUpdate }: ImageQuestionFormProps) => {
  const [questionType, setQuestionType] = useState<'mcq' | 'text'>(
    question.options && question.options.length > 0 ? 'mcq' : 'text'
  );
  
  const pointStatus = getModulePointStatus(module);
  const imagePointStatus = pointStatus.image;
  const pointValidation = validatePointAllocation('image', question.points || 1, module);

  const correctAnswerError = questionType === 'text' 
    ? (!question.correctAnswer?.trim() ? "Correct answer is required" : null)
    : (!question.correctAnswer?.trim() ? "Please select a correct answer" : null);

  const handlePointsChange = (newPoints: number) => {
    // Allow any valid positive number up to the available points
    const maxAvailable = imagePointStatus.remaining + (question.points || 0);
    if (newPoints > 0 && newPoints <= maxAvailable) {
      onUpdate({ points: newPoints });
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    console.log('Image uploaded successfully:', imageUrl.substring(0, 50) + '...');
    onUpdate({ imageUrl });
  };

  const handleQuestionTypeChange = (type: 'mcq' | 'text') => {
    setQuestionType(type);
    if (type === 'mcq') {
      // Initialize with empty options if switching to MCQ
      const currentOptions = question.options && question.options.length > 0 ? question.options : ['', ''];
      onUpdate({ 
        options: currentOptions,
        correctAnswer: question.correctAnswer || ''
      });
    } else {
      // Clear options for text type
      onUpdate({ 
        options: [],
        correctAnswer: question.correctAnswer || ''
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), ''];
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index) || [];
    onUpdate({ options: newOptions });
    
    // Clear correct answer if it matches the removed option
    if (question.correctAnswer === question.options?.[index]) {
      onUpdate({ correctAnswer: '' });
    }
  };

  const handleCorrectAnswerChange = (value: string) => {
    onUpdate({ correctAnswer: value });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Image Question {questionNumber}
          <div className="flex items-center gap-2 text-sm font-normal">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-blue-600">
              Image Points: {imagePointStatus.remaining} remaining
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageUploadSection 
          questionNumber={questionNumber}
          imageUrl={question.imageUrl}
          onImageUpload={handleImageUpload}
        />

        <div className="space-y-2">
          <Label htmlFor={`question-${questionNumber}`}>Question Text *</Label>
          <Textarea
            id={`question-${questionNumber}`}
            placeholder="Enter your question about the image..."
            value={question.question || ''}
            onChange={(e) => onUpdate({ question: e.target.value })}
            rows={3}
          />
        </div>

        {/* Question Type Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Answer Type *</Label>
          <RadioGroup
            value={questionType}
            onValueChange={(value: 'mcq' | 'text') => handleQuestionTypeChange(value)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mcq" id="mcq" />
              <Label htmlFor="mcq" className="text-sm">Multiple Choice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="text" />
              <Label htmlFor="text" className="text-sm">Text Input</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Conditional Answer Section */}
        {questionType === 'mcq' ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Answer Options *</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addOption}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              
              {(question.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {(question.options?.length || 0) > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="h-10 w-10 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Correct Answer *</Label>
              <RadioGroup
                value={question.correctAnswer}
                onValueChange={handleCorrectAnswerChange}
                className="space-y-2"
              >
                {(question.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option} 
                      id={`correct-${index}`}
                      disabled={!option.trim()}
                    />
                    <Label 
                      htmlFor={`correct-${index}`} 
                      className={`text-sm ${!option.trim() ? 'text-gray-400' : ''}`}
                    >
                      {option.trim() || `Option ${index + 1} (empty)`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {correctAnswerError && (
                <div className="flex items-center gap-2 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {correctAnswerError}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={`answer-${questionNumber}`}>Correct Answer *</Label>
            <Input
              id={`answer-${questionNumber}`}
              placeholder="Enter correct answer"
              value={question.correctAnswer || ''}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
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

        <div className="space-y-2">
          <Label htmlFor={`points-${questionNumber}`}>Points *</Label>
          <Input
            id={`points-${questionNumber}`}
            type="number"
            min="1"
            max={imagePointStatus.remaining + (question.points || 0)}
            value={question.points || 1}
            onChange={(e) => handlePointsChange(parseInt(e.target.value) || 1)}
          />
          {!pointValidation.isValid && (
            <div className="flex items-center gap-2 text-red-600 text-xs">
              <AlertCircle className="h-3 w-3" />
              {pointValidation.error}
            </div>
          )}
          <p className="text-xs text-gray-500">
            Available: {imagePointStatus.remaining + (question.points || 0)} points
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`explanation-${questionNumber}`}>Explanation (Optional)</Label>
          <Textarea
            id={`explanation-${questionNumber}`}
            placeholder="Provide explanation for the correct answer..."
            value={question.explanation || ''}
            onChange={(e) => onUpdate({ explanation: e.target.value })}
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageQuestionForm;
