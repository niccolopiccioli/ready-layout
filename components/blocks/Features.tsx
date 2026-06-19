'use client'

import { DraggableItem } from '@/components/editor/drag/DraggableItem'
import { richProps } from '@/lib/richtext'

interface FeatureItem {
  icon: string
  title: string
  desc: string
}

interface FeaturesProps {
  sectionTitle: string
  accentColor: string
  items: FeatureItem[]
  _sectionId: string
}

export function Features({ sectionTitle, accentColor, items, _sectionId }: FeaturesProps) {
  return (
    <section data-section={_sectionId} className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 data-field="sectionTitle" data-field-type="text" className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-3" {...richProps(sectionTitle)} />
        <p className="text-center text-slate-500 mb-10 md:mb-16">
          Progettato per chi non vuole compromessi.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {items.map((item, i) => (
            <DraggableItem
              key={i}
              sectionId={_sectionId}
              fieldId="items"
              itemIndex={i}
            >
              <div className="p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow cursor-grab">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6"
                  style={{ backgroundColor: accentColor + '15' }}
                >
                  {item.icon}
                </div>
                <h3 data-field={`items.${i}.title`} data-field-type="text" className="text-xl font-semibold text-slate-900 mb-2" {...richProps(item.title)} />
                <p data-field={`items.${i}.desc`} data-field-type="text" className="text-slate-500 leading-relaxed" {...richProps(item.desc)} />
              </div>
            </DraggableItem>
          ))}
        </div>
      </div>
    </section>
  )
}