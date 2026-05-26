'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TemplateRenderer } from '@/components/TemplateRenderer'
import type { Section, TemplateSchema, TemplateValues } from '@/lib/schemas/types'

interface PreviewContentProps {
  schema: TemplateSchema
  defaultValues: TemplateValues
}

interface HydrationState {
  sections: Section[]
  sectionOrder: string[]
  values: TemplateValues
}

function initialState(schema: TemplateSchema, defaults: TemplateValues): HydrationState {
  return {
    sections: schema.sections,
    sectionOrder: schema.sections.map((s) => s.id),
    values: defaults,
  }
}

function parseStorage(raw: string | null): Partial<HydrationState> | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function hydrateFrom(
  parsed: Partial<HydrationState>,
  schema: TemplateSchema,
  defaults: TemplateValues
): HydrationState {
  return {
    sections: Array.isArray(parsed.sections) && parsed.sections.length > 0 ? parsed.sections : schema.sections,
    sectionOrder: Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length > 0
      ? parsed.sectionOrder
      : schema.sections.map((s) => s.id),
    values: parsed.values && typeof parsed.values === 'object' ? parsed.values : defaults,
  }
}

export function PreviewContent({ schema, defaultValues }: PreviewContentProps) {
  const searchParams = useSearchParams()
  const clean = searchParams.get('clean') === 'true'
  const [state, setState] = useState<HydrationState>(() => initialState(schema, defaultValues))

  useEffect(() => {
    if (clean) return
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(`readylayout-${schema.id}`)
    const parsed = parseStorage(raw)
    if (!parsed) return
    setState(hydrateFrom(parsed, schema, defaultValues))
  }, [clean, schema, defaultValues])

  useEffect(() => {
    if (clean) return
    const key = `readylayout-${schema.id}`
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return
      const parsed = parseStorage(e.newValue)
      if (!parsed) return
      setState(hydrateFrom(parsed, schema, defaultValues))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [clean, schema, defaultValues])

  const orderedSchema = useMemo<TemplateSchema>(() => {
    const ordered = state.sectionOrder
      .map((id) => state.sections.find((s) => s.id === id))
      .filter((s): s is Section => s !== undefined)
    return { ...schema, sections: ordered.length > 0 ? ordered : schema.sections }
  }, [schema, state.sections, state.sectionOrder])

  return <TemplateRenderer schema={orderedSchema} values={state.values} editable={false} />
}
