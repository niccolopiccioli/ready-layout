'use client'

import Link from 'next/link'
import { Canvas } from './Canvas'
import { Sidebar } from './Sidebar'

export function EditorLayout() {
  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--ed-bg)' }}>

      {/* Topbar */}
      <header
        className="h-11 flex items-center justify-between px-4 shrink-0"
        style={{ borderBottom: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
      >
        {/* Left: wordmark + template name */}
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-semibold tracking-[0.12em] uppercase"
            style={{ color: 'var(--ed-accent)' }}
          >
            SiteGen
          </span>
          <span style={{ color: 'var(--ed-border)' }}>·</span>
          <span className="text-[13px] font-medium" style={{ color: 'var(--ed-text)' }}>
            Startup Launchpad
          </span>
          <span
            className="text-[10px] font-medium tracking-[0.06em] uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'var(--ed-accent-surface)', color: 'var(--ed-accent)' }}
          >
            bozza
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/preview/demo"
            target="_blank"
            className="text-[12px] font-medium px-3 py-1.5 rounded transition-colors"
            style={{ color: 'var(--ed-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ed-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ed-secondary)')}
          >
            Preview ↗
          </Link>
          <button
            className="text-[12px] font-medium px-3 py-1.5 rounded transition-opacity hover:opacity-85"
            style={{ background: 'var(--ed-accent)', color: 'var(--ed-canvas)' }}
          >
            Pubblica
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Canvas />
        <Sidebar />
      </div>
    </div>
  )
}
