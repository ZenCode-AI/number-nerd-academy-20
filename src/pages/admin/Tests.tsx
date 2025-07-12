
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import TestFilters from '@/components/admin/TestFilters';
import TestAnalytics from '@/components/admin/TestAnalytics';
import TestsHeader from '@/components/admin/tests/TestsHeader';
import TestsTable from '@/components/admin/tests/TestsTable';
import { modularTestStorage, convertModularTestForDisplay } from '@/services/modularTestStorage';

interface LocalTest {
  id: number;
  name: string;
  subject: 'Math' | 'English';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  questions: number;
  duration: number;
  status: 'Active' | 'Draft';
  createdAt: string;
  attempts: number;
  avgScore: number;
  isModular?: boolean;
  moduleCount?: number;
}

const Tests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [tests, setTests] = useState<LocalTest[]>([]);

  // Load tests from storage
  const loadTests = () => {
    // Load modular tests from storage (no sample tests)
    const modularTests = modularTestStorage.getAll();
    const convertedModularTests = modularTests.map(convertModularTestForDisplay);

    setTests(convertedModularTests);
  };

  // Load tests from storage on component mount
  useEffect(() => {
    loadTests();
  }, []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Apply filters
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === '' || subjectFilter === 'all' || test.subject === subjectFilter;
    const matchesDifficulty = difficultyFilter === '' || difficultyFilter === 'all' || test.difficulty === difficultyFilter;
    const matchesPlan = planFilter === '' || planFilter === 'all' || test.plan === planFilter;
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || test.status === statusFilter;
    
    // Module filter logic
    let matchesModule = true;
    if (moduleFilter && moduleFilter !== 'all') {
      if (moduleFilter === 'modular') {
        matchesModule = test.isModular === true;
      } else if (moduleFilter === 'single') {
        matchesModule = !test.isModular || test.isModular === false;
      }
    }
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesModule && matchesPlan && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('');
    setDifficultyFilter('');
    setModuleFilter('');
    setPlanFilter('');
    setStatusFilter('');
  };

  const handleEditTest = (testId: number) => {
    navigate(`/admin/edit-test/${testId}`);
  };

  const handleViewTest = (testId: number) => {
    toast({
      title: "View Test",
      description: `Viewing test ID: ${testId}`,
    });
  };

  const handleDeleteTest = (testId: number) => {
    try {
      // Delete from modular test storage
      modularTestStorage.delete(testId.toString());
      
      // Update local state
      setTests(tests.filter(test => test.id !== testId));
      
      toast({
        title: "Test Deleted",
        description: "Test has been deleted successfully",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting test:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete test. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = (testId: number) => {
    try {
      const testIdString = testId.toString();
      const modularTest = modularTestStorage.getById(testIdString);
      
      if (modularTest) {
        // Update the status in storage
        const newStatus = modularTest.status === 'Active' ? 'Draft' : 'Active';
        modularTestStorage.update(testIdString, { status: newStatus });
        
        // Update local state
        setTests(tests.map(test => 
          test.id === testId 
            ? { ...test, status: newStatus }
            : test
        ));
        
        console.log(`Test ${testId} status changed to ${newStatus}`);
        
        toast({
          title: "Status Updated",
          description: `Test status changed to ${newStatus}`,
        });
      } else {
        throw new Error('Test not found');
      }
    } catch (error) {
      console.error('Error toggling test status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update test status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col gap-4">
        <TestsHeader />

        {/* Analytics Overview */}
        <TestAnalytics tests={tests} />

        {/* Filters */}
        <TestFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          difficultyFilter={difficultyFilter}
          onDifficultyFilterChange={setDifficultyFilter}
          moduleFilter={moduleFilter}
          onModuleFilterChange={setModuleFilter}
          planFilter={planFilter}
          onPlanFilterChange={setPlanFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={clearFilters}
        />

        {/* Tests Table */}
        <TestsTable
          tests={filteredTests}
          onEdit={handleEditTest}
          onView={handleViewTest}
          onDelete={handleDeleteTest}
          onToggleStatus={handleToggleStatus}
          onRefresh={loadTests}
        />
      </div>
    </div>
  );
};

export default Tests;
