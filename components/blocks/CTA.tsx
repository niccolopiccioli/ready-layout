import { richProps } from '@/lib/richtext'

interface CTAProps {
  headline: string
  subtext: string
  ctaLabel: string
  bgColor: string
  textColor: string
}

export function CTA({ headline, subtext, ctaLabel, bgColor, textColor }: CTAProps) {
  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 data-field="headline" data-field-type="text" className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight" {...richProps(headline)} />
        <p data-field="subtext" data-field-type="text" className="text-sm md:text-lg opacity-75 mb-8 md:mb-10 max-w-xl mx-auto" {...richProps(subtext)} />
        <button
          data-field="ctaLabel"
          data-field-type="text"
          className="px-7 py-3.5 md:px-10 md:py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: textColor, color: bgColor }}
          {...richProps(ctaLabel)}
        />
      </div>
    </section>
  )
}