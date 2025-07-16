
import { apiClient } from '../client';
import { ModularTest } from '@/types/modularTest';
import { ApiResponse } from '../types';
import { modularTestStorage, convertModularTestForDisplay } from '@/services/modularTestStorage';
import { userPurchaseService } from '@/services/userPurchaseService';

export interface TestAccess {
  testId: string;
  hasAccess: boolean;
  accessType: 'free' | 'purchased' | 'subscription';
  expiryDate?: Date;
}

export const studentTestsAPI = {
  // Get available tests for student
  async getAvailableTests(userId: string): Promise<ApiResponse<any[]>> {
    const modularTests = await modularTestStorage.getAll();
    const activeTests = modularTests.filter(test => test.status === 'Active');
    const convertedTests = activeTests.map(test => {
      const displayTest = convertModularTestForDisplay(test);
      return {
        ...displayTest,
        hasAccess: userPurchaseService.hasTestAccess(userId, test.id, test.plan),
        isPurchased: test.plan !== 'Free' && userPurchaseService.hasTestAccess(userId, test.id, test.plan),
      };
    });

    return {
      data: convertedTests,
      success: true,
    };
  },

  // Get purchased tests for student
  async getPurchasedTests(userId: string): Promise<ApiResponse<any[]>> {
    const modularTests = await modularTestStorage.getAll();
    const activeTests = modularTests.filter(test => test.status === 'Active');
    const purchasedTests = activeTests
      .map(test => convertModularTestForDisplay(test))
      .filter(test => 
        test.plan !== 'Free' && 
        userPurchaseService.hasTestAccess(userId, test.id.toString(), test.plan)
      );

    return {
      data: purchasedTests,
      success: true,
    };
  },

  // Get test details
  async getTestDetails(testId: string): Promise<ApiResponse<ModularTest>> {
    const test = await modularTestStorage.getById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    return {
      data: test,
      success: true,
    };
  },

  // Check test access
  async checkTestAccess(userId: string, testId: string): Promise<ApiResponse<TestAccess>> {
    const test = await modularTestStorage.getById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const hasAccess = await userPurchaseService.hasTestAccess(userId, testId, test.plan);
    
    return {
      data: {
        testId,
        hasAccess,
        accessType: test.plan === 'Free' ? 'free' : 'purchased',
      },
      success: true,
    };
  },
};
