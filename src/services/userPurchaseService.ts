// Legacy purchase service for backward compatibility
import { userService as supabaseUserService } from '@/services/supabase/userService';

export interface UserPurchase {
  _id: string;
  userId: string;
  testId: string;
  purchaseType: string;
  price?: number;
  status: string;
  purchasedAt: string;
}

export interface UserTestAccess {
  userId: string;
  testId: string;
  hasAccess: boolean;
  accessType: 'free' | 'purchased' | 'subscription';
}

export const userPurchaseService = {
  // Check if user has access to a test
  hasTestAccess: async (userId: string, testId: string, testPlan: string): Promise<boolean> => {
    console.log('Checking test access for:', { userId, testId, testPlan });
    
    // Free tests are always accessible
    if (testPlan === 'Free') {
      console.log('Free test, access granted');
      return true;
    }

    // Use Supabase service to check access
    return await supabaseUserService.hasTestAccess(testId);
  },

  // Get user's purchased tests
  getUserPurchases: async (userId: string): Promise<UserPurchase[]> => {
    // This would need to be implemented with Supabase queries
    // For now, return empty array
    return [];
  },

  // Add a purchase (simulate successful payment)
  addPurchase: async (purchase: Omit<UserPurchase, '_id'>): Promise<void> => {
    const { data, error } = await supabaseUserService.purchaseTest(
      purchase.testId,
      purchase.purchaseType,
      purchase.price
    );
    
    if (error) {
      throw new Error('Failed to process purchase');
    }
    
    console.log('Purchase added:', data);
  },

  // Grant test access to user
  grantTestAccess: (userId: string, testId: string, accessType: 'free' | 'purchased' | 'subscription'): void => {
    console.log('Test access granted:', { userId, testId, accessType });
    // This would be handled by Supabase RLS policies
  }
};