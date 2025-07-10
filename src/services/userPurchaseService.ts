
import { UserPurchase, UserTestAccess } from '@/models/UserPurchase';

const PURCHASES_KEY = 'nna_user_purchases';
const ACCESS_KEY = 'nna_user_access';

// Initialize from localStorage
const loadPurchases = (): UserPurchase[] => {
  try {
    const stored = localStorage.getItem(PURCHASES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load purchases:', error);
    return [];
  }
};

const savePurchases = (purchases: UserPurchase[]): void => {
  try {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
  } catch (error) {
    console.error('Failed to save purchases:', error);
  }
};

const loadAccess = (): UserTestAccess[] => {
  try {
    const stored = localStorage.getItem(ACCESS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load access:', error);
    return [];
  }
};

const saveAccess = (access: UserTestAccess[]): void => {
  try {
    localStorage.setItem(ACCESS_KEY, JSON.stringify(access));
  } catch (error) {
    console.error('Failed to save access:', error);
  }
};

export const userPurchaseService = {
  // Check if user has access to a test
  hasTestAccess: (userId: string, testId: string, testPlan: string): boolean => {
    console.log('Checking test access for:', { userId, testId, testPlan });
    
    // Free tests are always accessible
    if (testPlan === 'Free') {
      console.log('Free test, access granted');
      return true;
    }

    const purchases = loadPurchases();
    const access = loadAccess();

    console.log('Loaded purchases:', purchases.length);
    console.log('Loaded access records:', access.length);

    // Check if user has purchased this specific test
    const purchase = purchases.find(
      p => p.userId === userId && p.testId === testId && p.status === 'completed'
    );
    
    console.log('Purchase search result:', purchase);
    
    if (purchase) {
      console.log('Purchase found, access granted');
      return true;
    }

    // Check if user has subscription access
    const userAccess = access.find(
      a => a.userId === userId && a.testId === testId && a.hasAccess
    );

    console.log('Access search result:', userAccess);
    const hasAccess = userAccess ? true : false;
    console.log('Final access decision:', hasAccess);
    return hasAccess;
  },

  // Get user's purchased tests
  getUserPurchases: (userId: string): UserPurchase[] => {
    const purchases = loadPurchases();
    return purchases.filter(p => p.userId === userId && p.status === 'completed');
  },

  // Add a purchase (simulate successful payment)
  addPurchase: (purchase: Omit<UserPurchase, '_id'>): void => {
    const purchases = loadPurchases();
    const newPurchase: UserPurchase = {
      ...purchase,
      _id: Date.now().toString()
    };
    purchases.push(newPurchase);
    savePurchases(purchases);
    console.log('Purchase added:', newPurchase);
  },

  // Grant test access to user
  grantTestAccess: (userId: string, testId: string, accessType: 'free' | 'purchased' | 'subscription'): void => {
    const access = loadAccess();
    const existingAccessIndex = access.findIndex(a => a.userId === userId && a.testId === testId);
    
    if (existingAccessIndex >= 0) {
      access[existingAccessIndex].hasAccess = true;
      access[existingAccessIndex].accessType = accessType;
    } else {
      access.push({
        userId,
        testId,
        hasAccess: true,
        accessType
      });
    }
    
    saveAccess(access);
    console.log('Test access granted:', { userId, testId, accessType });
  }
};
