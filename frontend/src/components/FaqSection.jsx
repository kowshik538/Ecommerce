// components/FaqSection.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3–5 business days depending on your location.",
  },
  {
    question: "Do you offer cash on delivery?",
    answer: "Yes, we offer COD at checkout for most regions across India.",
  },
  {
    question: "Are your products sustainable?",
    answer: "Yes, we use eco-friendly materials and ethical manufacturing practices.",
  },
  {
    question: "Will I get tracking updates?",
    answer: "Absolutely! You’ll receive SMS and email updates as soon as your order ships.",
  },
//   {
//     question: "What if the product doesn’t fit me?",
//     answer: "We have a hassle-free return policy for eligible items within 7 days of delivery.",
//   },
//   {
//     question: "Are there any first-time buyer discounts?",
//     answer: "Yes! Subscribe to our newsletter and get an instant 10% off on your first purchase.",
//   },
  {
    question: "Do you restock sold-out items?",
    answer: "We do restock popular items.",
  },
//   {
//     question: "Can I cancel or change my order after placing it?",
//     answer: "Yes, but only within the first hour of placing your order. Reach out via our chat support.",
//   },
  {
    question: "Where are your products made?",
    answer: "Our collections are proudly designed and made in India by skilled local artisans.",
  },
  {
    question: "Are your payments secure?",
    answer: "Yes. All transactions are encrypted and handled by trusted payment gateways.",
  },
];


const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleIndex(i)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="mt-3 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
