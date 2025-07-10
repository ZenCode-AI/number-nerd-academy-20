
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Section from '@/components/layouts/Section';
import SectionHeader from '@/components/common/SectionHeader';
import { FAQS } from '@/utils/constants';
import { buttonStyles } from '@/utils/styles';

const FAQ = () => {
  return (
    <Section id="faq" backgroundColor="gray">
      <SectionHeader 
        title="Frequently Asked Questions"
        description="Got questions? We've got answers. Here are the most common questions about Number Nerd Academy."
      />

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className={`px-6 py-3 rounded-lg font-semibold ${buttonStyles.primary}`}>
            Contact Support
          </button>
          <button className={`px-6 py-3 rounded-lg font-semibold ${buttonStyles.outline}`}>
            Schedule a Demo
          </button>
        </div>
      </div>
    </Section>
  );
};

export default FAQ;
