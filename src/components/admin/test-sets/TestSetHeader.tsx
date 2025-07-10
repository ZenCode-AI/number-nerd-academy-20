
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface TestSetHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

const TestSetHeader = ({ searchTerm, onSearchChange, onCreateClick }: TestSetHeaderProps) => {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Sets</h1>
          <p className="text-gray-600">Manage multi-module adaptive test experiences</p>
        </div>
        <Button onClick={onCreateClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Test Set
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search test sets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </>
  );
};

export default TestSetHeader;
