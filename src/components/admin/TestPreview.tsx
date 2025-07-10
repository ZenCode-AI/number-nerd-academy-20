
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestDetails, Question, EnglishPassage } from '@/types/admin';

interface TestPreviewProps {
  testDetails: TestDetails;
  questions: Question[];
  passage?: EnglishPassage;
  fullScreenPreview: boolean;
  onToggleFullScreen: () => void;
  onExitPreview: () => void;
}

const TestPreview = ({ 
  testDetails, 
  questions, 
  passage, 
  fullScreenPreview, 
  onToggleFullScreen, 
  onExitPreview 
}: TestPreviewProps) => {
  if (fullScreenPreview && testDetails.subject === 'Math') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-lg sm:text-xl font-bold">{testDetails.name}</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={onToggleFullScreen}
              className="flex-1 sm:flex-none"
            >
              Exit Full Screen
            </Button>
            <Button onClick={onExitPreview} variant="outline" className="flex-1 sm:flex-none">
              Back to Edit
            </Button>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {questions.map((question, index) => (
            <div key={question.id} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl sm:text-2xl font-bold">Question {index + 1}</span>
                <Badge variant="outline">{question.points} pt{question.points > 1 ? 's' : ''}</Badge>
              </div>
              <p className="text-base sm:text-lg mb-4">{question.question}</p>
              
              {question.imageUrl && (
                <img src={question.imageUrl} alt="Question" className="mb-4 max-w-full h-auto" />
              )}
              
              {question.type === 'MCQ' && (
                <div className="space-y-3">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="text-base sm:text-lg">{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (testDetails.subject === 'English') {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Test Preview - English</h1>
          <Button onClick={onExitPreview} variant="outline">
            Back to Edit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-auto lg:h-[80vh]">
          <Card className="overflow-auto">
            <CardHeader>
              <CardTitle>{passage?.title || 'Reading Passage'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {passage?.imageUrl && (
                <img src={passage.imageUrl} alt="Passage" className="w-full h-auto rounded" />
              )}
              <div className="prose max-w-none">
                {passage?.content?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-auto">
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {questions.map((question, index) => (
                <div key={question.id} className="mb-6 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold">Question {index + 1}</span>
                    <Badge variant="outline">{question.points} pt{question.points > 1 ? 's' : ''}</Badge>
                  </div>
                  <p className="mb-3">{question.question}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2 p-2 border rounded">
                        <span className="w-6">{String.fromCharCode(65 + optIndex)}.</span>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Test Preview</h1>
          <p className="text-gray-600">{testDetails.name}</p>
        </div>
        <Button onClick={onExitPreview} variant="outline">
          Back to Edit
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{testDetails.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge>{testDetails.subject}</Badge>
            <Badge variant="outline">{testDetails.difficulty}</Badge>
            <Badge variant="secondary">{testDetails.duration} min</Badge>
          </div>
          <p className="text-gray-600">{testDetails.description}</p>
        </CardHeader>
        <CardContent>
          {questions.map((question, index) => (
            <div key={question.id} className="mb-6 p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold">Question {index + 1}</span>
                <Badge variant="outline" className="text-xs">{question.points} pt{question.points > 1 ? 's' : ''}</Badge>
              </div>
              <p className="mb-3">{question.question}</p>
              
              {question.imageUrl && (
                <img src={question.imageUrl} alt="Question" className="mb-3 max-w-full h-auto max-h-48 border rounded" />
              )}
              
              {question.type === 'MCQ' && (
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="w-6">{String.fromCharCode(65 + optIndex)}.</span>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPreview;
