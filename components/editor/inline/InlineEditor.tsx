'use client'

import { useState, useRef, useEffect, useMemo, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import { useEditorStore } from '@/lib/store/editor-context'
import { normalizeRichHtml, toEditorContent } from '@/lib/richtext'
import { postToParent } from '@/lib/editor-messaging'
import { getRichExtensions } from '../richtext/tiptapSetup'
import { RichToolbar } from '../richtext/RichToolbar'
import { X, Check } from 'lucide-react'

interface ActiveField {
  sectionId: string
  fieldId: string
  element: HTMLElement
}

export function InlineEditor({ children }: { children: ReactNode }) {
  const [activeField, setActiveField] = useState<ActiveField | null>(null)
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null)
  const updateField = useEditorStore((s) => s.updateField)

  const handleMouseOver = (e: React.MouseEvent) => {
    if (activeField) return
    const field = (e.target as HTMLElement).closest('[data-field]') as HTMLElement | null
    if (!field || field.getAttribute('data-field-type') !== 'text') {
      setHoveredRect(null)
      return
    }
    setHoveredRect(field.getBoundingClientRect())
    e.stopPropagation()
  }

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-rich-editor]')) return

    const field = (e.target as HTMLElement).closest('[data-field]') as HTMLElement | null
    if (!field) { setActiveField(null); return }

    const section = (e.target as HTMLElement).closest('[data-section]')
    if (!section) return

    const sectionId = section.getAttribute('data-section')
    const fieldId = field.getAttribute('data-field')
    if (sectionId && fieldId && field.getAttribute('data-field-type') === 'text') {
      setActiveField({ sectionId, fieldId, element: field })
      setHoveredRect(null)
      postToParent({ type: 'readylayout-section-active', sectionId })
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleSave = (sectionId: string, fieldId: string, html: string) => {
    updateField(sectionId, fieldId, html)
    setActiveField(null)
  }

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={() => { if (!activeField) setHoveredRect(null) }}
      onClick={handleClick}
      data-editor-canvas="true"
    >
      {children}

      {hoveredRect && !activeField && (
        <div
          className="fixed pointer-events-none z-40"
          style={{
            left: hoveredRect.left - 3,
            top: hoveredRect.top - 3,
            width: hoveredRect.width + 6,
            height: hoveredRect.height + 6,
            border: '1.5px solid #00e5ff',
            borderRadius: '10px',
            boxShadow: '0 0 0 4px rgba(0,229,255,0.15), 0 0 24px rgba(0,229,255,0.3)',
          }}
        />
      )}

      {activeField && (
        <RichTextOverlay
          key={`${activeField.sectionId}:${activeField.fieldId}`}
          sectionId={activeField.sectionId}
          fieldId={activeField.fieldId}
          element={activeField.element}
          onSave={handleSave}
          onCancel={() => setActiveField(null)}
        />
      )}
    </div>
  )
}

/* ─── Rich-text overlay ──────────────────────────────────────── */

const PAD = 6

interface OverlayProps {
  sectionId: string
  fieldId: string
  element: HTMLElement
  onSave: (sectionId: string, fieldId: string, html: string) => void
  onCancel: () => void
}

function RichTextOverlay({ sectionId, fieldId, element, onSave, onCancel }: OverlayProps) {
  const values = useEditorStore((s) => s.values)
  const rawValue = (values[sectionId]?.[fieldId] as string) ?? ''

  const rect = element.getBoundingClientRect()
  const cs = window.getComputedStyle(element)

  const extensions = useMemo(() => getRichExtensions(), [])
  const editor = useEditor({
    extensions,
    content: toEditorContent(rawValue),
    autofocus: 'end',
    immediatelyRender: false,
  })

  // Stable save ref so effects can call the latest version
  const saveRef = useRef<() => void>(() => {})
  useEffect(() => {
    saveRef.current = () => {
      if (!editor) return
      onSave(sectionId, fieldId, normalizeRichHtml(editor.getHTML()))
    }
  }, [editor, onSave, sectionId, fieldId])

  // Hide original element while editing (query DOM to avoid mutating the element prop)
  useEffect(() => {
    const el = document.querySelector(
      `[data-section="${sectionId}"] [data-field="${fieldId}"]`
    ) as HTMLElement | null
    if (!el) return
    el.style.opacity = '0'
    return () => { el.style.opacity = '' }
  }, [sectionId, fieldId])

  // Click-outside → save; Escape → cancel; Cmd+Enter → save
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) saveRef.current()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onCancel() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); saveRef.current() }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  if (typeof window === 'undefined' || !editor) return null

  // Position: fixed (iframe doesn't scroll) — sopra l'elemento se c'è spazio, altrimenti sotto
  const overlayWidth = Math.min(Math.max(rect.width + PAD * 2, 320), window.innerWidth - 16)
  const left = Math.max(8, Math.min(rect.left - PAD, window.innerWidth - overlayWidth - 8))
  const above = rect.top - 170 - PAD
  const top = above >= 8 ? above : Math.max(8, Math.min(rect.bottom + PAD, window.innerHeight - 240))
  const minWidth = overlayWidth

  return createPortal(
    <div
      ref={containerRef}
      data-rich-editor="true"
      style={{ position: 'fixed', top, left, zIndex: 9999, minWidth }}
    >
      {/* ── Toolbar ricca completa ── */}
      <div
        style={{
          padding: '8px 8px 7px',
          background: 'rgba(10,10,18,0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,229,255,0.35)',
          borderRadius: '14px 14px 0 0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(0,229,255,0.15)',
        }}
      >
        <RichToolbar editor={editor} mode="block" />
      </div>

      {/* ── Editor body ── */}
      <div
        style={{
          padding: `${PAD}px ${PAD + 2}px`,
          background: 'rgba(10,10,18,0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,229,255,0.35)',
          borderTop: 'none',
          borderRadius: '0 0 14px 14px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,229,255,0.1)',
          minHeight: rect.height + PAD * 2,
          // Mirror the element's text style
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontFamily: cs.fontFamily,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          color: '#fff',
        }}
      >
        <EditorContent editor={editor} className="rt-editor" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 6,
          padding: '7px 8px 7px 10px',
          background: 'rgba(10,10,18,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,229,255,0.25)',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        }}
      >
        <span style={{ fontSize: 10, color: 'rgba(125,243,255,0.75)', fontFamily: 'monospace', letterSpacing: '0.08em', flex: 1 }}>
          ⌘+↵ SALVA · ESC ANNULLA
        </span>
        <button
          title="Annulla (Esc)"
          onMouseDown={(e) => { e.preventDefault(); onCancel() }}
          className="ed-press"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            height: 28, padding: '0 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.08)', color: '#fff',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <X size={12} /> Annulla
        </button>
        <button
          title="Salva (⌘↵)"
          onMouseDown={(e) => { e.preventDefault(); saveRef.current() }}
          className="ed-press"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            height: 28, padding: '0 12px', borderRadius: 8,
            background: 'linear-gradient(135deg,#00e5ff,#4f7cff)', color: '#02060a',
            fontSize: 11, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 2px 14px rgba(0,229,255,0.4)',
          }}
        >
          <Check size={12} strokeWidth={3} /> Salva
        </button>
      </div>
    </div>,
    document.body
  )
}
