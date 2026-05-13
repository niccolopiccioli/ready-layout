import type { TemplateSchema, TemplateValues } from '@/lib/schemas/types'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface TemplateRendererProps {
  schema: TemplateSchema
  values: TemplateValues
}

export function TemplateRenderer({ schema, values }: TemplateRendererProps) {
  return (
    <div className="font-sans">
      {schema.sections.map((section) => (
        <BlockRenderer
          key={section.id}
          blockType={section.blockType}
          values={values[section.id] ?? {}}
        />
      ))}
    </div>
  )
}
