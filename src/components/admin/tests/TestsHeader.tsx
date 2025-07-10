
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

const TestsHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">Test Management</h1>
        <p className="text-sm lg:text-base text-gray-600 mt-1">Manage and organize your tests</p>
      </div>
      <div className="flex-shrink-0">
        <Button asChild className="w-full sm:w-auto">
          <a href="/admin/create-test">
            <Plus className="h-4 w-4 mr-2" />
            Create Test
          </a>
        </Button>
      </div>
    </div>
  );
};

export default TestsHeader;
