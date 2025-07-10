
// MongoDB AdaptiveTestConfig Model Schema
export interface AdaptiveTestConfig {
  _id: string;
  name: string;
  subject: 'Math' | 'English';
  module1TestId: string; // Medium difficulty test
  module2TestId?: string; // Hard difficulty test  
  module3TestId?: string; // Easy difficulty test
  threshold: number; // Percentage to determine which module to show next
  isActive: boolean;
  description: string;
  createdBy: string; // Admin user ID
  createdAt: Date;
  updatedAt: Date;
  analytics: {
    totalAttempts: number;
    module1Attempts: number;
    module2Attempts: number;
    module3Attempts: number;
    averageProgression: number; // Average number of modules completed
  };
}

// MongoDB Schema (for reference)
export const AdaptiveTestConfigSchema = {
  name: { type: String, required: true },
  subject: { type: String, enum: ['Math', 'English'], required: true },
  module1TestId: { type: String, required: true },
  module2TestId: String,
  module3TestId: String,
  threshold: { type: Number, required: true, min: 0, max: 100 },
  isActive: { type: Boolean, default: true },
  description: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  analytics: {
    totalAttempts: { type: Number, default: 0 },
    module1Attempts: { type: Number, default: 0 },
    module2Attempts: { type: Number, default: 0 },
    module3Attempts: { type: Number, default: 0 },
    averageProgression: { type: Number, default: 0 }
  }
};
