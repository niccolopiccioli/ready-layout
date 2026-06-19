import type { TemplateSchema } from './types'

export interface FieldInfo {
  label: string
  multiline: boolean
  type: 'text' | 'color' | 'image' | 'emoji' | 'repeater' | 'unknown'
}

/**
 * Find a field's display info from a schema given sectionId and field path.
 * Field path is either a simple fieldId ("headline") or a repeater path ("items.0.title").
 */
export function getFieldInfo(schema: TemplateSchema, sectionId: string, fieldPath: string): FieldInfo {
  const section = schema.sections.find((s) => s.id === sectionId)
  if (!section) return { label: fieldPath, multiline: false, type: 'unknown' }

  if (fieldPath.includes('.')) {
    const [repeaterId, , subId] = fieldPath.split('.')
    const repeater = section.fields.find((f) => f.id === repeaterId)
    if (repeater?.type === 'repeater') {
      const subField = repeater.itemSchema.find((f) => f.id === subId)
      if (!subField) return { label: fieldPath, multiline: false, type: 'unknown' }
      return {
        label: subField.label,
        multiline: false,
        type: subField.type === 'text' ? 'text' : subField.type,
      }
    }
    return { label: fieldPath, multiline: false, type: 'unknown' }
  }

  const field = section.fields.find((f) => f.id === fieldPath)
  if (!field) return { label: fieldPath, multiline: false, type: 'unknown' }

  return {
    label: field.label,
    multiline: field.type === 'text' ? Boolean(field.multiline) : false,
    type: field.type,
  }
}

export function getSectionLabel(schema: TemplateSchema, sectionId: string): string {
  const section = schema.sections.find((s) => s.id === sectionId)
  return section?.label ?? sectionId
}
