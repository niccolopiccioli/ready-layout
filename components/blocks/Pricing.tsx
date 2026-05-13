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
}

export function Pricing({ sectionTitle, accentColor, plans }: PricingProps) {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-4">{sectionTitle}</h2>
        <p className="text-center text-slate-500 mb-16">Scala quando sei pronto.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => {
            const isHighlighted = plan.highlighted === 'true'
            const features = plan.features.split('|').filter(Boolean)
            return (
              <div
                key={plan.name || i}
                className={`rounded-2xl p-8 flex flex-col ${
                  isHighlighted
                    ? 'text-white shadow-xl scale-[1.03]'
                    : 'bg-white border border-slate-200'
                }`}
                style={isHighlighted ? { backgroundColor: accentColor } : {}}
              >
                <div className="mb-6">
                  <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${isHighlighted ? 'opacity-80' : 'text-slate-500'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">€{plan.price}</span>
                    <span className={`text-sm ${isHighlighted ? 'opacity-70' : 'text-slate-400'}`}>{plan.period}</span>
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
                  className={`w-full py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 ${
                    isHighlighted ? 'bg-white' : 'border border-current'
                  }`}
                  style={isHighlighted ? { color: accentColor } : { color: accentColor }}
                >
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
