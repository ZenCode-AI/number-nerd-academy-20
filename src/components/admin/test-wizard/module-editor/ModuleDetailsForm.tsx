
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestModule } from '@/types/modularTest';
import { validateModuleName } from '@/utils/testValidation';

interface ModuleDetailsFormProps {
  formData: TestModule;
  existingModules?: TestModule[];
  onUpdate: (updates: Partial<TestModule>) => void;
}

const ModuleDetailsForm = ({ formData, existingModules = [], onUpdate }: ModuleDetailsFormProps) => {
  const [nameValidationError, setNameValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (formData.name) {
      const error = validateModuleName(formData.name, existingModules, formData.id);
      setNameValidationError(error);
    } else {
      setNameValidationError(null);
    }
  }, [formData.name, existingModules, formData.id]);

  const getDefaultScores = (subject: 'Math' | 'English') => {
    if (subject === 'Math') {
      return { mcq: 1, numeric: 2, image: 2, passage: 0 };
    } else {
      return { mcq: 1, passage: 3, numeric: 0, image: 0 };
    }
  };

  const handleSubjectChange = (subject: 'Math' | 'English') => {
    const defaultScores = getDefaultScores(subject);
    onUpdate({ 
      subject,
      questionCounts: { numeric: 0, passage: 0, image: 0, mcq: 0 },
      questionScores: defaultScores
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="moduleName">Module Name *</Label>
          <Input
            id="moduleName"
            placeholder="e.g., English Reading 1, Math Algebra"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={nameValidationError ? 'border-red-500' : ''}
          />
          {nameValidationError && (
            <p className="text-sm text-red-600">{nameValidationError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={handleSubjectChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Math">Math</SelectItem>
                <SelectItem value="English">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => onUpdate({ difficulty: value as any })}
            >
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
        </div>

        {/* Question Scoring Configuration */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Default Points Per Question Type</Label>
          <div className="grid grid-cols-2 gap-3">
            {formData.subject === 'Math' ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="mcqScore" className="text-sm">MCQ Questions</Label>
                  <Input
                    id="mcqScore"
                    type="number"
                    min="1"
                    value={formData.questionScores?.mcq || 1}
                    onChange={(e) => onUpdate({
                      questionScores: {
                        ...formData.questionScores,
                        mcq: parseInt(e.target.value) || 1
                      }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="numericScore" className="text-sm">Numeric Questions</Label>
                  <Input
                    id="numericScore"
                    type="number"
                    min="1"
                    value={formData.questionScores?.numeric || 2}
                    onChange={(e) => onUpdate({
                      questionScores: {
                        ...formData.questionScores,
                        numeric: parseInt(e.target.value) || 2
                      }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="imageScore" className="text-sm">Image Questions</Label>
                  <Input
                    id="imageScore"
                    type="number"
                    min="1"
                    value={formData.questionScores?.image || 2}
                    onChange={(e) => onUpdate({
                      questionScores: {
                        ...formData.questionScores,
                        image: parseInt(e.target.value) || 2
                      }
                    })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <Label htmlFor="mcqScore" className="text-sm">MCQ Questions</Label>
                  <Input
                    id="mcqScore"
                    type="number"
                    min="1"
                    value={formData.questionScores?.mcq || 1}
                    onChange={(e) => onUpdate({
                      questionScores: {
                        ...formData.questionScores,
                        mcq: parseInt(e.target.value) || 1
                      }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="passageScore" className="text-sm">Passage Questions</Label>
                  <Input
                    id="passageScore"
                    type="number"
                    min="1"
                    value={formData.questionScores?.passage || 3}
                    onChange={(e) => onUpdate({
                      questionScores: {
                        ...formData.questionScores,
                        passage: parseInt(e.target.value) || 3
                      }
                    })}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleDetailsForm;
