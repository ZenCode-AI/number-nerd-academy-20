
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestDetails } from '@/types/admin';
import HelpTooltip from '@/components/admin/HelpTooltip';

interface TestDetailsFormProps {
  details: TestDetails;
  onUpdate: (field: keyof TestDetails, value: any) => void;
}

const TestDetailsForm = ({ details, onUpdate }: TestDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test Configuration
          <HelpTooltip content="Configure the basic settings for your test including name, subject, difficulty, and access level." />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Test Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Algebra Fundamentals"
              value={details.name}
              onChange={(e) => onUpdate('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Select value={details.subject} onValueChange={(value) => onUpdate('subject', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Math">Math</SelectItem>
                <SelectItem value="English">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="difficulty">Difficulty Level *</Label>
            <Select value={details.difficulty} onValueChange={(value) => onUpdate('difficulty', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
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
              placeholder="45"
              value={details.duration}
              onChange={(e) => onUpdate('duration', parseInt(e.target.value) || 45)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="plan">Access Level *</Label>
          <Select value={details.plan} onValueChange={(value) => onUpdate('plan', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select plan level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Free">Free - Available to all users</SelectItem>
              <SelectItem value="Basic">Basic - Basic plan subscribers</SelectItem>
              <SelectItem value="Standard">Standard - Standard plan subscribers</SelectItem>
              <SelectItem value="Premium">Premium - Premium plan subscribers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what this test covers..."
            value={details.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestDetailsForm;
