
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, BookOpen, Settings, FileText, MessageSquare } from 'lucide-react';
import HelpPanel from './HelpPanel';
import { testDetailsHelp, moduleHelp, passageHelp, questionsHelp } from '@/utils/testCreationHelp';

const TestCreationGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Test Creation Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Complete Test Creation Guide
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
              <TabsTrigger value="modules" className="text-xs">Modules</TabsTrigger>
              <TabsTrigger value="passages" className="text-xs">Passages</TabsTrigger>
              <TabsTrigger value="questions" className="text-xs">Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Test Creation Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border">
                    <h4 className="font-medium text-blue-900 mb-2">Step 1: Test Details</h4>
                    <p className="text-sm text-blue-800">Set up basic information, subject, difficulty, and requirements.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border">
                    <h4 className="font-medium text-green-900 mb-2">Step 2: Module & Adaptive</h4>
                    <p className="text-sm text-green-800">Configure module settings and adaptive testing parameters.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border">
                    <h4 className="font-medium text-purple-900 mb-2">Step 3: Reading Passage</h4>
                    <p className="text-sm text-purple-800">Add reading material for English tests (optional for Math).</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border">
                    <h4 className="font-medium text-orange-900 mb-2">Step 4: Questions</h4>
                    <p className="text-sm text-orange-800">Create and configure test questions with proper answers.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <HelpPanel title="Test Details Help" sections={testDetailsHelp} defaultOpen={true} />
            </TabsContent>
            
            <TabsContent value="modules" className="mt-4">
              <HelpPanel title="Module & Adaptive Testing Help" sections={moduleHelp} defaultOpen={true} />
            </TabsContent>
            
            <TabsContent value="passages" className="mt-4">
              <HelpPanel title="Reading Passage Help" sections={passageHelp} defaultOpen={true} />
            </TabsContent>
            
            <TabsContent value="questions" className="mt-4">
              <HelpPanel title="Questions Help" sections={questionsHelp} defaultOpen={true} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TestCreationGuide;
