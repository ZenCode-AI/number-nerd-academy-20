
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react';

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
}

interface TestAnalyticsProps {
  tests: LocalTest[];
}

const TestAnalytics = ({ tests }: TestAnalyticsProps) => {
  const totalTests = tests.length;
  const activeTests = tests.filter(test => test.status === 'Active').length;
  const totalAttempts = tests.reduce((sum, test) => sum + test.attempts, 0);
  const avgScore = tests.length > 0 
    ? tests.reduce((sum, test) => sum + (test.avgScore * test.attempts), 0) / Math.max(totalAttempts, 1)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTests}</div>
          <p className="text-xs text-muted-foreground">
            {activeTests} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAttempts}</div>
          <p className="text-xs text-muted-foreground">
            Across all tests
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(avgScore)}%</div>
          <p className="text-xs text-muted-foreground">
            Overall performance
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {tests.length > 0 ? Math.round(tests.reduce((sum, test) => sum + test.duration, 0) / tests.length) : 0}m
          </div>
          <p className="text-xs text-muted-foreground">
            Per test
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAnalytics;
