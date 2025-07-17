import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveData {
  timestamp: number;
  data: any;
}

export const useTestAutoSave = (testId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const getStorageKey = useCallback((id?: string) => {
    return `autosave_test_${id || 'new'}`;
  }, []);

  const saveToLocal = useCallback(async (testData: any, id?: string) => {
    try {
      setIsSaving(true);
      const storageKey = getStorageKey(id);
      const saveData: AutoSaveData = {
        timestamp: Date.now(),
        data: testData
      };
      
      localStorage.setItem(storageKey, JSON.stringify(saveData));
      setLastSaved(new Date());
      
      // Show subtle feedback
      toast({
        title: "Auto-saved",
        description: "Your progress has been saved locally",
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to auto-save:', error);
      toast({
        title: "Auto-save failed",
        description: "Unable to save progress locally",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  }, [getStorageKey, toast]);

  const loadFromLocal = useCallback((id?: string): any | null => {
    try {
      const storageKey = getStorageKey(id);
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const saveData: AutoSaveData = JSON.parse(saved);
        
        // Check if save is less than 24 hours old
        const isRecent = Date.now() - saveData.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          setLastSaved(new Date(saveData.timestamp));
          return saveData.data;
        } else {
          // Clean up old save
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Failed to load auto-save:', error);
    }
    
    return null;
  }, [getStorageKey]);

  const clearLocalSave = useCallback((id?: string) => {
    try {
      const storageKey = getStorageKey(id);
      localStorage.removeItem(storageKey);
      setLastSaved(null);
    } catch (error) {
      console.error('Failed to clear auto-save:', error);
    }
  }, [getStorageKey]);

  const hasLocalSave = useCallback((id?: string): boolean => {
    const saved = loadFromLocal(id);
    return saved !== null;
  }, [loadFromLocal]);

  // Debounced auto-save function
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      
      return (testData: any, id?: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          saveToLocal(testData, id);
        }, 2000); // Auto-save after 2 seconds of inactivity
      };
    })(),
    [saveToLocal]
  );

  return {
    isSaving,
    lastSaved,
    saveToLocal,
    loadFromLocal,
    clearLocalSave,
    hasLocalSave,
    debouncedSave
  };
};