'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  faqs: FAQItem[]
}

export default function FAQ({ faqs }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  if (faqs.length === 0) return null

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
            <button
              onClick={() => toggleItem(index)}
              className="w-full text-left flex justify-between items-center py-2 hover:text-blue-600 transition-colors"
            >
              <h4 className="font-medium text-gray-900">{faq.question}</h4>
              <span className="text-gray-500 transform transition-transform duration-200">
                {openItems.has(index) ? '−' : '+'}
              </span>
            </button>
            {openItems.has(index) && (
              <div className="mt-2 text-gray-700 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

