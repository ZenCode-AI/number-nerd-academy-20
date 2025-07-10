
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Clock, MessageCircle, MapPin } from 'lucide-react';
import Section from '@/components/layouts/Section';
import SectionHeader from '@/components/common/SectionHeader';
import StatsGrid from '@/components/common/StatsGrid';
import { CONTACT_STATS } from '@/utils/constants';
import { ContactInfo } from '@/types';
import { cardStyles } from '@/utils/styles';

const Contact = () => {
  const contactMethods: ContactInfo[] = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get detailed help via email',
      contact: 'support@numbernerdacademy.com',
      href: 'mailto:support@numbernerdacademy.com',
      color: 'primary'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Talk to our experts directly',
      contact: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      color: 'green'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      description: '',
      contact: '',
      href: '',
      color: 'purple'
    }
  ];

  return (
    <Section id="contact" backgroundColor="gray" className="py-12">
      <SectionHeader 
        title="Contact Us"
        description="Need help with your studies? Get in touch with our support team."
        className="mb-8"
      />

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {contactMethods.map((method, index) => (
            <Card key={index} className={`${cardStyles.hover} border border-gray-200`}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 bg-${method.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <method.icon className={`w-6 h-6 text-${method.color === 'primary' ? 'primary' : method.color}-600`} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{method.title}</h3>
                {method.description && <p className="text-gray-600 text-sm mb-3">{method.description}</p>}
                
                {method.title === 'Support Hours' ? (
                  <div className="space-y-1 text-gray-600 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Mon - Fri</span>
                      <span>9AM - 6PM EST</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Weekend</span>
                      <span>10AM - 4PM EST</span>
                    </div>
                  </div>
                ) : (
                  <a 
                    href={method.href} 
                    className={`text-${method.color === 'primary' ? 'primary' : method.color}-600 hover:text-${method.color === 'primary' ? 'primary' : method.color}-700 font-medium text-sm transition-colors`}
                  >
                    {method.contact}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Office Location and Community */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">Our Office</h3>
              </div>
              <div className="space-y-1 text-gray-600 text-sm">
                <p>Number Nerd Academy</p>
                <p>123 Education Street, Suite 100</p>
                <p>Learning City, LC 12345</p>
                <p>United States</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-50 border border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">Quick Help</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Join our Discord community for instant support from our team and fellow students.
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Community
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <StatsGrid stats={CONTACT_STATS} />
        </div>
      </div>
    </Section>
  );
};

export default Contact;
