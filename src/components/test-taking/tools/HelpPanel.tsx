
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Calculator, BookOpen, HelpCircle } from 'lucide-react';
import CalculatorTool from './Calculator';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
}

const HelpPanel = ({ isOpen, onClose, subject }: HelpPanelProps) => {
  const getMathFormulas = () => [
    { name: 'Area of Circle', formula: 'A = πr²' },
    { name: 'Circumference', formula: 'C = 2πr' },
    { name: 'Area of Rectangle', formula: 'A = l × w' },
    { name: 'Area of Triangle', formula: 'A = ½bh' },
    { name: 'Pythagorean Theorem', formula: 'a² + b² = c²' },
    { name: 'Quadratic Formula', formula: 'x = (-b ± √(b²-4ac)) / 2a' },
  ];

  const getEnglishTips = () => [
    'Read questions carefully and identify key words',
    'For grammar questions, try reading the sentence aloud',
    'Look for context clues in reading passages',
    'Eliminate obviously wrong answers first',
    'Pay attention to verb tenses and subject-verb agreement',
    'In essay questions, plan your structure before writing',
  ];

  const getGeneralTips = () => [
    'Manage your time effectively across all questions',
    'Flag difficult questions to return to later',
    'Read all answer choices before selecting',
    'Use the process of elimination',
    'Take breaks between modules to stay fresh',
    'Double-check your answers if time permits',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Test Help Center
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="formulas">Formulas & Tips</TabsTrigger>
            <TabsTrigger value="general">General Help</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalculatorTool />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            {subject === 'Math' && (
              <Card>
                <CardHeader>
                  <CardTitle>Math Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {getMathFormulas().map((item, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-900">{item.name}</div>
                        <div className="font-mono text-blue-700">{item.formula}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {subject === 'English' && (
              <Card>
                <CardHeader>
                  <CardTitle>English Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {getEnglishTips().map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Test-Taking Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {getGeneralTips().map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HelpPanel;
