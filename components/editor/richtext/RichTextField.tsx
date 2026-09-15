'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { getRichExtensions } from './tiptapSetup'
import { RichToolbar } from './RichToolbar'
import { normalizeRichHtml, toEditorContent } from '@/lib/richtext'

const SAVE_DEBOUNCE_MS = 500

function textLength(html: string): number {
  return html.replace(/<[^>]*>/g, '').length
}

interface RichTextFieldProps {
  id: string
  label: string
  value: string
  multiline?: boolean
  onChange: (value: string) => void
}

export function RichTextField({ id, label, value, multiline, onChange }: RichTextFieldProps) {
  const extensions = useMemo(() => getRichExtensions(), [])
  const onChangeRef = useRef(onChange)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editor = useEditor({
    extensions,
    content: toEditorContent(value ?? ''),
    immediatelyRender: false,
    editorProps: {
      attributes: { 'aria-label': label, id: `${id}-rich` },
    },
  })

  // Sincronizza modifiche esterne (cambio sezione, editing dal canvas) — mai mentre scrivo
  useEffect(() => {
    if (!editor || editor.isFocused) return
    const current = normalizeRichHtml(editor.getHTML())
    const incoming = normalizeRichHtml(value ?? '')
    if (current !== incoming) {
      editor.commands.setContent(toEditorContent(value ?? ''), { emitUpdate: false })
    }
  }, [editor, value])

  // Autosave con debounce + flush su blur/unmount
  useEffect(() => {
    if (!editor) return
    const schedule = () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveTimer.current = null
        onChangeRef.current(normalizeRichHtml(editor.getHTML()))
      }, SAVE_DEBOUNCE_MS)
    }
    const flush = () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current)
        saveTimer.current = null
        onChangeRef.current(normalizeRichHtml(editor.getHTML()))
      }
    }
    editor.on('update', schedule)
    editor.on('blur', flush)
    return () => {
      editor.off('update', schedule)
      editor.off('blur', flush)
      flush()
    }
  }, [editor])

  return (
    <div className="flex flex-col gap-1.5 group">
      <label htmlFor={`${id}-rich`} className="ed-label flex items-center justify-between">
        <span>{label}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300/60 normal-case tracking-normal font-sans font-medium text-[10px]">
          {textLength(value ?? '')} ch · ricco
        </span>
      </label>
      <div className="rounded-xl border border-white/8 bg-white/[0.025] overflow-hidden focus-within:border-cyan-400/50 transition-colors">
        <div className="px-2 pt-2 pb-1.5 border-b border-white/8 bg-black/30">
          <RichToolbar editor={editor} mode={multiline ? 'block' : 'inline'} />
        </div>
        <div className="px-3 py-2.5" style={multiline ? { minHeight: 76 } : undefined}>
          <EditorContent editor={editor} className="rt-field" />
        </div>
      </div>
    </div>
  )
}
