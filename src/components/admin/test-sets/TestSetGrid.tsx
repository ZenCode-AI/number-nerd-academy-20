
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TestSet } from '@/types/testSet';
import TestSetCard from './TestSetCard';

interface TestSetGridProps {
  testSets: TestSet[];
  onEdit: (testSet: TestSet) => void;
  onDelete: (testSetId: string) => void;
  onCreateClick: () => void;
  searchTerm: string;
}

const TestSetGrid = ({ testSets, onEdit, onDelete, onCreateClick, searchTerm }: TestSetGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {testSets.map((testSet) => (
        <TestSetCard
          key={testSet.id}
          testSet={testSet}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {testSets.length === 0 && (
        <Card className="text-center py-12 col-span-full">
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No test sets found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first test set.'}
            </p>
            {!searchTerm && (
              <Button onClick={onCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                Create Test Set
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestSetGrid;
