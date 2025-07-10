
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OperatorSelectorProps {
  value: 'greater_than' | 'less_than';
  onChange: (value: 'greater_than' | 'less_than') => void;
}

const OperatorSelector = ({ value, onChange }: OperatorSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="operator">Condition Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium mb-1">Choose condition:</p>
                <p className="text-xs mb-1"><strong>&gt;</strong> High performers advance to harder content</p>
                <p className="text-xs"><strong>&lt;</strong> Struggling students get additional help</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select condition type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="greater_than">
            <div className="flex items-center gap-2">
              <span className="font-mono text-green-600">&gt;</span>
              <span>Score above threshold (advance high performers)</span>
            </div>
          </SelectItem>
          <SelectItem value="less_than">
            <div className="flex items-center gap-2">
              <span className="font-mono text-red-600">&lt;</span>
              <span>Score below threshold (help struggling students)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OperatorSelector;
