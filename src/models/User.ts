
// MongoDB User Model Schema
export interface User {
  _id: string;
  email: string;
  password: string; // hashed
  name: string;
  phone?: string;
  avatar?: string;
  role: 'student' | 'admin';
  plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
  planExpiry?: Date;
  paymentHistory: PaymentRecord[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  emailVerified: boolean;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };
}

export interface PaymentRecord {
  _id: string;
  transactionId: string;
  amount: number;
  currency: string;
  plan: string;
  billing: 'monthly' | 'annual';
  paymentMethod: 'paypal' | 'stripe' | 'bank';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paypalOrderId?: string;
  createdAt: Date;
}

// MongoDB Schema (for reference when creating in your backend)
export const UserSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  plan: { type: String, enum: ['Free', 'Basic', 'Standard', 'Premium'], default: 'Free' },
  planExpiry: { type: Date },
  paymentHistory: [{
    transactionId: String,
    amount: Number,
    currency: String,
    plan: String,
    billing: String,
    paymentMethod: String,
    status: String,
    paypalOrderId: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  preferences: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'en' }
  }
};
