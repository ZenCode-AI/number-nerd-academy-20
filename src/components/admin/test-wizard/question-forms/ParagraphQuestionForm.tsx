import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { Question } from '@/types/modularTest';

interface ParagraphQuestionFormProps {
  question: Partial<Question>;
  questionNumber: number;
  onUpdate: (updates: Partial<Question>) => void;
}

const ParagraphQuestionForm = ({ question, questionNumber, onUpdate }: ParagraphQuestionFormProps) => {
  // Add correct answer validation
  const correctAnswerError = !question.correctAnswer?.trim() ? "Expected answer is required" : null;

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`answer-${questionNumber}`}>Expected Answer *</Label>
            <Textarea
              id={`answer-${questionNumber}`}
              placeholder="Enter expected answer or key points..."
              value={question.correctAnswer || ''}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
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
