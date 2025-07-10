
export interface UserPurchase {
  _id: string;
  userId: string;
  testId: string;
  purchaseDate: Date;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded';
  transactionId: string;
}

export interface UserTestAccess {
  userId: string;
  testId: string;
  hasAccess: boolean;
  accessType: 'free' | 'purchased' | 'subscription';
  expiryDate?: Date;
}
