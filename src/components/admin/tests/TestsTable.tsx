
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Clock, Users, Eye, Layers } from 'lucide-react';
import TestActions from '@/components/admin/TestActions';

interface LocalTest {
  id: number;
  name: string;
  subject: 'Math' | 'English';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  questions: number;
  duration: number;
  status: 'Active' | 'Draft';
  createdAt: string;
  attempts: number;
  avgScore: number;
  isModular?: boolean;
  moduleCount?: number;
}

interface TestsTableProps {
  tests: LocalTest[];
  onEdit: (testId: number) => void;
  onView: (testId: number) => void;
  onDelete: (testId: number) => void;
  onToggleStatus: (testId: number) => void;
  onRefresh?: () => void;
}

const TestsTable = ({ tests, onEdit, onView, onDelete, onToggleStatus, onRefresh }: TestsTableProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'bg-gray-100 text-gray-800';
      case 'Basic': return 'bg-blue-100 text-blue-800';
      case 'Standard': return 'bg-purple-100 text-purple-800';
      case 'Premium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 lg:p-6 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
          <FileText className="h-5 w-5" />
          Tests ({tests.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card View */}
        <div className="block lg:hidden">
          <div className="space-y-3 p-4">
            {tests.map((test) => (
              <div key={test.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{test.name}</h3>
                      {test.isModular && (
                        <Badge variant="secondary" className="text-xs">
                          <Layers className="h-3 w-3 mr-1" />
                          Modular
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{test.subject}</Badge>
                      <Badge className={`text-xs ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </Badge>
                      {test.isModular && test.moduleCount && (
                        <Badge variant="outline" className="text-xs">
                          {test.moduleCount} modules
                        </Badge>
                      )}
                    </div>
                  </div>
                  <TestActions
                    testId={test.id.toString()}
                    testName={test.name}
                    status={test.status}
                    test={test as any}
                    onEdit={() => onEdit(test.id)}
                    onView={() => onView(test.id)}
                    onDelete={() => onDelete(test.id)}
                    onToggleStatus={() => onToggleStatus(test.id)}
                    onRefresh={onRefresh}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={`text-xs ${getPlanColor(test.plan)}`}>
                    {test.plan}
                  </Badge>
                  <Badge variant={test.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                    {test.status}
                  </Badge>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>{test.questions} questions</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {test.duration}m
                    </div>
                  </div>
                  {test.attempts > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {test.attempts} ({test.avgScore}%)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-3">Test Name</TableHead>
                  <TableHead className="px-4 py-3">Subject</TableHead>
                  <TableHead className="px-4 py-3">Difficulty</TableHead>
                  <TableHead className="px-4 py-3">Plan</TableHead>
                  <TableHead className="px-4 py-3">Questions</TableHead>
                  <TableHead className="px-4 py-3">Duration</TableHead>
                  <TableHead className="px-4 py-3">Status</TableHead>
                  <TableHead className="px-4 py-3">Performance</TableHead>
                  <TableHead className="px-4 py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium px-4 py-3">
                      <div className="flex items-center gap-2">
                        {test.name}
                        {test.isModular && (
                          <Badge variant="secondary" className="text-xs">
                            <Layers className="h-3 w-3 mr-1" />
                            Modular
                          </Badge>
                        )}
                      </div>
                      {test.isModular && test.moduleCount && (
                        <div className="text-xs text-gray-500 mt-1">
                          {test.moduleCount} modules
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{test.subject}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge className={`text-xs ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge className={`text-xs ${getPlanColor(test.plan)}`}>
                        {test.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">{test.questions}</TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {test.duration}m
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant={test.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Users className="h-3 w-3" />
                          {test.attempts} attempts
                        </div>
                        {test.attempts > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <Eye className="h-3 w-3" />
                            {test.avgScore}% avg
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <TestActions
                        testId={test.id.toString()}
                        testName={test.name}
                        status={test.status}
                        test={test as any}
                        onEdit={() => onEdit(test.id)}
                        onView={() => onView(test.id)}
                        onDelete={() => onDelete(test.id)}
                        onToggleStatus={() => onToggleStatus(test.id)}
                        onRefresh={onRefresh}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {tests.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No tests found matching your filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestsTable;
