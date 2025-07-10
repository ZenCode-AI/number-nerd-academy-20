
// Export all models for easy importing
export * from './User';
export * from './Test';
export * from './TestAttempt';
export * from './AdaptiveTestConfig';
export * from './UserSubscription';

// Common types used across models
export interface BaseModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Database connection config (for your backend reference)
export interface DatabaseConfig {
  mongoUri: string;
  dbName: string;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    maxPoolSize: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
  };
}
