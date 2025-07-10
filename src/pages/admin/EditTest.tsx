
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { modularTestStorage } from '@/services/modularTestStorage';
import { ModularTest } from '@/types/modularTest';

const EditTest = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [test, setTest] = useState<ModularTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    plan: 'Free' as 'Free' | 'Basic' | 'Standard' | 'Premium',
    status: 'Draft' as 'Draft' | 'Active'
  });

  useEffect(() => {
    if (testId) {
      const loadTest = () => {
        try {
          const foundTest = modularTestStorage.getById(testId);
          if (foundTest) {
            setTest(foundTest);
            setFormData({
              name: foundTest.name,
              description: foundTest.description || '',
              plan: foundTest.plan,
              status: foundTest.status
            });
          } else {
            toast({
              title: "Test Not Found",
              description: "The requested test could not be found.",
              variant: "destructive"
            });
            navigate('/admin/tests');
          }
        } catch (error) {
          console.error('Error loading test:', error);
          toast({
            title: "Error",
            description: "Failed to load test data.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };

      loadTest();
    }
  }, [testId, navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!test || !testId) return;

    setIsSaving(true);
    try {
      const updatedTest = {
        ...test,
        name: formData.name,
        description: formData.description,
        plan: formData.plan,
        status: formData.status,
        updatedAt: new Date().toISOString()
      };

      modularTestStorage.update(testId, updatedTest);
      
      toast({
        title: "Test Updated",
        description: "Test has been updated successfully.",
      });

      navigate('/admin/tests');
    } catch (error) {
      console.error('Error updating test:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update test. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading test...</span>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Test not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/tests')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tests
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Edit Test</h1>
          <p className="text-gray-600 text-sm lg:text-base">Modify test details and settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Test Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter test name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter test description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600">Modules</p>
              <p className="font-semibold">{test.modules?.length || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600">Total Questions</p>
              <p className="font-semibold">
                {test.modules?.reduce((sum, module) => sum + (module.questions?.length || 0), 0) || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600">Created</p>
              <p className="font-semibold">{new Date(test.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600">Updated</p>
              <p className="font-semibold">{new Date(test.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 flex-wrap">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/tests')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || !formData.name.trim()}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditTest;
