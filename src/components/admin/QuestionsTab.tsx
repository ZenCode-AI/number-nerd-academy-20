
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question, EnglishPassage } from '@/types/admin';
import QuestionEditor from '@/components/admin/QuestionEditor';
import QuestionTypeSelector from '@/components/admin/QuestionTypeSelector';
import ReadingPassageQuestion from '@/components/admin/ReadingPassageQuestion';
import HelpTooltip from '@/components/admin/HelpTooltip';

interface QuestionsTabProps {
  questions: Question[];
  passage?: EnglishPassage;
  subject: 'Math' | 'English';
  onAddQuestion: (type: Question['type']) => void;
  onUpdateQuestion: (id: string, field: keyof Question, value: any) => void;
  onRemoveQuestion: (id: string) => void;
  onImageUpload: (questionId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdatePassage: (passage: EnglishPassage | undefined) => void;
}

const QuestionsTab = ({ 
  questions,
  passage,
  subject,
  onAddQuestion, 
  onUpdateQuestion, 
  onRemoveQuestion, 
  onImageUpload,
  onUpdatePassage
}: QuestionsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Reading Passage Section for English Tests */}
      {subject === 'English' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Reading Passage</h3>
            <HelpTooltip content="English tests require a reading passage for comprehension questions. This passage will be available to students throughout the test." />
          </div>
          <ReadingPassageQuestion
            passage={passage}
            onUpdate={onUpdatePassage}
            isRequired={true}
          />
        </div>
      )}

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Test Questions</CardTitle>
              <HelpTooltip content="Add and configure questions for your test. Question types depend on the subject selected." />
            </div>
            <QuestionTypeSelector
              subject={subject}
              onAddQuestion={onAddQuestion}
            />
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No questions added yet. Start by adding your first question.</p>
              <QuestionTypeSelector
                subject={subject}
                onAddQuestion={onAddQuestion}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(field: keyof Question, value: any) => onUpdateQuestion(question.id, field, value)}
                  onRemove={() => onRemoveQuestion(question.id)}
                  onImageUpload={(event: React.ChangeEvent<HTMLInputElement>) => onImageUpload(question.id, event)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionsTab;
