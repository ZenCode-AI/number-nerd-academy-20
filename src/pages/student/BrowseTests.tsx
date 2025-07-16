import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Filter, Play, Lock, Crown, ShoppingCart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { modularTestStorage, convertModularTestForDisplay } from '@/services/modularTestStorage';
import { userService } from '@/services/userService';
import { userPurchaseService } from '@/services/userPurchaseService';
import PurchaseDialog from '@/components/student/PurchaseDialog';
import { TestGrid } from '@/components/student/TestGrid';

const BrowseTests = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');
  const [adminTests, setAdminTests] = useState<any[]>([]);
  const [filteredTests, setFilteredTests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [counts, setCounts] = useState({ free: 0, purchased: 0, total: 0 });

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Load admin-created tests
  useEffect(() => {
    const loadAdminTests = async () => {
      const modularTests = await modularTestStorage.getAll();
      const convertedTests = modularTests
        .filter(test => test.status === 'Active')
        .map(test => convertModularTestForDisplay(test));
      setAdminTests(convertedTests);
    };

    loadAdminTests();
  }, []);

  // Update filtered tests when filters change
  useEffect(() => {
    const updateFilteredTests = async () => {
      let filtered = adminTests.filter(test => {
        const subjectMatch = selectedSubject === 'all' || test.subject === selectedSubject;
        const difficultyMatch = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
        const moduleMatch = selectedModule === 'all' || 
                           test.moduleCount?.toString() === selectedModule;
        
        return subjectMatch && difficultyMatch && moduleMatch;
      });

      // Add access information
      if (currentUser) {
        for (let test of filtered) {
          test.hasAccess = await userPurchaseService.hasTestAccess(currentUser.id, test.id, test.plan);
          test.isPurchased = test.plan !== 'Free' && test.hasAccess;
        }
      } else {
        filtered = filtered.map(test => ({
          ...test,
          hasAccess: test.plan === 'Free',
          isPurchased: false
        }));
      }

      // Apply tab filter
      if (activeTab === 'free') {
        filtered = filtered.filter(test => test.plan === 'Free');
      } else if (activeTab === 'purchased') {
        filtered = filtered.filter(test => test.isPurchased);
      }

      setFilteredTests(filtered);
    };

    updateFilteredTests();
  }, [adminTests, selectedSubject, selectedDifficulty, selectedModule, activeTab, currentUser]);

  // Update counts when tests change
  useEffect(() => {
    const updateCounts = async () => {
      const freeTests = adminTests.filter(test => test.plan === 'Free').length;
      let purchasedTests = 0;
      
      if (currentUser) {
        for (let test of adminTests) {
          if (test.plan !== 'Free' && await userPurchaseService.hasTestAccess(currentUser.id, test.id, test.plan)) {
            purchasedTests++;
          }
        }
      }
      
      setCounts({ 
        free: freeTests, 
        purchased: purchasedTests, 
        total: adminTests.length 
      });
    };

    updateCounts();
  }, [adminTests, currentUser]);

  const handleStartTest = (testId: string, hasAccess: boolean) => {
    if (!hasAccess) {
      return;
    }
    navigate(`/student/test/${testId}`);
  };

  const handlePurchaseClick = (test: any) => {
    setSelectedTest(test);
    setShowPurchaseDialog(true);
  };

  const handlePurchaseComplete = async () => {
    const modularTests = await modularTestStorage.getAll();
    const convertedTests = modularTests
      .filter(test => test.status === 'Active')
      .map(test => convertModularTestForDisplay(test));
    setAdminTests(convertedTests);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Tests</h1>
          <p className="text-gray-600">Explore all available tests across different subjects and modules</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>{counts.total} tests available</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            All Tests ({counts.total})
          </TabsTrigger>
          <TabsTrigger value="free" className="flex items-center gap-2">
            Free Tests ({counts.free})
          </TabsTrigger>
          <TabsTrigger value="purchased" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Purchased ({counts.purchased})
          </TabsTrigger>
        </TabsList>

        {/* Legacy Filters - kept for backward compatibility but simplified */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Quick Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Math">Math</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Modules</label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="1">1 Module</SelectItem>
                    <SelectItem value="2">2 Modules</SelectItem>
                    <SelectItem value="3">3 Modules</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedSubject('all');
                    setSelectedDifficulty('all');
                    setSelectedModule('all');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="all" className="space-y-6">
          <TestGrid 
            tests={filteredTests} 
            onStartTest={handleStartTest} 
            onPurchaseTest={handlePurchaseClick}
            showFilters={true}
          />
        </TabsContent>

        <TabsContent value="free" className="space-y-6">
          <TestGrid 
            tests={filteredTests} 
            onStartTest={handleStartTest} 
            onPurchaseTest={handlePurchaseClick}
            showFilters={true}
          />
        </TabsContent>

        <TabsContent value="purchased" className="space-y-6">
          <TestGrid 
            tests={filteredTests} 
            onStartTest={handleStartTest} 
            onPurchaseTest={handlePurchaseClick}
            showFilters={true}
          />
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
    </div>
  );
};

export default BrowseTests;