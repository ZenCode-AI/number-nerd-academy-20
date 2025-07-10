
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TestBadgeProps {
  type: 'Free' | 'Premium';
  badge?: string | null;
}

const TestBadge: React.FC<TestBadgeProps> = ({ type, badge }) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <Badge 
        variant={type === 'Free' ? 'outline' : 'default'} 
        className={type === 'Free' ? 'text-green-600 border-green-600' : 'bg-primary text-white'}
      >
        {type}
      </Badge>
      {badge && (
        <Badge 
          variant={badge === 'Most Popular' ? 'default' : 'secondary'} 
          className="text-xs ml-2"
        >
          {badge}
        </Badge>
      )}
    </div>
  );
};

export default TestBadge;
