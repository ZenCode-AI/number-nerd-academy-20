
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, X, BookOpen } from 'lucide-react';
import { EnglishPassage } from '@/types/admin';

interface ReadingPassageQuestionProps {
  passage?: EnglishPassage;
  onUpdate: (passage: EnglishPassage | undefined) => void;
  isRequired?: boolean;
}

const ReadingPassageQuestion = ({ 
  passage, 
  onUpdate, 
  isRequired = false 
}: ReadingPassageQuestionProps) => {
  const handleCreate = () => {
    const newPassage: EnglishPassage = {
      id: `passage_${Date.now()}`,
      title: '',
      content: '',
    };
    onUpdate(newPassage);
  };

  const handleUpdate = (field: keyof EnglishPassage, value: string) => {
    if (!passage) return;
    onUpdate({
      ...passage,
      [field]: value
    });
  };

  const handleRemove = () => {
    onUpdate(undefined);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && passage) {
      // In a real app, you'd upload to a server
      const imageUrl = URL.createObjectURL(file);
      handleUpdate('imageUrl', imageUrl);
    }
  };

  if (!passage) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="pt-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isRequired ? 'Reading Passage Required' : 'Add Reading Passage'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isRequired 
              ? 'English tests require a reading passage for comprehension questions.'
              : 'Add a reading passage for comprehension-based questions.'
            }
          </p>
          <Button onClick={handleCreate}>
            <BookOpen className="h-4 w-4 mr-2" />
            Create Reading Passage
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Reading Passage
            </CardTitle>
            <Badge variant="secondary">Required for English</Badge>
          </div>
          {!isRequired && (
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Passage Title *</Label>
          <Input
            placeholder="Enter passage title..."
            value={passage.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Passage Content *</Label>
          <Textarea
            placeholder="Enter the reading passage content here..."
            value={passage.content}
            onChange={(e) => handleUpdate('content', e.target.value)}
            className="mt-1 min-h-[200px]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Passage Image (Optional)</Label>
          <div className="mt-1 space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id={`passage-image-${passage.id}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById(`passage-image-${passage.id}`)?.click()}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            {passage.imageUrl && (
              <div className="border rounded-lg p-2">
                <img src={passage.imageUrl} alt="Passage" className="max-w-full h-auto max-h-48" />
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>This reading passage will be available to students throughout all questions in this test.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingPassageQuestion;
