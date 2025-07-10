
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle } from 'lucide-react';

interface OptionsManagerProps {
  options: string[];
  onUpdateOption: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  validationError?: string;
}

const OptionsManager = ({ 
  options, 
  onUpdateOption, 
  onAddOption, 
  onRemoveOption, 
  validationError 
}: OptionsManagerProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Answer Options *</Label>
        {options.length < 6 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddOption}
            className="h-7 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Option
          </Button>
        )}
      </div>
      
      <div className="grid gap-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="min-w-[20px] text-xs font-medium text-gray-500 flex-shrink-0">
              {String.fromCharCode(65 + index)}.
            </span>
            <Input
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              value={option}
              onChange={(e) => onUpdateOption(index, e.target.value)}
              className="flex-1 h-8 text-sm"
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveOption(index)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {validationError && (
        <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {validationError}
        </div>
      )}
    </div>
  );
};

export default OptionsManager;
