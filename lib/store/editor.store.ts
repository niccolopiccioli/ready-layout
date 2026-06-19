import { createStore } from 'zustand/vanilla'
import type { Section, TemplateSchema, TemplateValues } from '@/lib/schemas/types'
import { LAYOUT_PRESETS } from '@/lib/presets/layouts'
import { uniqueSectionId } from '@/lib/utils/uniqueId'
import { loadPersistedState, persistEditorState } from '@/lib/editor-sync'

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

interface Snapshot {
  values: TemplateValues
  sectionOrder: string[]
  elementOrder: Record<string, Record<string, number[]>>
  sections: Section[]
}

function snapshotFromState(state: {
  values: TemplateValues
  sectionOrder: string[]
  elementOrder: Record<string, Record<string, number[]>>
  sections: Section[]
}): Snapshot {
  return {
    values: state.values,
    sectionOrder: state.sectionOrder,
    elementOrder: state.elementOrder,
    sections: state.sections,
  }
}

function persist(
  templateId: string,
  state: {
    values: TemplateValues
    sectionOrder: string[]
    elementOrder: Record<string, Record<string, number[]>>
    sections: Section[]
  },
  immediate = false
) {
  persistEditorState(templateId, snapshotFromState(state), { immediate })
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
  removeSection: (sectionId: string) => void
  duplicateSection: (sectionId: string) => void
}

export function createEditorStore(schema: TemplateSchema) {
  const defaults = buildDefaults(schema)
  const saved = loadPersistedState(schema.id)
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
        const past = [...state._past, snapshotFromState(state)].slice(-HISTORY_LIMIT)

        const sectionValues = state.values[sectionId] || {}
        const updatedValues: Record<string, unknown> = fieldId.includes('.')
          ? setNestedValue(sectionValues as Record<string, unknown>, fieldId, value)
          : { ...sectionValues, [fieldId]: value }

        const newValues = { ...state.values, [sectionId]: updatedValues }
        const next = { ...state, values: newValues }
        persist(state.templateId, next)

        return { values: newValues, _past: past, _future: [], canUndo: true, canRedo: false }
      }),

    setActiveSection: (sectionId) => set({ activeSection: sectionId }),

    reset: () => {
      const state = get()
      const freshValues = Object.fromEntries(
        state.sections.map((section) => [
          section.id,
          Object.fromEntries(section.fields.map((field) => [field.id, field.default])),
        ])
      ) as TemplateValues
      const next = {
        values: freshValues,
        sections: state.sections,
        sectionOrder: state.sectionOrder,
        elementOrder: {} as Record<string, Record<string, number[]>>,
      }
      persist(state.templateId, next, true)
      set({
        ...next,
        activeSection: state.sectionOrder[0] ?? state.sections[0]?.id ?? '',
        _past: [...state._past, snapshotFromState(state)].slice(-HISTORY_LIMIT),
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
        const future = [snapshotFromState(state), ...state._future].slice(0, HISTORY_LIMIT)
        persist(state.templateId, { ...state, ...prev }, true)
        return {
          values: prev.values,
          sections: prev.sections,
          sectionOrder: prev.sectionOrder,
          elementOrder: prev.elementOrder,
          _past: past,
          _future: future,
          canUndo: past.length > 0,
          canRedo: true,
        }
      }),

    redo: () =>
      set((state) => {
        if (state._future.length === 0) return {}
        const nextSnap = state._future[0]
        const future = state._future.slice(1)
        const past = [...state._past, snapshotFromState(state)].slice(-HISTORY_LIMIT)
        persist(state.templateId, { ...state, ...nextSnap }, true)
        return {
          values: nextSnap.values,
          sections: nextSnap.sections,
          sectionOrder: nextSnap.sectionOrder,
          elementOrder: nextSnap.elementOrder,
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
        const past = [...state._past, snapshotFromState(state)].slice(-HISTORY_LIMIT)
        const newOrder = [...state.sectionOrder]
        const [removed] = newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, removed)
        const next = { ...state, sectionOrder: newOrder }
        persist(state.templateId, next, true)
        return { sectionOrder: newOrder, _past: past, _future: [], canUndo: true, canRedo: false }
      }),

    reorderElements: (sectionId, fieldId, fromIndex, toIndex) =>
      set((state) => {
        const past = [...state._past, snapshotFromState(state)].slice(-HISTORY_LIMIT)

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
        const next = { ...state, values: newValues, elementOrder: newElementOrder }
        persist(state.templateId, next, true)
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
        const insertIndex =
          insertAfterId === null
            ? state.sectionOrder.length
            : insertAfterId === ''
            ? 0
            : state.sectionOrder.indexOf(insertAfterId) + 1
        const newOrder = [...state.sectionOrder]
        newOrder.splice(insertIndex, 0, newId)

        const updatedValues = { ...state.values, [newId]: newValues }
        const past = [...state._past, snapshotFromState(state)].slice(-HISTORY_LIMIT)

        const next = {
          ...state,
          sections: newSections,
          sectionOrder: newOrder,
          values: updatedValues,
        }
        persist(state.templateId, next, true)

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

    removeSection: (sectionId) =>
      set((state) => {
        if (state.sectionOrder[0] === sectionId) return {}
        const idx = state.sectionOrder.indexOf(sectionId)
        if (idx === -1) return {}

        const past = [...state._past, snapshotFromState(state)].slice(-HISTORY_LIMIT)

        const newOrder = state.sectionOrder.filter((id) => id !== sectionId)
        const newSections = state.sections.filter((s) => s.id !== sectionId)
        const newValues = { ...state.values }
        delete newValues[sectionId]
        const newElementOrder = { ...state.elementOrder }
        delete newElementOrder[sectionId]

        const newActive = state.activeSection === sectionId
          ? newOrder[Math.max(idx - 1, 0)] ?? newOrder[0] ?? ''
          : state.activeSection

        const next = {
          ...state,
          sections: newSections,
          sectionOrder: newOrder,
          values: newValues,
          elementOrder: newElementOrder,
        }
        persist(state.templateId, next, true)

        return {
          sections: newSections,
          sectionOrder: newOrder,
          values: newValues,
          elementOrder: newElementOrder,
          activeSection: newActive,
          _past: past,
          _future: [],
          canUndo: true,
          canRedo: false,
        }
      }),

    duplicateSection: (sectionId) =>
      set((state) => {
        const section = state.sections.find((s) => s.id === sectionId)
        const idx = state.sectionOrder.indexOf(sectionId)
        if (!section || idx === -1) return {}

        const past = [...state._past, snapshotFromState(state)].slice(-HISTORY_LIMIT)

        const taken = new Set(state.sections.map((s) => s.id))
        const newId = uniqueSectionId(section.blockType, taken)
        const dup: Section = structuredClone({ ...section, id: newId })
        const dupValues = structuredClone(state.values[sectionId] ?? {})

        const newSections = [...state.sections, dup]
        const newOrder = [...state.sectionOrder]
        newOrder.splice(idx + 1, 0, newId)
        const newValues = { ...state.values, [newId]: dupValues }

        const next = { ...state, sections: newSections, sectionOrder: newOrder, values: newValues }
        persist(state.templateId, next, true)

        return {
          sections: newSections,
          sectionOrder: newOrder,
          values: newValues,
          _past: past,
          _future: [],
          canUndo: true,
          canRedo: false,
        }
      }),
  }))
}

export type EditorStore = ReturnType<typeof createEditorStore>
