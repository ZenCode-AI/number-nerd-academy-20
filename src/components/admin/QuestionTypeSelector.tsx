
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calculator, BookOpen, Image, Type, Hash, FileText } from 'lucide-react';
import { Question } from '@/types/admin';

interface QuestionTypeSelectorProps {
  subject: 'Math' | 'English';
  onAddQuestion: (type: Question['type']) => void;
}

const QuestionTypeSelector = ({ subject, onAddQuestion }: QuestionTypeSelectorProps) => {
  const getQuestionTypes = (): Question['type'][] => {
    if (subject === 'Math') {
      return ['MCQ', 'Numeric', 'Image'];
    } else {
      return ['MCQ', 'Paragraph'];
    }
  };

  const getTypeIcon = (type: Question['type']) => {
    switch (type) {
      case 'MCQ':
        return Type;
      case 'Numeric':
        return Hash;
      case 'Image':
        return Image;
      case 'Paragraph':
        return FileText;
      default:
        return Type;
    }
  };

  const getTypeDescription = (type: Question['type']) => {
    switch (type) {
      case 'MCQ':
        return 'Multiple Choice';
      case 'Numeric':
        return 'Numeric Answer';
      case 'Image':
        return 'Image-based';
      case 'Paragraph':
        return 'Text Response';
      default:
        return type;
    }
  };

  const questionTypes = getQuestionTypes();

  return (
    <div className="flex flex-wrap gap-2">
      {questionTypes.map((type) => {
        const IconComponent = getTypeIcon(type);
        return (
          <Button
            key={type}
            onClick={() => onAddQuestion(type)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-3 w-3" />
            <IconComponent className="h-3 w-3" />
            {getTypeDescription(type)}
          </Button>
        );
      })}
    </div>
  );
};

export default QuestionTypeSelector;
