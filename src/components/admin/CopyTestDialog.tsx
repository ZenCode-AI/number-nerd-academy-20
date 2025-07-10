
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Copy } from 'lucide-react';
import { ModularTest } from '@/types/modularTest';
import { isTestNameUnique, generateUniqueTestName } from '@/utils/testCopyUtils';

interface CopyTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (modifications: { name: string; plan: string; description?: string }) => void;
  originalTest: ModularTest;
}

const CopyTestDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  originalTest
}: CopyTestDialogProps) => {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<'Free' | 'Basic' | 'Standard' | 'Premium'>(originalTest.plan);
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  // Check for name uniqueness
  const checkNameUniqueness = (testName: string) => {
    if (!testName.trim()) {
      setNameError('Test name is required');
      return false;
    }

    if (!isTestNameUnique(testName, originalTest.id)) {
      setNameError('A test with this name already exists');
      return false;
    }

    setNameError('');
    return true;
  };

  useEffect(() => {
    // Generate unique name on dialog open
    if (isOpen && !name) {
      const uniqueName = generateUniqueTestName(originalTest.name);
      setName(uniqueName);
    }
  }, [isOpen, originalTest.name, name]);

  const handleNameChange = (newName: string) => {
    setName(newName);
    checkNameUniqueness(newName);
  };

  const handleConfirm = () => {
    if (!checkNameUniqueness(name)) {
      return;
    }

    const modifications = {
      name,
      plan,
      description
    };

    onConfirm(modifications);
  };

  const getDialogTitle = () => 'Duplicate Test';

  const isFormValid = name.trim() && !nameError;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Original:</span> {originalTest.name}
            </div>
          </div>

          <div>
            <Label htmlFor="copyName">New Test Name *</Label>
            <Input
              id="copyName"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter test name..."
              className={nameError ? 'border-red-500' : ''}
            />
            {nameError && (
              <div className="flex items-center gap-2 text-red-600 text-xs mt-1">
                <AlertCircle className="h-3 w-3" />
                {nameError}
              </div>
            )}
          </div>

          <div>
            <Label>Plan</Label>
            <Select value={plan} onValueChange={(value: 'Free' | 'Basic' | 'Standard' | 'Premium') => setPlan(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="copyDescription">Description (Optional)</Label>
            <Textarea
              id="copyDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this copy..."
              className="h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isFormValid} className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Create Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CopyTestDialog;
