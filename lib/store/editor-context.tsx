'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createEditorStore, type EditorStore, type EditorState } from './editor.store'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'

const EditorContext = createContext<EditorStore | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<EditorStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createEditorStore(startupLaunchpadSchema)
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
