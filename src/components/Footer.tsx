
import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#about' },
        { name: 'Our Services', href: '#services' },
        { name: 'Careers', href: '#careers' },
        { name: 'Press', href: '#press' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'FAQ', href: '#faq' },
        { name: 'Help Center', href: '#help' },
        { name: 'Contact Support', href: '#support' },
        { name: 'System Status', href: '#status' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Cookie Policy', href: '#cookies' },
        { name: 'GDPR', href: '#gdpr' }
      ]
    },
    {
      title: 'Connect',
      links: [
        { name: 'Blog', href: '#blog' },
        { name: 'Community', href: '#community' },
        { name: 'Newsletter', href: '#newsletter' },
        { name: 'Events', href: '#events' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">Number Nerd Academy</h3>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Empowering students worldwide with expert math education and personalized learning experiences.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <span className="text-xl">📸</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <span className="text-xl">💼</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <span className="text-xl">🐦</span>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12">
          <div className="max-w-2xl">
            <h4 className="font-display font-bold text-2xl mb-2">Stay Updated</h4>
            <p className="text-gray-400 mb-6">Get the latest study tips, exam updates, and exclusive offers delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-center lg:text-left">
              <p>© 2024 Number Nerd Academy. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6 text-sm text-gray-400">
              <span>🌟 Trusted by 10,000+ students worldwide</span>
              <span>🏆 95% success rate</span>
              <span>🔒 Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
