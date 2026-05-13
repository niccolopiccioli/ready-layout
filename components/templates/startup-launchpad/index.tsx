import { Hero } from './Hero'
import { Features } from './Features'
import { Pricing } from './Pricing'
import { FAQ } from './FAQ'
import { CTA } from './CTA'
import type { TemplateValues } from '@/lib/schemas/types'

interface StartupLaunchpadProps {
  values: TemplateValues
}

export function StartupLaunchpad({ values }: StartupLaunchpadProps) {
  const hero     = values['hero']     as Record<string, string>
  const features = values['features'] as Record<string, unknown>
  const pricing  = values['pricing']  as Record<string, unknown>
  const faq      = values['faq']      as Record<string, unknown>
  const cta      = values['cta']      as Record<string, string>

  return (
    <div className="font-sans">
      <Hero
        headline={hero['headline'] as string}
        subheadline={hero['subheadline'] as string}
        ctaLabel={hero['ctaLabel'] as string}
        bgColor={hero['bgColor'] as string}
        textColor={hero['textColor'] as string}
        accentColor={hero['accentColor'] as string}
      />
      <Features
        sectionTitle={features['sectionTitle'] as string}
        accentColor={features['accentColor'] as string}
        items={features['items'] as { icon: string; title: string; desc: string }[]}
      />
      <Pricing
        sectionTitle={pricing['sectionTitle'] as string}
        accentColor={pricing['accentColor'] as string}
        plans={pricing['plans'] as { name: string; price: string; period: string; cta: string; highlighted: string; features: string }[]}
      />
      <FAQ
        sectionTitle={faq['sectionTitle'] as string}
        items={faq['items'] as { question: string; answer: string }[]}
      />
      <CTA
        headline={cta['headline'] as string}
        subtext={cta['subtext'] as string}
        ctaLabel={cta['ctaLabel'] as string}
        bgColor={cta['bgColor'] as string}
        textColor={cta['textColor'] as string}
      />
    </div>
  )
}
