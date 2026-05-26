'use client'

import { useEffect, useState } from 'react'
import { EditorProvider, useEditorStore, useEditorStoreApi } from '@/lib/store/editor-context'
import { TemplateRenderer } from '@/components/TemplateRenderer'
import { InlineEditor } from '@/components/editor/inline/InlineEditor'
import { ImageEditor } from '@/components/editor/inline/ImageEditor'
import type { TemplateSchema } from '@/lib/schemas/types'

// Syncs canvas store when the parent editor writes to localStorage
function StorageSyncer() {
  const storeApi = useEditorStoreApi()

  useEffect(() => {
    const { schema } = storeApi.getState()
    const key = `readylayout-${schema.id}`

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key || !e.newValue) return
      try {
        const { values, sectionOrder, elementOrder, sections } = JSON.parse(e.newValue)
        storeApi.setState({
          values,
          sectionOrder,
          elementOrder: elementOrder ?? {},
          ...(sections ? { sections } : {}),
        })
      } catch {}
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [storeApi])

  return null
}

// Tells the parent iframe how tall the content is so it can resize the iframe element
function HeightReporter() {
  useEffect(() => {
    const report = () =>
      window.parent.postMessage(
        { type: 'readylayout-resize', height: document.documentElement.scrollHeight },
        '*'
      )

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
  const [fontFamily, setFontFamily] = useState('')

  useEffect(() => {
    setFontFamily(localStorage.getItem('readylayout-font') || '')

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
        <StorageSyncer />
        <HeightReporter />
        <CanvasRenderer />
      </EditorProvider>
    </>
  )
}
