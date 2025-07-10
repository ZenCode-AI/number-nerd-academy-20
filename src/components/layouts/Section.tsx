
import React from 'react';
import { containerStyles, sectionPadding } from '@/utils/styles';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  backgroundColor?: 'white' | 'gray' | 'primary';
  className?: string;
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  id, 
  backgroundColor = 'white',
  className = '' 
}) => {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-gradient-to-br from-primary-50 to-white'
  };

  return (
    <section 
      id={id} 
      className={`${sectionPadding} ${bgClasses[backgroundColor]} ${className}`}
    >
      <div className={containerStyles}>
        {children}
      </div>
    </section>
  );
};

export default Section;
