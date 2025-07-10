
import React from 'react';
import { centerText, headingStyles, maxWidthContent } from '@/utils/styles';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  description, 
  className = "mb-16" 
}) => {
  return (
    <div className={`${centerText} ${className}`}>
      <h2 className={headingStyles.primary}>{title}</h2>
      {description && (
        <p className={`${headingStyles.secondary} ${maxWidthContent}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
