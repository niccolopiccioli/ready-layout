import type { TemplateSchema, Section, Field, RepeaterField } from '@/lib/schemas/types'

type Overrides = Record<string, string | Record<string, string>[]>

function deepCloneField(f: Field): Field {
  if (f.type === 'repeater') {
    return {
      ...f,
      default: (f as RepeaterField).default.map((d) => ({ ...d })),
      itemSchema: (f as RepeaterField).itemSchema.map((s) => ({ ...s })),
    }
  }
  return { ...f }
}

function deepCloneSection(s: Section): Section {
  return { ...s, fields: s.fields.map(deepCloneField) }
}

export function createPreset(
  base: TemplateSchema,
  presetId: string,
  overrides: Overrides,
  nameOverride?: string,
  descriptionOverride?: string,
): TemplateSchema {
  const sections: Section[] = base.sections.map(deepCloneSection)

  for (const [key, value] of Object.entries(overrides)) {
    const secId = key.split('.').slice(0, -1).join('.')
    const fieldId = key.split('.').pop()!

    for (const section of sections) {
      if (section.id === secId) {
        for (const field of section.fields) {
          if (field.id === fieldId) {
            if (field.type === 'repeater' && Array.isArray(value)) {
              (field as RepeaterField).default = value as Record<string, string>[]
            } else if (typeof value === 'string') {
              ;(field as Exclude<Field, RepeaterField>).default = value
            }
          }
        }
      }
    }
  }

  return {
    ...base,
    id: `${base.id}-${presetId}`,
    name: nameOverride ?? `${base.name} (${presetId})`,
    description: descriptionOverride ?? base.description,
    sections,
  }
}
