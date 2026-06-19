'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createEditorStore, type EditorStore, type EditorState } from './editor.store'
import type { TemplateSchema } from '@/lib/schemas/types'
import { useEditorSync } from '@/lib/hooks/useEditorSync'

const EditorContext = createContext<EditorStore | null>(null)

interface EditorProviderProps {
  schema: TemplateSchema
  children: ReactNode
}

function EditorSync({ store, templateId }: { store: EditorStore; templateId: string }) {
  useEditorSync(store, templateId)
  return null
}

export function EditorProvider({ schema, children }: EditorProviderProps) {
  const store = useMemo(() => createEditorStore(schema), [schema.id])

  return (
    <EditorContext.Provider value={store}>
      <EditorSync store={store} templateId={schema.id} />
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
