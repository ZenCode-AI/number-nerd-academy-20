
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Copy, Trash2, Eye, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import CopyTestDialog from './CopyTestDialog';
import { modularTestStorage } from '@/services/modularTestStorage';
import { ModularTest } from '@/types/modularTest';

interface TestActionsProps {
  testId: string;
  testName: string;
  status: 'Active' | 'Draft';
  test?: ModularTest;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onRefresh?: () => void;
}

const TestActions = ({ 
  testId, 
  testName, 
  status, 
  test,
  onEdit, 
  onView, 
  onDelete, 
  onToggleStatus,
  onRefresh
}: TestActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  const handleCopyTest = () => {
    setShowCopyDialog(true);
  };

  const handleEditWizard = () => {
    navigate(`/admin/edit-test-wizard/${testId}`);
  };

  const handleCopyConfirm = async (modifications: { name: string; plan: string; description?: string }) => {
    try {
      if (!test) {
        // Try to fetch the test from storage
        const storedTest = modularTestStorage.getById(testId);
        if (!storedTest) {
          toast({
            title: "Copy Error",
            description: "Test data not available for copying.",
            variant: "destructive"
          });
          return;
        }
        
        // Use stored test data
        const { copyTest } = require('@/utils/testCopyUtils');
        const newTest = copyTest(storedTest, modifications);
        modularTestStorage.save(newTest);
      } else {
        // Use the new copy utility for deep copying
        const { copyTest } = require('@/utils/testCopyUtils');
        const newTest = copyTest(test, modifications);
        
        // Save using modular test storage
        modularTestStorage.save(newTest);
      }

      toast({
        title: "Test Copied",
        description: `Test "${modifications.name}" has been created successfully.`,
      });

      setShowCopyDialog(false);
      onRefresh?.();
    } catch (error) {
      console.error('Error copying test:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy test. Please try again.",
        variant: "destructive"
      });
    }
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditWizard}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleStatus}>
            {status === 'Active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyTest}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Test
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Test
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Copy Test Dialog */}
      {showCopyDialog && test && (
        <CopyTestDialog
          isOpen={showCopyDialog}
          onClose={() => setShowCopyDialog(false)}
          onConfirm={handleCopyConfirm}
          originalTest={test}
        />
      )}
    </>
  );
};

export default TestActions;
