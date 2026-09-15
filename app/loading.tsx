export default function Loading() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--ed-bg)' }}>
      {/* Hero skeleton — full screen, no header */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Background glow placeholders */}
        <div
          className="absolute top-1/4 -left-32 size-[500px] rounded-full opacity-10"
          style={{ background: 'var(--ed-accent)', filter: 'blur(100px)' }}
        />
        <div
          className="absolute bottom-1/4 -right-32 size-[400px] rounded-full opacity-8"
          style={{ background: '#a78bfa', filter: 'blur(100px)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-8 animate-pulse"
            style={{ background: 'var(--ed-surface)', width: '180px', height: '28px' }}
          />
          {/* Heading lines */}
          <div className="h-12 sm:h-16 w-3/4 mx-auto rounded-lg animate-pulse mb-3" style={{ background: 'var(--ed-border)' }} />
          <div className="h-12 sm:h-16 w-1/2 mx-auto rounded-lg animate-pulse mb-3" style={{ background: 'var(--ed-border)' }} />
          <div className="h-12 sm:h-16 w-2/3 mx-auto rounded-lg animate-pulse mb-8" style={{ background: 'var(--ed-border-subtle)' }} />
          {/* Subtitle */}
          <div className="h-4 w-full max-w-2xl mx-auto rounded-full animate-pulse mb-2" style={{ background: 'var(--ed-border-subtle)' }} />
          <div className="h-4 w-2/3 mx-auto rounded-full animate-pulse mb-10" style={{ background: 'var(--ed-border-subtle)' }} />
          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-40 rounded-xl animate-pulse" style={{ background: 'var(--ed-border)' }} />
            <div className="h-12 w-32 rounded-xl animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
          </div>
        </div>
      </div>

      {/* Features skeleton — 2x2 grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-28">
        <div className="text-center mb-16">
          <div className="h-6 w-28 mx-auto rounded-full animate-pulse mb-6" style={{ background: 'var(--ed-border-subtle)' }} />
          <div className="h-9 w-80 mx-auto rounded-lg animate-pulse" style={{ background: 'var(--ed-border)' }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 animate-pulse"
              style={{
                border: '1px solid var(--ed-border)',
                background: 'var(--ed-surface)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="size-11 rounded-xl mb-4 animate-pulse" style={{ background: 'var(--ed-border)' }} />
              <div className="h-5 w-32 rounded-lg mb-2 animate-pulse" style={{ background: 'var(--ed-border)' }} />
              <div className="h-3 w-full rounded-full mb-1.5 animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
              <div className="h-3 w-4/5 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Templates skeleton — grid of cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-32">
        <div className="flex items-baseline justify-between mb-10">
          <div className="h-8 w-32 rounded-lg animate-pulse" style={{ background: 'var(--ed-border)' }} />
          <div className="h-3 w-20 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
        </div>
        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-20 rounded-xl animate-pulse"
              style={{ background: 'var(--ed-surface)', border: '1px solid var(--ed-border)', animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{
                border: '1px solid var(--ed-border)',
                background: 'var(--ed-surface)',
                animationDelay: `${i * 60}ms`,
              }}
            >
              {/* Thumb */}
              <div className="h-40 w-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
              {/* Content */}
              <div className="p-5">
                <div className="flex items-baseline gap-2.5 mb-2">
                  <div className="h-3 w-6 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
                  <div className="h-5 w-32 rounded-lg animate-pulse" style={{ background: 'var(--ed-border)' }} />
                </div>
                <div className="h-3 w-full rounded-full mb-1.5 animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
                <div className="h-3 w-3/4 rounded-full mb-4 animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
                  <div className="h-4 w-4 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-32">
        <div
          className="rounded-3xl px-8 sm:px-16 py-20 text-center animate-pulse"
          style={{ background: 'var(--ed-border)' }}
        >
          <div className="h-10 w-64 mx-auto rounded-lg mb-6" style={{ background: 'var(--ed-border-subtle)' }} />
          <div className="h-4 w-80 mx-auto rounded-full mb-10" style={{ background: 'var(--ed-border-subtle)' }} />
          <div className="h-12 w-32 mx-auto rounded-xl" style={{ background: 'var(--ed-border-subtle)' }} />
        </div>
      </div>

      {/* Footer skeleton */}
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-wrap items-center justify-between gap-3"
        style={{ borderTop: '1px solid var(--ed-border)' }}
      >
        <div className="h-5 w-48 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
        <div className="h-3 w-20 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
      </div>
    </main>
  )
}
