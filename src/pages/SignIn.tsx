
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { authService } from '@/services/supabase/authService';
import { emailService } from '@/services/supabase/emailService';
import { mapAuthError } from '@/utils/authErrorHandler';
import { Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
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
    setError(null);
    setSuccess(null);
    setNeedsEmailVerification(false);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          toast({
            title: "Password Mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }
        
        const result = await authService.signUp(formData.email, formData.password, formData.name);
        
        if (result?.user) {
          toast({
            title: "Success",
            description: "Account created successfully! Please check your email to verify your account.",
          });
          setIsSignUp(false);
        }
      } else {
        await login(formData.email, formData.password);
        
        setSuccess("Successfully signed in!");
        toast({
          title: "Signed in successfully!",
          description: "Welcome back to NNA.",
        });
        
        // Redirect admin users to admin dashboard
        if (formData.email.includes('admin')) {
          navigate('/admin');
        } else if (from !== '/') {
          navigate(from);
        } else {
          navigate('/student');
        }
      }
    } catch (error: any) {
      const errorInfo = mapAuthError(error);
      setError(errorInfo.message);
      
      // Check if it's an email verification issue
      if (error.message === 'Email not confirmed') {
        setNeedsEmailVerification(true);
      }
      
      toast({
        variant: "destructive",
        title: errorInfo.title,
        description: errorInfo.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const { error } = await emailService.resendConfirmation(formData.email);
      
      if (error) {
        const errorInfo = mapAuthError(error);
        toast({
          variant: "destructive",
          title: errorInfo.title,
          description: errorInfo.message,
        });
      } else {
        toast({
          title: "Verification email sent",
          description: "Please check your email for the verification link.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send verification email",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address first.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await emailService.resetPassword(formData.email);
      
      if (error) {
        const errorInfo = mapAuthError(error);
        toast({
          variant: "destructive",
          title: errorInfo.title,
          description: errorInfo.message,
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: "Please try again later.",
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
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            {needsEmailVerification && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Need help? 
                  <Button 
                    variant="link" 
                    className="p-0 ml-1 h-auto font-normal"
                    onClick={handleResendVerification}
                    disabled={isLoading}
                  >
                    Resend verification email
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
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
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
              
              {!isSignUp && (
                <Button 
                  type="button" 
                  variant="link" 
                  className="w-full"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Forgot password?
                </Button>
              )}
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
