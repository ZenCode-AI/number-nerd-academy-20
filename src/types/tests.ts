
export interface BaseTest {
  id: string;
  name: string;
  description: string;
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  status: 'Draft' | 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface TestAccess {
  testId: string;
  hasAccess: boolean;
  accessType: 'free' | 'purchased' | 'subscription';
  expiryDate?: Date;
  purchaseDate?: Date;
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  completedAt: Date;
  status: 'completed' | 'in-progress' | 'abandoned';
}

export interface TestFilters {
  status?: string;
  subject?: string;
  difficulty?: string;
  plan?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
