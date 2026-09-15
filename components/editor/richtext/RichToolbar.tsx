'use client'

import { useEffect, useReducer, useState } from 'react'
import type { Editor } from '@tiptap/core'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Heading1, Heading2, Heading3, Pilcrow,
  Link2, Unlink, RemoveFormatting, Check, Highlighter,
} from 'lucide-react'
import { FONT_SIZE_STEPS } from './tiptapSetup'

interface RichToolbarProps {
  editor: Editor | null
  /** 'inline' = solo formattazione carattere · 'block' = + titoli, liste, allineamento */
  mode: 'inline' | 'block'
}

function normalizeHref(raw: string): string {
  const s = raw.trim()
  if (!s) return ''
  if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(s)) return s
  return `https://${s}`
}

function currentFontPx(editor: Editor): number | null {
  const fs = editor.getAttributes('textStyle').fontSize as string | undefined
  if (!fs) return null
  const n = parseInt(fs, 10)
  return Number.isFinite(n) ? n : null
}

function stepFont(editor: Editor, dir: 1 | -1): void {
  const cur = currentFontPx(editor) ?? 16
  const steps = FONT_SIZE_STEPS
  let next: number
  if (dir === 1) {
    next = steps.find((s) => s > cur + 0.5) ?? steps[steps.length - 1]
  } else {
    const lower = [...steps].reverse().find((s) => s < cur - 0.5)
    next = lower ?? steps[0]
  }
  editor.chain().focus().setFontSize(`${next}px`).run()
}

export function RichToolbar({ editor, mode }: RichToolbarProps) {
  const [, force] = useReducer((x: number) => x + 1, 0)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  useEffect(() => {
    if (!editor) return
    const bump = () => force()
    editor.on('selectionUpdate', bump)
    editor.on('update', bump)
    return () => {
      editor.off('selectionUpdate', bump)
      editor.off('update', bump)
    }
  }, [editor])

  if (!editor) return null

  const openLinkRow = () => {
    setLinkUrl((editor.getAttributes('link').href as string) || '')
    setLinkOpen(true)
  }

  const applyLink = () => {
    const href = normalizeHref(linkUrl)
    if (!href) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else if (editor.isActive('link')) {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    } else {
      editor.chain().focus().setLink({ href }).run()
    }
    setLinkOpen(false)
  }

  const textColor = (editor.getAttributes('textStyle').color as string) || '#ffffff'
  const markColor = (editor.getAttributes('highlight').color as string) || '#facc15'
  const fontPx = currentFontPx(editor)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-[3px]">
        <ToolBtn title="Grassetto (⌘B)" active={editor.isActive('bold')} onAction={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={13} />
        </ToolBtn>
        <ToolBtn title="Corsivo (⌘I)" active={editor.isActive('italic')} onAction={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={13} />
        </ToolBtn>
        <ToolBtn title="Sottolineato (⌘U)" active={editor.isActive('underline')} onAction={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={13} />
        </ToolBtn>
        <ToolBtn title="Barrato" active={editor.isActive('strike')} onAction={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={13} />
        </ToolBtn>

        <Sep />

        {/* Dimensione testo */}
        <ToolBtn title="Riduci dimensione" onAction={() => stepFont(editor, -1)}>
          <span className="text-[11px] font-extrabold leading-none">A−</span>
        </ToolBtn>
        <span className="font-hud min-w-[38px] text-center text-[10px] tabular-nums" style={{ color: 'var(--ed-muted)' }}>
          {fontPx ? `${fontPx}` : 'Aa'}
        </span>
        <ToolBtn title="Aumenta dimensione" onAction={() => stepFont(editor, 1)}>
          <span className="text-[13px] font-extrabold leading-none">A+</span>
        </ToolBtn>

        {/* Colore testo */}
        <label
          title="Colore testo"
          className="ed-press relative grid place-items-center cursor-pointer"
          style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: editor.isActive('textStyle') ? 'rgba(0,229,255,0.18)' : 'transparent',
            border: editor.isActive('textStyle') ? '1px solid rgba(0,229,255,0.4)' : '1px solid transparent',
          }}
        >
          <span className="text-[13px] font-extrabold leading-none" style={{ color: textColor, textShadow: '0 0 1px #000' }}>A</span>
          <span className="absolute bottom-[5px] left-[7px] right-[7px] rounded-full" style={{ height: 3, background: textColor }} />
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(textColor) ? textColor : '#ffffff'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Colore testo"
          />
        </label>

        {/* Evidenziatore */}
        <label
          title="Evidenzia testo"
          className="ed-press relative grid place-items-center cursor-pointer"
          style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: editor.isActive('highlight') ? 'rgba(0,229,255,0.18)' : 'transparent',
            border: editor.isActive('highlight') ? '1px solid rgba(0,229,255,0.4)' : '1px solid transparent',
            color: 'var(--ed-text)',
          }}
        >
          <Highlighter size={13} />
          <span className="absolute bottom-[5px] left-[7px] right-[7px] rounded-full" style={{ height: 3, background: markColor }} />
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(markColor) ? markColor : '#facc15'}
            onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Colore evidenziatore"
          />
        </label>

        {/* Link */}
        <ToolBtn title="Aggiungi link" active={editor.isActive('link')} onAction={openLinkRow}>
          <Link2 size={13} />
        </ToolBtn>
        {editor.isActive('link') && (
          <ToolBtn title="Rimuovi link" onAction={() => editor.chain().focus().unsetLink().run()}>
            <Unlink size={13} />
          </ToolBtn>
        )}

        <Sep />

        {/* Allineamento */}
        <ToolBtn title="Allinea a sinistra" active={editor.isActive({ textAlign: 'left' })} onAction={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft size={13} />
        </ToolBtn>
        <ToolBtn title="Centra" active={editor.isActive({ textAlign: 'center' })} onAction={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter size={13} />
        </ToolBtn>
        <ToolBtn title="Allinea a destra" active={editor.isActive({ textAlign: 'right' })} onAction={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight size={13} />
        </ToolBtn>
        <ToolBtn title="Giustifica" active={editor.isActive({ textAlign: 'justify' })} onAction={() => editor.chain().focus().setTextAlign('justify').run()}>
          <AlignJustify size={13} />
        </ToolBtn>

        {mode === 'block' && (
          <>
            <Sep />
            <ToolBtn title="Titolo grande" active={editor.isActive('heading', { level: 1 })} onAction={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 size={13} />
            </ToolBtn>
            <ToolBtn title="Titolo medio" active={editor.isActive('heading', { level: 2 })} onAction={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 size={13} />
            </ToolBtn>
            <ToolBtn title="Titolo piccolo" active={editor.isActive('heading', { level: 3 })} onAction={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 size={13} />
            </ToolBtn>
            <ToolBtn title="Testo normale" active={editor.isActive('paragraph')} onAction={() => editor.chain().focus().setParagraph().run()}>
              <Pilcrow size={13} />
            </ToolBtn>
            <ToolBtn title="Elenco puntato" active={editor.isActive('bulletList')} onAction={() => editor.chain().focus().toggleBulletList().run()}>
              <List size={13} />
            </ToolBtn>
            <ToolBtn title="Elenco numerato" active={editor.isActive('orderedList')} onAction={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered size={13} />
            </ToolBtn>
          </>
        )}

        <Sep />

        <ToolBtn title="Rimuovi formattazione" onAction={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <RemoveFormatting size={13} />
        </ToolBtn>
      </div>

      {/* Riga link */}
      {linkOpen && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); applyLink() }
              if (e.key === 'Escape') setLinkOpen(false)
            }}
            placeholder="https://…"
            autoFocus
            className="ed-input flex-1 min-w-0"
            style={{ fontSize: 12, padding: '6px 9px' }}
            spellCheck={false}
          />
          <button
            onMouseDown={(e) => { e.preventDefault(); applyLink() }}
            className="ed-press grid place-items-center shrink-0"
            title="Applica link"
            style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#00e5ff,#4f7cff)', color: '#02060a' }}
          >
            <Check size={13} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  )
}

function Sep() {
  return <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', margin: '0 3px', flexShrink: 0 }} />
}

function ToolBtn({
  active = false,
  title,
  onAction,
  children,
}: {
  active?: boolean
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
        borderRadius: 7,
        background: active ? 'rgba(0,229,255,0.18)' : 'transparent',
        color: active ? '#7df3ff' : 'rgba(255,255,255,0.75)',
        border: active ? '1px solid rgba(0,229,255,0.4)' : '1px solid transparent',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}
