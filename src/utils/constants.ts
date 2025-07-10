
import { MockTest, Service, Testimonial, FAQ, WhyReason, Stat } from '@/types';

export const MOCK_TESTS: MockTest[] = [
  {
    title: 'SAT Math Practice Test #1',
    description: 'Full-length adaptive SAT Math test with detailed explanations',
    duration: '70 minutes',
    questions: '44 questions',
    difficulty: 'Intermediate',
    type: 'Free',
    badge: 'Most Popular'
  },
  {
    title: 'GCSE Higher Math Mock',
    description: 'Complete GCSE Higher tier mathematics practice exam',
    duration: '90 minutes',
    questions: '25 questions',
    difficulty: 'Advanced',
    type: 'Premium',
    badge: null
  },
  {
    title: 'A-Level Pure Math Test',
    description: 'Core pure mathematics test covering AS & A2 syllabus',
    duration: '120 minutes',
    questions: '12 questions',
    difficulty: 'Expert',
    type: 'Premium',
    badge: null
  },
  {
    title: 'CBSE Class 12 Math',
    description: 'Board exam pattern practice test for Class 12 Mathematics',
    duration: '180 minutes',
    questions: '36 questions',
    difficulty: 'Advanced',
    type: 'Free',
    badge: 'New'
  }
];

export const SERVICES: Service[] = [
  {
    title: 'Digital SAT Prep',
    description: 'Comprehensive preparation for the new Digital SAT with practice tests and study materials.',
    icon: '💻',
    features: ['Practice Tests', 'Score Predictor', 'Study Materials', 'Progress Tracking'],
    popular: true
  },
  {
    title: 'Mock Test Platform',
    description: 'Take unlimited practice tests with instant feedback and detailed performance analysis.',
    icon: '📝',
    features: ['Instant Feedback', 'Video Solutions', 'All Grade Levels', 'Written Explanations']
  },
  {
    title: 'A-Level Math',
    description: 'Complete A-Level Mathematics preparation with comprehensive study materials and practice tests.',
    icon: '🎓',
    features: ['Core & Applied Math', 'Statistics & Mechanics', 'Past Papers', 'Exam Strategies']
  },
  {
    title: 'GCSE Math',
    description: 'GCSE Mathematics preparation covering all exam boards with focused practice and revision.',
    icon: '📚',
    features: ['All Exam Boards', 'Higher & Foundation', 'Mock Exams', 'Grade Tracking']
  },
  {
    title: 'CBSE & ICSE',
    description: 'Complete preparation for CBSE and ICSE curricula covering all subjects with practice tests.',
    icon: '🏫',
    features: ['All Subjects', 'Board Exam Prep', 'Study Materials', 'Practice Tests']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'SAT Student',
    location: 'California, USA',
    score: 'SAT: 1540/1600',
    content: "Number Nerd Academy transformed my SAT prep completely. The adaptive testing helped me identify my weak areas and the personalized study plan boosted my score by 280 points! The tutors are amazing and always available when I needed help.",
    avatar: '👩‍🎓',
    rating: 5
  },
  {
    name: 'James Wilson',
    role: 'A-Level Student',
    location: 'London, UK',
    score: 'A-Level Math: A*',
    content: "I was struggling with A-Level Further Mathematics until I found NNA. Their comprehensive materials and expert guidance helped me achieve an A* grade. The mock tests were incredibly similar to the actual exam format.",
    avatar: '👨‍🎓',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'CBSE Student',
    location: 'Mumbai, India',
    score: 'CBSE: 98%',
    content: "The CBSE preparation materials at NNA are outstanding. The detailed explanations and practice problems helped me score 98% in my Class 12 Mathematics board exam. The 24/7 support was a lifesaver during exam season.",
    avatar: '👩‍💼',
    rating: 5
  }
];

export const FAQS: FAQ[] = [
  {
    question: 'What makes Number Nerd Academy different from other prep platforms?',
    answer: 'We offer adaptive learning technology that personalizes your study experience based on your performance. Our expert tutors have 10+ years of experience, and we provide comprehensive support for multiple curricula including SAT, CBSE, GCSE, and A-Level Mathematics.'
  },
  {
    question: 'How does the adaptive testing system work?',
    answer: 'Our AI-powered system analyzes your responses in real-time and adjusts question difficulty accordingly. This ensures you\'re always challenged at the right level, maximizing learning efficiency and identifying knowledge gaps quickly.'
  },
  {
    question: 'Can I switch between different exam preparations?',
    answer: 'Absolutely! Your subscription gives you access to all our preparation materials. You can switch between SAT, GCSE, A-Level, and CBSE prep materials anytime based on your academic needs.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! We offer a 14-day free trial for all paid plans. You can explore our platform, take practice tests, and experience our tutoring services without any commitment. No credit card required to start.'
  },
  {
    question: 'How do the live tutoring sessions work?',
    answer: 'Live tutoring sessions are conducted via our integrated video platform. You can schedule sessions with certified tutors, share your screen for homework help, and get real-time assistance. Sessions are recorded for your review.'
  },
  {
    question: 'What devices and browsers are supported?',
    answer: 'Our platform works on all modern devices including computers, tablets, and smartphones. We support Chrome, Firefox, Safari, and Edge browsers. We also have dedicated mobile apps for iOS and Android.'
  },
  {
    question: 'How is my progress tracked and reported?',
    answer: 'You get detailed analytics showing your performance across different topics, time spent studying, improvement trends, and personalized recommendations. Parents can also receive weekly progress reports.'
  },
  {
    question: 'What if I\'m not satisfied with the service?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not completely satisfied with our service, you can request a full refund within the first 30 days of your subscription.'
  }
];

export const WHY_REASONS: WhyReason[] = [
  {
    icon: '🎯',
    title: 'Structured Learning',
    description: 'Well-organized study materials and practice tests that follow exam patterns for maximum efficiency.'
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Track your performance with detailed score reports and identify areas for improvement.'
  },
  {
    icon: '🏆',
    title: 'Proven Success',
    description: '95% of our students achieve their target scores with an average improvement of 150+ points in SAT.'
  },
  {
    icon: '🔄',
    title: 'Adaptive Testing',
    description: 'Experience real exam conditions with our testing platform that mimics actual test formats.'
  },
  {
    icon: '💬',
    title: '24/7 Support',
    description: 'Get help whenever you need it with our comprehensive student support system.'
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Access your study materials and take practice tests anywhere, anytime with our mobile-optimized platform.'
  }
];

export const STATS: Stat[] = [
  { number: '10,000+', label: 'Students Enrolled' },
  { number: '95%', label: 'Success Rate' },
  { number: '4.9/5', label: 'Average Rating' },
  { number: '50+', label: 'Expert Tutors' }
];

export const CONTACT_STATS: Stat[] = [
  { number: '24/7', label: 'Community Support' },
  { number: '<2h', label: 'Response Time' },
  { number: '5000+', label: 'Happy Students' },
  { number: '98%', label: 'Satisfaction Rate' }
];
