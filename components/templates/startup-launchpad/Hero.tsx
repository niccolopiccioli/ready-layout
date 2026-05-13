interface HeroProps {
  headline: string
  subheadline: string
  ctaLabel: string
  bgColor: string
  textColor: string
  accentColor: string
}

export function Hero({ headline, subheadline, ctaLabel, bgColor, textColor, accentColor }: HeroProps) {
  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="min-h-[90vh] flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="max-w-3xl">
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6"
            style={{ backgroundColor: accentColor + '22', color: accentColor }}
          >
            Nuovo ✦ Appena lanciato
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6 whitespace-pre-line">
            {headline}
          </h1>
          <p className="text-xl opacity-70 leading-relaxed mb-10 max-w-xl">
            {subheadline}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              className="px-8 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: accentColor, color: '#fff' }}
            >
              {ctaLabel}
            </button>
            <span className="text-sm opacity-50">Nessuna carta di credito richiesta</span>
          </div>
        </div>
      </div>
    </section>
  )
}
