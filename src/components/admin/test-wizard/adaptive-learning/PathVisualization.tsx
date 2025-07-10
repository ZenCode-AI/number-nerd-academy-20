
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, BookOpen, Calculator, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestModule, AdaptiveRule } from '@/types/modularTest';

interface PathVisualizationProps {
  modules: TestModule[];
  adaptiveRules: AdaptiveRule[];
  onRemoveRule: (ruleId: string) => void;
}

const PathVisualization = ({ modules, adaptiveRules, onRemoveRule }: PathVisualizationProps) => {
  // Get modules that have adaptive rules or are referenced by rules
  const getRelevantModules = () => {
    const moduleIds = new Set<string>();
    
    // Add source modules
    adaptiveRules.forEach(rule => {
      if (rule.sourceModuleId) moduleIds.add(rule.sourceModuleId);
    });
    
    return modules.filter(module => moduleIds.has(module.id));
  };

  const modulesWithRules = getRelevantModules();

  const getRulesForModule = (moduleId: string) => {
    return adaptiveRules.filter(rule => rule.sourceModuleId === moduleId);
  };

  const getModuleById = (moduleId: string) => {
    return modules.find(m => m.id === moduleId);
  };

  const getNextSequentialModule = (currentModule: TestModule) => {
    const sortedModules = modules.sort((a, b) => a.order - b.order);
    const currentIndex = sortedModules.findIndex(m => m.id === currentModule.id);
    return sortedModules[currentIndex + 1];
  };

  const formatRuleCondition = (rule: AdaptiveRule) => {
    const operator = rule.operator === 'greater_than' ? '≥' : '<';
    const isHighPerformance = rule.operator === 'greater_than';
    
    return {
      operator,
      isHighPerformance,
      threshold: rule.scoreThreshold,
      bgColor: isHighPerformance ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
      textColor: isHighPerformance ? 'text-green-700' : 'text-red-700',
    };
  };

  if (modulesWithRules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-600" />
            Adaptive Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Network className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No Adaptive Rules Configured</p>
            <p className="text-sm">All modules will follow sequential flow</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-blue-600" />
          Adaptive Flow ({modulesWithRules.length} modules)
        </CardTitle>
        <p className="text-sm text-gray-600">
          Modules with conditional branching rules
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modulesWithRules.map((module) => {
            const moduleRules = getRulesForModule(module.id);
            
            return (
              <div key={module.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                {/* Module Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    module.subject === 'English' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {module.subject === 'English' ? <BookOpen className="h-4 w-4" /> : <Calculator className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{module.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{module.subject}</Badge>
                      <Badge variant="outline" className="text-xs">{module.difficulty}</Badge>
                    </div>
                  </div>
                </div>

                {/* IF/ELSE Flow */}
                <div className="space-y-3">
                  {moduleRules.map((rule) => {
                    const targetModule = getModuleById(rule.nextModuleId);
                    const elseModule = rule.elseModuleId ? getModuleById(rule.elseModuleId) : getNextSequentialModule(module);
                    const condition = formatRuleCondition(rule);
                    
                    return (
                      <div key={rule.id} className="bg-gray-50 rounded-lg p-3 border">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Adaptive Rule</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveRule(rule.id)}
                            className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* IF Condition */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">IF</span>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${condition.bgColor} ${condition.textColor}`}>
                              Score {condition.operator} {condition.threshold}%
                            </div>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <div className="flex items-center gap-1">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                targetModule?.subject === 'English' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                              }`}>
                                {targetModule?.subject === 'English' ? <BookOpen className="h-2 w-2" /> : <Calculator className="h-2 w-2" />}
                              </div>
                              <span className="text-sm font-medium text-blue-700">
                                {targetModule?.name || 'Unknown Module'}
                              </span>
                            </div>
                          </div>
                          
                          {/* ELSE Condition */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">ELSE</span>
                            <div className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              Score {condition.operator === 'greater_than' ? '<' : '≥'} {condition.threshold}%
                            </div>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <div className="flex items-center gap-1">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                elseModule?.subject === 'English' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                              }`}>
                                {elseModule?.subject === 'English' ? <BookOpen className="h-2 w-2" /> : <Calculator className="h-2 w-2" />}
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {elseModule?.name || 'Next Module'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PathVisualization;
