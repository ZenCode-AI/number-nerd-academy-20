
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, FileText, Calculator, Book } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const TestTemplates = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const templates = [
    {
      id: 1,
      name: 'SAT Math Module 1',
      subject: 'Math',
      module: 1,
      difficulty: 'Medium',
      questions: 58,
      duration: 80,
      description: 'Standard SAT Math practice test with mixed difficulty',
      icon: Calculator,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'GCSE Math Foundation',
      subject: 'Math',
      module: 3,
      difficulty: 'Easy',
      questions: 45,
      duration: 90,
      description: 'Foundation level mathematics for GCSE preparation',
      icon: Calculator,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'A-Level Advanced Math',
      subject: 'Math',
      module: 2,
      difficulty: 'Hard',
      questions: 75,
      duration: 120,
      description: 'Advanced mathematics for A-Level students',
      icon: Calculator,
      color: 'bg-red-500'
    },
    {
      id: 4,
      name: 'SAT Reading Comprehension',
      subject: 'English',
      module: 1,
      difficulty: 'Medium',
      questions: 52,
      duration: 65,
      description: 'Reading comprehension with passage analysis',
      icon: Book,
      color: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'IELTS Reading Practice',
      subject: 'English',
      module: 2,
      difficulty: 'Hard',
      questions: 40,
      duration: 60,
      description: 'Advanced reading comprehension for IELTS preparation',
      icon: Book,
      color: 'bg-orange-500'
    }
  ];

  const handleUseTemplate = (template: any) => {
    // Navigate to create test with template data pre-filled
    navigate('/admin/create-test', { 
      state: { 
        template: {
          name: `${template.name} - Copy`,
          subject: template.subject,
          module: template.module,
          difficulty: template.difficulty,
          duration: template.duration,
          description: template.description
        }
      }
    });
    
    toast({
      title: "Template Applied",
      description: `Creating new test from "${template.name}" template`,
    });
  };

  const handleCreateBlankTest = () => {
    navigate('/admin/create-test');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Test Templates</h2>
          <p className="text-gray-600">Quick start with pre-configured test templates</p>
        </div>
        <Button onClick={handleCreateBlankTest} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Blank Test
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${template.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {template.subject}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Module {template.module}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Difficulty:</span>
                    <Badge variant={
                      template.difficulty === 'Easy' ? 'default' :
                      template.difficulty === 'Medium' ? 'secondary' : 'destructive'
                    } className="ml-2 text-xs">
                      {template.difficulty}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Questions:</span>
                    <span className="ml-2 font-medium">{template.questions}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2 font-medium">{template.duration} min</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Module:</span>
                    <span className="ml-2 font-medium">{template.module}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleUseTemplate(template)}
                  className="w-full"
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="font-medium">Import from File</span>
              <span className="text-xs text-gray-500">Import questions from CSV/JSON</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Copy className="h-6 w-6" />
              <span className="font-medium">Duplicate Existing</span>
              <span className="text-xs text-gray-500">Copy from existing test</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span className="font-medium">Adaptive Test Set</span>
              <span className="text-xs text-gray-500">Create linked module tests</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestTemplates;
