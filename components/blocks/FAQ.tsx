'use client'

import { useState } from 'react'
import { richProps } from '@/lib/richtext'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  sectionTitle: string
  items: FAQItem[]
  _sectionId: string
}

export function FAQ({ sectionTitle, items, _sectionId }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section data-section={_sectionId} className="bg-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h2 data-field="sectionTitle" data-field-type="text" className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-10 md:mb-16" {...richProps(sectionTitle)} />
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.question || i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span data-field={`items.${i}.question`} data-field-type="text" className="font-medium text-slate-900" {...richProps(item.question)} />
                <span className="text-slate-400 ml-4 shrink-0">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div data-field={`items.${i}.answer`} data-field-type="text" className="px-6 pb-5 text-slate-500 leading-relaxed border-t border-slate-100 pt-4" {...richProps(item.answer)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
