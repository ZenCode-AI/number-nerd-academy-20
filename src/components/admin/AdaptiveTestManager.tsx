
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { AdaptiveTestConfig } from '@/types/admin';

const AdaptiveTestManager = () => {
  const [configs, setConfigs] = useState<AdaptiveTestConfig[]>([
    {
      subject: 'Math',
      module1TestId: 'test_1',
      module2TestId: 'test_2', 
      module3TestId: 'test_3',
      threshold: 70
    },
    {
      subject: 'English',
      module1TestId: 'test_4',
      module2TestId: 'test_5',
      module3TestId: 'test_6', 
      threshold: 75
    }
  ]);

  const [newConfig, setNewConfig] = useState<Partial<AdaptiveTestConfig>>({
    subject: 'Math',
    threshold: 70
  });

  const addConfig = () => {
    if (newConfig.subject && newConfig.module1TestId && newConfig.threshold) {
      setConfigs([...configs, newConfig as AdaptiveTestConfig]);
      setNewConfig({ subject: 'Math', threshold: 70 });
    }
  };

  const removeConfig = (index: number) => {
    setConfigs(configs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 py-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Settings className="h-5 w-5" />
            Adaptive Testing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Subject</Label>
                <Select 
                  onValueChange={(value: 'Math' | 'English') => 
                    setNewConfig({...newConfig, subject: value})
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Math">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Module 1 Test (Medium)</Label>
                <Input 
                  placeholder="Test ID"
                  value={newConfig.module1TestId || ''}
                  onChange={(e) => setNewConfig({...newConfig, module1TestId: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Threshold (%)</Label>
                <Input 
                  type="number"
                  placeholder="70"
                  value={newConfig.threshold || ''}
                  onChange={(e) => setNewConfig({...newConfig, threshold: parseInt(e.target.value)})}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-end">
                <Button onClick={addConfig} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Config
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-lg md:text-xl">Current Configurations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {configs.map((config, index) => (
              <div key={index} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline">{config.subject}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeConfig(index)}
                      className="p-1 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Module 1 (Medium):</span>
                    <span className="ml-2">{config.module1TestId}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Module 2 (Hard):</span>
                    <span className="ml-2">{config.module2TestId || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Module 3 (Easy):</span>
                    <span className="ml-2">{config.module3TestId || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Threshold:</span>
                    <span className="ml-2">{config.threshold}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px] px-4 py-3">Subject</TableHead>
                  <TableHead className="min-w-[120px] px-4 py-3">Module 1 (Medium)</TableHead>
                  <TableHead className="min-w-[120px] px-4 py-3">Module 2 (Hard)</TableHead>
                  <TableHead className="min-w-[120px] px-4 py-3">Module 3 (Easy)</TableHead>
                  <TableHead className="min-w-[80px] px-4 py-3">Threshold</TableHead>
                  <TableHead className="min-w-[100px] px-4 py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline">{config.subject}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">{config.module1TestId}</TableCell>
                    <TableCell className="px-4 py-3">{config.module2TestId || 'Not set'}</TableCell>
                    <TableCell className="px-4 py-3">{config.module3TestId || 'Not set'}</TableCell>
                    <TableCell className="px-4 py-3">{config.threshold}%</TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeConfig(index)}
                          className="p-1 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveTestManager;
