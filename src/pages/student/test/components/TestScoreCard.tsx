
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

interface TestScoreCardProps {
  score: number;
  maxScore: number;
  percentage: number;
}

const TestScoreCard = ({ score, maxScore, percentage }: TestScoreCardProps) => {
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (percentage >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 65) return 'D';
    return 'F';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding Performance!", color: "text-green-600" };
    if (percentage >= 80) return { message: "Great Job!", color: "text-blue-600" };
    if (percentage >= 70) return { message: "Good Work!", color: "text-yellow-600" };
    if (percentage >= 60) return { message: "Keep Practicing!", color: "text-orange-600" };
    return { message: "More Practice Needed", color: "text-red-600" };
  };

  const performance = getPerformanceMessage(percentage);
  const grade = getGrade(percentage);

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white h-full">
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Award className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-lg font-bold text-gray-900">Final Score</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {score}
            <span className="text-lg text-gray-500">/{maxScore}</span>
          </div>
          <Badge className={`text-lg px-3 py-1 border ${getGradeColor(percentage)}`}>
            {grade}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="text-2xl font-bold text-blue-600">
            {percentage}%
          </div>
          <Progress value={percentage} className="h-2" />
          <div className={`text-sm font-semibold ${percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
            {percentage >= 70 ? '✓ PASSED' : '✗ NOT PASSED'}
          </div>
        </div>

        <div className={`text-lg font-semibold ${performance.color} pt-2`}>
          {performance.message}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestScoreCard;
