import { richProps } from '@/lib/richtext'

interface HeroProps {
  headline: string
  subheadline: string
  ctaLabel: string
  badge?: string
  footnote?: string
  bgColor: string
  textColor: string
  accentColor: string
  _sectionId: string
}

export function Hero({
  headline,
  subheadline,
  ctaLabel,
  badge = '',
  footnote = '',
  bgColor,
  textColor,
  accentColor,
  _sectionId,
}: HeroProps) {
  const badgeText = typeof badge === 'string' ? badge.trim() : ''
  const footnoteText = typeof footnote === 'string' ? footnote.trim() : ''

  return (
    <section data-section={_sectionId} style={{ backgroundColor: bgColor, color: textColor }} className="min-h-[600px] flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="max-w-3xl">
          {badgeText ? (
            <div
              data-field="badge"
              data-field-type="text"
              className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4 md:mb-6"
              style={{ backgroundColor: accentColor + '22', color: accentColor }}
              {...richProps(badge)}
            />
          ) : null}
          <h1
            data-field="headline"
            data-field-type="text"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-4 md:mb-6"
            {...richProps(headline)}
          />
          <p
            data-field="subheadline"
            data-field-type="text"
            className="text-base md:text-xl opacity-70 leading-relaxed mb-8 md:mb-10 max-w-xl"
            {...richProps(subheadline)}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <button
              data-field="ctaLabel"
              data-field-type="text"
              className="px-7 py-3.5 md:px-8 md:py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: accentColor, color: '#fff' }}
              {...richProps(ctaLabel)}
            />
            {footnoteText ? (
              <span
                data-field="footnote"
                data-field-type="text"
                className="text-sm opacity-50"
                {...richProps(footnote)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
