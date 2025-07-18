// Performance monitoring utilities
import { ErrorReporter, createError } from './errorHandling';

export class PerformanceMonitor {
  private static measurements = new Map<string, number>();
  private static thresholds = {
    pageLoad: 3000, // 3 seconds
    apiCall: 5000,  // 5 seconds
    render: 100,    // 100ms
  };
  
  static startMeasurement(name: string) {
    this.measurements.set(name, performance.now());
  }
  
  static endMeasurement(name: string, category: keyof typeof this.thresholds = 'render') {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No start measurement found for: ${name}`);
      return;
    }
    
    const duration = performance.now() - startTime;
    this.measurements.delete(name);
    
    // Check if performance is below threshold
    if (duration > this.thresholds[category]) {
      ErrorReporter.report(createError(
        'PERFORMANCE_SLOW',
        `Slow ${category}: ${name} took ${duration.toFixed(2)}ms`,
        { duration, threshold: this.thresholds[category] },
        'PERFORMANCE'
      ));
    }
    
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  static measureAsync<T>(
    name: string, 
    operation: () => Promise<T>,
    category: keyof typeof this.thresholds = 'apiCall'
  ): Promise<T> {
    this.startMeasurement(name);
    
    return operation().finally(() => {
      this.endMeasurement(name, category);
    });
  }
  
  static measureSync<T>(
    name: string,
    operation: () => T,
    category: keyof typeof this.thresholds = 'render'
  ): T {
    this.startMeasurement(name);
    
    try {
      return operation();
    } finally {
      this.endMeasurement(name, category);
    }
  }
  
  static getNavigationTiming() {
    if (!performance.getEntriesByType) return null;
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;
    
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: this.getFirstPaint(),
      largestContentfulPaint: this.getLargestContentfulPaint(),
    };
  }
  
  private static getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }
  
  private static getLargestContentfulPaint(): number | null {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry ? lastEntry.startTime : null);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Timeout after 10 seconds
      setTimeout(() => resolve(null), 10000);
    }) as any;
  }
  
  static logPageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = this.getNavigationTiming();
        if (timing) {
          console.log('Page Performance:', timing);
          
          // Report slow page loads
          if (timing.loadComplete > this.thresholds.pageLoad) {
            ErrorReporter.report(createError(
              'PERFORMANCE_SLOW_PAGE',
              `Slow page load: ${timing.loadComplete}ms`,
              timing,
              'PERFORMANCE'
            ));
          }
        }
      }, 0);
    });
  }
}