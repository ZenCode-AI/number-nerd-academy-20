
import React from 'react';
import { BookOpen, Calculator } from 'lucide-react';
import { TestModule, AdaptiveRule } from '@/types/modularTest';
import ModuleFlowCard from './ModuleFlowCard';

interface ModuleGroupDisplayProps {
  title: string;
  icon: 'english' | 'math';
  modules: TestModule[];
  allModules: TestModule[];
  adaptiveRules: AdaptiveRule[];
  onRemoveRule: (ruleId: string) => void;
}

const ModuleGroupDisplay = ({ 
  title, 
  icon, 
  modules, 
  allModules, 
  adaptiveRules, 
  onRemoveRule 
}: ModuleGroupDisplayProps) => {
  const getRulesForModule = (moduleId: string) => {
    return adaptiveRules.filter(rule => rule.sourceModuleId === moduleId);
  };

  const IconComponent = icon === 'english' ? BookOpen : Calculator;
  const iconColor = icon === 'english' ? 'text-blue-700' : 'text-green-700';

  if (modules.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className={`font-semibold ${iconColor} flex items-center gap-2`}>
        <IconComponent className="h-4 w-4" />
        {title}
      </h3>
      <div className="space-y-3">
        {modules.map((module) => (
          <ModuleFlowCard 
            key={module.id} 
            module={module} 
            moduleRules={getRulesForModule(module.id)}
            modules={allModules}
            onRemoveRule={onRemoveRule}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleGroupDisplay;
