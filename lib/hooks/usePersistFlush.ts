'use client'

import { useEffect } from 'react'
import { flushEditorPersistence } from '@/lib/editor-sync'

/** Persists debounced editor state before tab close or hide. */
export function usePersistFlush(): void {
  useEffect(() => {
    const flush = () => flushEditorPersistence()

    window.addEventListener('beforeunload', flush)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      flush()
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
}
