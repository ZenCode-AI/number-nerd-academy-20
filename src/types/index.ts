
export interface MockTest {
  title: string;
  description: string;
  duration: string;
  questions: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  type: 'Free' | 'Premium';
  badge?: string | null;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
  popular?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  score: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactInfo {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  contact: string;
  href: string;
  color: string;
}

export interface Stat {
  number: string;
  label: string;
}

export interface WhyReason {
  icon: string;
  title: string;
  description: string;
}
