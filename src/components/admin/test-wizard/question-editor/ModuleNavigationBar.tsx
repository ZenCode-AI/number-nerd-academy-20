
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ModuleNavigationBarProps {
  currentModuleIndex: number;
  totalModules: number;
  onModuleChange: (index: number) => void;
}

const ModuleNavigationBar = ({ currentModuleIndex, totalModules, onModuleChange }: ModuleNavigationBarProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModuleChange(Math.max(0, currentModuleIndex - 1))}
        disabled={currentModuleIndex === 0}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Module</span>
        <span className="font-medium">{currentModuleIndex + 1} of {totalModules}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onModuleChange(Math.min(totalModules - 1, currentModuleIndex + 1))}
        disabled={currentModuleIndex === totalModules - 1}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default ModuleNavigationBar;
