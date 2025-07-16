
import React, { useState, useEffect } from 'react';
import { TestSet } from '@/types/testSet';
import { testSetStorage } from '@/services/testSetStorage';
import TestSetBuilder from '@/components/admin/TestSetBuilder';
import TestSetHeader from '@/components/admin/test-sets/TestSetHeader';
import TestSetGrid from '@/components/admin/test-sets/TestSetGrid';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const TestSets = () => {
  const { toast } = useToast();
  const [testSets, setTestSets] = useState<TestSet[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTestSet, setEditingTestSet] = useState<TestSet | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Load test sets from localStorage
  useEffect(() => {
    const loadTestSets = async () => {
      const storedTestSets = await testSetStorage.getAllTestSets();
      // Add mock data if no test sets exist
      if (storedTestSets.length === 0) {
        const mockTestSet: TestSet = {
          id: 'set_1',
          name: 'Digital SAT Practice Set 1',
          description: 'Complete adaptive test with Math and English modules',
          modules: [
            {
              id: 'mod_1',
              moduleNumber: 1,
              name: 'Math Module 1',
              subject: 'Math',
              difficulty: 'Medium',
              testId: 'test_math_1',
              duration: 45,
              breakAfter: true,
              breakDuration: 5
            },
            {
              id: 'mod_2',
              moduleNumber: 2,
              name: 'Reading Module',
              subject: 'English',
              difficulty: 'Medium',
              testId: 'test_english_1',
              duration: 35,
              breakAfter: true,
              breakDuration: 5
            },
            {
              id: 'mod_3',
              moduleNumber: 3,
              name: 'Math Module 2',
              subject: 'Math',
              difficulty: 'Adaptive',
              testId: 'test_math_2',
              duration: 45,
              breakAfter: false
            }
          ],
          adaptiveConfig: {
            enabled: true,
            rules: [
              {
                fromModule: 1,
                toModule: 3,
                scoreThreshold: 75,
                highPerformanceDifficulty: 'Hard',
                lowPerformanceDifficulty: 'Medium'
              }
            ]
          },
          totalDuration: 125,
          plan: 'Premium',
          status: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        testSetStorage.saveTestSet(mockTestSet);
        setTestSets([mockTestSet]);
      } else {
        setTestSets(storedTestSets);
      }
    };

    loadTestSets();
  }, []);

  const filteredTestSets = testSets.filter(testSet =>
    testSet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testSet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveTestSet = async (testSet: TestSet) => {
    try {
      await testSetStorage.saveTestSet(testSet);
      const updatedTestSets = await testSetStorage.getAllTestSets();
      setTestSets(updatedTestSets);
      
      if (editingTestSet) {
        toast({
          title: "Test Set Updated",
          description: `"${testSet.name}" has been updated successfully.`
        });
      } else {
        toast({
          title: "Test Set Created",
          description: `"${testSet.name}" has been created successfully.`
        });
      }
      setShowBuilder(false);
      setEditingTestSet(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save test set. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditTestSet = (testSet: TestSet) => {
    setEditingTestSet(testSet);
    setShowBuilder(true);
  };

  const handleDeleteTestSet = async (testSetId: string) => {
    try {
      const testSet = testSets.find(ts => ts.id === testSetId);
      await testSetStorage.deleteTestSet(testSetId);
      const updatedTestSets = await testSetStorage.getAllTestSets();
      setTestSets(updatedTestSets);
      
      if (testSet) {
        toast({
          title: "Test Set Deleted",
          description: `"${testSet.name}" has been deleted.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete test set. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateClick = () => {
    setShowBuilder(true);
  };

  if (showBuilder) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingTestSet ? 'Edit Test Set' : 'Create Test Set'}
            </h1>
            <p className="text-gray-600">Build multi-module adaptive test experiences</p>
          </div>
          <Button variant="outline" onClick={() => {
            setShowBuilder(false);
            setEditingTestSet(undefined);
          }}>
            Back to Test Sets
          </Button>
        </div>

        <TestSetBuilder
          onSave={handleSaveTestSet}
          existingTestSet={editingTestSet}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <TestSetHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={handleCreateClick}
      />

      <TestSetGrid
        testSets={filteredTestSets}
        onEdit={handleEditTestSet}
        onDelete={handleDeleteTestSet}
        onCreateClick={handleCreateClick}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default TestSets;
