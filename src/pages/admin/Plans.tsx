
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, CheckCircle, XCircle } from 'lucide-react';

const Plans = () => {
  const plans = [
    {
      id: 1,
      name: 'Free',
      price: 0,
      users: 1247,
      features: ['5 Practice Tests', 'Basic Analytics', 'Community Support'],
      testsIncluded: ['SAT Basic', 'GCSE Foundation'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Basic',
      price: 29,
      users: 834,
      features: ['15 Practice Tests', 'Detailed Analytics', 'Email Support', 'Progress Tracking'],
      testsIncluded: ['SAT Basic', 'SAT Intermediate', 'GCSE Foundation', 'GCSE Higher'],
      status: 'active'
    },
    {
      id: 3,
      name: 'Standard',
      price: 59,
      users: 456,
      features: ['50 Practice Tests', 'Advanced Analytics', 'Priority Support', 'Custom Study Plans'],
      testsIncluded: ['All SAT Tests', 'All GCSE Tests', 'A-Level Foundation'],
      status: 'active'
    },
    {
      id: 4,
      name: 'Premium',
      price: 99,
      users: 123,
      features: ['Unlimited Tests', 'AI-Powered Insights', '1-on-1 Support', 'Custom Mock Tests'],
      testsIncluded: ['All Tests', 'Custom Tests', 'Adaptive Testing', 'Premium Content'],
      status: 'active'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Plans Management</h1>
          <p className="text-sm md:text-base text-gray-600">Manage subscription plans and pricing</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          Create New Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg md:text-xl">{plan.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl md:text-3xl font-bold">${plan.price}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                </div>
                <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                  {plan.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 md:space-y-4">
              {/* User Count */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{plan.users} active users</span>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Features:</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tests Included */}
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Tests Included:</h4>
                <div className="flex flex-wrap gap-1">
                  {plan.testsIncluded.map((test, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {test}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 md:pt-4">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="px-2">
                  {plan.status === 'active' ? <XCircle className="h-3 w-3 md:h-4 md:w-4" /> : <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Plan Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">2,660</div>
              <div className="text-sm text-gray-600">Total Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600">$12,340</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">73%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plans;
