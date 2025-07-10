
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const handleStartTest = () => {
    window.location.href = '/signin';
  };

  const handleViewTests = () => {
    const element = document.getElementById('mock-tests');
    if (element) {
      const headerHeight = 100;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-72 sm:h-72 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-96 sm:h-96 bg-blue-200 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="animate-fade-in text-center lg:text-left">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                🎯 Trusted by 10,000+ Students Worldwide
              </div>
              
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 leading-tight mb-4 sm:mb-6">
                Master Math with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-600 block">Expert Preparation</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                Comprehensive SAT, CBSE, GCSE, and A-Level Math preparation with practice tests, study materials, and instant feedback to achieve your academic goals.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10 max-w-md mx-auto lg:mx-0">
                <div className="text-center">
                  <div className="font-bold text-xl sm:text-2xl lg:text-3xl text-primary mb-1">95%</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl sm:text-2xl lg:text-3xl text-primary mb-1">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Students Helped</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl sm:text-2xl lg:text-3xl text-primary mb-1">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Practice Tests</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={handleStartTest}
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Start Your SAT Prep Journey Today</span>
                  <span className="sm:hidden">Start SAT Prep</span>
                </Button>
                <Button 
                  onClick={handleViewTests}
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 hover:shadow-lg w-full sm:w-auto"
                >
                  View Free Tests
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="animate-slide-up mt-8 lg:mt-0">
              <div className="relative max-w-lg mx-auto lg:max-w-none">
                <div className="bg-gradient-to-br from-white to-primary-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-primary-100">
                  <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&auto=format" 
                    alt="Math preparation and study materials"
                    className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                  />
                  
                  {/* Floating cards */}
                  <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 bg-white p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 scale-75 sm:scale-90 lg:scale-100">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm sm:text-lg lg:text-xl">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xs sm:text-sm">Score Improved</div>
                        <div className="text-xs text-gray-600">+150 points avg</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-white p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 scale-75 sm:scale-90 lg:scale-100">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <span className="text-primary font-bold text-sm sm:text-lg lg:text-xl">📊</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xs sm:text-sm">Progress Tracking</div>
                        <div className="text-xs text-gray-600">Real-time insights</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
