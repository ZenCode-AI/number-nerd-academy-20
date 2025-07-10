
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();

  const plans = [
    {
      name: 'FREE',
      description: 'Start your journey towards excellence today',
      price: { monthly: 0, annual: 0 },
      features: [
        'Personalized Feedback',
        'Priority Support',
        'Track Your Progress',
        'Comprehensive Coverage',
        'Adapted Test'
      ],
      popular: false,
      cta: 'Get Started Free',
      note: 'Start your journey towards excellence today with our Free Mock Test Plan and experience the difference it can make in your preparation!'
    },
    {
      name: 'BASIC',
      description: 'One-time submission with video solution',
      price: { monthly: 20, annual: 200 },
      features: [
        'Personalized Feedback',
        'Priority Support',
        'Track Your Progress',
        'Comprehensive Coverage',
        'Adapted Test',
        'View Tests'
      ],
      popular: false,
      cta: 'Start Basic Plan',
      note: 'One-time submission, 1 video solution, No progress tracker, No written solution.'
    },
    {
      name: 'STANDARD',
      description: 'Includes progress tracker',
      price: { monthly: 40, annual: 400 },
      features: [
        'Personalized Feedback',
        'Priority Support',
        'Track Your Progress',
        'Comprehensive Coverage',
        'Adapted Test',
        'View Tests'
      ],
      popular: true,
      cta: 'Start Standard Plan',
      note: 'One-time submission, 1 video solution, progress tracker, No written solution.'
    },
    {
      name: 'PREMIUM',
      description: 'Complete package with written solutions',
      price: { monthly: 60, annual: 600 },
      features: [
        'Personalized Feedback',
        'Priority Support',
        'Track Your Progress',
        'Comprehensive Coverage',
        'Adapted Test',
        'Written Solutions'
      ],
      popular: false,
      cta: 'Start Premium Plan',
      note: 'One-time submission, 1 video solution, progress tracker, written solution.'
    }
  ];

  const handlePlanClick = (plan: any) => {
    if (plan.price.monthly === 0) {
      // Free plan - redirect to sign up
      window.location.href = '/signin';
      return;
    }

    // Check if user is logged in (you would replace this with actual auth check)
    const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase a plan",
        variant: "destructive"
      });
      // Redirect to login with return URL
      window.location.href = `/signin?redirect=/payment&plan=${plan.name.toLowerCase()}&billing=${isAnnual ? 'annual' : 'monthly'}`;
      return;
    }

    // User is logged in, redirect to PayPal
    const amount = isAnnual ? plan.price.annual : plan.price.monthly;
    const billing = isAnnual ? 'annual' : 'monthly';
    
    // In a real app, you would generate a secure payment URL from your backend
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=your-paypal-email@example.com&item_name=${encodeURIComponent(plan.name + ' Plan - ' + billing)}&amount=${amount}&currency_code=USD&return=http://localhost:5173/student?payment=success&cancel_return=http://localhost:5173/?payment=cancelled`;
    
    toast({
      title: "Redirecting to PayPal",
      description: `Processing payment for ${plan.name} plan ($${amount})`,
    });

    // Redirect to PayPal after a short delay
    setTimeout(() => {
      window.location.href = paypalUrl;
    }, 1000);
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Flexible pricing options designed to fit your learning needs and budget
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-primary' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isAnnual ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${isAnnual ? 'text-primary' : 'text-gray-500'}`}>
              Annual 
              <Badge variant="secondary" className="ml-2 text-xs">Save 20%</Badge>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.popular ? 'ring-2 ring-primary scale-105' : 'hover:-translate-y-1'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-semibold">
                  Popular
                </div>
              )}
              
              <CardContent className={`p-6 ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="text-center mb-6">
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-500">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  
                  {isAnnual && plan.price.monthly > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Save ${(plan.price.monthly * 12) - plan.price.annual}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mb-6">
                  <p className="text-xs text-gray-500 italic">{plan.note}</p>
                </div>

                <Button 
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full font-semibold transition-colors duration-200 ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary-600 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include comprehensive mock tests and detailed feedback.</p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Compare All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
