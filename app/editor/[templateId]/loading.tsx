export default function EditorLoading() {
  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--ed-bg)' }}>
      {/* Header */}
      <div
        className="h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 shrink-0"
        style={{ borderBottom: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
      >
        {/* Left: logo + template name */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-28 rounded-md animate-pulse" style={{ background: 'var(--ed-border)' }} />
          <div className="hidden lg:flex flex-col gap-2">
            <div className="h-2.5 w-10 rounded-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
            <div className="h-5 w-32 rounded-md animate-pulse" style={{ background: 'var(--ed-border)' }} />
          </div>
        </div>

        {/* Center: device switcher */}
        <div
          className="flex items-center gap-1 rounded-xl p-1.5"
          style={{ background: 'var(--ed-bg)', border: '1px solid var(--ed-border)' }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-12 rounded-lg animate-pulse"
              style={{ background: 'var(--ed-border)', animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        {/* Right: toolbar */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-10 rounded-lg animate-pulse"
              style={{ background: 'var(--ed-border)', animationDelay: `${i * 50}ms` }}
            />
          ))}
          <div className="h-10 w-24 rounded-lg animate-pulse" style={{ background: 'var(--ed-accent-surface)' }} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1" style={{ background: 'var(--ed-bg)' }}>
          <div className="h-full animate-pulse" style={{ background: 'var(--ed-border-subtle)' }} />
        </div>

        {/* Sidebar */}
        <div
          className="w-72 shrink-0"
          style={{ borderLeft: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
        >
          <div className="p-4 flex flex-col gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg animate-pulse"
                style={{
                  height: i % 3 === 0 ? '28px' : '40px',
                  background: i % 3 === 0 ? 'var(--ed-border-subtle)' : 'var(--ed-border)',
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
