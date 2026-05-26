'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface LayoutPickerContextValue {
  open: boolean
  insertAfterId: string | null
  openPicker: (insertAfterId: string | null) => void
  closePicker: () => void
}

const LayoutPickerContext = createContext<LayoutPickerContextValue | null>(null)

export function LayoutPickerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [insertAfterId, setInsertAfterId] = useState<string | null>(null)

  const openPicker = useCallback((afterId: string | null) => {
    setInsertAfterId(afterId)
    setOpen(true)
  }, [])

  const closePicker = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <LayoutPickerContext.Provider value={{ open, insertAfterId, openPicker, closePicker }}>
      {children}
    </LayoutPickerContext.Provider>
  )
}

export function useLayoutPicker(): LayoutPickerContextValue {
  const ctx = useContext(LayoutPickerContext)
  if (!ctx) throw new Error('useLayoutPicker must be used within LayoutPickerProvider')
  return ctx
}
