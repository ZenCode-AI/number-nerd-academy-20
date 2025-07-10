
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TestSet } from '@/types/testSet';

interface TestSetDetailsCardProps {
  testSet: Partial<TestSet>;
  onUpdate: (updates: Partial<TestSet>) => void;
}

const TestSetDetailsCard = ({ testSet, onUpdate }: TestSetDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Set Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Test Set Name</Label>
            <Input
              id="name"
              value={testSet.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="e.g., Digital SAT Practice Set 1"
            />
          </div>
          <div>
            <Label htmlFor="plan">Plan Level</Label>
            <Select value={testSet.plan} onValueChange={(value) => onUpdate({ plan: value as any })}>
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
            value={testSet.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe this test set..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestSetDetailsCard;
