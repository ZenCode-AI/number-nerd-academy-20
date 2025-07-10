
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Question, TestModule } from '@/types/modularTest';
import { getModulePointStatus } from '@/utils/testValidation';
import QuestionTextArea from './numeric/QuestionTextArea';
import AnswerInput from './numeric/AnswerInput';
import PointsInput from './numeric/PointsInput';
import ExplanationArea from './numeric/ExplanationArea';

interface NumericQuestionFormProps {
  question: Partial<Question>;
  questionNumber: number;
  module: TestModule;
  onUpdate: (updates: Partial<Question>) => void;
}

const NumericQuestionForm = ({ question, questionNumber, module, onUpdate }: NumericQuestionFormProps) => {
  const pointStatus = getModulePointStatus(module);
  const numericPointStatus = pointStatus.numeric;
  
  const correctAnswerError = !question.correctAnswer?.trim() ? "Correct answer is required" : null;
  const maxAllowedPoints = numericPointStatus.remaining + (question.points || 0);

  return (
    <Card className="border-l-4 border-l-green-500 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Numeric Question {questionNumber}
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            <Info className="h-3 w-3" />
            {numericPointStatus.remaining} points available
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <QuestionTextArea
          value={question.question || ''}
          onChange={(value) => onUpdate({ question: value })}
          questionNumber={questionNumber}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnswerInput
            value={question.correctAnswer || ''}
            onChange={(value) => onUpdate({ correctAnswer: value })}
            questionNumber={questionNumber}
            error={correctAnswerError}
          />

          <PointsInput
            value={question.points || 1}
            onChange={(points) => onUpdate({ points })}
            questionNumber={questionNumber}
            maxAllowed={maxAllowedPoints}
          />
        </div>

        <ExplanationArea
          value={question.explanation || ''}
          onChange={(value) => onUpdate({ explanation: value })}
          questionNumber={questionNumber}
        />
      </CardContent>
    </Card>
  );
};

export default NumericQuestionForm;
