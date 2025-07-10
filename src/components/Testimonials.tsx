
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Section from '@/components/layouts/Section';
import SectionHeader from '@/components/common/SectionHeader';
import StatsGrid from '@/components/common/StatsGrid';
import Rating from '@/components/common/Rating';
import { TESTIMONIALS, STATS } from '@/utils/constants';
import { cardStyles, gridStyles } from '@/utils/styles';

const Testimonials = () => {
  return (
    <Section id="reviews" backgroundColor="white">
      <SectionHeader 
        title="What Our Students Say"
        description="Join thousands of successful students who've achieved their academic goals with Number Nerd Academy"
      />

      <div className={`${gridStyles.responsive} max-w-6xl mx-auto`}>
        {TESTIMONIALS.map((testimonial, index) => (
          <Card key={index} className={cardStyles.base}>
            <CardContent className="p-8">
              <Rating rating={testimonial.rating} />

              <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role} • {testimonial.location}</div>
                  <div className="text-sm font-medium text-primary">{testimonial.score}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-primary-50 rounded-2xl p-8 md:p-12">
        <StatsGrid stats={STATS} />
      </div>
    </Section>
  );
};

export default Testimonials;
