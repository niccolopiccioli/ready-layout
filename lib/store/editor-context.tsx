'use client'

import { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createEditorStore, type EditorStore, type EditorState } from './editor.store'
import type { TemplateSchema } from '@/lib/schemas/types'

const EditorContext = createContext<EditorStore | null>(null)

interface EditorProviderProps {
  schema: TemplateSchema
  children: ReactNode
}

export function EditorProvider({ schema, children }: EditorProviderProps) {
  const store = useMemo(() => createEditorStore(schema), [schema.id])

  // Receive updates written by other contexts (e.g. inline edits from the canvas iframe)
  useEffect(() => {
    const key = `readylayout-${schema.id}`
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key || !e.newValue) return
      try {
        const { values, sectionOrder, elementOrder, sections } = JSON.parse(e.newValue)
        store.setState({
          values,
          sectionOrder,
          elementOrder: elementOrder ?? {},
          ...(sections ? { sections } : {}),
        })
      } catch {}
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [store, schema.id])

  return (
    <EditorContext.Provider value={store}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorStore<T>(selector: (state: EditorState) => T): T {
  const store = useContext(EditorContext)
  if (!store) throw new Error('useEditorStore must be used within EditorProvider')
  return useStore(store, selector)
}

export function useEditorStoreApi(): EditorStore {
  const store = useContext(EditorContext)
  if (!store) throw new Error('useEditorStoreApi must be used within EditorProvider')
  return store
}

/**
 * Returns true when an EditorProvider is present in the tree.
 * Use to gate editor-only UI (drag handles, overlays) in components shared with /preview.
 */
export function useIsEditorContext(): boolean {
  return useContext(EditorContext) !== null
}