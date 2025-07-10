
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Upload } from 'lucide-react';
import { Question } from '@/types/admin';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (field: keyof Question, value: any) => void;
  onRemove: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const QuestionEditor = ({ question, index, onUpdate, onRemove, onImageUpload }: QuestionEditorProps) => {
  const getTypeColor = (type: Question['type']) => {
    switch (type) {
      case 'MCQ': return 'bg-blue-100 text-blue-800';
      case 'Numeric': return 'bg-green-100 text-green-800';
      case 'Image': return 'bg-purple-100 text-purple-800';
      case 'Paragraph': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">Question {index + 1}</Badge>
            <Badge className={`text-xs ${getTypeColor(question.type)}`}>
              {question.type}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        <div>
          <Label className="text-sm font-medium">Question Text *</Label>
          <Textarea
            placeholder="Enter your question here..."
            value={question.question}
            onChange={(e) => onUpdate('question', e.target.value)}
            className="mt-1 min-h-[80px]"
          />
        </div>

        {question.type === 'Image' && (
          <div>
            <Label className="text-sm font-medium">Question Image</Label>
            <div className="mt-1 space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                id={`image-${question.id}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`image-${question.id}`)?.click()}
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              {question.imageUrl && (
                <div className="border rounded-lg p-2">
                  <img src={question.imageUrl} alt="Question" className="max-w-full h-auto max-h-48" />
                </div>
              )}
            </div>
          </div>
        )}

        {question.type === 'MCQ' && (
          <div>
            <Label className="text-sm font-medium">Answer Options *</Label>
            <div className="space-y-2 mt-2">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <span className="w-6 text-sm font-medium flex-shrink-0">{String.fromCharCode(65 + optIndex)}.</span>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[optIndex] = e.target.value;
                      onUpdate('options', newOptions);
                    }}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="text-sm font-medium">Correct Answer *</Label>
            {question.type === 'MCQ' ? (
              <Select 
                value={question.correctAnswer} 
                onValueChange={(value) => onUpdate('correctAnswer', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select correct option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder="Enter correct answer"
                value={question.correctAnswer}
                onChange={(e) => onUpdate('correctAnswer', e.target.value)}
                className="mt-1"
              />
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Points</Label>
            <Input
              type="number"
              min="1"
              value={question.points}
              onChange={(e) => onUpdate('points', parseInt(e.target.value) || 1)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Explanation (Optional)</Label>
          <Textarea
            placeholder="Provide explanation for the correct answer..."
            value={question.explanation}
            onChange={(e) => onUpdate('explanation', e.target.value)}
            className="mt-1 min-h-[60px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;
