
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { ModularTest } from '@/types/modularTest';

interface LoadExistingTestCardProps {
  savedTests: ModularTest[];
  onLoadTest: (testId: string) => void;
}

const LoadExistingTestCard = ({ savedTests, onLoadTest }: LoadExistingTestCardProps) => {
  if (savedTests.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Load Existing Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {savedTests.slice(0, 6).map((test) => (
            <div 
              key={test.id} 
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" 
              onClick={() => onLoadTest(test.id)}
            >
              <h4 className="font-medium text-sm truncate">{test.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{test.modules[0]?.subject || 'Mixed'}</Badge>
                <Badge variant="secondary" className="text-xs">{test.modules.reduce((total, module) => total + module.questions.length, 0)}Q</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadExistingTestCard;
