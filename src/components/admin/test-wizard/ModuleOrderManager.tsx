
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Star, AlertCircle } from 'lucide-react';
import { TestModule } from '@/types/modularTest';
import { validateModuleOrder, validateStartingModule } from '@/utils/testValidation';

interface ModuleOrderManagerProps {
  modules: TestModule[];
  onUpdateModules: (modules: TestModule[]) => void;
}

const ModuleOrderManager: React.FC<ModuleOrderManagerProps> = ({ modules, onUpdateModules }) => {
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);
  const orderValidation = validateModuleOrder(modules);
  const startingModuleValidation = validateStartingModule(modules);

  const moveModule = (moduleId: string, direction: 'up' | 'down') => {
    const moduleIndex = sortedModules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;

    const newIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
    if (newIndex < 0 || newIndex >= sortedModules.length) return;

    const updatedModules = [...modules];
    const moduleToMove = updatedModules.find(m => m.id === moduleId);
    const moduleToSwap = updatedModules.find(m => m.order === newIndex);

    if (moduleToMove && moduleToSwap) {
      const tempOrder = moduleToMove.order;
      moduleToMove.order = moduleToSwap.order;
      moduleToSwap.order = tempOrder;
    }

    onUpdateModules(updatedModules);
  };

  const setAsStartingModule = (moduleId: string) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        return { ...module, order: 0 };
      } else if (module.order === 0) {
        // Find a new order for the current starting module
        const maxOrder = Math.max(...modules.map(m => m.order));
        return { ...module, order: maxOrder + 1 };
      }
      return module;
    });

    // Reorder all modules to ensure sequential ordering
    const reorderedModules = updatedModules
      .sort((a, b) => a.order - b.order)
      .map((module, index) => ({ ...module, order: index }));

    onUpdateModules(reorderedModules);
  };

  if (modules.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No modules to order. Add modules first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Module Order Management
          {(orderValidation || startingModuleValidation) && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        {(orderValidation || startingModuleValidation) && (
          <div className="text-sm text-red-600">
            {orderValidation || startingModuleValidation}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          <p>Set the order in which students will encounter modules. The first module (Order 1) is the starting module.</p>
        </div>

        <div className="space-y-3">
          {sortedModules.map((module, index) => (
            <div
              key={module.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                module.order === 0 ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant={module.order === 0 ? 'default' : 'outline'} className="min-w-[80px]">
                    {module.order === 0 ? (
                      <>
                        <Star className="h-3 w-3 mr-1" />
                        Starting
                      </>
                    ) : (
                      `Order ${module.order + 1}`
                    )}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">{module.name}</h4>
                  <p className="text-sm text-gray-600">
                    {module.subject} • {module.difficulty}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {module.order !== 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAsStartingModule(module.id)}
                  >
                    Set as Starting
                  </Button>
                )}
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveModule(module.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveModule(module.id, 'down')}
                    disabled={index === sortedModules.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Module Flow</h4>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            {sortedModules.map((module, index) => (
              <React.Fragment key={module.id}>
                <span className={`px-2 py-1 rounded ${
                  module.order === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {module.name}
                </span>
                {index < sortedModules.length - 1 && (
                  <span className="text-gray-400">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleOrderManager;
