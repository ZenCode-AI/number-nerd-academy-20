
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/ui/PageLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { TestGrid } from '@/components/student/TestGrid';
import PurchaseDialog from '@/components/student/PurchaseDialog';
import { useTestManagement } from '@/hooks/useTestManagement';

const MyTests = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  
  const { tests: allTests, isLoading: allTestsLoading, refreshTests } = useTestManagement(false);
  const { tests: purchasedTests, isLoading: purchasedTestsLoading } = useTestManagement(true);

  console.log('MyTests - Current user:', user);
  console.log('MyTests - Auth loading:', authLoading);

  const handleStartTest = (testId: string, hasAccess: boolean) => {
    if (!hasAccess) return;
    navigate(`/student/test/${testId}`);
  };

  const handlePurchaseClick = (test: any) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setSelectedTest(test);
    setShowPurchaseDialog(true);
  };

  const handlePurchaseComplete = () => {
    refreshTests();
  };

  if (authLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-8 lg:py-12">
          <LoadingSpinner size="lg" text="Loading authentication..." />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <EmptyState
          icon={<BookOpen className="h-8 w-8 lg:h-12 lg:w-12" />}
          title="Please Log In"
          description="You need to be logged in to access your tests."
          action={{
            label: "Sign In",
            onClick: () => navigate('/signin')
          }}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="My Tests"
      subtitle="Access your available tests and track your progress"
    >
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 lg:mb-6">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All Tests</TabsTrigger>
          <TabsTrigger value="purchased" className="text-xs sm:text-sm">Purchased Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 lg:mt-6">
          {allTestsLoading ? (
            <div className="flex justify-center py-8 lg:py-12">
              <LoadingSpinner size="lg" text="Loading tests..." />
            </div>
          ) : allTests.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-8 w-8 lg:h-12 lg:w-12" />}
              title="No tests found"
              description="No tests are currently available for your plan."
            />
          ) : (
            <TestGrid
              tests={allTests}
              onStartTest={handleStartTest}
              onPurchaseTest={handlePurchaseClick}
            />
          )}
        </TabsContent>
        
        <TabsContent value="purchased" className="mt-4 lg:mt-6">
          {purchasedTestsLoading ? (
            <div className="flex justify-center py-8 lg:py-12">
              <LoadingSpinner size="lg" text="Loading purchased tests..." />
            </div>
          ) : purchasedTests.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-8 w-8 lg:h-12 lg:w-12" />}
              title="No purchased tests"
              description="You haven't purchased any tests yet."
            />
          ) : (
            <TestGrid
              tests={purchasedTests}
              onStartTest={handleStartTest}
              onPurchaseTest={handlePurchaseClick}
            />
          )}
        </TabsContent>
      </Tabs>

      {selectedTest && (
        <PurchaseDialog
          isOpen={showPurchaseDialog}
          onClose={() => setShowPurchaseDialog(false)}
          test={selectedTest}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </PageLayout>
  );
};

export default MyTests;
