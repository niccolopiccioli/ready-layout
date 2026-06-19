import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--ed-bg)', color: 'var(--ed-text)' }}
    >
      <span className="ed-label" style={{ color: 'var(--ed-accent)', fontSize: '11px' }}>404</span>
      <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mt-4 mb-4">
        Pagina non trovata
      </h1>
      <p
        className="text-[16px] leading-relaxed mb-10 max-w-[40ch]"
        style={{ color: 'var(--ed-secondary)' }}
      >
        La pagina che cerchi non esiste o è stata spostata.
      </p>
      <Link
        href="/"
        className="ed-press inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[15px] font-medium"
        style={{ background: 'var(--ed-accent)', color: 'var(--ed-canvas)' }}
      >
        Torna alla home →
      </Link>
    </main>
  )
}
