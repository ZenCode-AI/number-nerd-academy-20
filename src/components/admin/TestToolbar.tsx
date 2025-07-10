
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Save, Copy } from 'lucide-react';
import TestCreationGuide from '@/components/admin/TestCreationGuide';

interface TestToolbarProps {
  currentTestId: string | null;
  testName: string;
  onPreview: () => void;
  onSave: () => void;
  onCopy: () => void;
}

const TestToolbar = ({ currentTestId, testName, onPreview, onSave, onCopy }: TestToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <TestCreationGuide />
      <Button onClick={onPreview} variant="outline" size="sm" className="gap-2">
        <Eye className="h-4 w-4" />
        Preview Test
      </Button>
      <Button onClick={onSave} className="gap-2">
        <Save className="h-4 w-4" />
        {currentTestId ? 'Update Test' : 'Save Test'}
      </Button>
      <Button 
        onClick={onCopy} 
        variant="outline" 
        size="sm" 
        className="gap-2"
        disabled={!currentTestId && !testName.trim()}
      >
        <Copy className="h-4 w-4" />
        Copy Test
      </Button>
    </div>
  );
};

export default TestToolbar;
