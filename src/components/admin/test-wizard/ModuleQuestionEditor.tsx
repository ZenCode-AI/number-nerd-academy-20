
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TestModule, Question } from '@/types/modularTest';
import ModuleNavigationBar from './question-editor/ModuleNavigationBar';
import QuestionTypeRenderer from './question-editor/QuestionTypeRenderer';
import PointAllocationDashboard from './PointAllocationDashboard';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ModuleQuestionEditorProps {
  modules: TestModule[];
  currentModuleIndex: number;
  onUpdateModule: (moduleIndex: number, updates: Partial<TestModule>) => void;
  onModuleChange: (index: number) => void;
}

const ModuleQuestionEditor = ({ 
  modules, 
  currentModuleIndex, 
  onUpdateModule, 
  onModuleChange 
}: ModuleQuestionEditorProps) => {
  const [activeQuestionType, setActiveQuestionType] = useState<'mcq' | 'numeric' | 'image' | 'passage'>('mcq');
  
  const currentModule = modules[currentModuleIndex];
  
  if (!currentModule) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No modules available</p>
      </div>
    );
  }

  const getTotalQuestions = (module: TestModule) => {
    return module.questionCounts.numeric + 
           module.questionCounts.passage + 
           module.questionCounts.image + 
           module.questionCounts.mcq;
  };

  const getCompletedQuestions = (module: TestModule) => {
    return module.questions.length;
  };

  const getQuestionsByType = (type: Question['type']) => {
    return currentModule.questions.filter(q => q.type === type);
  };

  const getAvailableQuestionTypes = () => {
    const types = [];
    if (currentModule.questionCounts.mcq > 0) types.push({ key: 'mcq', label: 'MCQ', count: currentModule.questionCounts.mcq, type: 'MCQ' as Question['type'] });
    if (currentModule.questionCounts.numeric > 0) types.push({ key: 'numeric', label: 'Numeric', count: currentModule.questionCounts.numeric, type: 'Numeric' as Question['type'] });
    if (currentModule.questionCounts.image > 0) types.push({ key: 'image', label: 'Image', count: currentModule.questionCounts.image, type: 'Image' as Question['type'] });
    if (currentModule.questionCounts.passage > 0) types.push({ key: 'passage', label: 'Passage', count: currentModule.questionCounts.passage, type: 'Paragraph' as Question['type'] });
    return types;
  };

  const availableTypes = getAvailableQuestionTypes();

  React.useEffect(() => {
    if (availableTypes.length > 0 && !availableTypes.find(t => t.key === activeQuestionType)) {
      setActiveQuestionType(availableTypes[0].key as any);
    }
  }, [currentModuleIndex]);

  const getModuleStatus = (module: TestModule) => {
    const total = getTotalQuestions(module);
    const completed = getCompletedQuestions(module);
    
    if (total === 0) return { status: 'Not Configured', color: 'text-gray-500', icon: AlertTriangle };
    if (completed === 0) return { status: 'Pending', color: 'text-orange-500', icon: Clock };
    if (completed < total) return { status: 'In Progress', color: 'text-blue-500', icon: Clock };
    return { status: 'Complete', color: 'text-green-500', icon: CheckCircle };
  };

  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <div className="text-center py-2">
        <h2 className="text-lg font-semibold text-gray-900">Create Questions</h2>
        <p className="text-gray-600 text-xs mt-1">Add questions to each module based on your configuration</p>
      </div>

      {/* Module Navigation */}
      <ModuleNavigationBar
        currentModuleIndex={currentModuleIndex}
        totalModules={modules.length}
        onModuleChange={onModuleChange}
      />

      {/* Main Content Grid - Optimized Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        {/* Left Column - Question Editor */}
        <div className="xl:col-span-3 space-y-3">
          {/* Module Info Card - Horizontal Layout */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{currentModule.name}</h3>
                  <p className="text-xs text-gray-600">{currentModule.subject} • {currentModule.difficulty}</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {getCompletedQuestions(currentModule)}/{getTotalQuestions(currentModule)}
                  </div>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
                <div>
                  <Progress 
                    value={getTotalQuestions(currentModule) > 0 ? (getCompletedQuestions(currentModule) / getTotalQuestions(currentModule)) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Type Tabs - Improved Compact Design */}
          {availableTypes.length > 0 && (
            <div className="bg-white border rounded-lg p-2">
              <div className="flex flex-wrap gap-1">
                {availableTypes.map(({ key, label, count, type }) => {
                  const completed = getQuestionsByType(type).length;
                  const isActive = activeQuestionType === key;
                  const isComplete = completed === count;
                  return (
                    <Button
                      key={key}
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveQuestionType(key as any)}
                      className={`flex items-center gap-2 h-8 px-3 text-xs transition-all ${
                        isActive ? 'shadow-sm' : 'hover:bg-gray-50'
                      } ${isComplete && !isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}`}
                    >
                      <span className="font-medium">{label}</span>
                      <Badge 
                        variant={isComplete ? 'default' : 'outline'}
                        className={`text-xs h-4 px-1 ${
                          isComplete ? 'bg-green-500' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {completed}/{count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question Forms */}
          <QuestionTypeRenderer
            module={currentModule}
            activeQuestionType={activeQuestionType}
            onUpdateModule={(updates) => onUpdateModule(currentModuleIndex, updates)}
          />
        </div>

        {/* Right Column - Dashboards */}
        <div className="xl:col-span-1 space-y-3">
          {/* Point Allocation Dashboard */}
          <PointAllocationDashboard module={currentModule} />
          
          {/* All Modules Status - Compact */}
          <Card>
            <CardContent className="p-3">
              <h4 className="font-medium text-gray-900 text-sm mb-2">Module Status</h4>
              <div className="space-y-2">
                {modules.map((module, index) => {
                  const status = getModuleStatus(module);
                  const StatusIcon = status.icon;
                  const isActive = index === currentModuleIndex;
                  const total = getTotalQuestions(module);
                  const completed = getCompletedQuestions(module);
                  
                  return (
                    <div
                      key={module.id}
                      className={`p-2 border rounded cursor-pointer transition-all hover:shadow-sm ${
                        isActive ? 'ring-1 ring-blue-500 bg-blue-50 border-blue-200' : 
                        completed === total && total > 0 ? 'bg-green-50 border-green-200' : 
                        'hover:bg-gray-50'
                      }`}
                      onClick={() => onModuleChange(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-xs truncate">{module.name}</h5>
                          <p className="text-xs text-gray-600 truncate">
                            {module.subject} • {module.difficulty}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <div className="text-right">
                            <div className="text-xs font-medium">
                              {completed}/{total}
                            </div>
                            <div className={`flex items-center gap-1 text-xs ${status.color}`}>
                              <StatusIcon className="h-2 w-2" />
                              <span className="text-xs">{status.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {total > 0 && (
                        <div className="mt-1">
                          <Progress 
                            value={(completed / total) * 100} 
                            className="h-1"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleQuestionEditor;
