
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { EnglishPassage } from '@/types/admin';

interface PassageEditorProps {
  passage?: EnglishPassage;
  onUpdate: (passage: EnglishPassage) => void;
  isRequired: boolean;
}

const PassageEditor = ({ passage, onUpdate, isRequired }: PassageEditorProps) => {
  const [localPassage, setLocalPassage] = useState<EnglishPassage>(
    passage || {
      id: Date.now().toString(),
      title: '',
      content: '',
    }
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedPassage = {
          ...localPassage,
          imageUrl: e.target?.result as string
        };
        setLocalPassage(updatedPassage);
        onUpdate(updatedPassage);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePassage = (field: keyof EnglishPassage, value: string) => {
    const updatedPassage = {
      ...localPassage,
      [field]: value
    };
    setLocalPassage(updatedPassage);
    onUpdate(updatedPassage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Reading Passage {isRequired && <span className="text-red-500">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="passageTitle">Passage Title *</Label>
          <Input
            id="passageTitle"
            placeholder="Enter passage title..."
            value={localPassage.title}
            onChange={(e) => updatePassage('title', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="passageContent">Passage Content *</Label>
          <Textarea
            id="passageContent"
            placeholder="Enter the reading passage here..."
            value={localPassage.content}
            onChange={(e) => updatePassage('content', e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <div>
          <Label>Passage Image (Optional)</Label>
          <div className="mt-1 space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="passage-image"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('passage-image')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            {localPassage.imageUrl && (
              <div className="border rounded-lg p-2">
                <img 
                  src={localPassage.imageUrl} 
                  alt="Passage" 
                  className="max-w-full h-auto max-h-48" 
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassageEditor;
