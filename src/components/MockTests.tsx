
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Section from '@/components/layouts/Section';
import SectionHeader from '@/components/common/SectionHeader';
import TestBadge from '@/components/common/TestBadge';
import { MOCK_TESTS } from '@/utils/constants';
import { buttonStyles, cardStyles, maxWidthGrid, gridStyles } from '@/utils/styles';

const MockTests = () => {
  return (
    <Section id="mock-tests" backgroundColor="white">
      <SectionHeader 
        title="Featured Mock Tests"
        description="Practice with our comprehensive mock tests designed to simulate real exam conditions"
      />

      <div className={`${gridStyles.cards} ${maxWidthGrid}`}>
        {MOCK_TESTS.map((test, index) => (
          <Card key={index} className={`relative overflow-hidden ${cardStyles.base}`}>
            <CardContent className="p-6">
              <TestBadge type={test.type} badge={test.badge} />

              <div className="mb-3">
                <span className="text-sm text-gray-500">{test.difficulty}</span>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{test.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{test.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Questions:</span>
                  <span className="font-medium">{test.questions}</span>
                </div>
              </div>

              <Button 
                className={`w-full ${
                  test.type === 'Free' 
                    ? buttonStyles.free 
                    : buttonStyles.primary
                }`}
              >
                Start Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 font-semibold">
          View All Mock Tests
        </Button>
      </div>
    </Section>
  );
};

export default MockTests;
