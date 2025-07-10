
import React from 'react';
import { Stat } from '@/types';

interface StatsGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  columns = 4, 
  className = "text-center" 
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3', 
    4: 'grid-cols-2 md:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index}>
          <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
          <div className="text-gray-600 text-xs">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
