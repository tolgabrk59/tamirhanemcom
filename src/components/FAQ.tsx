'use client';

import { useState } from 'react';
import { faqData } from '@/data/faq';
import type { FAQ } from '@/types';

interface FAQProps {
  items?: FAQ[];
  limit?: number;
}

export default function FAQSection({ items, limit = 6 }: FAQProps) {
  const faqs = items || faqData.slice(0, limit);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Sık Sorulan Sorular
          </h2>
          <p className="text-secondary-600">
            Merak ettiğiniz konular hakkında bilgi edinin
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <FAQItem key={faq.id} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-secondary-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-secondary-50 transition-colors"
      >
        <span className="font-medium text-secondary-900 pr-8">{faq.question}</span>
        <svg
          className={`w-5 h-5 text-secondary-500 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-secondary-50 border-t border-secondary-200">
          <div className="text-secondary-600 whitespace-pre-line text-sm leading-relaxed">
            {faq.answer}
          </div>
          {faq.category && (
            <span className="inline-block mt-3 text-xs bg-secondary-200 text-secondary-600 px-2 py-1 rounded">
              {faq.category}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
