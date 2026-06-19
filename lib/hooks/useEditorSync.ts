'use client'

import { useEffect } from 'react'
import type { EditorStore } from '@/lib/store/editor.store'
import { subscribeEditorSync, type EditorPersistPayload } from '@/lib/editor-sync'

function applyPayload(store: EditorStore, payload: EditorPersistPayload): void {
  store.setState({
    values: payload.values,
    sectionOrder: payload.sectionOrder,
    elementOrder: payload.elementOrder ?? {},
    ...(payload.sections ? { sections: payload.sections } : {}),
  })
}

/** Keeps a Zustand editor store in sync with other frames (sidebar ↔ canvas iframe). */
export function useEditorSync(store: EditorStore, templateId: string): void {
  useEffect(() => {
    return subscribeEditorSync(templateId, (payload) => applyPayload(store, payload))
  }, [store, templateId])
}
