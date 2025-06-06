import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('faq.title')}
          </h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setOpenItem(openItem === faq.id ? null : faq.id)}
                aria-expanded={openItem === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="font-medium text-lg text-gray-900 dark:text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-primary transform transition-transform duration-300 ${
                    openItem === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openItem === faq.id && (
                <div id={`faq-answer-${faq.id}`} className="px-6 pb-6 pt-2">
                  <p className="text-muted-foreground dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}