'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQ } from '../_types'

interface FAQSectionProps {
  faqs: FAQ[]
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
          >
            <span className="text-left font-medium text-gray-900 dark:text-white">
              {faq.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`transition-all duration-200 ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
