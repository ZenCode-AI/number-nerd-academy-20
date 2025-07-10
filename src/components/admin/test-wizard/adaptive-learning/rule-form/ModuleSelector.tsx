
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestModule } from '@/types/modularTest';

interface ModuleSelectorProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  modules: TestModule[];
  disabled?: boolean;
  helpText?: string;
}

const ModuleSelector = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  modules, 
  disabled = false,
  helpText 
}: ModuleSelectorProps) => {
  const englishModules = modules.filter(m => m.subject === 'English');
  const mathModules = modules.filter(m => m.subject === 'Math');

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(' ', '-')}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {englishModules.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50">
                English Modules
              </div>
              {englishModules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name} ({module.difficulty})
                </SelectItem>
              ))}
            </>
          )}
          {mathModules.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-50">
                Math Modules
              </div>
              {mathModules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name} ({module.difficulty})
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};

export default ModuleSelector;
