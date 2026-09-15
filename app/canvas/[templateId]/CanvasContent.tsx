'use client'

import { useEffect, useState } from 'react'
import { EditorProvider, useEditorStore } from '@/lib/store/editor-context'
import { TemplateRenderer } from '@/components/TemplateRenderer'
import { InlineEditor } from '@/components/editor/inline/InlineEditor'
import { ImageEditor } from '@/components/editor/inline/ImageEditor'
import { postToParent } from '@/lib/editor-messaging'
import { migrateFontVar } from '@/lib/fonts'
import type { TemplateSchema } from '@/lib/schemas/types'

function HeightReporter() {
  useEffect(() => {
    const report = () =>
      postToParent({
        type: 'readylayout-resize',
        height: document.documentElement.scrollHeight,
      })

    const observer = new ResizeObserver(report)
    observer.observe(document.documentElement)
    report()
    return () => observer.disconnect()
  }, [])

  return null
}

function CanvasRenderer() {
  const schema = useEditorStore(s => s.schema)
  const values = useEditorStore(s => s.values)
  // '' sia su server che al primo render client → nessun mismatch hydration.
  // Il font salvato viene letto solo dopo il mount.
  const [fontFamily, setFontFamily] = useState('')

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const raw = localStorage.getItem('readylayout-font')
      if (raw) setFontFamily(migrateFontVar(raw))
    })
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'readylayout-font') setFontFamily(e.newValue ? migrateFontVar(e.newValue) : '')
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return (
    <div style={{ fontFamily: fontFamily || 'inherit', margin: 0, padding: 0 }}>
      <InlineEditor>
        <ImageEditor>
          <TemplateRenderer schema={schema} values={values} />
        </ImageEditor>
      </InlineEditor>
    </div>
  )
}

export function CanvasContent({ schema }: { schema: TemplateSchema }) {
  return (
    <>
      <style>{`body { margin: 0; padding: 0; overflow-x: hidden; }`}</style>
      <EditorProvider schema={schema}>
        <HeightReporter />
        <CanvasRenderer />
      </EditorProvider>
    </>
  )
}
