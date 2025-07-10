
import React, { ReactNode } from 'react';
import { Container } from './Container';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className,
  containerSize = 'xl' 
}: PageLayoutProps) => {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <Container size={containerSize} className="py-6">
        {(title || subtitle || actions) && (
          <div className="flex items-center justify-between mb-6">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        )}
        {children}
      </Container>
    </div>
  );
};
