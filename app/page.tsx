import Link from 'next/link'
import { templates } from '@/lib/templates'

const categoryLabel: Record<string, string> = {
  landing: 'Landing',
  portfolio: 'Portfolio',
  commerce: 'Commerce',
  content: 'Content',
  event: 'Event',
  personal: 'Personal',
}

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--ed-bg)', color: 'var(--ed-text)' }}>

      <header
        className="h-11 flex items-center justify-between px-6 sticky top-0 z-10"
        style={{ borderBottom: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
      >
        <span
          className="text-[11px] font-semibold tracking-[0.12em] uppercase"
          style={{ color: 'var(--ed-accent)' }}
        >
          SiteGen
        </span>
        <span className="text-[12px]" style={{ color: 'var(--ed-secondary)' }}>
          {templates.length} template disponibili
        </span>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <span className="ed-label" style={{ color: 'var(--ed-accent)' }}>
          Editor visuale
        </span>
        <h1
          className="text-5xl md:text-6xl font-medium tracking-tight mt-3 mb-6"
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

      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div
          className="flex items-baseline justify-between mb-8"
          style={{ borderBottom: '1px solid var(--ed-border)', paddingBottom: '12px' }}
        >
          <span className="ed-label">Template</span>
          <span className="ed-label">Categoria</span>
        </div>

        <ul className="flex flex-col">
          {templates.map((template, i) => (
            <li
              key={template.id}
              style={{ borderBottom: i < templates.length - 1 ? '1px solid var(--ed-border-subtle)' : 'none' }}
            >
              <Link
                href={`/editor/${template.id}`}
                className="group flex items-baseline justify-between gap-8 py-7 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span
                      className="text-[11px] font-mono tabular-nums"
                      style={{ color: 'var(--ed-muted)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2
                      className="text-[28px] md:text-[34px] font-medium tracking-tight leading-tight"
                      style={{ color: 'var(--ed-text)' }}
                    >
                      <span
                        className="transition-all group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[6px]"
                        style={{ textDecorationColor: 'var(--ed-accent)' }}
                      >
                        {template.name}
                      </span>
                    </h2>
                  </div>
                  {template.description && (
                    <p
                      className="text-[14px] leading-relaxed ml-7 max-w-2xl"
                      style={{ color: 'var(--ed-secondary)' }}
                    >
                      {template.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6 shrink-0 ml-4">
                  {template.category && (
                    <span
                      className="text-[11px] font-medium tracking-[0.08em] uppercase"
                      style={{ color: 'var(--ed-muted)' }}
                    >
                      {categoryLabel[template.category] ?? template.category}
                    </span>
                  )}
                  <span
                    className="text-[18px] transition-transform group-hover:translate-x-1"
                    style={{ color: 'var(--ed-accent)' }}
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer
        className="max-w-5xl mx-auto px-6 py-10 flex items-center justify-between text-[12px]"
        style={{ borderTop: '1px solid var(--ed-border)', color: 'var(--ed-muted)' }}
      >
        <span>SiteGen — Editor visuale per siti web professionali</span>
        <span>v0.1 · Phase A</span>
      </footer>

    </main>
  )
}
