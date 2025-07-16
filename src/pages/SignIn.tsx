
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { authService } from '@/services/supabase/authService';

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }
        
        const { error } = await authService.signUp(formData.email, formData.password, formData.name);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account, then sign in.",
        });
        setIsSignUp(false);
      } else {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome!",
          description: "You have been signed in successfully.",
        });
        
        // Redirect based on user role or intended destination
        if (formData.email.includes('admin')) {
          navigate('/admin');
        } else if (from !== '/') {
          navigate(from);
        } else {
          navigate('/student');
        }
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-blue-200 mx-auto mb-4">
            <img 
              src="/lovable-uploads/b1fbfea2-d357-4112-a088-f0785f52bf6e.png" 
              alt="Number Nerd Academy Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display font-bold text-3xl text-gray-900">Number Nerd Academy</h1>
          <p className="text-blue-600 font-medium">Master Math • Ace Your Tests</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-gray-600">
              {isSignUp ? 'Start your math journey today' : 'Sign in to continue your preparation'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                    required={isSignUp}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use admin@example.com for admin access or student@example.com for student access
                </p>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
              
              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirm your password"
                    required={isSignUp}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-primary font-semibold hover:text-primary-600 transition-colors"
                  disabled={isLoading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-all duration-200"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                Continue as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
