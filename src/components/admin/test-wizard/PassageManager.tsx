
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface PassageManagerProps {
  passage: {
    title: string;
    content: string;
  };
  onUpdate: (passage: { title: string; content: string }) => void;
}

const PassageManager = ({ passage, onUpdate }: PassageManagerProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Reading Passage</CardTitle>
        <p className="text-sm text-gray-600">
          Add the passage that students will read before answering questions
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="passage-title">Passage Title *</Label>
          <Input
            id="passage-title"
            placeholder="Enter passage title..."
            value={passage.title}
            onChange={(e) => onUpdate({ ...passage, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passage-content">Passage Content *</Label>
          <Textarea
            id="passage-content"
            placeholder="Enter the reading passage here..."
            value={passage.content}
            onChange={(e) => onUpdate({ ...passage, content: e.target.value })}
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PassageManager;
