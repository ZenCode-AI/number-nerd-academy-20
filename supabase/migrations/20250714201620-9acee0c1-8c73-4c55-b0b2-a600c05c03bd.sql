-- Create enums for user roles and subscription plans
CREATE TYPE user_role AS ENUM ('admin', 'student');
CREATE TYPE subscription_plan AS ENUM ('Free', 'Basic', 'Standard', 'Premium');
CREATE TYPE test_status AS ENUM ('Draft', 'Active', 'Inactive', 'Archived');
CREATE TYPE question_type AS ENUM ('MCQ', 'Paragraph', 'Numeric', 'Image');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'completed', 'abandoned');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'student',
  plan subscription_plan DEFAULT 'Free',
  avatar_url TEXT,
  phone TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests table
CREATE TABLE public.tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration INTEGER NOT NULL,
  plan subscription_plan NOT NULL,
  total_score INTEGER DEFAULT 0,
  status test_status DEFAULT 'Draft',
  instructions TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test modules for modular tests
CREATE TABLE public.test_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  module_order INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  passage_title TEXT,
  passage_content TEXT,
  passage_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE public.test_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.test_modules(id) ON DELETE CASCADE,
  question_type question_type NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  image_url TEXT,
  question_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test attempts table
CREATE TABLE public.test_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status attempt_status DEFAULT 'in_progress',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  current_question_index INTEGER DEFAULT 0,
  answers JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User answers table
CREATE TABLE public.user_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.test_questions(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User purchases table
CREATE TABLE public.user_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  purchase_type TEXT NOT NULL,
  price DECIMAL(10,2),
  status TEXT DEFAULT 'completed',
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for tests table
CREATE POLICY "Anyone can view active tests" ON public.tests
  FOR SELECT USING (status = 'Active');

CREATE POLICY "Admins can manage all tests" ON public.tests
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view tests they created" ON public.tests
  FOR SELECT USING (created_by = auth.uid());

-- RLS Policies for test_modules table
CREATE POLICY "Anyone can view active test modules" ON public.test_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tests 
      WHERE tests.id = test_modules.test_id 
      AND tests.status = 'Active'
    )
  );

CREATE POLICY "Admins can manage all test modules" ON public.test_modules
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for test_questions table
CREATE POLICY "Anyone can view active test questions" ON public.test_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tests 
      WHERE tests.id = test_questions.test_id 
      AND tests.status = 'Active'
    )
  );

CREATE POLICY "Admins can manage all test questions" ON public.test_questions
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for test_attempts table
CREATE POLICY "Users can view own attempts" ON public.test_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own attempts" ON public.test_attempts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own attempts" ON public.test_attempts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all attempts" ON public.test_attempts
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for user_answers table
CREATE POLICY "Users can view own answers" ON public.user_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts 
      WHERE test_attempts.id = user_answers.attempt_id 
      AND test_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own answers" ON public.user_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_attempts 
      WHERE test_attempts.id = user_answers.attempt_id 
      AND test_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own answers" ON public.user_answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts 
      WHERE test_attempts.id = user_answers.attempt_id 
      AND test_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all answers" ON public.user_answers
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for user_purchases table
CREATE POLICY "Users can view own purchases" ON public.user_purchases
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own purchases" ON public.user_purchases
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all purchases" ON public.user_purchases
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON public.tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_modules_updated_at
  BEFORE UPDATE ON public.test_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_questions_updated_at
  BEFORE UPDATE ON public.test_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_attempts_updated_at
  BEFORE UPDATE ON public.test_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_answers_updated_at
  BEFORE UPDATE ON public.user_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_purchases_updated_at
  BEFORE UPDATE ON public.user_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'student',
    'Free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_tests_status ON public.tests(status);
CREATE INDEX idx_tests_created_by ON public.tests(created_by);
CREATE INDEX idx_test_modules_test_id ON public.test_modules(test_id);
CREATE INDEX idx_test_questions_test_id ON public.test_questions(test_id);
CREATE INDEX idx_test_questions_module_id ON public.test_questions(module_id);
CREATE INDEX idx_test_attempts_user_id ON public.test_attempts(user_id);
CREATE INDEX idx_test_attempts_test_id ON public.test_attempts(test_id);
CREATE INDEX idx_user_answers_attempt_id ON public.user_answers(attempt_id);
CREATE INDEX idx_user_purchases_user_id ON public.user_purchases(user_id);