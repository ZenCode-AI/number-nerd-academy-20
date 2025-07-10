
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestModule, Question } from '@/types/modularTest';
import MCQQuestionForm from '../question-forms/MCQQuestionForm';
import NumericQuestionForm from '../question-forms/NumericQuestionForm';
import ImageQuestionForm from '../question-forms/ImageQuestionForm';
import PassageBasedQuestionForm from '../question-forms/PassageBasedQuestionForm';
import PassageManager from '../PassageManager';
import { Plus } from 'lucide-react';

interface QuestionTypeRendererProps {
  module: TestModule;
  activeQuestionType: 'mcq' | 'numeric' | 'image' | 'passage';
  onUpdateModule: (updates: Partial<TestModule>) => void;
}

const QuestionTypeRenderer = ({ module, activeQuestionType, onUpdateModule }: QuestionTypeRendererProps) => {
  const getQuestionsByType = (type: Question['type']) => {
    return module.questions.filter(q => q.type === type);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    const updatedQuestions = module.questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    onUpdateModule({ questions: updatedQuestions });
  };

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `${module.id}-${type}-${Date.now()}`,
      type,
      question: '',
      options: type === 'MCQ' || type === 'Paragraph' ? ['', ''] : [],
      correctAnswer: '',
      explanation: '',
      points: 1,
      imageUrl: type === 'Image' ? '' : undefined
    };

    const updatedQuestions = [...module.questions, newQuestion];
    onUpdateModule({ questions: updatedQuestions });
  };

  const updatePassage = (passage: { title: string; content: string }) => {
    onUpdateModule({ 
      passage: {
        id: module.passage?.id || Date.now().toString(),
        title: passage.title,
        content: passage.content
      }
    });
  };

  const getAvailableQuestionTypes = () => {
    const types = [];
    if (module.questionCounts.mcq > 0) types.push({ key: 'mcq', label: 'MCQ', count: module.questionCounts.mcq, type: 'MCQ' as Question['type'] });
    if (module.questionCounts.numeric > 0) types.push({ key: 'numeric', label: 'Numeric', count: module.questionCounts.numeric, type: 'Numeric' as Question['type'] });
    if (module.questionCounts.image > 0) types.push({ key: 'image', label: 'Image', count: module.questionCounts.image, type: 'Image' as Question['type'] });
    if (module.questionCounts.passage > 0) types.push({ key: 'passage', label: 'Passage', count: module.questionCounts.passage, type: 'Paragraph' as Question['type'] });
    return types;
  };

  const availableTypes = getAvailableQuestionTypes();
  const activeTypeConfig = availableTypes.find(t => t.key === activeQuestionType);
  
  if (!activeTypeConfig) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No questions of this type configured for this module</p>
      </div>
    );
  }

  const questionsOfType = getQuestionsByType(activeTypeConfig.type);
  const requiredCount = activeTypeConfig.count;
  
  const forms = [];
  
  // For passage questions, show passage manager first
  if (activeQuestionType === 'passage') {
    forms.push(
      <PassageManager
        key="passage-manager"
        passage={module.passage || { title: '', content: '' }}
        onUpdate={updatePassage}
      />
    );
  }
  
  // Render existing questions
  questionsOfType.forEach((question, index) => {
    const commonProps = {
      question,
      questionNumber: index + 1,
      module,
      onUpdate: (updates: Partial<Question>) => updateQuestion(question.id, updates)
    };

    switch (activeTypeConfig.type) {
      case 'MCQ':
        forms.push(<MCQQuestionForm key={question.id} {...commonProps} />);
        break;
      case 'Numeric':
        forms.push(<NumericQuestionForm key={question.id} {...commonProps} />);
        break;
      case 'Image':
        forms.push(<ImageQuestionForm key={question.id} {...commonProps} />);
        break;
      case 'Paragraph':
        forms.push(
          <PassageBasedQuestionForm 
            key={question.id} 
            {...commonProps}
            passage={module.passage?.content || ''} 
          />
        );
        break;
    }
  });

  // Add empty forms for remaining questions
  const remainingCount = requiredCount - questionsOfType.length;
  for (let i = 0; i < remainingCount; i++) {
    const questionNumber = questionsOfType.length + i + 1;
    forms.push(
      <Card key={`empty-${i}`} className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6 text-center">
          <div className="text-gray-400 mb-3">
            <Plus className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-gray-600 mb-3 font-medium">
            {activeTypeConfig.label} Question {questionNumber}
          </p>
          <Button 
            onClick={() => addQuestion(activeTypeConfig.type)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add {activeTypeConfig.label} Question
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <div className="space-y-4">{forms}</div>;
};

export default QuestionTypeRenderer;
