
import React from 'react';

interface FeatureListProps {
  features: string[];
  className?: string;
}

const FeatureList: React.FC<FeatureListProps> = ({ features, className = "space-y-2 mb-6" }) => {
  return (
    <ul className={className}>
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
          {feature}
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
