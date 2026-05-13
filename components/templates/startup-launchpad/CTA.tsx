interface CTAProps {
  headline: string
  subtext: string
  ctaLabel: string
  bgColor: string
  textColor: string
}

export function CTA({ headline, subtext, ctaLabel, bgColor, textColor }: CTAProps) {
  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{headline}</h2>
        <p className="text-base md:text-lg opacity-75 mb-10 max-w-xl mx-auto">{subtext}</p>
        <button
          className="px-10 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: textColor, color: bgColor }}
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  )
}
