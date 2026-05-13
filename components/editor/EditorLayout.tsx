'use client'

import Link from 'next/link'
import { useEditorStore } from '@/lib/store/editor-context'
import { Canvas } from './Canvas'
import { Sidebar } from './Sidebar'

export function EditorLayout() {
  const templateName = useEditorStore((s) => s.schema.name)
  const templateId = useEditorStore((s) => s.schema.id)

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--ed-bg)' }}>

      <header
        className="h-11 flex items-center justify-between px-4 shrink-0"
        style={{ borderBottom: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[11px] font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-70"
            style={{ color: 'var(--ed-accent)' }}
          >
            SiteGen
          </Link>
          <span style={{ color: 'var(--ed-border)' }}>·</span>
          <span className="text-[13px] font-medium" style={{ color: 'var(--ed-text)' }}>
            {templateName}
          </span>
          <span
            className="text-[10px] font-medium tracking-[0.06em] uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'var(--ed-accent-surface)', color: 'var(--ed-accent)' }}
          >
            bozza
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/preview/${templateId}`}
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

      <div className="flex flex-1 overflow-hidden">
        <Canvas />
        <Sidebar />
      </div>
    </div>
  )
}
