
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';
import { Question } from '@/types/admin';

interface QuestionPreviewProps {
  question: Question;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const QuestionPreview = ({ 
  question, 
  index, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: QuestionPreviewProps) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Question {index + 1}</Badge>
            <Badge variant={
              question.type === 'MCQ' ? 'default' :
              question.type === 'Numeric' ? 'secondary' :
              question.type === 'Image' ? 'destructive' : 'outline'
            }>
              {question.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {question.points} pt{question.points > 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDuplicate}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">
            {question.question || 'No question text'}
          </p>
          
          {question.imageUrl && (
            <div className="border rounded p-2">
              <img 
                src={question.imageUrl} 
                alt="Question" 
                className="max-w-full h-auto max-h-32 rounded" 
              />
            </div>
          )}
          
          {question.type === 'MCQ' && question.options.length > 0 && (
            <div className="space-y-1">
              {question.options.map((option, optIndex) => (
                <div 
                  key={optIndex} 
                  className={`flex items-center gap-2 text-sm p-2 rounded ${
                    question.correctAnswer === String.fromCharCode(65 + optIndex) 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <span className="font-medium w-6">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <span>{option || 'Empty option'}</span>
                  {question.correctAnswer === String.fromCharCode(65 + optIndex) && (
                    <Badge variant="default" className="text-xs ml-auto">
                      Correct
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {question.type !== 'MCQ' && question.correctAnswer && (
            <div className="bg-green-50 border border-green-200 p-2 rounded">
              <span className="text-sm font-medium">Correct Answer: </span>
              <span className="text-sm">{question.correctAnswer}</span>
            </div>
          )}
          
          {question.explanation && (
            <div className="bg-blue-50 border border-blue-200 p-2 rounded">
              <span className="text-sm font-medium">Explanation: </span>
              <span className="text-sm">{question.explanation}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionPreview;
