export default function Loading() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--ed-bg)' }}>
      {/* Header */}
      <div
        className="h-20 flex items-center px-4"
        style={{ borderBottom: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
      >
        <div
          className="h-7 w-36 rounded-md animate-pulse"
          style={{ background: 'var(--ed-border)' }}
        />
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="h-2.5 w-20 rounded-full animate-pulse mb-5" style={{ background: 'var(--ed-border)' }} />
        <div className="h-10 sm:h-12 w-4/5 rounded-lg animate-pulse mb-3" style={{ background: 'var(--ed-border)' }} />
        <div className="h-10 sm:h-12 w-1/2 rounded-lg animate-pulse mb-8" style={{ background: 'var(--ed-border)' }} />
        <div className="h-4 w-full max-w-prose rounded-full animate-pulse mb-2" style={{ background: 'var(--ed-border-subtle)' }} />
        <div className="h-4 w-2/3 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
      </div>

      {/* Template list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-32">
        <div
          className="flex items-center justify-between mb-8 pb-3"
          style={{ borderBottom: '1px solid var(--ed-border)' }}
        >
          <div className="h-2.5 w-20 rounded-full animate-pulse" style={{ background: 'var(--ed-border)' }} />
          <div className="h-2.5 w-16 rounded-full animate-pulse" style={{ background: 'var(--ed-border)' }} />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 py-7"
            style={{ borderBottom: '1px solid var(--ed-border-subtle)' }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="h-3 w-6 rounded-full animate-pulse shrink-0"
                style={{ background: 'var(--ed-border-subtle)', animationDelay: `${i * 80}ms` }}
              />
              <div
                className="h-7 sm:h-9 w-48 rounded-lg animate-pulse"
                style={{ background: 'var(--ed-border)', animationDelay: `${i * 80}ms` }}
              />
            </div>
            <div
              className="h-2.5 w-14 rounded-full animate-pulse shrink-0"
              style={{ background: 'var(--ed-border-subtle)', animationDelay: `${i * 80}ms` }}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
