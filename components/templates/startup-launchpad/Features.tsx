interface FeatureItem {
  icon: string
  title: string
  desc: string
}

interface FeaturesProps {
  sectionTitle: string
  accentColor: string
  items: FeatureItem[]
}

export function Features({ sectionTitle, accentColor, items }: FeaturesProps) {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-4">{sectionTitle}</h2>
        <p className="text-center text-slate-500 mb-16">
          Progettato per chi non vuole compromessi.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ backgroundColor: accentColor + '15' }}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
