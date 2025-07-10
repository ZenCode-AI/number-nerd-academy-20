
import { apiClient } from './client';
import { UserPurchase } from '@/models/UserPurchase';
import { ApiResponse } from './types';
import { userPurchaseService } from '@/services/userPurchaseService';

export interface PurchaseRequest {
  testId: string;
  amount: number;
  currency: string;
}

export const purchasesAPI = {
  // Process purchase
  async purchaseTest(userId: string, purchaseData: PurchaseRequest): Promise<ApiResponse<UserPurchase>> {
    // Simulate purchase process
    const purchase: Omit<UserPurchase, '_id'> = {
      userId,
      testId: purchaseData.testId,
      purchaseDate: new Date(),
      amount: purchaseData.amount,
      currency: purchaseData.currency,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
    };

    userPurchaseService.addPurchase(purchase);
    userPurchaseService.grantTestAccess(userId, purchaseData.testId, 'purchased');

    return {
      data: { ...purchase, _id: Date.now().toString() },
      success: true,
      message: 'Purchase completed successfully',
    };
  },

  // Get user purchases
  async getUserPurchases(userId: string): Promise<ApiResponse<UserPurchase[]>> {
    const purchases = userPurchaseService.getUserPurchases(userId);
    
    return {
      data: purchases,
      success: true,
    };
  },

  // Get purchase details
  async getPurchaseDetails(purchaseId: string): Promise<ApiResponse<UserPurchase>> {
    // Mock implementation
    const purchases = userPurchaseService.getUserPurchases('');
    const purchase = purchases.find(p => p._id === purchaseId);
    
    if (!purchase) {
      throw new Error('Purchase not found');
    }

    return {
      data: purchase,
      success: true,
    };
  },
};
