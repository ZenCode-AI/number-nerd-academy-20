
import { useEffect, useState } from 'react';
import { useTestSet } from '@/contexts/TestSetContext';

export const useTestTimer = () => {
  const { currentModuleData, testSet, session } = useTestSet();
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Initialize timer with real admin-defined duration
  useEffect(() => {
    if (currentModuleData && testSet && session) {
      const currentModuleConfig = testSet.modules.find(m => m.moduleNumber === session.currentModule);
      const moduleDuration = currentModuleConfig?.duration || currentModuleData.duration;
      
      console.log('🕐 Timer: Setting real admin duration for module', session.currentModule, ':', moduleDuration, 'minutes');
      setTimeRemaining(moduleDuration * 60);
    }
  }, [currentModuleData, testSet, session]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  return timeRemaining;
};
