
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';

interface HelpSection {
  title: string;
  content: string;
  type?: 'info' | 'tip' | 'warning';
  icon?: React.ReactNode;
}

interface HelpPanelProps {
  title: string;
  sections: HelpSection[];
  defaultOpen?: boolean;
  className?: string;
}

const HelpPanel = ({ title, sections, defaultOpen = false, className }: HelpPanelProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getIconAndColor = (type: HelpSection['type']) => {
    switch (type) {
      case 'tip':
        return { icon: <Lightbulb className="h-4 w-4" />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
      case 'warning':
        return { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
      default:
        return { icon: <HelpCircle className="h-4 w-4" />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    }
  };

  return (
    <Card className={`border-l-4 border-l-blue-500 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                {title}
              </CardTitle>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 space-y-3">
            {sections.map((section, index) => {
              const { icon, color, bg } = getIconAndColor(section.type);
              return (
                <div key={index} className={`p-3 rounded-md border ${bg}`}>
                  <div className="flex items-start gap-2">
                    <div className={color}>
                      {section.icon || icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium text-sm ${color} mb-1`}>
                        {section.title}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default HelpPanel;
