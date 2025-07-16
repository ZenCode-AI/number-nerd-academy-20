
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Play, 
  Star,
  CheckCircle,
  ArrowRight,
  Target,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { modularTestStorage, convertModularTestForDisplay } from '@/services/modularTestStorage';
import { userPurchaseService } from '@/services/userPurchaseService';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    totalTime: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    // Load available tests
    const modularTests = await modularTestStorage.getAll();
    const availableTests = modularTests
      .filter(test => test.status === 'Active')
      .map(test => {
        const displayTest = convertModularTestForDisplay(test);
        return {
          ...displayTest,
          hasAccess: userPurchaseService.hasTestAccess(user!.id, test.id, test.plan),
          isPurchased: test.plan !== 'Free' && userPurchaseService.hasTestAccess(user!.id, test.id, test.plan)
        };
      })
      .slice(0, 4);

    setRecentTests(availableTests);

    // Calculate stats
    const totalTests = modularTests.filter(test => test.status === 'Active').length;
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    const userAttempts = attempts.filter((attempt: any) => attempt.userId === user!.id);
    const completedTests = new Set(userAttempts.map((attempt: any) => attempt.testId)).size;
    const totalScore = userAttempts.reduce((sum: number, attempt: any) => sum + (attempt.score || 0), 0);
    const averageScore = userAttempts.length > 0 ? Math.round(totalScore / userAttempts.length) : 0;
    const totalTime = userAttempts.reduce((sum: number, attempt: any) => sum + (attempt.timeSpent || 0), 0);

    setStats({
      totalTests,
      completedTests,
      averageScore,
      totalTime: Math.round(totalTime / 60)
    });
  };

  const getTestScore = (testId: string) => {
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    const testAttempts = attempts.filter((attempt: any) => 
      attempt.testId === testId && attempt.userId === user!.id
    );
    if (testAttempts.length === 0) return null;
    
    const bestScore = Math.max(...testAttempts.map((attempt: any) => attempt.score || 0));
    return bestScore;
  };

  const handleStartTest = (testId: string) => {
    navigate(`/student/test/${testId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-blue-100">Ready to continue your learning journey? Let's achieve your goals together.</p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold">{stats.totalTests}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completedTests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Time</p>
                <p className="text-2xl font-bold">{stats.totalTime}min</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Tests</CardTitle>
            <Button variant="outline" onClick={() => navigate('/student/browse')}>
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentTests.map((test) => {
              const bestScore = getTestScore(test.id);
              const hasAttempted = bestScore !== null;
              
              return (
                <Card key={test.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      {hasAttempted && (
                        <Badge variant="outline">
                          <Star className="h-3 w-3 mr-1" />
                          {bestScore}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{test.plan}</Badge>
                      <Badge variant="outline">{test.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{test.duration} min</span>
                      <span>{test.questions} questions</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleStartTest(test.id)}
                      className="w-full"
                      disabled={!test.hasAccess}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {hasAttempted ? 'Retake Test' : 'Start Test'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
