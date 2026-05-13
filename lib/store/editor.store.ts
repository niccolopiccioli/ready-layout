import { createStore } from 'zustand/vanilla'
import type { TemplateSchema, TemplateValues } from '@/lib/schemas/types'

function buildDefaults(schema: TemplateSchema): TemplateValues {
  return Object.fromEntries(
    schema.sections.map((section) => [
      section.id,
      Object.fromEntries(section.fields.map((field) => [field.id, field.default])),
    ])
  )
}

export interface EditorState {
  templateId: string
  schema: TemplateSchema
  values: TemplateValues
  activeSection: string
  updateField: (sectionId: string, fieldId: string, value: unknown) => void
  setActiveSection: (sectionId: string) => void
  reset: () => void
}

export function createEditorStore(schema: TemplateSchema) {
  const defaults = buildDefaults(schema)
  return createStore<EditorState>()((set) => ({
    templateId: schema.id,
    schema,
    values: structuredClone(defaults),
    activeSection: schema.sections[0]?.id ?? '',
    updateField: (sectionId, fieldId, value) =>
      set((state) => ({
        values: {
          ...state.values,
          [sectionId]: { ...state.values[sectionId], [fieldId]: value },
        },
      })),
    setActiveSection: (sectionId) => set({ activeSection: sectionId }),
    reset: () => set({ values: structuredClone(defaults) }),
  }))
}

export type EditorStore = ReturnType<typeof createEditorStore>
