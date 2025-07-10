
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TestModule, AdaptiveRule } from '@/types/modularTest';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import OperatorSelector from './rule-form/OperatorSelector';
import ScoreThresholdInput from './rule-form/ScoreThresholdInput';
import ModuleSelector from './rule-form/ModuleSelector';
import RuleFormActions from './rule-form/RuleFormActions';

interface RuleCreationFormProps {
  modules: TestModule[];
  onAddRule: (rule: AdaptiveRule) => void;
}

const RuleCreationForm = ({ modules, onAddRule }: RuleCreationFormProps) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [useElseCondition, setUseElseCondition] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AdaptiveRule>>({
    operator: 'less_than',
    scoreThreshold: 70,
    nextModuleId: '',
    elseModuleId: '',
    description: ''
  });

  const getAvailableTargetModules = (sourceModuleId: string) => {
    const sourceModule = modules.find(m => m.id === sourceModuleId);
    if (!sourceModule) return [];
    
    return modules.filter(m => 
      m.id !== sourceModuleId && 
      m.subject === sourceModule.subject
    );
  };

  const getSkippedModules = (sourceModuleId: string, targetModuleId: string) => {
    const sourceModule = modules.find(m => m.id === sourceModuleId);
    const targetModule = modules.find(m => m.id === targetModuleId);
    
    if (!sourceModule || !targetModule) return [];
    
    const sourceIndex = modules.findIndex(m => m.id === sourceModuleId);
    const targetIndex = modules.findIndex(m => m.id === targetModuleId);
    
    if (targetIndex <= sourceIndex + 1) return [];
    
    return modules.slice(sourceIndex + 1, targetIndex).map(m => m.name);
  };

  const handleAddRule = () => {
    if (!selectedModuleId || !newRule.nextModuleId || !newRule.description) return;
    if (useElseCondition && !newRule.elseModuleId) return;

    const rule: AdaptiveRule = {
      id: Date.now().toString(),
      sourceModuleId: selectedModuleId,
      operator: newRule.operator || 'less_than',
      scoreThreshold: newRule.scoreThreshold || 70,
      nextModuleId: newRule.nextModuleId,
      elseModuleId: useElseCondition ? newRule.elseModuleId : undefined,
      description: newRule.description
    };

    console.log('Adding adaptive rule:', rule);
    onAddRule(rule);

    setNewRule({
      operator: 'less_than',
      scoreThreshold: 70,
      nextModuleId: '',
      elseModuleId: '',
      description: ''
    });
    setUseElseCondition(false);
  };

  const isFormValid = selectedModuleId && newRule.nextModuleId && newRule.description && 
    (!useElseCondition || newRule.elseModuleId);
  const skippedModules = getSkippedModules(selectedModuleId, newRule.nextModuleId || '');
  const elseSkippedModules = useElseCondition && newRule.elseModuleId ? 
    getSkippedModules(selectedModuleId, newRule.elseModuleId) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Adaptive Rule</CardTitle>
        <p className="text-sm text-gray-600">
          Create performance-based branching with optional else conditions
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Adaptive rules allow students to skip modules based on performance. 
            You can now add "else" conditions for complete branching logic.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModuleSelector
            label="From Module"
            placeholder="Select source module"
            value={selectedModuleId}
            onChange={setSelectedModuleId}
            modules={modules}
            helpText="Choose the module where this rule will apply"
          />

          <OperatorSelector
            value={newRule.operator || 'less_than'}
            onChange={(value) => setNewRule(prev => ({ ...prev, operator: value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoreThresholdInput
            value={newRule.scoreThreshold || 70}
            onChange={(value) => setNewRule(prev => ({ ...prev, scoreThreshold: value }))}
            operator={newRule.operator || 'less_than'}
          />

          <ModuleSelector
            label="Jump to Module (IF condition)"
            placeholder="Select target module"
            value={newRule.nextModuleId || ''}
            onChange={(value) => setNewRule(prev => ({ ...prev, nextModuleId: value }))}
            modules={getAvailableTargetModules(selectedModuleId)}
            disabled={!selectedModuleId}
            helpText="Module for when condition is met"
          />
        </div>

        {/* Else Condition Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="use-else"
            checked={useElseCondition}
            onCheckedChange={setUseElseCondition}
          />
          <Label htmlFor="use-else">Add ELSE condition</Label>
        </div>

        {useElseCondition && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <ModuleSelector
              label="ELSE Jump to Module"
              placeholder="Select else module"
              value={newRule.elseModuleId || ''}
              onChange={(value) => setNewRule(prev => ({ ...prev, elseModuleId: value }))}
              modules={getAvailableTargetModules(selectedModuleId)}
              disabled={!selectedModuleId}
              helpText="Module for when condition is NOT met"
            />
          </div>
        )}

        {skippedModules.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>IF condition - Modules that will be skipped:</strong> {skippedModules.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {elseSkippedModules.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>ELSE condition - Modules that will be skipped:</strong> {elseSkippedModules.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="ruleDescription">Rule Description</Label>
          <Input
            id="ruleDescription"
            placeholder="e.g., 'High performers skip to advanced, low performers get review'"
            value={newRule.description || ''}
            onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <RuleFormActions
          onAddRule={handleAddRule}
          disabled={!isFormValid}
        />
      </CardContent>
    </Card>
  );
};

export default RuleCreationForm;
