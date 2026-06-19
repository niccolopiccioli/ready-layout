import Image from 'next/image'
import { templates } from '@/lib/templates'
import { TemplateList } from '@/components/TemplateList'

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--ed-bg)', color: 'var(--ed-text)' }}>

      <header
        className="h-20 flex items-center px-4 sticky top-0 z-10"
        style={{ borderBottom: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
      >
        <Image
          src="/website-icon.png"
          alt="ReadyLayout"
          width={300}
          height={300}
          className="object-contain"
          style={{ width: '180px', height: 'auto' }}
        />
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <span className="ed-label" style={{ color: 'var(--ed-accent)' }}>
          Editor visuale
        </span>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mt-3 mb-6"
          style={{ color: 'var(--ed-text)', maxWidth: '20ch', lineHeight: '1.05' }}
        >
          Costruisci il tuo sito.<br />
          Senza scrivere codice.
        </h1>
        <p
          className="text-[17px] leading-relaxed max-w-prose"
          style={{ color: 'var(--ed-secondary)' }}
        >
          Dieci template progettati per portfolio, ristoranti, blog, e-commerce.
          Scegli un punto di partenza, personalizza ogni dettaglio dal pannello di editing.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-32">
        <span
          className="ed-label block mb-8"
          style={{ borderBottom: '1px solid var(--ed-border)', paddingBottom: '12px' }}
        >
          Template
        </span>
        <TemplateList
          templates={templates.map(({ id, name, description, category }) => ({
            id,
            name,
            description,
            category,
          }))}
        />
      </section>

      <footer
        className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-wrap items-center justify-between gap-3 text-[12px]"
        style={{ borderTop: '1px solid var(--ed-border)', color: 'var(--ed-muted)' }}
      >
        <span>ReadyLayout — Editor visuale per siti web professionali</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>

    </main>
  )
}
