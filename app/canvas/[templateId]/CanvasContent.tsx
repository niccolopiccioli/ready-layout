'use client'

import { useEffect, useState } from 'react'
import { EditorProvider, useEditorStore } from '@/lib/store/editor-context'
import { TemplateRenderer } from '@/components/TemplateRenderer'
import { InlineEditor } from '@/components/editor/inline/InlineEditor'
import { ImageEditor } from '@/components/editor/inline/ImageEditor'
import { postToParent } from '@/lib/editor-messaging'
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
  const [fontFamily, setFontFamily] = useState(
    () => (typeof window !== 'undefined' ? localStorage.getItem('readylayout-font') || '' : '')
  )

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'readylayout-font') setFontFamily(e.newValue || '')
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
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
