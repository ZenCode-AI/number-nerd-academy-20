
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, Target, TrendingUp } from 'lucide-react';
import { TestModule } from '@/types/modularTest';

interface ScoreDashboardProps {
  modules: TestModule[];
  targetScore?: number;
}

const ScoreDashboard = ({ modules, targetScore }: ScoreDashboardProps) => {
  const calculateModuleScore = (module: TestModule) => {
    const { questionCounts, questionScores } = module;
    return (
      (questionCounts.mcq * questionScores.mcq) +
      (questionCounts.numeric * questionScores.numeric) +
      (questionCounts.image * questionScores.image) +
      (questionCounts.passage * questionScores.passage)
    );
  };

  const currentTotalScore = modules.reduce((total, module) => total + calculateModuleScore(module), 0);
  const targetToUse = targetScore || currentTotalScore || 100;
  const progressPercentage = Math.min((currentTotalScore / targetToUse) * 100, 100);
  const remainingPoints = Math.max(targetToUse - currentTotalScore, 0);

  const getScoreStatus = () => {
    if (currentTotalScore === 0) return { color: 'text-gray-500', status: 'Not Started' };
    if (remainingPoints > 0) return { color: 'text-blue-600', status: 'In Progress' };
    if (currentTotalScore === targetToUse) return { color: 'text-green-600', status: 'Target Met' };
    return { color: 'text-orange-600', status: 'Over Target' };
  };

  const scoreStatus = getScoreStatus();

  return (
    <div className="sticky top-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5" />
            Score Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Points</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{currentTotalScore}</span>
              {targetScore && <span className="text-sm text-gray-500">/ {targetScore}</span>}
            </div>
          </div>

          {targetScore && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Target</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <Badge variant="outline" className={scoreStatus.color}>
              {scoreStatus.status}
            </Badge>
          </div>

          {remainingPoints > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                {remainingPoints} points remaining
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {modules.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Module Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modules.map((module, index) => {
                const moduleScore = calculateModuleScore(module);
                const totalQuestions = Object.values(module.questionCounts).reduce((a, b) => a + b, 0);
                return (
                  <div key={module.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        <span className="text-sm font-medium truncate">{module.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{module.subject}</Badge>
                        <span className="text-xs text-gray-500">{totalQuestions} questions</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{moduleScore}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScoreDashboard;
