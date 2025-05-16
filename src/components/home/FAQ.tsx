import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  const { t } = useTranslation('home');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: t('faq.items.security.question'),
      answer: t('faq.items.security.answer')
    },
    {
      id: '2',
      question: t('faq.items.payment.question'),
      answer: t('faq.items.payment.answer')
    },
    {
      id: '3',
      question: t('faq.items.methods.question'),
      answer: t('faq.items.methods.answer')
    },
    {
      id: '4',
      question: t('faq.items.cancellation.question'),
      answer: t('faq.items.cancellation.answer')
    },
    {
      id: '5',
      question: t('faq.items.rescheduling.question'),
      answer: t('faq.items.rescheduling.answer')
    }
  ];

  return (
    <div className="py-16">
      <div className="mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          {t('faq.title')}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border rounded-lg">
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left"
                onClick={() => setOpenItem(openItem === faq.id ? null : faq.id)}
                aria-expanded={openItem === faq.id}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openItem === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openItem === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}