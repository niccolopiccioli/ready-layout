'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  sectionTitle: string
  items: FAQItem[]
}

export function FAQ({ sectionTitle, items }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-white py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">{sectionTitle}</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.question || i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-slate-900">{item.question}</span>
                <span className="text-slate-400 ml-4 shrink-0">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
