
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Section from '@/components/layouts/Section';
import SectionHeader from '@/components/common/SectionHeader';
import FeatureList from '@/components/common/FeatureList';
import { SERVICES } from '@/utils/constants';
import { buttonStyles, cardStyles, maxWidthGrid, gridStyles } from '@/utils/styles';

const Services = () => {
  const handleLearnMore = () => {
    window.location.href = '#contact';
  };

  return (
    <Section id="services" backgroundColor="gray">
      <SectionHeader 
        title="Our Services"
        description="Comprehensive math education services designed to help you excel in your academic journey"
      />

      <div className={`${gridStyles.responsive} ${maxWidthGrid}`}>
        {SERVICES.map((service, index) => (
          <Card key={index} className={`relative overflow-hidden ${cardStyles.base} ${service.popular ? cardStyles.popular : ''}`}>
            {service.popular && (
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                Most Popular
              </div>
            )}
            <CardContent className="p-8">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <FeatureList features={service.features} />

              <Button 
                onClick={handleLearnMore}
                className={`w-full ${buttonStyles.primary}`}
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default Services;
