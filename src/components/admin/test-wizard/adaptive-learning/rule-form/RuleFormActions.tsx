
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface RuleFormActionsProps {
  onAddRule: () => void;
  disabled: boolean;
}

const RuleFormActions = ({ onAddRule, disabled }: RuleFormActionsProps) => {
  return (
    <Button
      onClick={onAddRule}
      disabled={disabled}
      className="w-full flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Add Adaptive Rule
    </Button>
  );
};

export default RuleFormActions;
