
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TestDetails } from '@/types/admin';

interface TestDetailsFormSimplifiedProps {
  testDetails: TestDetails;
  onUpdate: (updates: Partial<TestDetails>) => void;
}

const TestDetailsFormSimplified = ({ testDetails, onUpdate }: TestDetailsFormSimplifiedProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="testName">Test Name *</Label>
            <Input
              id="testName"
              placeholder="e.g., Algebra Practice Test"
              value={testDetails.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Select value={testDetails.subject} onValueChange={(value) => onUpdate({ subject: value as 'Math' | 'English' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Math">Math</SelectItem>
                <SelectItem value="English">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="difficulty">Difficulty *</Label>
            <Select value={testDetails.difficulty} onValueChange={(value) => onUpdate({ difficulty: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="180"
              value={testDetails.duration}
              onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 60 })}
            />
          </div>
          <div>
            <Label htmlFor="plan">Plan Level *</Label>
            <Select value={testDetails.plan} onValueChange={(value) => onUpdate({ plan: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what this test covers..."
            value={testDetails.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestDetailsFormSimplified;
