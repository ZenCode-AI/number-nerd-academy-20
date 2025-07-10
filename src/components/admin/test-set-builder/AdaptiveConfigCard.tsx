import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestSetAdaptiveConfig, AdaptiveRule } from '@/types/testSet';
import { TestSetModule } from '@/types/testSet';
import { Trash2, Plus, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdaptiveConfigCardProps {
  adaptiveConfig: TestSetAdaptiveConfig;
  modules?: TestSetModule[];
  onUpdate: (config: TestSetAdaptiveConfig) => void;
}

const AdaptiveConfigCard = ({ adaptiveConfig, modules = [], onUpdate }: AdaptiveConfigCardProps) => {
  const [newRule, setNewRule] = React.useState<Partial<AdaptiveRule>>({
    fromModule: 1,
    toModule: 2,
    scoreThreshold: 70,
    highPerformanceDifficulty: 'Hard',
    lowPerformanceDifficulty: 'Medium'
  });

  const handleToggleAdaptive = (enabled: boolean) => {
    onUpdate({
      ...adaptiveConfig,
      enabled,
      rules: enabled ? adaptiveConfig.rules : []
    });
  };

  const handleAddRule = () => {
    if (!newRule.fromModule || !newRule.toModule || !newRule.scoreThreshold) return;
    
    const rule: AdaptiveRule = {
      fromModule: newRule.fromModule,
      toModule: newRule.toModule,
      scoreThreshold: newRule.scoreThreshold,
      highPerformanceDifficulty: newRule.highPerformanceDifficulty || 'Hard',
      lowPerformanceDifficulty: newRule.lowPerformanceDifficulty || 'Medium'
    };

    onUpdate({
      ...adaptiveConfig,
      rules: [...adaptiveConfig.rules, rule]
    });

    // Reset form
    setNewRule({
      fromModule: 1,
      toModule: 2,
      scoreThreshold: 70,
      highPerformanceDifficulty: 'Hard',
      lowPerformanceDifficulty: 'Medium'
    });
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = adaptiveConfig.rules.filter((_, i) => i !== index);
    onUpdate({
      ...adaptiveConfig,
      rules: updatedRules
    });
  };

  const getSkippedModules = (fromModule: number, toModule: number) => {
    if (toModule <= fromModule + 1) return [];
    const skipped = [];
    for (let i = fromModule + 1; i < toModule; i++) {
      const module = modules.find(m => m.moduleNumber === i);
      if (module) {
        skipped.push(module.name);
      }
    }
    return skipped;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adaptive Configuration</CardTitle>
        <p className="text-sm text-gray-600">
          Configure adaptive rules to skip modules based on student performance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="adaptive-enabled"
            checked={adaptiveConfig.enabled}
            onCheckedChange={handleToggleAdaptive}
          />
          <Label htmlFor="adaptive-enabled">Enable Adaptive Testing</Label>
        </div>

        {adaptiveConfig.enabled && (
          <>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Adaptive rules allow students to skip modules based on their performance. 
                For example: If a student scores above 70% on Module 1, they can jump directly to Module 3, skipping Module 2.
              </AlertDescription>
            </Alert>

            {/* Existing Rules */}
            {adaptiveConfig.rules.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Active Rules</h4>
                {adaptiveConfig.rules.map((rule, index) => {
                  const skippedModules = getSkippedModules(rule.fromModule, rule.toModule);
                  return (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          Module {rule.fromModule} → Module {rule.toModule}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRule(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Score threshold: {rule.scoreThreshold}%</div>
                        <div>High performance: {rule.highPerformanceDifficulty}</div>
                        <div>Low performance: {rule.lowPerformanceDifficulty}</div>
                        {skippedModules.length > 0 && (
                          <div className="text-orange-600">
                            Skipped modules: {skippedModules.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New Rule */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Add New Rule</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Module</Label>
                  <Select
                    value={newRule.fromModule?.toString()}
                    onValueChange={(value) => setNewRule(prev => ({ ...prev, fromModule: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map(module => (
                        <SelectItem key={module.id} value={module.moduleNumber.toString()}>
                          Module {module.moduleNumber}: {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Jump to Module</Label>
                  <Select
                    value={newRule.toModule?.toString()}
                    onValueChange={(value) => setNewRule(prev => ({ ...prev, toModule: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules
                        .filter(module => module.moduleNumber > (newRule.fromModule || 0))
                        .map(module => (
                          <SelectItem key={module.id} value={module.moduleNumber.toString()}>
                            Module {module.moduleNumber}: {module.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Score Threshold (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newRule.scoreThreshold || 70}
                  onChange={(e) => setNewRule(prev => ({ ...prev, scoreThreshold: parseInt(e.target.value) }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>High Performance Difficulty</Label>
                  <Select
                    value={newRule.highPerformanceDifficulty}
                    onValueChange={(value: 'Medium' | 'Hard') => 
                      setNewRule(prev => ({ ...prev, highPerformanceDifficulty: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Low Performance Difficulty</Label>
                  <Select
                    value={newRule.lowPerformanceDifficulty}
                    onValueChange={(value: 'Easy' | 'Medium') => 
                      setNewRule(prev => ({ ...prev, lowPerformanceDifficulty: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newRule.fromModule && newRule.toModule && newRule.toModule > newRule.fromModule + 1 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This rule will skip: {getSkippedModules(newRule.fromModule, newRule.toModule).join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAddRule}
                disabled={!newRule.fromModule || !newRule.toModule || !newRule.scoreThreshold}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdaptiveConfigCard;
