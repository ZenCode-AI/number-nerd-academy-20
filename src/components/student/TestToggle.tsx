
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface TestToggleProps {
  showPurchased: boolean;
  onToggle: (value: boolean) => void;
}

export const TestToggle = ({ showPurchased, onToggle }: TestToggleProps) => {
  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm font-medium ${!showPurchased ? 'text-blue-600' : 'text-gray-500'}`}>
        Available Tests
      </span>
      <Switch
        checked={showPurchased}
        onCheckedChange={onToggle}
      />
      <span className={`text-sm font-medium ${showPurchased ? 'text-blue-600' : 'text-gray-500'}`}>
        Purchased Tests
      </span>
    </div>
  );
};
