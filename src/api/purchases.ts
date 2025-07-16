
import { apiClient } from './client';
import { UserPurchase } from '@/models/UserPurchase';
import { ApiResponse } from './types';
import { userPurchaseService, UserPurchase as ServiceUserPurchase } from '@/services/userPurchaseService';

export interface PurchaseRequest {
  testId: string;
  amount: number;
  currency: string;
}

export const purchasesAPI = {
  // Process purchase
  async purchaseTest(userId: string, purchaseData: PurchaseRequest): Promise<ApiResponse<UserPurchase>> {
    // Simulate purchase process
    const servicePurchase: Omit<ServiceUserPurchase, '_id'> = {
      userId,
      testId: purchaseData.testId,
      purchaseType: 'test',
      price: purchaseData.amount,
      status: 'completed',
      purchasedAt: new Date().toISOString()
    };

    await userPurchaseService.addPurchase(servicePurchase);
    
    const purchase: UserPurchase = {
      _id: Date.now().toString(),
      userId,
      testId: purchaseData.testId,
      purchaseDate: new Date(),
      amount: purchaseData.amount,
      currency: purchaseData.currency,
      status: 'completed',
      transactionId: `txn_${Date.now()}`
    };
    userPurchaseService.grantTestAccess(userId, purchaseData.testId, 'purchased');

    return {
      data: purchase,
      success: true,
      message: 'Purchase completed successfully',
    };
  },

  // Get user purchases
  async getUserPurchases(userId: string): Promise<ApiResponse<UserPurchase[]>> {
    const servicePurchases = await userPurchaseService.getUserPurchases(userId);
    
    // Convert service purchases to API format
    const purchases: UserPurchase[] = servicePurchases.map(sp => ({
      _id: sp._id,
      userId: sp.userId,
      testId: sp.testId,
      purchaseDate: new Date(sp.purchasedAt),
      amount: sp.price || 0,
      currency: 'USD',
      status: sp.status as any,
      transactionId: `txn_${sp._id}`
    }));
    
    return {
      data: purchases,
      success: true,
    };
  },

  // Get purchase details
  async getPurchaseDetails(purchaseId: string): Promise<ApiResponse<UserPurchase>> {
    // Mock implementation
    const servicePurchases = await userPurchaseService.getUserPurchases('');
    const servicePurchase = servicePurchases.find(p => p._id === purchaseId);
    
    if (!servicePurchase) {
      throw new Error('Purchase not found');
    }

    const purchase: UserPurchase = {
      _id: servicePurchase._id,
      userId: servicePurchase.userId,
      testId: servicePurchase.testId,
      purchaseDate: new Date(servicePurchase.purchasedAt),
      amount: servicePurchase.price || 0,
      currency: 'USD',
      status: servicePurchase.status as any,
      transactionId: `txn_${servicePurchase._id}`
    };

    return {
      data: purchase,
      success: true,
    };
  },
};
