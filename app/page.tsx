import { templates } from '@/lib/templates'
import { TemplateList } from '@/components/TemplateList'
import { HeroSection } from '@/components/HeroSection'
import { FeatureSection } from '@/components/FeatureSection'
import { CTASection } from '@/components/CTASection'
import type { TemplateSchema } from '@/lib/schemas/types'

function extractColors(schema: TemplateSchema): { accent: string; bg: string } {
  for (const section of schema.sections) {
    const accent = section.fields.find((f) => f.id === 'accentColor')
    const bg = section.fields.find((f) => f.id === 'bgColor')
    if (accent && accent.type === 'color') {
      return {
        accent: (accent as { default: string }).default,
        bg: bg && bg.type === 'color' ? (bg as { default: string }).default : '#ffffff',
      }
    }
  }
  return { accent: '#00e5ff', bg: '#ffffff' }
}

export default function HomePage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#05050a' }}>
      <HeroSection />
      <FeatureSection />

      {/* Catalogo */}
      <section id="templates" className="relative w-full px-4 sm:px-8 pb-24 scroll-mt-8">
        <div className="text-center mb-10">
          <span className="rl-chip"><span className="dot" /> CATALOGO MODULI</span>
          <h2 className="font-display font-black tracking-tight mt-6 leading-[0.95]" style={{ fontSize: 'clamp(32px,5vw,58px)' }}>
            Scegli il tuo <span className="rl-neon-text">punto di salto.</span>
          </h2>
          <p className="text-[15px] text-white/50 mt-4 max-w-lg mx-auto leading-relaxed">
            {templates.length} template iper-personalizzabili. Ognuno è un universo: colori, font, sezioni, contenuti.
          </p>
        </div>
        <TemplateList
          templates={templates.map(({ id, name, description, category, sections }) => {
            const colors = extractColors({ id, name, description, category, sections })
            return { id, name, description, category, accentColor: colors.accent, bgColor: colors.bg }
          })}
        />
      </section>

      <CTASection />

      <footer className="border-t border-white/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg" style={{ background: 'linear-gradient(135deg,#00e5ff,#7c3aed)', boxShadow: '0 0 18px rgba(0,229,255,0.4)' }} />
            <span className="font-display font-extrabold text-[14px] tracking-tight">READY<span className="rl-neon-text">LAYOUT</span></span>
            <span className="font-hud text-[9px] tracking-[0.24em] text-white/30 hidden sm:inline">— VISUAL ENGINE FOR THE FUTURE WEB</span>
          </div>
          <div className="font-hud text-[10px] tracking-[0.2em] text-white/30 flex items-center gap-4">
            <span>SYS.ONLINE <span className="text-emerald-400">●</span></span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
