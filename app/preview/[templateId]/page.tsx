import { notFound } from 'next/navigation'
import { getTemplateById } from '@/lib/templates'
import { TemplateRenderer } from '@/components/TemplateRenderer'
import type { TemplateValues } from '@/lib/schemas/types'

interface PageProps {
  params: Promise<{ templateId: string }>
}

function buildDefaults(schema: ReturnType<typeof getTemplateById>): TemplateValues {
  if (!schema) return {}
  return Object.fromEntries(
    schema.sections.map((section) => [
      section.id,
      Object.fromEntries(section.fields.map((field) => [field.id, field.default])),
    ])
  )
}

export default async function PreviewPage({ params }: PageProps) {
  const { templateId } = await params
  const schema = getTemplateById(templateId)
  if (!schema) notFound()

  const values = buildDefaults(schema)
  return <TemplateRenderer schema={schema} values={values} />
}
