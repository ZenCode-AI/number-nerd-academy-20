
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, X, BookOpen, Calculator } from 'lucide-react';
import { TestModule, AdaptiveRule } from '@/types/modularTest';

interface ModuleFlowCardProps {
  module: TestModule;
  moduleRules: AdaptiveRule[];
  modules: TestModule[];
  onRemoveRule: (ruleId: string) => void;
}

const ModuleFlowCard = ({ module, moduleRules, modules, onRemoveRule }: ModuleFlowCardProps) => {
  const hasRules = moduleRules.length > 0;

  const formatRuleCondition = (rule: AdaptiveRule) => {
    const operator = rule.operator === 'greater_than' ? '≥' : '<';
    const isHighPerformance = rule.operator === 'greater_than';
    
    return {
      operator,
      isHighPerformance,
      threshold: rule.scoreThreshold,
      bgColor: isHighPerformance ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
      textColor: isHighPerformance ? 'text-green-700' : 'text-red-700',
      iconColor: isHighPerformance ? 'text-green-600' : 'text-red-600'
    };
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Module Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
          module.subject === 'English' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {module.subject === 'English' ? <BookOpen className="h-5 w-5" /> : <Calculator className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{module.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs font-medium">
              {module.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium">
              {module.subject}
            </Badge>
          </div>
        </div>
        <Badge variant={hasRules ? 'default' : 'secondary'} className="text-xs font-medium">
          {hasRules ? `${moduleRules.length} rule${moduleRules.length > 1 ? 's' : ''}` : 'No rules'}
        </Badge>
      </div>

      {/* Adaptive Rules - Clean IF/ELSE Flow */}
      {hasRules && (
        <div className="space-y-4 mt-4">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Adaptive Flow Rules
          </div>
          {moduleRules.map((rule, index) => {
            const targetModule = modules.find(m => m.id === rule.nextModuleId);
            const condition = formatRuleCondition(rule);
            
            return (
              <div key={rule.id} className="relative bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                {/* Rule Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-700">
                    Rule {index + 1}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveRule(rule.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-7 w-7"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* IF/ELSE Flow */}
                <div className="space-y-2">
                  {/* IF Condition */}
                  <div className={`border-2 rounded-lg p-3 ${condition.bgColor} relative`}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-white px-2 py-1 rounded text-gray-700">IF</span>
                        <span className={`font-bold text-sm ${condition.textColor}`}>
                          Score {condition.operator} {condition.threshold}%
                        </span>
                      </div>
                      <ArrowRight className={`h-4 w-4 ${condition.iconColor}`} />
                      <span className="font-semibold text-blue-700 text-sm bg-white px-2 py-1 rounded shadow-sm">
                        Go to {targetModule?.name || 'Unknown Module'}
                      </span>
                    </div>
                  </div>

                  {/* ELSE Condition */}
                  <div className="border-2 border-gray-300 rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-700">ELSE</span>
                        <span className="font-medium text-sm text-gray-700">
                          Score {condition.operator === '≥' ? '<' : '≥'} {condition.threshold}%
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-700 text-sm bg-gray-100 px-2 py-1 rounded">
                        Continue Sequential
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Rules State */}
      {!hasRules && (
        <div className="mt-4 p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <span className="text-sm text-gray-500 font-medium">
            No adaptive rules configured - follows sequential flow
          </span>
        </div>
      )}
    </div>
  );
};

export default ModuleFlowCard;
