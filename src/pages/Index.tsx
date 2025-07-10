
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyNNA from '@/components/WhyNNA';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <WhyNNA />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
