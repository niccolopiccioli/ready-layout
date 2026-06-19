import { richProps } from '@/lib/richtext'

interface Plan {
  name: string
  price: string
  period: string
  cta: string
  highlighted: string  // "true" or "false" as string
  features: string     // pipe-delimited: "Feature 1|Feature 2"
}

interface PricingProps {
  sectionTitle: string
  accentColor: string
  plans: Plan[]
  _sectionId: string
}

export function Pricing({ sectionTitle, accentColor, plans, _sectionId }: PricingProps) {
  return (
    <section data-section={_sectionId} className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 data-field="sectionTitle" data-field-type="text" className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-3" {...richProps(sectionTitle)} />
        <p className="text-center text-slate-500 mb-10 md:mb-16">Scala quando sei pronto.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {plans.map((plan, i) => {
            const isHighlighted = plan.highlighted === 'true'
            const features = plan.features.split('|').filter(Boolean)
            return (
              <div
                key={plan.name || i}
                className={`rounded-2xl p-6 md:p-8 flex flex-col ${
                  isHighlighted
                    ? 'text-white shadow-xl md:scale-[1.03]'
                    : 'bg-white border border-slate-200'
                }`}
                style={isHighlighted ? { backgroundColor: accentColor } : {}}
              >
                <div className="mb-6">
                  <p data-field={`plans.${i}.name`} data-field-type="text" className={`text-sm font-semibold uppercase tracking-widest mb-2 ${isHighlighted ? 'opacity-80' : 'text-slate-500'}`} {...richProps(plan.name)} />
                  <div className="flex items-baseline gap-1">
                    <span data-field={`plans.${i}.price`} data-field-type="text" className="text-5xl font-bold">€<span {...richProps(plan.price)} /></span>
                    <span data-field={`plans.${i}.period`} data-field-type="text" className={`text-sm ${isHighlighted ? 'opacity-70' : 'text-slate-400'}`} {...richProps(plan.period)} />
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <span className={isHighlighted ? 'opacity-80' : 'text-slate-400'}>✓</span>
                      <span className={isHighlighted ? '' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  data-field={`plans.${i}.cta`}
                  data-field-type="text"
                  className={`w-full py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 ${
                    isHighlighted ? 'bg-white' : 'border border-current'
                  }`}
                  style={isHighlighted ? { color: accentColor } : { color: accentColor }}
                  {...richProps(plan.cta)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
