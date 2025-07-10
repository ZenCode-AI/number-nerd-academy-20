
# MongoDB Models for Number Nerd Academy

This folder contains TypeScript interfaces and MongoDB schema definitions for the Number Nerd Academy application.

## Models Overview

### 1. User (`User.ts`)
- User authentication and profile information
- Payment history and subscription details
- User preferences and settings
- Role-based access (student/admin)

### 2. Test (`Test.ts`)
- Test structure and content
- Questions with different types (MCQ, Numeric, Image, Paragraph)
- English passages for reading comprehension
- Adaptive testing configuration

### 3. TestAttempt (`TestAttempt.ts`)
- User test attempts and results
- Answer tracking and analytics
- Performance metrics and feedback
- Time tracking per question

### 4. AdaptiveTestConfig (`AdaptiveTestConfig.ts`)
- Configuration for adaptive testing modules
- Module progression rules and thresholds
- Analytics for adaptive test performance

### 5. UserSubscription (`UserSubscription.ts`)
- Subscription management and billing
- Plan features and limitations
- Usage tracking and limits
- Payment method information

## Backend Implementation Notes

### Database Setup
```javascript
// MongoDB connection example
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

### API Endpoints Structure
```
/api/auth
  POST /register - User registration
  POST /login - User login
  POST /logout - User logout
  GET /profile - Get user profile
  PUT /profile - Update user profile

/api/tests
  GET / - Get available tests (filtered by user plan)
  GET /:id - Get specific test
  POST /:id/attempt - Start test attempt
  PUT /attempt/:id - Update test attempt
  POST /attempt/:id/submit - Submit test attempt

/api/payments
  POST /create-order - Create PayPal order
  POST /capture-order - Capture PayPal payment
  GET /subscription - Get user subscription
  POST /cancel-subscription - Cancel subscription

/api/admin
  GET /users - Get all users
  GET /tests - Get all tests
  POST /tests - Create new test
  PUT /tests/:id - Update test
  DELETE /tests/:id - Delete test
  GET /analytics - Get system analytics
```

### Required Environment Variables
```
MONGODB_URI=mongodb://localhost:27017/number-nerd-academy
JWT_SECRET=your-jwt-secret
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENVIRONMENT=sandbox # or live
```

### Recommended Packages
```json
{
  "mongoose": "^7.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "express": "^4.18.0",
  "cors": "^2.8.5",
  "helmet": "^6.0.0",
  "express-rate-limit": "^6.7.0",
  "paypal-rest-sdk": "^1.8.1"
}
```

## Security Considerations
- Always hash passwords using bcrypt
- Use JWT tokens for authentication
- Implement rate limiting on API endpoints
- Validate and sanitize all user inputs
- Use HTTPS in production
- Store sensitive data in environment variables
