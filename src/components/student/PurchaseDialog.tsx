
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, CreditCard, Check, Loader2 } from 'lucide-react';
import { userPurchaseService } from '@/services/userPurchaseService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  test: {
    id: string;
    name: string;
    plan: string;
    duration: number;
    questions: number;
  };
  onPurchaseComplete: () => void;
}

const PurchaseDialog = ({ isOpen, onClose, test, onPurchaseComplete }: PurchaseDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case 'Basic': return '$9.99';
      case 'Standard': return '$19.99';
      case 'Premium': return '$29.99';
      default: return '$0.00';
    }
  };

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'Basic':
        return ['Access to test', 'Detailed results', 'Answer explanations'];
      case 'Standard':
        return ['Access to test', 'Detailed results', 'Answer explanations', 'Performance analytics'];
      case 'Premium':
        return ['Access to test', 'Detailed results', 'Answer explanations', 'Performance analytics', 'Priority support'];
      default:
        return [];
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase tests.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Processing purchase for user:', user);

      // Simulate purchase processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add purchase to service
      userPurchaseService.addPurchase({
        userId: user.id,
        testId: test.id,
        purchasedAt: new Date().toISOString(),
        purchaseType: 'test',
        price: parseFloat(getPlanPrice(test.plan).replace('$', '')),
        status: 'completed'
      });

      // Grant test access
      userPurchaseService.grantTestAccess(user.id, test.id, 'purchased');

      // Small delay to ensure localStorage operations complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify purchase was successful
      console.log('Verifying purchase access for:', { userId: user.id, testId: test.id, testPlan: test.plan });
      const hasAccess = userPurchaseService.hasTestAccess(user.id, test.id, test.plan);
      
      if (hasAccess) {
        toast({
          title: "Purchase Successful!",
          description: `You now have access to ${test.name}`,
        });

        // Call the completion callback to refresh test data
        onPurchaseComplete();
        onClose();
      } else {
        throw new Error('Purchase verification failed');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Crown className="h-5 w-5 text-yellow-600" />
            Purchase Test Access
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Get full access to {test.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Please sign in to purchase tests.
              </p>
            </div>
          )}

          <div className="border rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="font-semibold text-sm sm:text-base">{test.name}</h3>
              <Badge variant="outline" className="text-xs">{test.plan}</Badge>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p>Duration: {test.duration} minutes</p>
              <p>Questions: {test.questions}</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <span className="font-semibold text-sm sm:text-base">{test.plan} Plan</span>
              <span className="text-xl sm:text-2xl font-bold text-green-600">{getPlanPrice(test.plan)}</span>
            </div>
            <ul className="space-y-2">
              {getPlanFeatures(test.plan).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 text-sm"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePurchase} 
              className="flex-1 text-sm"
              disabled={!user || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
