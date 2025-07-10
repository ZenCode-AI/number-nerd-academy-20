
// MongoDB UserSubscription Model Schema
export interface UserSubscription {
  _id: string;
  userId: string;
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  billing: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: {
    type: 'paypal' | 'stripe' | 'bank';
    paypalSubscriptionId?: string;
    stripeSubscriptionId?: string;
    lastFour?: string; // For card payments
  };
  pricing: {
    amount: number;
    currency: string;
    discount?: {
      code: string;
      percentage: number;
      validUntil: Date;
    };
  };
  features: {
    maxTests: number;
    videoSolutions: boolean;
    writtenSolutions: boolean;
    progressTracker: boolean;
    prioritySupport: boolean;
    adaptiveTesting: boolean;
  };
  usage: {
    testsCompleted: number;
    lastTestDate?: Date;
    monthlyTestCount: number;
    resetDate: Date; // Monthly reset for test count
  };
  createdAt: Date;
  updatedAt: Date;
}

// MongoDB Schema (for reference)
export const UserSubscriptionSchema = {
  userId: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['Free', 'Basic', 'Standard', 'Premium'], required: true },
  billing: { type: String, enum: ['monthly', 'annual'] },
  status: { type: String, enum: ['active', 'cancelled', 'expired', 'pending'], default: 'active' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  autoRenew: { type: Boolean, default: true },
  paymentMethod: {
    type: { type: String, enum: ['paypal', 'stripe', 'bank'] },
    paypalSubscriptionId: String,
    stripeSubscriptionId: String,
    lastFour: String
  },
  pricing: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    discount: {
      code: String,
      percentage: Number,
      validUntil: Date
    }
  },
  features: {
    maxTests: { type: Number, default: -1 }, // -1 for unlimited
    videoSolutions: { type: Boolean, default: false },
    writtenSolutions: { type: Boolean, default: false },
    progressTracker: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    adaptiveTesting: { type: Boolean, default: false }
  },
  usage: {
    testsCompleted: { type: Number, default: 0 },
    lastTestDate: Date,
    monthlyTestCount: { type: Number, default: 0 },
    resetDate: { type: Date, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};
