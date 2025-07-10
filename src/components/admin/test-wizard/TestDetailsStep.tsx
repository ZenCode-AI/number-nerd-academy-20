
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ModularTest } from '@/types/modularTest';
import { validateTestName, calculateTotalTestScore } from '@/utils/testValidation';

interface TestDetailsStepProps {
  testData: Partial<ModularTest>;
  onUpdate: (updates: Partial<ModularTest>) => void;
}

const TestDetailsStep = ({ testData, onUpdate }: TestDetailsStepProps) => {
  const [nameValidationError, setNameValidationError] = useState<string | null>(null);
  const [isValidatingName, setIsValidatingName] = useState(false);

  useEffect(() => {
    const validateName = async (name: string) => {
      if (!name.trim()) {
        setNameValidationError(null);
        return;
      }

      setIsValidatingName(true);
      try {
        const error = await validateTestName(name, testData.id);
        setNameValidationError(error);
      } catch (err) {
        console.error('Error validating test name:', err);
        setNameValidationError(null);
      } finally {
        setIsValidatingName(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (testData.name) {
        validateName(testData.name);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [testData.name, testData.id]);

  const calculatedScore = testData.modules ? calculateTotalTestScore(testData.modules) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Test Details</h2>
        <p className="text-gray-600 mt-2">Enter the basic information for your test</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testName">Test Name *</Label>
            <Input
              id="testName"
              placeholder="Enter test name (e.g., SAT Math Practice Test)"
              value={testData.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className={nameValidationError ? 'border-red-500' : ''}
            />
            {isValidatingName && (
              <p className="text-sm text-gray-500">Checking name availability...</p>
            )}
            {nameValidationError && (
              <p className="text-sm text-red-600">{nameValidationError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="testDescription">Description (Optional)</Label>
            <Textarea
              id="testDescription"
              placeholder="Brief description of the test..."
              value={testData.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalDuration">Total Duration (minutes)</Label>
              <Input
                id="totalDuration"
                type="number"
                min="1"
                value={testData.totalDuration || 60}
                onChange={(e) => onUpdate({ totalDuration: parseInt(e.target.value) || 60 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
              <Input
                id="breakDuration"
                type="number"
                min="1"
                max="15"
                value={Math.round((testData.breakDuration || 300) / 60)}
                onChange={(e) => onUpdate({ breakDuration: (parseInt(e.target.value) || 5) * 60 })}
              />
              <p className="text-xs text-gray-500">
                Time between modules (1-15 minutes)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan Level</Label>
              <Select
                value={testData.plan || 'Basic'}
                onValueChange={(value) => onUpdate({ plan: value as any })}
              >
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalScore">Total Score</Label>
              <Input
                id="totalScore"
                type="number"
                min="1"
                value={testData.totalScore || calculatedScore || 0}
                onChange={(e) => onUpdate({ totalScore: parseInt(e.target.value) || 0 })}
              />
              {calculatedScore > 0 && (
                <p className="text-xs text-gray-500">
                  Calculated from modules: {calculatedScore} points
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAdaptive"
                  checked={testData.isAdaptive || false}
                  onCheckedChange={(checked) => onUpdate({ isAdaptive: checked })}
                />
                <Label htmlFor="isAdaptive">Enable Adaptive Learning</Label>
              </div>
              <p className="text-xs text-gray-500">
                Allow dynamic module progression based on student performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
        <p className="text-blue-700 text-sm">
          After entering the test details, you'll add modules to organize your questions by subject and difficulty level.
          {testData.isAdaptive && " You'll also configure adaptive learning rules to customize the student experience."}
        </p>
      </div>
    </div>
  );
};

export default TestDetailsStep;
