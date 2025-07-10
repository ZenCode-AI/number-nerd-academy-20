
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Question, EnglishPassage } from '@/types/admin';
import QuestionEditor from './QuestionEditor';
import QuestionTypeSelector from './QuestionTypeSelector';
import ReadingPassageQuestion from './ReadingPassageQuestion';

interface QuestionsTabEnhancedProps {
  questions: Question[];
  passage?: EnglishPassage;
  allowedQuestionTypes: Question['type'][];
  testSubject: 'Math' | 'English';
  onAddQuestion: (type: Question['type']) => void;
  onUpdateQuestion: (id: string, field: keyof Question, value: any) => void;
  onRemoveQuestion: (id: string) => void;
  onImageUpload: (questionId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdatePassage: (passage: EnglishPassage | undefined) => void;
}

const QuestionsTabEnhanced = ({
  questions,
  passage,
  allowedQuestionTypes,
  testSubject,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onImageUpload,
  onUpdatePassage
}: QuestionsTabEnhancedProps) => {
  return (
    <div className="space-y-6">
      {/* Reading Passage Section */}
      {testSubject === 'English' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Reading Passage</h3>
          <ReadingPassageQuestion
            passage={passage}
            onUpdate={onUpdatePassage}
            isRequired={testSubject === 'English'}
          />
        </div>
      )}

      {/* Questions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Questions</h3>
          <QuestionTypeSelector
            subject={testSubject}
            onAddQuestion={onAddQuestion}
          />
        </div>

        {questions.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">No questions added yet. Start by adding your first question.</p>
              <QuestionTypeSelector
                subject={testSubject}
                onAddQuestion={onAddQuestion}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-base">Question {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuestionEditor
                    question={question}
                    index={index}
                    onUpdate={(field: keyof Question, value: any) => onUpdateQuestion(question.id, field, value)}
                    onRemove={() => onRemoveQuestion(question.id)}
                    onImageUpload={(event: React.ChangeEvent<HTMLInputElement>) => onImageUpload(question.id, event)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsTabEnhanced;
