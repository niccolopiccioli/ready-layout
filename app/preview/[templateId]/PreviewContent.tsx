'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TemplateRenderer } from '@/components/TemplateRenderer'
import {
  loadPersistedState,
  subscribeEditorSync,
  type EditorPersistPayload,
} from '@/lib/editor-sync'
import type { Section, TemplateSchema, TemplateValues } from '@/lib/schemas/types'

interface PreviewContentProps {
  schema: TemplateSchema
  defaultValues: TemplateValues
}

interface HydrationState {
  sections: Section[]
  sectionOrder: string[]
  values: TemplateValues
  elementOrder: Record<string, Record<string, number[]>>
}

function initialState(schema: TemplateSchema, defaults: TemplateValues): HydrationState {
  return {
    sections: schema.sections,
    sectionOrder: schema.sections.map((s) => s.id),
    values: defaults,
    elementOrder: {},
  }
}

function hydrateFrom(
  parsed: Partial<EditorPersistPayload>,
  schema: TemplateSchema,
  defaults: TemplateValues
): HydrationState {
  return {
    sections: Array.isArray(parsed.sections) && parsed.sections.length > 0 ? parsed.sections : schema.sections,
    sectionOrder: Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length > 0
      ? parsed.sectionOrder
      : schema.sections.map((s) => s.id),
    values: parsed.values && typeof parsed.values === 'object' ? parsed.values : defaults,
    elementOrder:
      parsed.elementOrder && typeof parsed.elementOrder === 'object' ? parsed.elementOrder : {},
  }
}

function readPersisted(
  templateId: string,
  schema: TemplateSchema,
  defaults: TemplateValues
): HydrationState | null {
  const payload = loadPersistedState(templateId)
  if (!payload) return null
  return hydrateFrom(payload, schema, defaults)
}

export function PreviewContent({ schema, defaultValues }: PreviewContentProps) {
  const searchParams = useSearchParams()
  const clean = searchParams.get('clean') === 'true'
  // Stato iniziale sempre dai default → server e primo render client coincidono.
  // Il persistito viene letto solo dopo il mount (niente mismatch hydration).
  const [state, setState] = useState<HydrationState>(() => initialState(schema, defaultValues))

  useEffect(() => {
    if (clean) return

    const raf = requestAnimationFrame(() => {
      const persisted = readPersisted(schema.id, schema, defaultValues)
      if (persisted) setState(persisted)
    })
    const unsubscribe = subscribeEditorSync(schema.id, (payload) => {
      setState(hydrateFrom(payload, schema, defaultValues))
    })
    return () => {
      cancelAnimationFrame(raf)
      unsubscribe()
    }
  }, [clean, schema, defaultValues])

  const orderedSchema = useMemo<TemplateSchema>(() => {
    const ordered = state.sectionOrder
      .map((id) => state.sections.find((s) => s.id === id))
      .filter((s): s is Section => s !== undefined)
    return { ...schema, sections: ordered.length > 0 ? ordered : schema.sections }
  }, [schema, state.sections, state.sectionOrder])

  return <TemplateRenderer schema={orderedSchema} values={state.values} editable={false} />
}
