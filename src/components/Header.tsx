import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ContactModal from '@/components/ContactModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'why-nna', 'pricing', 'reviews', 'faq'];
      const scrollPosition = window.scrollY + 120; // Account for fixed header height

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartTest = () => {
    window.location.href = '/signin';
  };

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 100; // Fixed header height
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const isActive = (section: string) => activeSection === section;

  const handleContactClick = () => {
    setIsContactModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg z-50 border-b border-blue-100">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-lg border-2 border-blue-200 flex-shrink-0">
                <img 
                  src="/lovable-uploads/b1fbfea2-d357-4112-a088-f0785f52bf6e.png" 
                  alt="Number Nerd Academy Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-lg sm:text-2xl text-gray-900 truncate">Number Nerd Academy</h1>
                <p className="text-xs text-blue-600 font-medium hidden sm:block">Master Math • Ace Your Tests</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isActive('home') 
                    ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('why-nna')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isActive('why-nna') 
                    ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Why Choose Us
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isActive('pricing') 
                    ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavClick('reviews')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isActive('reviews') 
                    ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isActive('faq') 
                    ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={handleContactClick}
                className="px-4 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                Contact
              </button>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button 
                onClick={handleStartTest}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Start Free Test
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 sm:p-3 rounded-xl hover:bg-blue-50 transition-colors border border-blue-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center space-y-1.5">
                <span className={`block h-0.5 w-full bg-blue-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-blue-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-blue-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden mt-4 sm:mt-6 pb-4 sm:pb-6 border-t border-blue-100 pt-4 sm:pt-6 bg-white/90 rounded-xl backdrop-blur-sm">
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`block w-full text-left transition-all duration-200 font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg border ${
                    isActive('home')
                      ? 'text-blue-600 bg-blue-50 border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-100 hover:border-blue-200'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('why-nna')}
                  className={`block w-full text-left transition-all duration-200 font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg border ${
                    isActive('why-nna')
                      ? 'text-blue-600 bg-blue-50 border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-100 hover:border-blue-200'
                  }`}
                >
                  Why Choose Us
                </button>
                <button
                  onClick={() => handleNavClick('pricing')}
                  className={`block w-full text-left transition-all duration-200 font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg border ${
                    isActive('pricing')
                      ? 'text-blue-600 bg-blue-50 border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-100 hover:border-blue-200'
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => handleNavClick('reviews')}
                  className={`block w-full text-left transition-all duration-200 font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg border ${
                    isActive('reviews')
                      ? 'text-blue-600 bg-blue-50 border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-100 hover:border-blue-200'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => handleNavClick('faq')}
                  className={`block w-full text-left transition-all duration-200 font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg border ${
                    isActive('faq')
                      ? 'text-blue-600 bg-blue-50 border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-100 hover:border-blue-200'
                  }`}
                >
                  FAQ
                </button>
                <button
                  onClick={handleContactClick}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg border border-gray-100 hover:border-blue-200"
                >
                  Contact
                </button>
              </div>
              <Button 
                onClick={handleStartTest}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg mt-4 sm:mt-6 w-full text-sm sm:text-base"
              >
                Start Free Test
              </Button>
            </nav>
          )}
        </div>
      </header>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Header;
