
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, BookOpen, Calculator, Check, Clock, Target, FileText } from 'lucide-react';
import { modularTestStorage } from '@/services/modularTestStorage';
import { ModularTest } from '@/types/modularTest';

interface TestSelectorProps {
  selectedTestId?: string;
  onSelectTest: (testId: string) => void;
  subjectFilter?: 'Math' | 'English';
}

const TestSelector = ({ selectedTestId, onSelectTest, subjectFilter }: TestSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tests, setTests] = useState<ModularTest[]>([]);

  React.useEffect(() => {
    const loadTests = async () => {
      const allTests = await modularTestStorage.getAll();
      setTests(allTests);
    };
    loadTests();
  }, []);

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (test.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const testSubject = test.modules[0]?.subject;
    const matchesSubject = !subjectFilter || testSubject === subjectFilter;
    return matchesSearch && matchesSubject && test.status === 'Active';
  });

  const getSubjectIcon = (subject: 'Math' | 'English') => {
    return subject === 'Math' ? Calculator : BookOpen;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Search Tests</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredTests.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            {tests.length === 0 ? (
              <div className="space-y-3">
                <FileText className="h-12 w-12 mx-auto text-gray-300" />
                <p>No tests created yet.</p>
                <p className="text-sm">Create individual tests first, then use them in test sets.</p>
              </div>
            ) : (
              <p>No tests match your search criteria.</p>
            )}
          </div>
        ) : (
          filteredTests.map((test) => {
            const testSubject = test.modules[0]?.subject || 'Math';
            const SubjectIcon = getSubjectIcon(testSubject);
            const isSelected = selectedTestId === test.id;
            
            return (
              <Card 
                key={test.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onSelectTest(test.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <SubjectIcon className="h-4 w-4" />
                      <CardTitle className="text-sm truncate">{test.name}</CardTitle>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-600 line-clamp-2">{test.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      <SubjectIcon className="h-3 w-3 mr-1" />
                      {testSubject}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      {test.modules[0]?.difficulty || 'Medium'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {test.totalDuration}min
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">{test.modules.reduce((total, module) => total + module.questions.length, 0)}</span> questions
                    </div>
                    <div>
                      <span className="font-medium">{test.totalScore}</span> points
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {filteredTests.length > 0 && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} available
          {subjectFilter && ` for ${subjectFilter}`}
        </div>
      )}
    </div>
  );
};

export default TestSelector;
