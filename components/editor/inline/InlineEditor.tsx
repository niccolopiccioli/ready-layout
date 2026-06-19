'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEditorStore } from '@/lib/store/editor-context'
import { rt, normalizeRichHtml } from '@/lib/richtext'
import { postToParent } from '@/lib/editor-messaging'
import {
  Bold, Italic, Underline as UnderlineIcon,
  Strikethrough, RemoveFormatting, X, Check,
} from 'lucide-react'

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
            border: '1px solid var(--ed-accent)',
            borderRadius: '4px',
            boxShadow: '0 0 0 3px var(--ed-accent-surface)',
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

const TOOLBAR_H = 44
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
    ],
    content: `<p>${rt(rawValue)}</p>`,
    autofocus: 'end',
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

  // Position: fixed (iframe doesn't scroll) above the element
  const top = rect.top - TOOLBAR_H - PAD
  const left = Math.max(8, Math.min(rect.left - PAD, window.innerWidth - 320 - 8))
  const minWidth = Math.max(rect.width + PAD * 2, 260)

  return createPortal(
    <div
      ref={containerRef}
      data-rich-editor="true"
      style={{ position: 'fixed', top, left, zIndex: 9999, minWidth }}
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          height: TOOLBAR_H,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '0 6px',
          background: 'var(--ed-surface)',
          border: '1px solid var(--ed-border)',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 -4px 12px -4px rgb(0 0 0 / 0.08)',
        }}
      >
        <Btn
          active={editor.isActive('bold')}
          title="Grassetto (⌘B)"
          onAction={() => editor.chain().focus().toggleBold().run()}
        ><Bold size={13} /></Btn>

        <Btn
          active={editor.isActive('italic')}
          title="Corsivo (⌘I)"
          onAction={() => editor.chain().focus().toggleItalic().run()}
        ><Italic size={13} /></Btn>

        <Btn
          active={editor.isActive('underline')}
          title="Sottolineato (⌘U)"
          onAction={() => editor.chain().focus().toggleUnderline().run()}
        ><UnderlineIcon size={13} /></Btn>

        <Btn
          active={editor.isActive('strike')}
          title="Barrato"
          onAction={() => editor.chain().focus().toggleStrike().run()}
        ><Strikethrough size={13} /></Btn>

        <div style={{ width: 1, height: 18, background: 'var(--ed-border)', margin: '0 4px' }} />

        <Btn
          active={false}
          title="Rimuovi formattazione"
          onAction={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        ><RemoveFormatting size={13} /></Btn>

        <div style={{ flex: 1 }} />

        <button
          title="Annulla (Esc)"
          onMouseDown={(e) => { e.preventDefault(); onCancel() }}
          style={{
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 5, color: 'var(--ed-muted)', cursor: 'pointer',
          }}
        ><X size={13} /></button>

        <button
          title="Salva (⌘↵)"
          onMouseDown={(e) => { e.preventDefault(); saveRef.current() }}
          style={{
            height: 28, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5,
            borderRadius: 5, background: 'var(--ed-accent)', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Check size={12} />
          Salva
        </button>
      </div>

      {/* ── Editor body ── */}
      <div
        style={{
          padding: `${PAD}px ${PAD + 2}px`,
          background: 'var(--ed-surface)',
          border: '1px solid var(--ed-border)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 8px 24px -8px rgb(0 0 0 / 0.14)',
          minHeight: rect.height + PAD * 2,
          // Mirror the element's text style
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontFamily: cs.fontFamily,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          color: 'var(--ed-text)',
        }}
      >
        <EditorContent editor={editor} className="rt-editor" />
      </div>

      <div style={{ marginTop: 3, fontSize: 10, color: 'var(--ed-muted)', paddingLeft: PAD + 2 }}>
        ⌘+↵ salva · Esc annulla
      </div>
    </div>,
    document.body
  )
}

/* ─── Toolbar button ─────────────────────────────────────────── */

function Btn({
  active,
  title,
  onAction,
  children,
}: {
  active: boolean
  title: string
  onAction: () => void
  children: React.ReactNode
}) {
  return (
    <button
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onAction() }}
      style={{
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 5,
        background: active ? 'var(--ed-accent-surface)' : 'transparent',
        color: active ? 'var(--ed-accent)' : 'var(--ed-text)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}
