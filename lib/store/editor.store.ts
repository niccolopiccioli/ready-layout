import { createStore } from 'zustand/vanilla'
import type { Section, TemplateSchema, TemplateValues } from '@/lib/schemas/types'
import { LAYOUT_PRESETS } from '@/lib/presets/layouts'
import { uniqueSectionId } from '@/lib/utils/uniqueId'

const HISTORY_LIMIT = 100

function buildDefaults(schema: TemplateSchema): TemplateValues {
  return Object.fromEntries(
    schema.sections.map((section) => [
      section.id,
      Object.fromEntries(section.fields.map((field) => [field.id, field.default])),
    ])
  )
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const result = structuredClone(obj)
  const parts = path.split('.')
  let current = result
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    const nextKey = parts[i + 1]
    const isArrayIndex = /^\d+$/.test(nextKey)
    if (!(key in current)) current[key] = isArrayIndex ? [] : {}
    current = current[key] as Record<string, unknown>
  }
  current[parts[parts.length - 1]] = value
  return result
}

interface StoredPayload {
  values: TemplateValues
  sectionOrder: string[]
  elementOrder: Record<string, Record<string, number[]>>
  sections?: Section[]
}

function loadFromStorage(templateId: string): StoredPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(`readylayout-${templateId}`)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function saveToStorage(
  templateId: string,
  values: TemplateValues,
  sectionOrder: string[],
  elementOrder: Record<string, Record<string, number[]>>,
  sections: Section[]
) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      `readylayout-${templateId}`,
      JSON.stringify({ values, sectionOrder, elementOrder, sections })
    )
  } catch {
    // storage full or private browsing — continue silently
  }
}

interface Snapshot {
  values: TemplateValues
  sectionOrder: string[]
  sections: Section[]
}

export interface EditorState {
  templateId: string
  schema: TemplateSchema
  sections: Section[]
  values: TemplateValues
  sectionOrder: string[]
  elementOrder: Record<string, Record<string, number[]>>
  activeSection: string

  // History
  _past: Snapshot[]
  _future: Snapshot[]
  canUndo: boolean
  canRedo: boolean

  updateField: (sectionId: string, fieldId: string, value: unknown) => void
  setActiveSection: (sectionId: string) => void
  reset: () => void
  undo: () => void
  redo: () => void
  exportTemplate: () => {
    schema: TemplateSchema
    sections: Section[]
    values: TemplateValues
    sectionOrder: string[]
    elementOrder: Record<string, Record<string, number[]>>
  }
  reorderSections: (fromIndex: number, toIndex: number) => void
  reorderElements: (sectionId: string, fieldId: string, fromIndex: number, toIndex: number) => void
  getElementOrder: (sectionId: string, fieldId: string) => number[]
  addSection: (presetId: string, insertAfterId: string | null) => void
}

export function createEditorStore(schema: TemplateSchema) {
  const defaults = buildDefaults(schema)
  const saved = loadFromStorage(schema.id)
  const defaultSections = structuredClone(schema.sections)
  const initialSections = saved?.sections ?? defaultSections
  const initialValues = saved?.values || structuredClone(defaults)
  const initialSectionOrder = saved?.sectionOrder || initialSections.map((s) => s.id)
  const initialElementOrder = saved?.elementOrder || {}

  return createStore<EditorState>()((set, get) => ({
    templateId: schema.id,
    schema,
    sections: initialSections,
    values: initialValues,
    sectionOrder: initialSectionOrder,
    elementOrder: initialElementOrder,
    activeSection: initialSections[0]?.id ?? schema.sections[0]?.id ?? '',

    _past: [],
    _future: [],
    canUndo: false,
    canRedo: false,

    updateField: (sectionId, fieldId, value) =>
      set((state) => {
        const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
        const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)

        const sectionValues = state.values[sectionId] || {}
        const updatedValues: Record<string, unknown> = fieldId.includes('.')
          ? setNestedValue(sectionValues as Record<string, unknown>, fieldId, value)
          : { ...sectionValues, [fieldId]: value }

        const newValues = { ...state.values, [sectionId]: updatedValues }
        saveToStorage(state.templateId, newValues, state.sectionOrder, state.elementOrder, state.sections)

        return { values: newValues, _past: past, _future: [], canUndo: true, canRedo: false }
      }),

    setActiveSection: (sectionId) => set({ activeSection: sectionId }),

    reset: () => {
      const state = get()
      const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
      const freshValues = structuredClone(defaults)
      const freshSections = structuredClone(schema.sections)
      const freshOrder = freshSections.map((s) => s.id)
      saveToStorage(schema.id, freshValues, freshOrder, {}, freshSections)
      set({
        values: freshValues,
        sections: freshSections,
        sectionOrder: freshOrder,
        elementOrder: {},
        activeSection: freshSections[0]?.id ?? '',
        _past: [...state._past, snapshot].slice(-HISTORY_LIMIT),
        _future: [],
        canUndo: true,
        canRedo: false,
      })
    },

    undo: () =>
      set((state) => {
        if (state._past.length === 0) return {}
        const prev = state._past[state._past.length - 1]
        const past = state._past.slice(0, -1)
        const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
        const future = [snapshot, ...state._future].slice(0, HISTORY_LIMIT)
        saveToStorage(state.templateId, prev.values, prev.sectionOrder, state.elementOrder, prev.sections)
        return {
          values: prev.values,
          sections: prev.sections,
          sectionOrder: prev.sectionOrder,
          _past: past,
          _future: future,
          canUndo: past.length > 0,
          canRedo: true,
        }
      }),

    redo: () =>
      set((state) => {
        if (state._future.length === 0) return {}
        const next = state._future[0]
        const future = state._future.slice(1)
        const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
        const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)
        saveToStorage(state.templateId, next.values, next.sectionOrder, state.elementOrder, next.sections)
        return {
          values: next.values,
          sections: next.sections,
          sectionOrder: next.sectionOrder,
          _past: past,
          _future: future,
          canUndo: true,
          canRedo: future.length > 0,
        }
      }),

    exportTemplate: () => {
      const state = get()
      return {
        schema: state.schema,
        sections: state.sections,
        values: state.values,
        sectionOrder: state.sectionOrder,
        elementOrder: state.elementOrder,
      }
    },

    reorderSections: (fromIndex, toIndex) =>
      set((state) => {
        const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
        const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)
        const newOrder = [...state.sectionOrder]
        const [removed] = newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, removed)
        saveToStorage(state.templateId, state.values, newOrder, state.elementOrder, state.sections)
        return { sectionOrder: newOrder, _past: past, _future: [], canUndo: true, canRedo: false }
      }),

    reorderElements: (sectionId, fieldId, fromIndex, toIndex) =>
      set((state) => {
        const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
        const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)

        const sectionValues = state.values[sectionId] || {}
        const currentArray = (sectionValues[fieldId] as unknown[]) || []
        const newArray = [...currentArray]
        const [removed] = newArray.splice(fromIndex, 1)
        newArray.splice(toIndex, 0, removed)

        const newValues = {
          ...state.values,
          [sectionId]: { ...sectionValues, [fieldId]: newArray },
        }
        const newElementOrder = {
          ...state.elementOrder,
          [sectionId]: {
            ...(state.elementOrder[sectionId] || {}),
            [fieldId]: newArray.map((_, i) => i),
          },
        }
        saveToStorage(state.templateId, newValues, state.sectionOrder, newElementOrder, state.sections)
        return {
          values: newValues,
          elementOrder: newElementOrder,
          _past: past,
          _future: [],
          canUndo: true,
          canRedo: false,
        }
      }),

    getElementOrder: (sectionId, fieldId) => {
      const state = get()
      return state.elementOrder[sectionId]?.[fieldId] || []
    },

    addSection: (presetId, insertAfterId) =>
      set((state) => {
        const preset = LAYOUT_PRESETS.find((p) => p.id === presetId)
        if (!preset) return {}

        const taken = new Set(state.sections.map((s) => s.id))
        const newId = uniqueSectionId(preset.blockType, taken)
        const newSection = preset.build(newId)
        const newValues = structuredClone(preset.defaultValues)

        const newSections = [...state.sections, newSection]
        const insertIndex = insertAfterId === null
          ? state.sectionOrder.length
          : state.sectionOrder.indexOf(insertAfterId) + 1
        const newOrder = [...state.sectionOrder]
        newOrder.splice(insertIndex, 0, newId)

        const updatedValues = { ...state.values, [newId]: newValues }
        const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
        const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)

        saveToStorage(state.templateId, updatedValues, newOrder, state.elementOrder, newSections)

        return {
          sections: newSections,
          sectionOrder: newOrder,
          values: updatedValues,
          activeSection: newId,
          _past: past,
          _future: [],
          canUndo: true,
          canRedo: false,
        }
      }),
  }))
}

export type EditorStore = ReturnType<typeof createEditorStore>
