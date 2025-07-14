import { supabase } from '@/integrations/supabase/client';

export const userService = {
  // Get current user profile
  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { data: null, error: null };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return { data, error };
  },

  // Update user profile
  async updateProfile(updates: {
    name?: string;
    avatar_url?: string;
    phone?: string;
    preferences?: any;
  }) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();

    return { data, error };
  },

  // Get all users (admin only)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Check if user has access to test
  async hasTestAccess(testId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }

    // Get test plan requirement
    const { data: test } = await supabase
      .from('tests')
      .select('plan')
      .eq('id', testId)
      .single();

    if (!test) {
      return false;
    }

    // Free tests are accessible to everyone
    if (test.plan === 'Free') {
      return true;
    }

    // Check if user has purchased the test
    const { data: purchase } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('test_id', testId)
      .eq('status', 'completed')
      .single();

    if (purchase) {
      return true;
    }

    // Check user's subscription plan
    const { data: user } = await supabase
      .from('users')
      .select('plan')
      .eq('id', session.user.id)
      .single();

    if (!user) {
      return false;
    }

    // Plan hierarchy: Free < Basic < Standard < Premium
    const planHierarchy = { 'Free': 0, 'Basic': 1, 'Standard': 2, 'Premium': 3 };
    const userPlanLevel = planHierarchy[user.plan as keyof typeof planHierarchy] || 0;
    const testPlanLevel = planHierarchy[test.plan as keyof typeof planHierarchy] || 0;

    return userPlanLevel >= testPlanLevel;
  },

  // Purchase test access
  async purchaseTest(testId: string, purchaseType: string, price?: number) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_purchases')
      .insert([{
        user_id: session.user.id,
        test_id: testId,
        purchase_type: purchaseType,
        price: price,
        status: 'completed'
      }])
      .select()
      .single();

    return { data, error };
  }
};