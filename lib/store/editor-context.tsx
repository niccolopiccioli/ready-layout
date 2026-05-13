'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createEditorStore, type EditorStore, type EditorState } from './editor.store'
import type { TemplateSchema } from '@/lib/schemas/types'

const EditorContext = createContext<EditorStore | null>(null)

interface EditorProviderProps {
  schema: TemplateSchema
  children: ReactNode
}

export function EditorProvider({ schema, children }: EditorProviderProps) {
  const storeRef = useRef<EditorStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createEditorStore(schema)
  }
  return (
    <EditorContext.Provider value={storeRef.current}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorStore<T>(selector: (state: EditorState) => T): T {
  const store = useContext(EditorContext)
  if (!store) throw new Error('useEditorStore must be used within EditorProvider')
  return useStore(store, selector)
}
