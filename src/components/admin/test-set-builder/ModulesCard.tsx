import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TestSetModule } from '@/types/testSet';
import { modularTestStorage } from '@/services/modularTestStorage';
import TestSelector from '@/components/admin/TestSelector';
import { Plus, Trash2, BookOpen, Calculator, ArrowRight, Search } from 'lucide-react';

interface ModulesCardProps {
  modules: TestSetModule[];
  onAddModule: (module: TestSetModule) => void;
  onRemoveModule: (moduleId: string) => void;
}

const ModulesCard = ({ modules, onAddModule, onRemoveModule }: ModulesCardProps) => {
  const [newModule, setNewModule] = useState<Partial<TestSetModule>>({
    moduleNumber: 1,
    name: '',
    subject: 'Math',
    difficulty: 'Medium',
    testId: '',
    duration: 45,
    breakAfter: true,
    breakDuration: 5
  });

  const [showTestSelector, setShowTestSelector] = useState(false);

  const getTestDetails = async (testId: string) => {
    const test = await modularTestStorage.getById(testId);
    return test ? {
      name: test.name,
      subject: test.modules[0]?.subject || 'Math',
      duration: test.totalDuration,
      questionsCount: test.modules.reduce((total, module) => total + module.questions.length, 0)
    } : null;
  };

  const handleTestSelection = async (testId: string) => {
    const testDetails = await getTestDetails(testId);
    if (testDetails) {
      setNewModule(prev => ({
        ...prev,
        testId,
        name: testDetails.name,
        subject: testDetails.subject,
        duration: testDetails.duration
      }));
      setShowTestSelector(false);
    }
  };

  const addModule = async () => {
    if (!newModule.name || !newModule.testId) return;

    const testDetails = await getTestDetails(newModule.testId);
    if (!testDetails) {
      alert('Selected test not found. Please select a valid test.');
      return;
    }

    const module: TestSetModule = {
      id: `module_${Date.now()}`,
      moduleNumber: modules.length + 1,
      name: newModule.name!,
      subject: newModule.subject!,
      difficulty: newModule.difficulty!,
      testId: newModule.testId!,
      duration: newModule.duration!,
      breakAfter: newModule.breakAfter,
      breakDuration: newModule.breakDuration || 5
    };

    onAddModule(module);

    setNewModule({
      moduleNumber: modules.length + 2,
      name: '',
      subject: 'Math',
      difficulty: 'Medium',
      testId: '',
      duration: 45,
      breakAfter: true,
      breakDuration: 5
    });
  };

  const getSubjectIcon = (subject: 'Math' | 'English') => {
    return subject === 'Math' ? Calculator : BookOpen;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Modules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Modules */}
        {modules.length > 0 && (
          <div className="space-y-4">
            {modules.map((module, index) => {
              const SubjectIcon = getSubjectIcon(module.subject);
              const [testDetails, setTestDetails] = React.useState<any>(null);
              
              React.useEffect(() => {
                getTestDetails(module.testId).then(setTestDetails);
              }, [module.testId]);
              
              return (
                <div key={module.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Module {module.moduleNumber}</Badge>
                    <SubjectIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{module.name}</div>
                    <div className="text-sm text-gray-600">
                      {module.subject} • {module.difficulty} • {module.duration}min
                      {testDetails && ` • ${testDetails.questionsCount} questions`}
                      {module.breakAfter && ` • ${module.breakDuration}min break`}
                    </div>
                  </div>
                  {index < modules.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveModule(module.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add New Module */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold">Add New Module</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-1">
              <Label>Select Test</Label>
              <div className="flex gap-2">
                <Input
                  value={newModule.name || ''}
                  placeholder="No test selected"
                  readOnly
                  className="flex-1"
                />
                <Dialog open={showTestSelector} onOpenChange={setShowTestSelector}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Select Test for Module</DialogTitle>
                    </DialogHeader>
                    <TestSelector
                      selectedTestId={newModule.testId}
                      onSelectTest={handleTestSelection}
                      subjectFilter={newModule.subject}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <Label>Subject</Label>
              <Select value={newModule.subject} onValueChange={(value) => setNewModule(prev => ({ ...prev, subject: value as any, testId: '' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Math">Math</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={newModule.difficulty} onValueChange={(value) => setNewModule(prev => ({ ...prev, difficulty: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Adaptive">Adaptive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={newModule.duration || 45}
                onChange={(e) => setNewModule(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newModule.breakAfter || false}
                onCheckedChange={(checked) => setNewModule(prev => ({ ...prev, breakAfter: checked }))}
              />
              <Label>Break after module</Label>
            </div>
          </div>
          <Button onClick={addModule} className="w-full" disabled={!newModule.testId}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModulesCard;
