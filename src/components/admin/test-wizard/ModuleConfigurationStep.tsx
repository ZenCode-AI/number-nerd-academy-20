
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Settings } from 'lucide-react';
import { TestModule } from '@/types/modularTest';
import { validateStartingModule } from '@/utils/testValidation';
import EnhancedModuleCard from './EnhancedModuleCard';
import ModuleEditor from './ModuleEditor';
import ModuleOrderManager from './ModuleOrderManager';

interface ModuleConfigurationStepProps {
  modules: TestModule[];
  onUpdate: (modules: TestModule[]) => void;
}

const ModuleConfigurationStep: React.FC<ModuleConfigurationStepProps> = ({ modules, onUpdate }) => {
  const [editingModule, setEditingModule] = useState<{ module: TestModule; index: number } | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('modules');

  const startingModuleError = validateStartingModule(modules);

  const handleAddModule = () => {
    const newModule: TestModule = {
      id: Date.now().toString(),
      name: `Module ${modules.length + 1}`,
      subject: 'Math',
      difficulty: 'Medium',
      questionCounts: { numeric: 0, passage: 0, image: 0, mcq: 0 },
      questionScores: { numeric: 1, passage: 2, image: 1, mcq: 1 },
      questions: [],
      order: modules.length === 0 ? 0 : modules.length // First module is starting module
    };
    
    onUpdate([...modules, newModule]);
    setEditingModule({ module: newModule, index: modules.length });
    setShowEditor(true);
  };

  const handleEditModule = (index: number) => {
    setEditingModule({ module: modules[index], index });
    setShowEditor(true);
  };

  const handleDeleteModule = (index: number) => {
    const moduleToDelete = modules[index];
    const updatedModules = modules.filter((_, i) => i !== index);
    
    // If we deleted the starting module, make the first remaining module the starting module
    if (moduleToDelete.order === 0 && updatedModules.length > 0) {
      updatedModules[0].order = 0;
      // Reorder remaining modules
      updatedModules.forEach((module, idx) => {
        module.order = idx;
      });
    } else {
      // Reorder modules to fill gaps
      updatedModules
        .sort((a, b) => a.order - b.order)
        .forEach((module, idx) => {
          module.order = idx;
        });
    }
    
    onUpdate(updatedModules);
  };

  const handleSaveModule = (updatedModule: TestModule) => {
    if (editingModule) {
      const updatedModules = [...modules];
      updatedModules[editingModule.index] = updatedModule;
      onUpdate(updatedModules);
    }
    setEditingModule(null);
    setShowEditor(false);
  };

  const handleCancelEdit = () => {
    setEditingModule(null);
    setShowEditor(false);
  };

  if (showEditor && editingModule) {
    const isNewModule = editingModule.index >= modules.length;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isNewModule ? 'Add New Module' : 'Edit Module'}
          </h2>
          <Button variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </div>
        <ModuleEditor
          module={editingModule.module}
          existingModules={modules}
          onSave={handleSaveModule}
          onCancel={handleCancelEdit}
          isNew={isNewModule}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configure Test Modules</h2>
          <p className="text-gray-600 text-sm mt-1">Add and configure modules for your test</p>
        </div>
        <Button onClick={handleAddModule} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Module
        </Button>
      </div>

      {/* Starting Module Validation */}
      {startingModuleError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <Settings className="h-4 w-4" />
            <span className="font-medium">Configuration Required</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{startingModuleError}</p>
        </div>
      )}

      {modules.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Start building your test by adding your first module. Each module can contain different types of questions and target specific subjects.
            </p>
            <Button onClick={handleAddModule} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Module
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="order">Module Order</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {modules.map((module, index) => (
                <EnhancedModuleCard
                  key={module.id}
                  module={module}
                  index={index}
                  onEdit={() => handleEditModule(index)}
                  onDelete={() => handleDeleteModule(index)}
                />
              ))}
            </div>

            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center py-6">
                <Button 
                  variant="outline" 
                  onClick={handleAddModule} 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Module
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="order" className="mt-4">
            <ModuleOrderManager
              modules={modules}
              onUpdateModules={onUpdate}
            />
          </TabsContent>
        </Tabs>
      )}

      {modules.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">
            {modules.length} Module{modules.length !== 1 ? 's' : ''} Configured
          </h3>
          <p className="text-blue-700 text-sm">
            Your test now has {modules.length} module{modules.length !== 1 ? 's' : ''}. 
            {modules.find(m => m.order === 0) ? 
              ` Starting module: ${modules.find(m => m.order === 0)?.name}` : 
              ' Please set a starting module in the Module Order tab.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ModuleConfigurationStep;
