// Handle concurrent operations and data conflicts
import { ErrorReporter, createError } from './errorHandling';

export class ConcurrencyHandler {
  private static lockMap = new Map<string, Promise<any>>();
  private static versionMap = new Map<string, number>();
  
  // Prevent concurrent operations on the same resource
  static async withLock<T>(
    resourceId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const lockKey = `lock:${resourceId}`;
    
    // If there's already an operation in progress, wait for it
    if (this.lockMap.has(lockKey)) {
      await this.lockMap.get(lockKey);
    }
    
    // Create new lock
    const lockPromise = this.performLockedOperation(resourceId, operation);
    this.lockMap.set(lockKey, lockPromise);
    
    try {
      const result = await lockPromise;
      return result;
    } finally {
      this.lockMap.delete(lockKey);
    }
  }
  
  private static async performLockedOperation<T>(
    resourceId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      ErrorReporter.report(createError(
        'CONCURRENCY_ERROR',
        `Failed operation on resource: ${resourceId}`,
        error,
        'CONCURRENCY'
      ));
      throw error;
    }
  }
  
  // Optimistic locking with version control
  static checkVersion(resourceId: string, expectedVersion: number): boolean {
    const currentVersion = this.versionMap.get(resourceId) || 0;
    return currentVersion === expectedVersion;
  }
  
  static updateVersion(resourceId: string): number {
    const currentVersion = this.versionMap.get(resourceId) || 0;
    const newVersion = currentVersion + 1;
    this.versionMap.set(resourceId, newVersion);
    return newVersion;
  }
  
  static getVersion(resourceId: string): number {
    return this.versionMap.get(resourceId) || 0;
  }
  
  // Handle conflicting updates
  static async resolveConflict<T>(
    resourceId: string,
    localData: T,
    serverData: T,
    resolver: (local: T, server: T) => T
  ): Promise<T> {
    try {
      const resolved = resolver(localData, serverData);
      this.updateVersion(resourceId);
      return resolved;
    } catch (error) {
      ErrorReporter.report(createError(
        'CONFLICT_RESOLUTION_ERROR',
        `Failed to resolve conflict for resource: ${resourceId}`,
        { localData, serverData, error },
        'CONCURRENCY'
      ));
      throw error;
    }
  }
  
  // Debounce function for rapid operations
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }
  
  // Throttle function for rate limiting
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let isThrottled = false;
    
    return (...args: Parameters<T>) => {
      if (isThrottled) return;
      
      func(...args);
      isThrottled = true;
      
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    };
  }
}