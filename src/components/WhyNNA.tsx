
import React from 'react';
import Section from '@/components/layouts/Section';
import SectionHeader from '@/components/common/SectionHeader';
import { WHY_REASONS } from '@/utils/constants';
import { gridStyles } from '@/utils/styles';

const WhyNNA = () => {
  const steps = [
    { step: '1', title: 'Choose Test', desc: 'Select your exam type' },
    { step: '2', title: 'Take Practice Test', desc: 'Complete mock exam' },
    { step: '3', title: 'Review Results', desc: 'Detailed score breakdown' },
    { step: '4', title: 'Study Materials', desc: 'Access solutions & explanations' }
  ];

  return (
    <Section id="why-nna" backgroundColor="primary">
      <SectionHeader 
        title="Why Choose Number Nerd Academy?"
        description="Discover what makes us the preferred choice for thousands of students worldwide"
      />

      <div className={`${gridStyles.responsive} max-w-6xl mx-auto`}>
        {WHY_REASONS.map((reason, index) => (
          <div key={index} className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <span className="text-3xl">{reason.icon}</span>
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-3">{reason.title}</h3>
            <p className="text-gray-600 leading-relaxed">{reason.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h3 className="font-display font-bold text-2xl text-gray-900 mb-4">Mock Test Process</h3>
          <p className="text-gray-600">Experience our comprehensive testing system designed for exam preparation</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6">
          {steps.map((item, index) => (
            <div key={index} className="flex-1 text-center relative">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 mx-auto">
                {item.step}
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
              {index < 3 && (
                <div className="hidden md:block absolute top-6 left-full w-6 h-0.5 bg-primary-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default WhyNNA;
