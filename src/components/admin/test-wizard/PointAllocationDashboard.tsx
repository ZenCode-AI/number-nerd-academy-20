
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { TestModule } from '@/types/modularTest';
import { getModulePointStatus } from '@/utils/testValidation';

interface PointAllocationDashboardProps {
  module: TestModule;
}

const PointAllocationDashboard: React.FC<PointAllocationDashboardProps> = ({ module }) => {
  const pointStatus = getModulePointStatus(module);
  
  const questionTypes = [
    { key: 'mcq', label: 'MCQ', color: 'blue' },
    { key: 'numeric', label: 'Numeric', color: 'green' },
    { key: 'image', label: 'Image', color: 'purple' },
    { key: 'passage', label: 'Passage', color: 'orange' }
  ] as const;

  const getStatusIcon = (used: number, available: number) => {
    if (available === 0) return null;
    if (used === available) return <CheckCircle className="h-3 w-3 text-green-500" />;
    if (used > available) return <AlertCircle className="h-3 w-3 text-red-500" />;
    return <Info className="h-3 w-3 text-blue-500" />;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Point Allocation</CardTitle>
        <p className="text-xs text-gray-600">Track points used vs. available</p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {questionTypes.map(({ key, label }) => {
          const status = pointStatus[key];
          if (status.available === 0) return null;

          const percentage = status.available > 0 ? Math.min((status.used / status.available) * 100, 100) : 0;
          const isOverAllocated = status.used > status.available;
          const isComplete = status.used === status.available;

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-xs">{label}</span>
                  {getStatusIcon(status.used, status.available)}
                </div>
                <Badge 
                  variant={isOverAllocated ? 'destructive' : isComplete ? 'default' : 'outline'}
                  className="text-xs h-4 px-1"
                >
                  {status.used}/{status.available}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={percentage} 
                  className="h-1"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Used: {status.used}</span>
                  <span>Remaining: {status.remaining}</span>
                </div>
              </div>

              {isOverAllocated && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle className="h-2 w-2" />
                  Over by {status.used - status.available}
                </div>
              )}
            </div>
          );
        })}

        <div className="border-t pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-xs">Total Points</span>
            <Badge variant="outline" className="text-xs h-4 px-1">
              {Object.values(pointStatus).reduce((sum, status) => sum + status.used, 0)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointAllocationDashboard;
